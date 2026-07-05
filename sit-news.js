// ═══════════════════════════════════════════════════════════
// sit-news.js — SIT v11 · Módulo de Notícias + Sentimento
// GNews API → busca notícias por atleta/clube
// Alimenta o indicador JUNG com score de mídia
// Proxy via Vault Worker para esconder API key
// © 2026 Cardinal Protocol
// ═══════════════════════════════════════════════════════════
'use strict';

// ── Config ─────────────────────────────────────────────────
const NEWS_CFG = {
  // GNews API — grátis 100 req/dia
  // Cadastro: https://gnews.io/
  gnews_key: localStorage.getItem('sit_gnews_key') || '',

  // Vault Worker como proxy (esconde a key)
  vault_url:   localStorage.getItem('sit_vault_url')   || '',
  vault_token: localStorage.getItem('sit_vault_token') || '',

  // Cache local — evita gastar quota
  cache_ttl: 60 * 60 * 1000, // 1 hora em ms
};

// ── Palavras-chave para análise de sentimento ──────────────
const SENTIMENT = {
  positivo: {
    words: ['gol','assistência','renovação','eleito','melhor','destaque',
            'ótimo','capitão','convocado','retorno','recuperado','herói',
            'hat-trick','artilheiro','campeão','contrato','renovar',
            'elogio','aprovação','seleção','titular','confirmado',
            'goal','assist','best','named','captain','recovered','hero'],
    peso: 1,
  },
  negativo: {
    words: ['lesão','suspensão','conflito','briga','expulsão','criticado',
            'vendido','saída','transferência','rescisão','multa','polêmica',
            'problema','confusão','desfalque','cirurgia','operação',
            'afastado','cortado','reclama','insatisfeito','desentendimento',
            'injury','suspended','sold','transfer','fight','criticism',
            'out','doubt','controversy','rift','surgery'],
    peso: 2, // negativo pesa mais (assimetria de risco)
  },
  neutro: {
    words: ['treino','viagem','declarou','disse','afirmou','entrevista',
            'coletiva','hotel','concentração','análise'],
    peso: 0,
  },
};

// ── Arquétipos Jung modificados por sentimento ─────────────
const JUNG_SENTIMENT_MAP = {
  // score > +3 → arquétipo amplificado
  alto_positivo: {
    ENTJ: { mod: '+MOMENTUM',   desc: 'Liderança confirmada pela mídia' },
    ESTJ: { mod: '+CONFIANÇA',  desc: 'Consistência reconhecida publicamente' },
    ESFP: { mod: '+SHOW',       desc: 'Em evidência, máxima performance esperada' },
    ENTP: { mod: '+CRIATIVO',   desc: 'Fase criativa confirmada' },
    DEFAULT: { mod: '+ALTA',    desc: 'Contexto midiático favorável' },
  },
  // score < -3 → risco Jung identificado
  alto_negativo: {
    ENTJ: { mod: '-PRESSÃO',    desc: 'Liderança questionada — risco de retração' },
    ISTP: { mod: '-ISOLAMENTO', desc: 'Padrão de isolamento sob crítica' },
    ESFP: { mod: '-INSTÁVEL',   desc: 'Performance instável sob holofotes negativos' },
    INFJ: { mod: '-BURNOUT',    desc: 'Risco de burnout psicológico' },
    DEFAULT: { mod: '-RISCO',   desc: 'Contexto midiático adverso' },
  },
  // -3 <= score <= +3 → neutro
  neutro: {
    DEFAULT: { mod: '=NEUTRO', desc: 'Contexto midiático equilibrado' },
  },
};

