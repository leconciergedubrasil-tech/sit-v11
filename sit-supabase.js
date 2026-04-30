// ═══════════════════════════════════════════════════════════
// sit-supabase.js — SIT v11 · Cliente Supabase
// Substitui sit-loader.js quando Supabase está configurado
// O SIT busca dados reais direto do banco, sem JSON local
// © 2026 Cardinal Protocol
// ═══════════════════════════════════════════════════════════
'use strict';

// ── Configuração — substitua pelos seus valores ──────────
// Encontre em: Supabase → Settings → API
const SUPABASE_URL = localStorage.getItem('sit_sb_url') || '';
const SUPABASE_KEY = localStorage.getItem('sit_sb_key') || '';
// ─────────────────────────────────────────────────────────

const SB = {
  configured: !!(SUPABASE_URL && SUPABASE_KEY),

  async get(table, params = '') {
    if (!this.configured) return null;
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?${params}`,
        {
          headers: {
            'apikey':        SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Accept':        'application/json',
          },
          signal: AbortSignal.timeout(5000),
        }
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      console.warn(`[SB] ${table}: ${e.message}`);
      return null;
    }
  },

  // Buscar câmbio
  async getFX() {
    const rows = await this.get('sit_fx', 'id=eq.latest');
    return rows?.[0] || null;
  },

  // Buscar todos os times
  async getTeams() {
    return await this.get('sit_teams', 'select=*') || [];
  },

  // Buscar um time específico
  async getTeam(teamKey) {
    const rows = await this.get('sit_teams', `team_key=eq.${teamKey}`);
    return rows?.[0] || null;
  },

  // Buscar artilheiros de uma liga
  async getScorers(liga) {
    return await this.get('sit_scorers',
      `liga=eq.${liga}&order=goals.desc&limit=10`) || [];
  },

  // Buscar log da última coleta
  async getLastLog() {
    const rows = await this.get('sit_logs', 'id=eq.latest');
    return rows?.[0] || null;
  },
};

// ── LOADER atualizado com Supabase ──────────────────────
const LOADER = {
  realData: null,
  loaded:   false,
  source:   'mock',

  async load() {
    // 1. Tentar Supabase (se configurado)
    if (SB.configured) {
      const ok = await this._loadFromSupabase();
      if (ok) return true;
    }

    // 2. Fallback: sit-data-real.json local
    try {
      const r = await fetch('sit-data-real.json', {
        cache: 'no-store',
        signal: AbortSignal.timeout(3000),
      });
      if (r.ok) {
        this.realData = await r.json();
        this.source   = 'json';
        this._mergeDB();
        console.log('[LOADER] JSON local carregado');
        return true;
      }
    } catch (e) {}

    // 3. Fallback final: mock
    console.log('[LOADER] Usando dados mock');
    this.source = 'mock';
    return false;
  },

  async _loadFromSupabase() {
    try {
      console.log('[LOADER] Buscando dados do Supabase...');

      const [fx, teams, log] = await Promise.all([
        SB.getFX(),
        SB.getTeams(),
        SB.getLastLog(),
      ]);

      if (!fx && !teams.length) {
        console.warn('[LOADER] Supabase vazio');
        return false;
      }

      this.realData = { fx, teams, log };
      this.source   = 'supabase';
      this._mergeDB();

      console.log(`[LOADER] Supabase ✓ — ${teams.length} times · FX: ${fx?.USDBRL}`);
      return true;
    } catch (e) {
      console.warn('[LOADER] Supabase erro:', e.message);
      return false;
    }
  },

  _mergeDB() {
    if (!this.realData || !window.SIT_DB) return;
    const db = window.SIT_DB.DB;

    // ── FX ──────────────────────────────────────────────
    if (this.realData.fx) {
      window.SIT_DB.FX_REAL = this.realData.fx;
    }

    // ── Times ────────────────────────────────────────────
    const teamsArr = Array.isArray(this.realData.teams)
      ? this.realData.teams
      : Object.values(this.realData.teams || {});

    teamsArr.forEach(data => {
      const tk = data.team_key;
      if (!tk || !db[tk]) return;

      if (data.vpi != null) {
        db[tk]._vpi_mock  = db[tk].vpi;
        db[tk].vpi        = parseFloat(data.vpi);
        db[tk].vpi_source = this.source;
      }
      if (data.pbi != null) {
        db[tk].pbi = parseFloat(data.pbi);
      }
      if (data.hp) {
        try {
          const hp = typeof data.hp === 'string'
            ? JSON.parse(data.hp) : data.hp;
          if (hp.length) db[tk].hp = hp;
        } catch(e) {}
      }
      if (data.venue)       db[tk].stadium = data.venue;
      if (data.founded)     db[tk].founded = parseInt(data.founded) || db[tk].founded;
      if (data.crest_url)   db[tk].logo    = data.crest_url;
      if (data.standing_pos) {
        db[tk].standing = {
          position: data.standing_pos,
          points:   data.standing_pts,
        };
      }
      db[tk].data_source = this.source;
    });
  },

  getFX() {
    return this.realData?.fx || {
      USDBRL:5.15, EURBRL:5.63, GBPBRL:6.51,
      EURUSD:1.093, SARBRL:1.373, JPYBRL:0.034,
      updated_at: null, source: 'mock',
    };
  },

  getStatusBadge() {
    const src = {
      supabase: `<span style="color:var(--g1)">● SUPABASE</span>`,
      json:     `<span style="color:var(--g2)">● JSON LOCAL</span>`,
      mock:     `<span style="color:var(--a1)">○ MOCK</span>`,
    }[this.source] || '';
    const log = this.realData?.log;
    const upd = log?.collected_at
      ? new Date(log.collected_at).toLocaleString('pt-BR')
      : this.realData?.fx?.updated_at
        ? new Date(this.realData.fx.updated_at).toLocaleString('pt-BR')
        : '';
    return `<span style="font-size:7px">${src}${upd ? ' · '+upd : ''}</span>`;
  },
};

window.SB     = SB;
window.LOADER = LOADER;
window.LOADER_READY = LOADER.load();
