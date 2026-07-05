// ═══════════════════════════════════════════════════════════
// sit-supabase.js — SIT v11 · Cliente Supabase v2
// Suporte a 500+ times com busca dinâmica + lazy loading
// Fallback: JSON local → mock
// © 2026 Cardinal Protocol
// ═══════════════════════════════════════════════════════════
'use strict';

const SB_URL = localStorage.getItem('sit_sb_url') || 'https://qddtpccbfpgzcexjuokh.supabase.co';
const SB_KEY = localStorage.getItem('sit_sb_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZHRwY2NiZnBnemNleGp1b2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1Mjg4NzUsImV4cCI6MjA5MzEwNDg3NX0.Ll9W_qFg3pJFJkR3PYkxYXGXVK8Pfn1iyY-GqWCmesk';
const SB_OK  = !!(SB_URL && SB_KEY);

const SB = {
  async get(table, qs = '') {
    if (!SB_OK) return null;
    try {
      const r = await fetch(`${SB_URL}/rest/v1/${table}?${qs}`, {
        headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Accept': 'application/json' },
        signal: AbortSignal.timeout(6000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch(e) { console.warn(`[SB] ${table}: ${e.message}`); return null; }
  },

  async rpc(fn, params = {}) {
    if (!SB_OK) return null;
    try {
      const r = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
        method: 'POST',
        headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(6000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch(e) { console.warn(`[SB] rpc/${fn}: ${e.message}`); return null; }
  },

  async getTeam(key)           { return (await this.get('sit_teams', `key=eq.${key}&select=*`))?.[0] || null; },
  async getAthletes(teamKey)   { return await this.get('sit_athletes', `team_key=eq.${teamKey}&order=vpi.desc&select=*`) || []; },
  async getMatches(teamKey, n=10) { return await this.get('sit_matches', `team_key=eq.${teamKey}&order=match_date.desc&limit=${n}`) || []; },
  async getRanking(liga, n=100){ let q=`order=vpi.desc&limit=${n}`; if(liga) q+=`&liga_id=eq.${liga}`; return await this.get('sit_ranking_vpi', q) || []; },
  async getScreener(f={})      { let q='order=vpi.desc&limit=100'; if(f.rating) q+=`&rating=eq.${f.rating}`; if(f.liga) q+=`&liga_id=eq.${f.liga}`; return await this.get('sit_screener', q) || []; },
  async search(q)              { return await this.rpc('sit_search', {q}) || []; },
  async getFX()                { return await this.get('sit_fx', 'order=pair') || []; },
  async getNews(tk, n=20)      { let q=`order=published_at.desc&limit=${n}`; if(tk) q+=`&team_key=eq.${tk}`; return await this.get('sit_news', q) || []; },
  async getCopa()              { return await this.get('sit_copa_nations', 'order=vpi.desc') || []; },
  async getMaestro(tk)         { let q='active=eq.true&order=call_date.desc&limit=20'; if(tk) q+=`&team_key=eq.${tk}`; return await this.get('sit_maestro', q) || []; },
  async getLastLog()           { return (await this.get('sit_logs', 'order=collected_at.desc&limit=1'))?.[0] || null; },
};

const LOADER = {
  source: 'mock', loaded: false, _log: null,

  async load() {
    if (SB_OK) {
      if (await this._fromSupabase()) return true;
    }
    try {
      const r = await fetch('sit-data-real.json', { cache:'no-store', signal:AbortSignal.timeout(3000) });
      if (r.ok) { this._fromJSON(await r.json()); return true; }
    } catch(e) {}
    this.source = 'mock';
    console.log('[LOADER] mock');
    return false;
  },

  async _fromSupabase() {
    try {
      const [ranking, fx, log] = await Promise.all([SB.getRanking(null,100), SB.getFX(), SB.getLastLog()]);
      if (!ranking?.length) return false;
      this._log = log; this.source = 'supabase';
      this._mergeRanking(ranking);
      if (fx?.length) { window.SIT_DB.FX_REAL = {}; fx.forEach(f => window.SIT_DB.FX_REAL[f.pair] = f); }
      console.log(`[LOADER] Supabase ✓ ${ranking.length} times`);
      return true;
    } catch(e) { console.warn('[LOADER] SB err:', e.message); return false; }
  },

  _fromJSON(data) {
    this.source = 'json';
    const db = window.SIT_DB?.DB || {};
    Object.values(data.teams || {}).forEach(t => {
      const k = t.team_key || t.key; if (!k || !db[k]) return;
      if (t.vpi != null) db[k].vpi = parseFloat(t.vpi);
      if (t.pbi != null) db[k].pbi = parseFloat(t.pbi);
      if (t.hp_real?.length) db[k].hp = t.hp_real;
      db[k].data_source = 'json';
    });
    if (data.fx) window.SIT_DB.FX_REAL = data.fx;
    console.log('[LOADER] JSON local');
  },

  _mergeRanking(ranking) {
    if (!window.SIT_DB) return;
    const db = window.SIT_DB.DB;
    ranking.forEach(t => {
      const k = t.key; if (!k) return;
      if (db[k]) {
        // Atualizar campos reais no time existente
        ['vpi','pbi','rsi'].forEach(f => { if (t[f] != null) db[k][f] = parseFloat(t[f]); });
        if (t.tdm)    db[k].tdm    = t.tdm;
        if (t.rating) db[k].rating = t.rating;
        if (t.score)  db[k].score  = t.score;
        if (t.chg)    db[k].chg    = t.chg;
        if (t.chg_num != null) db[k].chgN = parseFloat(t.chg_num);
        if (t.standing_pos) db[k].standing = { position: t.standing_pos, points: t.standing_pts };
        db[k].data_source = 'supabase';
      } else {
        // Time novo — não estava no mock
        db[k] = {
          n:t.name, tk:t.ticker||k, liga:t.liga_id||'—',
          vpi:parseFloat(t.vpi)||70, pbi:parseFloat(t.pbi)||22, rsi:parseFloat(t.rsi)||50,
          kii:10, tdm:t.tdm||'STABLE', rating:t.rating||'HOLD', score:t.score||'A',
          chg:t.chg||'+0.0%', chgN:parseFloat(t.chg_num)||0,
          val:t.market_value||'—', rev:t.revenue||'—', ebitda:t.ebitda||'—', roe:t.roe||'—',
          founded:t.founded||0, stadium:t.stadium||'—', cap:t.capacity||0,
          coach:t.coach||'—', logo:t.logo_url||'',
          athletes:[], hp:[], sponsors:[], hold:[], data_source:'supabase',
        };
      }
    });
    console.log(`[LOADER] DB: ${Object.keys(db).length} times`);
  },

  // Lazy load: busca time no Supabase se não estiver no DB local
  async resolveTeam(key) {
    const db = window.SIT_DB?.DB || {};
    if (db[key]) return db[key];
    if (!SB_OK) return null;
    const t = await SB.getTeam(key);
    if (!t) return null;
    this._mergeRanking([t]);
    return window.SIT_DB.DB[key] || null;
  },

  // Lazy load atletas
  async loadAthletes(teamKey) {
    const db = window.SIT_DB?.DB || {};
    const t  = db[teamKey];
    if (!t) return [];
    if (t.athletes?.length) return t.athletes;
    if (!SB_OK) return [];
    const rows = await SB.getAthletes(teamKey);
    t.athletes = rows.map(a => ({
      n:a.name, pos:a.position||'—', vpi:parseFloat(a.vpi)||70, pbi:parseFloat(a.pbi)||22, kii:10,
      gols:a.goals||0, ass:a.assists||0, min:a.minutes||0, nat:a.nationality||'—', age:a.age||0,
      sal:a.salary_month||'—', clause:a.release_clause||'—', ctr:a.contract_until||'—',
      vel:a.attr_vel||70, tec:a.attr_tec||70, fis:a.attr_fis||70,
      men:a.attr_men||70, tat:a.attr_tat||70, cri:a.attr_cri||70,
      inj:a.injuries||[], matches:a.match_history||[], bio:a.bio||'',
    }));
    return t.athletes;
  },

  // Lazy load partidas
  async loadMatches(teamKey) {
    const db = window.SIT_DB?.DB || {};
    const t  = db[teamKey];
    if (!t) return [];
    if (t.hp?.length) return t.hp;
    if (!SB_OK) return [];
    const rows = await SB.getMatches(teamKey);
    t.hp = rows.map(m => ({
      d:m.match_date, adv:m.opponent, pl:m.score,
      vp:parseFloat(m.vpi_match)||70, var:m.vpi_change||'+0.0%',
    }));
    return t.hp;
  },

  getFX() {
    const r = window.SIT_DB?.FX_REAL;
    if (!r) return window.SIT_DB?.FX_BASE || {};
    // Normalizar: pode ser array (Supabase) ou objeto (JSON)
    if (Array.isArray(r)) {
      const o = {};
      r.forEach(f => { o[f.pair] = f.rate || f; });
      return o;
    }
    return r;
  },

  getStatusBadge() {
    const src = { supabase:'<span style="color:var(--g1)">● LIVE</span>', json:'<span style="color:var(--g2)">● JSON</span>', mock:'<span style="color:var(--a1)">○ MOCK</span>' }[this.source] || '';
    const upd = this._log?.collected_at ? new Date(this._log.collected_at).toLocaleString('pt-BR') : '';
    return `<span style="font-size:7px;font-family:var(--fu)">${src}${upd?' · '+upd:''}</span>`;
  },
};

// Busca dinâmica com fallback Supabase
async function sitSearchDynamic(q) {
  if (!q || q.length < 2) return [];
  const db  = window.SIT_DB?.DB || {};
  const qUp = q.toUpperCase();
  const local = [];

  Object.entries(db).forEach(([k,t]) => {
    if (k.startsWith(qUp) || t.n.toUpperCase().includes(qUp) || t.tk.startsWith(qUp))
      local.push({ cmd:k, desc:`${t.n} · VPI:${t.vpi}%`, type:'team' });
    (t.athletes||[]).forEach(a => {
      if (a.n.toUpperCase().includes(qUp))
        local.push({ cmd:`${a.n.split(' ').pop().toUpperCase()}/${k}`, desc:`${a.pos} · ${t.tk} · VPI:${a.vpi}%`, type:'athlete' });
    });
  });

  if (local.length < 5 && SB_OK) {
    const sb = await SB.search(q);
    sb.forEach(r => {
      if (!local.find(l => l.cmd === r.key))
        local.push({ cmd:r.key, desc:`${r.name} · ${r.extra||''}${r.vpi?` · VPI:${r.vpi}%`:''}`, type:r.type });
    });
  }
  return local.slice(0,8);
}

function sitConfigSupabase(url, key) {
  localStorage.setItem('sit_sb_url', url);
  localStorage.setItem('sit_sb_key', key);
  alert('Credenciais salvas! Recarregue a página.');
}

window.SB               = SB;
window.LOADER           = LOADER;
window.sitSearchDynamic = sitSearchDynamic;
window.sitConfigSupabase= sitConfigSupabase;
window.LOADER_READY     = LOADER.load();