// ═══════════════════════════════════════════════════════════
// CLIENTE DE NOTÍCIAS
// ═══════════════════════════════════════════════════════════
const NEWS = {

  // ── Buscar notícias (GNews direto ou via Vault proxy) ──
  async fetch(query, lang = 'pt', max = 10) {
    const cacheKey = `sit_news_${query}_${lang}`;
    const cached   = this._getCache(cacheKey);
    if (cached) return cached;

    let articles = [];

    // Tentar via Vault Worker primeiro (esconde API key)
    if (NEWS_CFG.vault_url && NEWS_CFG.vault_token) {
      articles = await this._fetchVaultProxy(query, lang, max);
    }

    // Fallback: GNews direto (expõe key mas funciona)
    if (!articles.length && NEWS_CFG.gnews_key) {
      articles = await this._fetchGNewsDireto(query, lang, max);
    }

    // Fallback final: RSS público (sem auth, sem CORS via proxy)
    if (!articles.length) {
      articles = await this._fetchRSSFallback(query);
    }

    this._setCache(cacheKey, articles);
    return articles;
  },

  // GNews via Vault Worker (recomendado — esconde key)
  async _fetchVaultProxy(query, lang, max) {
    try {
      const r = await fetch(`${NEWS_CFG.vault_url}/sit/news`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${NEWS_CFG.vault_token}`,
        },
        body: JSON.stringify({ query, lang, max }),
        signal: AbortSignal.timeout(6000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      return d.articles || [];
    } catch(e) {
      console.warn('[NEWS] Vault proxy falhou:', e.message);
      return [];
    }
  },

  // GNews direto (fallback — expõe key no browser)
  async _fetchGNewsDireto(query, lang, max) {
    try {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}`
        + `&lang=${lang}&country=any&max=${max}&apikey=${NEWS_CFG.gnews_key}`;
      const r = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      return (d.articles || []).map(a => ({
        title:       a.title,
        description: a.description,
        url:         a.url,
        source:      a.source?.name || '',
        publishedAt: a.publishedAt,
        image:       a.image,
      }));
    } catch(e) {
      console.warn('[NEWS] GNews direto falhou:', e.message);
      return [];
    }
  },

  // RSS fallback — sem API key, sem CORS (via allorigins proxy)
  async _fetchRSSFallback(query) {
    try {
      // allorigins.win — proxy público para RSS
      const rssSources = [
        `https://ge.globo.com/rss`,
        `https://www.espn.com.br/rss/futebol/ultimas`,
      ];
      const articles = [];
      for (const rss of rssSources) {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rss)}`;
        const r = await fetch(proxyUrl, { signal: AbortSignal.timeout(4000) });
        if (!r.ok) continue;
        const d = await r.json();
        const parser = new DOMParser();
        const xml    = parser.parseFromString(d.contents, 'text/xml');
        const items  = [...xml.querySelectorAll('item')].slice(0, 10);
        items.forEach(item => {
          const title = item.querySelector('title')?.textContent || '';
          const link  = item.querySelector('link')?.textContent || '';
          const desc  = item.querySelector('description')?.textContent || '';
          const date  = item.querySelector('pubDate')?.textContent || '';
          // Filtrar por query
          const q = query.toLowerCase();
          if (title.toLowerCase().includes(q) || desc.toLowerCase().includes(q)) {
            articles.push({ title, url: link, description: desc,
                            publishedAt: date, source: 'RSS' });
          }
        });
      }
      return articles;
    } catch(e) {
      console.warn('[NEWS] RSS fallback falhou:', e.message);
      return [];
    }
  },

  // ── Analisar sentimento de um array de artigos ──────────
  analisarSentimento(articles) {
    if (!articles?.length) {
      return { score: 0, total: 0, positivo: 0, negativo: 0,
               neutro: 0, trend: 'neutro', label: 'SEM DADOS',
               articles: [] };
    }

    let pos = 0, neg = 0, neu = 0;
    const scored = articles.map(a => {
      const text = `${a.title} ${a.description || ''}`.toLowerCase();
      let artScore = 0;

      SENTIMENT.positivo.words.forEach(w => {
        if (text.includes(w)) artScore += SENTIMENT.positivo.peso;
      });
      SENTIMENT.negativo.words.forEach(w => {
        if (text.includes(w)) artScore -= SENTIMENT.negativo.peso;
      });

      if (artScore > 0)      pos++;
      else if (artScore < 0) neg++;
      else                   neu++;

      return { ...a, sentiment_score: artScore,
               sentiment: artScore > 0 ? 'positivo' : artScore < 0 ? 'negativo' : 'neutro' };
    });

    const total = articles.length;
    const score = scored.reduce((s, a) => s + a.sentiment_score, 0);
    const trend = score > 3 ? 'positivo' : score < -3 ? 'negativo' : 'neutro';

    const labels = {
      positivo: `+${score} · CONTEXTO FAVORÁVEL`,
      negativo: `${score} · ATENÇÃO: CONTEXTO ADVERSO`,
      neutro:   `${score} · CONTEXTO NEUTRO`,
    };

    return { score, total, positivo: pos, negativo: neg, neutro: neu,
             trend, label: labels[trend], articles: scored };
  },

  // ── Modificador Jung baseado no sentimento ──────────────
  getJungModificador(jungTipo, sentimentoTrend) {
    const map = JUNG_SENTIMENT_MAP[
      sentimentoTrend === 'positivo' ? 'alto_positivo' :
      sentimentoTrend === 'negativo' ? 'alto_negativo' : 'neutro'
    ];
    return map[jungTipo] || map.DEFAULT;
  },

  // ── Busca específica para atleta ────────────────────────
  async buscarAtleta(nome, clube) {
    const query = `${nome} ${clube}`;
    const articles = await this.fetch(query, 'pt', 8);
    const sentimento = this.analisarSentimento(articles);
    return { query, ...sentimento };
  },

  // ── Busca específica para time ──────────────────────────
  async buscarTime(nomeTime, liga) {
    const query = nomeTime;
    const articles = await this.fetch(query, liga === 'BRA' ? 'pt' : 'en', 10);
    const sentimento = this.analisarSentimento(articles);
    return { query, ...sentimento };
  },

  // ── Cache helpers ────────────────────────────────────────
  _getCache(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts > NEWS_CFG.cache_ttl) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch(e) { return null; }
  },

  _setCache(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
    } catch(e) {}
  },

  // ── Renderizar painel de notícias ────────────────────────
  renderPainel(sentimento, titulo = 'NOTÍCIAS & SENTIMENTO') {
    if (!sentimento) return '<div class="dim" style="padding:8px">Carregando...</div>';

    const col = sentimento.trend === 'positivo' ? 'var(--g1)' :
                sentimento.trend === 'negativo' ? 'var(--r1)' : 'var(--a1)';

    const tagCols = {
      positivo: 'buy', negativo: 'sell', neutro: 'hold'
    };

    return `
      <div class="sec">${titulo}</div>
      <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center">
        <span class="bg ${tagCols[sentimento.trend]||'hold'}"
              style="font-size:8px">${sentimento.label}</span>
        <span class="dim" style="font-size:8px">${sentimento.total} artigos analisados</span>
        <span class="dim" style="font-size:8px;margin-left:auto">
          ${sentimento.positivo}✓ ${sentimento.negativo}✗ ${sentimento.neutro}·
        </span>
      </div>
      ${sentimento.articles.slice(0,6).map(a => {
        const col = a.sentiment === 'positivo' ? 'var(--g2)' :
                    a.sentiment === 'negativo' ? 'var(--r1)' : 'var(--t4)';
        const icon = a.sentiment === 'positivo' ? '▲' :
                     a.sentiment === 'negativo' ? '▼' : '●';
        const date = a.publishedAt
          ? new Date(a.publishedAt).toLocaleDateString('pt-BR')
          : '';
        return `<div style="display:flex;gap:6px;padding:5px 0;border-bottom:1px solid var(--b0);cursor:pointer"
                     onclick="window.open('${a.url}','_blank')">
          <span style="color:${col};font-size:9px;flex-shrink:0;margin-top:1px">${icon}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:9px;color:var(--t1);line-height:1.4">${a.title}</div>
            <div style="font-size:7.5px;color:var(--t5);margin-top:1px">
              ${a.source} · ${date}
            </div>
          </div>
        </div>`;
      }).join('')}
      ${!sentimento.articles.length ? `
        <div class="dim" style="padding:8px;font-size:9px">
          Configure GNews API para carregar notícias em tempo real.<br>
          <span class="lk" onclick="sitConfigNews()">⚙ Configurar agora</span>
        </div>` : ''}`;
  },

  // ── Config helper ────────────────────────────────────────
  config(gnewsKey, vaultUrl, vaultToken) {
    if (gnewsKey)    localStorage.setItem('sit_gnews_key', gnewsKey);
    if (vaultUrl)    localStorage.setItem('sit_vault_url', vaultUrl);
    if (vaultToken)  localStorage.setItem('sit_vault_token', vaultToken);
    NEWS_CFG.gnews_key   = gnewsKey   || NEWS_CFG.gnews_key;
    NEWS_CFG.vault_url   = vaultUrl   || NEWS_CFG.vault_url;
    NEWS_CFG.vault_token = vaultToken || NEWS_CFG.vault_token;
    console.log('[NEWS] Configuração salva');
  },
};

// ── Config helper global ───────────────────────────────────
window.sitConfigNews = function() {
  const key = prompt('GNews API Key (gnews.io):', NEWS_CFG.gnews_key);
  if (key) NEWS.config(key);
  alert('Recarregue a página para ativar.');
};

window.NEWS = NEWS;
