// sit-news.js — SIT v11 · Módulo de Notícias + Sentimento
// Guard contra carregamento duplo
if (!window.NEWS) {

const NEWS_CFG = {
  gnews_key:   localStorage.getItem('sit_gnews_key')   || '',
  vault_url:   localStorage.getItem('sit_vault_url')   || '',
  vault_token: localStorage.getItem('sit_vault_token') || '',
  cache_ttl:   60 * 60 * 1000,
};

const SENTIMENT = {
  positivo: { words:['gol','assistência','renovação','eleito','melhor','destaque','ótimo','capitão','retorno','recuperado','herói','campeão','goal','assist','best','captain','recovered'], peso:1 },
  negativo: { words:['lesão','suspensão','conflito','briga','expulsão','criticado','vendido','saída','cirurgia','afastado','cortado','injury','suspended','sold','controversy','surgery'], peso:2 },
};

const JUNG_SENTIMENT_MAP = {
  alto_positivo: { DEFAULT:{ mod:'+ALTA',    desc:'Contexto midiático favorável'  } },
  alto_negativo: { DEFAULT:{ mod:'-RISCO',   desc:'Contexto midiático adverso'    } },
  neutro:        { DEFAULT:{ mod:'=NEUTRO',  desc:'Contexto midiático equilibrado'} },
};

window.NEWS = {
  async fetch(query, lang='pt', max=10) {
    const cacheKey = `sit_news_${query}_${lang}`;
    const cached = this._getCache(cacheKey);
    if (cached) return cached;
    let articles = [];
    if (NEWS_CFG.vault_url && NEWS_CFG.vault_token) {
      articles = await this._fetchVaultProxy(query, lang, max);
    }
    if (!articles.length && NEWS_CFG.gnews_key) {
      articles = await this._fetchGNewsDireto(query, lang, max);
    }
    this._setCache(cacheKey, articles);
    return articles;
  },

  async _fetchVaultProxy(query, lang, max) {
    try {
      const r = await fetch(`${NEWS_CFG.vault_url}/sit/news`, {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${NEWS_CFG.vault_token}`},
        body: JSON.stringify({query,lang,max}),
        signal: AbortSignal.timeout(6000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      return d.articles || [];
    } catch(e) { return []; }
  },

  async _fetchGNewsDireto(query, lang, max) {
    try {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${lang}&country=any&max=${max}&apikey=${NEWS_CFG.gnews_key}`;
      const r = await fetch(url, {signal:AbortSignal.timeout(6000)});
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      return (d.articles||[]).map(a=>({title:a.title,description:a.description,url:a.url,source:a.source?.name||'',publishedAt:a.publishedAt}));
    } catch(e) { return []; }
  },

  analisarSentimento(articles) {
    if (!articles?.length) return {score:0,total:0,positivo:0,negativo:0,neutro:0,trend:'neutro',label:'SEM DADOS',articles:[]};
    let pos=0,neg=0,neu=0;
    const scored = articles.map(a => {
      const text = `${a.title} ${a.description||''}`.toLowerCase();
      let s=0;
      SENTIMENT.positivo.words.forEach(w=>{if(text.includes(w)) s+=SENTIMENT.positivo.peso;});
      SENTIMENT.negativo.words.forEach(w=>{if(text.includes(w)) s-=SENTIMENT.negativo.peso;});
      if(s>0) pos++; else if(s<0) neg++; else neu++;
      return {...a, sentiment_score:s, sentiment:s>0?'positivo':s<0?'negativo':'neutro'};
    });
    const score = scored.reduce((s,a)=>s+a.sentiment_score,0);
    const trend = score>3?'positivo':score<-3?'negativo':'neutro';
    const labels = {positivo:`+${score} · FAVORÁVEL`,negativo:`${score} · ADVERSO`,neutro:`${score} · NEUTRO`};
    return {score,total:articles.length,positivo:pos,negativo:neg,neutro:neu,trend,label:labels[trend],articles:scored};
  },

  getJungModificador(tipo, trend) {
    const map = JUNG_SENTIMENT_MAP[trend==='positivo'?'alto_positivo':trend==='negativo'?'alto_negativo':'neutro'];
    return map[tipo] || map.DEFAULT;
  },

  async buscarAtleta(nome, clube) {
    const articles = await this.fetch(`${nome} ${clube}`,'pt',8);
    return {query:`${nome} ${clube}`, ...this.analisarSentimento(articles)};
  },

  async buscarTime(nome, liga) {
    const articles = await this.fetch(nome, liga==='BRA'?'pt':'en', 10);
    return {query:nome, ...this.analisarSentimento(articles)};
  },

  _getCache(key) {
    try { const r=localStorage.getItem(key); if(!r) return null; const {data,ts}=JSON.parse(r); if(Date.now()-ts>NEWS_CFG.cache_ttl){localStorage.removeItem(key);return null;} return data; } catch(e){return null;}
  },
  _setCache(key,data) { try{localStorage.setItem(key,JSON.stringify({data,ts:Date.now()}));}catch(e){} },

  renderPainel(sentimento, titulo='NOTÍCIAS & SENTIMENTO') {
    if (!sentimento) return '<div class="dim" style="padding:8px">Carregando...</div>';
    const col=sentimento.trend==='positivo'?'var(--g1)':sentimento.trend==='negativo'?'var(--r1)':'var(--a1)';
    const tagCols={positivo:'buy',negativo:'sell',neutro:'hold'};
    return `<div class="sec">${titulo}</div>
      <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center">
        <span class="bg ${tagCols[sentimento.trend]||'hold'}" style="font-size:8px">${sentimento.label}</span>
        <span class="dim" style="font-size:8px">${sentimento.total} artigos</span>
      </div>
      ${(sentimento.articles||[]).slice(0,6).map(a=>{
        const c=a.sentiment==='positivo'?'var(--g2)':a.sentiment==='negativo'?'var(--r1)':'var(--t4)';
        const icon=a.sentiment==='positivo'?'▲':a.sentiment==='negativo'?'▼':'●';
        const date=a.publishedAt?new Date(a.publishedAt).toLocaleDateString('pt-BR'):'';
        return `<div style="display:flex;gap:6px;padding:5px 0;border-bottom:1px solid var(--b0);cursor:pointer" onclick="window.open('${a.url}','_blank')">
          <span style="color:${c};font-size:9px;flex-shrink:0">${icon}</span>
          <div style="flex:1"><div style="font-size:9px;color:var(--t1)">${a.title}</div>
          <div style="font-size:7.5px;color:var(--t5)">${a.source} · ${date}</div></div></div>`;
      }).join('')}
      ${!sentimento.articles?.length?'<div class="dim" style="padding:8px;font-size:9px">Configure GNews API para notícias em tempo real.</div>':''}`;
  },

  config(key,vaultUrl,vaultToken) {
    if(key) localStorage.setItem('sit_gnews_key',key);
    if(vaultUrl) localStorage.setItem('sit_vault_url',vaultUrl);
    if(vaultToken) localStorage.setItem('sit_vault_token',vaultToken);
  },
};

window.sitConfigNews = function() {
  const key = prompt('GNews API Key:', NEWS_CFG.gnews_key);
  if(key) window.NEWS.config(key);
};

} // fim guard NEWS
