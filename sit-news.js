// sit-news.js — SIT v11 · Módulo de Notícias + Sentimento
'use strict';

const NEWS_CFG_DATA = {
  get gnews_key()   { return localStorage.getItem('sit_gnews_key')   || ''; },
  get vault_url()   { return localStorage.getItem('sit_vault_url')   || ''; },
  get vault_token() { return localStorage.getItem('sit_vault_token') || ''; },
  cache_ttl: 60 * 60 * 1000,
};

const SENTIMENT_DATA = {
  positivo: { words:['gol','assistência','renovação','eleito','melhor','destaque','capitão','retorno','recuperado','herói','campeão','goal','assist','best','captain','recovered','winner'], peso:1 },
  negativo: { words:['lesão','suspensão','conflito','briga','expulsão','criticado','vendido','saída','cirurgia','afastado','cortado','injury','suspended','sold','controversy','surgery','banned'], peso:2 },
};

window.NEWS = {
  async fetch(query, lang='pt', max=10) {
    const cacheKey = 'sit_news_' + query + '_' + lang;
    const cached = this._getCache(cacheKey);
    if (cached) return cached;
    let articles = [];
    if (NEWS_CFG_DATA.vault_url && NEWS_CFG_DATA.vault_token) {
      try {
        const r = await fetch(NEWS_CFG_DATA.vault_url + '/sit/news', {
          method:'POST',
          headers:{'Content-Type':'application/json','Authorization':'Bearer '+NEWS_CFG_DATA.vault_token},
          body: JSON.stringify({query,lang,max}),
          signal: AbortSignal.timeout(6000),
        });
        if (r.ok) { const d=await r.json(); articles=d.articles||[]; }
      } catch(e) {}
    }
    if (!articles.length && NEWS_CFG_DATA.gnews_key) {
      try {
        const url = 'https://gnews.io/api/v4/search?q='+encodeURIComponent(query)+'&lang='+lang+'&country=any&max='+max+'&apikey='+NEWS_CFG_DATA.gnews_key;
        const r = await fetch(url, {signal:AbortSignal.timeout(6000)});
        if (r.ok) {
          const d = await r.json();
          articles = (d.articles||[]).map(a=>({title:a.title,description:a.description,url:a.url,source:a.source?.name||'',publishedAt:a.publishedAt}));
        }
      } catch(e) {}
    }
    this._setCache(cacheKey, articles);
    return articles;
  },

  analisarSentimento(articles) {
    if (!articles || !articles.length) {
      return {score:0,total:0,positivo:0,negativo:0,neutro:0,trend:'neutro',label:'SEM DADOS',articles:[]};
    }
    let pos=0, neg=0, neu=0;
    const scored = articles.map(a => {
      const text = ((a.title||'') + ' ' + (a.description||'')).toLowerCase();
      let s = 0;
      SENTIMENT_DATA.positivo.words.forEach(w => { if(text.includes(w)) s += SENTIMENT_DATA.positivo.peso; });
      SENTIMENT_DATA.negativo.words.forEach(w => { if(text.includes(w)) s -= SENTIMENT_DATA.negativo.peso; });
      if (s>0) pos++; else if (s<0) neg++; else neu++;
      return Object.assign({}, a, {sentiment_score:s, sentiment:s>0?'positivo':s<0?'negativo':'neutro'});
    });
    const score = scored.reduce((s,a) => s+a.sentiment_score, 0);
    const trend = score>3 ? 'positivo' : score<-3 ? 'negativo' : 'neutro';
    return {score, total:articles.length, positivo:pos, negativo:neg, neutro:neu, trend,
      label: trend==='positivo' ? '+'+score+' · FAVORÁVEL' : trend==='negativo' ? score+' · ADVERSO' : score+' · NEUTRO',
      articles: scored};
  },

  getJungModificador(tipo, trend) {
    const mods = {
      positivo: {mod:'+ALTA',   desc:'Contexto midiático favorável'},
      negativo: {mod:'-RISCO',  desc:'Contexto midiático adverso'},
      neutro:   {mod:'=NEUTRO', desc:'Contexto midiático equilibrado'},
    };
    return mods[trend] || mods.neutro;
  },

  async buscarAtleta(nome, clube) {
    const articles = await this.fetch(nome+' '+clube, 'pt', 8);
    return Object.assign({query:nome+' '+clube}, this.analisarSentimento(articles));
  },

  async buscarTime(nome, liga) {
    const lang = (liga==='BRA') ? 'pt' : 'en';
    const articles = await this.fetch(nome, lang, 10);
    return Object.assign({query:nome}, this.analisarSentimento(articles));
  },

  renderPainel(sentimento, titulo) {
    titulo = titulo || 'NOTÍCIAS & SENTIMENTO';
    if (!sentimento) return '<div class="dim" style="padding:8px">Carregando...</div>';
    const tagCols = {positivo:'buy', negativo:'sell', neutro:'hold'};
    const tag = tagCols[sentimento.trend] || 'hold';
    let html = '<div class="sec">'+titulo+'</div>';
    html += '<div style="display:flex;gap:8px;margin-bottom:8px;align-items:center">';
    html += '<span class="bg '+tag+'" style="font-size:8px">'+sentimento.label+'</span>';
    html += '<span class="dim" style="font-size:8px">'+sentimento.total+' artigos</span></div>';
    const arts = sentimento.articles || [];
    if (!arts.length) {
      html += '<div class="dim" style="padding:8px;font-size:9px">Configure GNews API para notícias em tempo real.</div>';
    } else {
      arts.slice(0,6).forEach(function(a) {
        const c = a.sentiment==='positivo'?'var(--g2)':a.sentiment==='negativo'?'var(--r1)':'var(--t4)';
        const icon = a.sentiment==='positivo'?'▲':a.sentiment==='negativo'?'▼':'●';
        const date = a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('pt-BR') : '';
        html += '<div style="display:flex;gap:6px;padding:5px 0;border-bottom:1px solid var(--b0);cursor:pointer" onclick="window.open(\''+a.url+'\',\'_blank\')">';
        html += '<span style="color:'+c+';font-size:9px;flex-shrink:0">'+icon+'</span>';
        html += '<div style="flex:1"><div style="font-size:9px;color:var(--t1)">'+a.title+'</div>';
        html += '<div style="font-size:7.5px;color:var(--t5)">'+a.source+' · '+date+'</div></div></div>';
      });
    }
    return html;
  },

  config(key, vaultUrl, vaultToken) {
    if (key)        localStorage.setItem('sit_gnews_key', key);
    if (vaultUrl)   localStorage.setItem('sit_vault_url', vaultUrl);
    if (vaultToken) localStorage.setItem('sit_vault_token', vaultToken);
  },

  _getCache(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts > NEWS_CFG_DATA.cache_ttl) { localStorage.removeItem(key); return null; }
      return parsed.data;
    } catch(e) { return null; }
  },

  _setCache(key, data) {
    try { localStorage.setItem(key, JSON.stringify({data:data, ts:Date.now()})); } catch(e) {}
  },
};

window.sitConfigNews = function() {
  const key = prompt('GNews API Key (gnews.io):', NEWS_CFG_DATA.gnews_key);
  if (key) window.NEWS.config(key);
};
