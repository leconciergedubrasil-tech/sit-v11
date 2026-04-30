// ═══════════════════════════════════════════════════════════
// sit-core.js — SIT v11 · MPA Engine
// Compartilhado por TODAS as páginas do terminal
// © 2026 Cardinal Protocol — Confidencial
// ═══════════════════════════════════════════════════════════
'use strict';

// ── Sessão (localStorage) ──────────────────────────────────
const SIT = {
  // Ler sessão
  getSession() {
    try { return JSON.parse(localStorage.getItem('sit_session') || 'null'); }
    catch(e) { return null; }
  },
  // Salvar sessão
  setSession(data) {
    try { localStorage.setItem('sit_session', JSON.stringify(data)); }
    catch(e) {}
  },
  // Verificar se está logado
  checkAuth() {
    const s = this.getSession();
    if (!s || !s.user) {
      window.location.href = 'index.html';
      return false;
    }
    return s;
  },
  // Nível do plano
  getPlan() {
    const s = this.getSession();
    return s ? s.level : 'VIEWER';
  },

  // ── Navegação MPA ────────────────────────────────────────
  // O coração do terminal: cada comando abre uma PÁGINA real
  go(cmd) {
    const raw = cmd.trim().toUpperCase().replace(/<GO>|<\/GO>/g,'').trim();

    // MON / TOP / HOME
    if (['MON','TOP','HOME','WEI'].includes(raw)) {
      window.location.href = 'mon.html'; return;
    }
    // EQS
    if (raw === 'EQS') { window.location.href = 'eqs.html'; return; }
    // COPA
    if (['COPA','COPA2026'].includes(raw)) { window.location.href = 'copa.html'; return; }
    // H2H
    if (raw.startsWith('H2H')) {
      const parts = raw.replace('H2H','').trim().split(/\s+/);
      const t1 = parts[0]||'FLA', t2 = parts[1]||'RM';
      window.location.href = `h2h.html?t1=${t1}&t2=${t2}`; return;
    }
    // MRKT
    if (raw === 'MRKT') { window.location.href = 'mrkt.html'; return; }
    // ECO / MACRO
    if (['ECO','MACRO'].includes(raw)) { window.location.href = 'eco.html'; return; }
    // FX / CÂMBIO
    if (raw === 'FX') { window.location.href = 'fx.html'; return; }
    // FAVE / FAVORITOS
    if (['FAVE','FAV'].includes(raw)) { window.location.href = 'fave.html'; return; }
    // ALERT
    if (raw === 'ALERT') { window.location.href = 'alert.html'; return; }
    // HELP / MANUAL
    if (['HELP','MANUAL','?'].includes(raw)) { window.location.href = 'help.html'; return; }
    // BACK
    if (raw === 'BACK') { window.history.back(); return; }
    // TECH
    if (raw === 'TECH') {
      const key = this.getSession()?.lastTeam || 'FLA';
      window.location.href = `tech.html?team=${key}`; return;
    }
    // BLACKCARD / BLACK
    if (['BLACKCARD','BLACK','BC'].includes(raw)) {
      const key = this.getSession()?.lastTeam || 'FLA';
      window.location.href = `blackcard.html?team=${key}`; return;
    }

    // Atleta: PEDRO/FLA, VINI/RM, etc.
    const slashMatch = raw.match(/^([^\/]+)\/([A-Z0-9]+)$/);
    if (slashMatch) {
      const ath = slashMatch[1], team = slashMatch[2];
      window.location.href = `athlete.html?team=${team}&athlete=${encodeURIComponent(ath)}`;
      return;
    }

    // Time: FLA, RM, FCB, MCI, ACM, etc.
    const db = window.SIT_DB?.DB || {};
    if (db[raw]) {
      // Guardar último time na sessão
      const s = this.getSession() || {};
      s.lastTeam = raw;
      this.setSession(s);
      window.location.href = `team.html?team=${raw}`;
      return;
    }

    // Tentar tab: DES, FA, VPI, etc. → ir para team com tab
    const tabCmds = ['DES','FA','VPI','HP','TECH','ANR','GRAHAM','BUFFETT','BLACKROCK','NASH','RIGHTS','HOLD','SPLC','RV','PPC','CN'];
    if (tabCmds.includes(raw)) {
      const key = this.getSession()?.lastTeam;
      if (key) { window.location.href = `team.html?team=${key}&tab=${raw}`; return; }
    }

    // Região
    const regions = {
      'BRA':'mon.html?region=BRA','ESP':'mon.html?region=ESP',
      'UK':'mon.html?region=UK','GER':'mon.html?region=GER',
      'ITA':'mon.html?region=ITA','FRA':'mon.html?region=FRA',
      'SAU':'mon.html?region=SAU','LATAM':'mon.html?region=LATAM',
    };
    if (regions[raw]) { window.location.href = regions[raw]; return; }
  },

  // ── Header compartilhado ─────────────────────────────────
  renderHeader(activePage) {
    const s = this.getSession() || {};
    const pages = [
      { label:'MON', href:'mon.html' },
      { label:'EQS', href:'eqs.html' },
      { label:'COPA', href:'copa.html' },
      { label:'H2H', href:'h2h.html' },
      { label:'MRKT', href:'mrkt.html' },
      { label:'ECO', href:'eco.html' },
      { label:'FX', href:'fx.html' },
      { label:'FAVE', href:'fave.html' },
    ];
    const menuHTML = pages.map(p =>
      `<a class="mi${activePage===p.label?' active':''}" href="${p.href}">${p.label}</a>`
    ).join('');

    return `
      <div class="menubar">
        ${menuHTML}
        <a class="mi" href="help.html">?</a>
        <div id="mb-plan" class="mi plan">${s.level||'—'}</div>
        <div class="mi version">SIT v11 · CARDINAL</div>
      </div>
      <div class="topbar">
        <div class="tb-logo">
          <div class="tb-sit">SIT</div>
          <div class="tb-sub">Sport Intelligence Terminal</div>
        </div>
        <div class="tb-cmd">
          <span class="sit-cursor"></span>
          <input type="text" id="cmd-input"
                 placeholder="${activePage||'MON'} › Digite um comando — FLA &lt;GO&gt; · PEDRO/FLA &lt;GO&gt; · COPA &lt;GO&gt;"
                 autocomplete="off" spellcheck="false">
          <div id="cmd-sugs" class="tb-suggestions"></div>
        </div>
        <div class="tb-right">
          <button class="tb-btn" onclick="window.history.back()">← BACK</button>
          <button class="tb-btn" onclick="SIT.go('FAVE')">★ FAVE</button>
          <button class="tb-btn" onclick="SIT.go('ALERT')">⚡ ALERT</button>
          <button class="tb-btn" onclick="SIT.go('HELP')">? HELP</button>
        </div>
      </div>
      <div class="ticker-wrap"><div class="ticker-inner" id="ticker"></div></div>
      <div class="breadcrumb" id="breadcrumb"></div>`;
  },

  // ── Ticker ────────────────────────────────────────────────
  renderTicker() {
    const db = window.SIT_DB?.DB || {};
    const items = Object.entries(db).map(([k,t]) => {
      const col = t.chgN > 0 ? 'tup' : t.chgN < 0 ? 'tdn' : 'tv';
      const arr = t.chgN > 0 ? '▲' : t.chgN < 0 ? '▼' : '●';
      return `<span class="ti" onclick="SIT.go('${k}')"><span class="tn">${t.tk}</span> <span class="${col}">${arr} ${t.vpi}%</span> <span class="${col}" style="font-size:8px">${t.chg}</span></span><span class="tsep">·</span>`;
    }).join('');
    const el = document.getElementById('ticker');
    if (el) el.innerHTML = items + items; // doubled for infinite scroll
  },

  // ── Status bar ────────────────────────────────────────────
  renderStatusBar(extra) {
    const s = this.getSession() || {};
    return `
      <div class="status-bar">
        <div class="sb-item">SIT v11 <b style="color:var(--g1)">◉ ONLINE</b></div>
        ${extra || ''}
        <div class="sb-item">PLANO <b>${s.level||'—'}</b></div>
        <div class="sb-item">CLUBES <b>12</b></div>
        <div class="sb-item">INDICADORES <b>13</b></div>
        <div class="sb-clock" id="sb-clk">--:--:--</div>
      </div>`;
  },

  // ── Breadcrumb ────────────────────────────────────────────
  setBreadcrumb(parts) {
    const el = document.getElementById('breadcrumb');
    if (!el) return;
    el.innerHTML = parts.map((p, i) => {
      const isLast = i === parts.length - 1;
      return (i > 0 ? '<span class="bc-sep">›</span>' : '') +
        `<span class="bc-item${isLast ? ' current' : ''}"${p.href ? ` onclick="SIT.go('${p.href}')" style="cursor:pointer"` : ''}>${p.label}</span>`;
    }).join('');
  },

  // ── Command input binding ─────────────────────────────────
  bindCmd() {
    const inp = document.getElementById('cmd-input');
    const sugs = document.getElementById('cmd-sugs');
    if (!inp) return;

    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const v = inp.value.trim();
        if (v) { inp.value = ''; SIT.go(v); }
      }
      if (e.key === 'Escape' && sugs) sugs.style.display = 'none';
    });

    inp.addEventListener('input', () => {
      if (!sugs) return;
      const q = inp.value.trim().toUpperCase();
      if (q.length < 1) { sugs.style.display = 'none'; return; }
      const results = SIT.autocomplete(q);
      if (!results.length) { sugs.style.display = 'none'; return; }
      sugs.innerHTML = results.map(r =>
        `<div class="tb-sug-item" onclick="inp.value='';SIT.go('${r.cmd}')">
          <span class="tb-sug-cmd">${r.cmd}</span>
          <span class="tb-sug-desc">${r.desc}</span>
        </div>`).join('');
      sugs.style.display = 'block';
    });

    document.addEventListener('click', e => {
      if (sugs && !inp.closest('.tb-cmd')?.contains(e.target)) sugs.style.display = 'none';
    });
  },

  // ── Autocomplete ──────────────────────────────────────────
  autocomplete(q) {
    const db = window.SIT_DB?.DB || {};
    const results = [];
    // Times
    Object.entries(db).forEach(([k, t]) => {
      if (k.startsWith(q) || t.n.toUpperCase().includes(q)) {
        results.push({ cmd: k, desc: t.n + ' — VPI:' + t.vpi + '%' });
      }
      // Atletas
      (t.athletes||[]).forEach(a => {
        if (a.n.toUpperCase().includes(q)) {
          results.push({ cmd: a.n.replace(/\s+/g,'/').toUpperCase()+'/'+k, desc: a.pos+' · '+t.tk+' · VPI:'+a.vpi+'%' });
        }
      });
    });
    // Funções
    const fns = [
      {cmd:'MON',desc:'Monitor Global'},{cmd:'EQS',desc:'Screener'},
      {cmd:'COPA',desc:'Copa do Mundo 2026'},{cmd:'H2H',desc:'Head to Head'},
      {cmd:'MRKT',desc:'Mercado'},{cmd:'ECO',desc:'Macroeconomia'},
      {cmd:'FX',desc:'Câmbio ao vivo'},{cmd:'FAVE',desc:'Favoritos'},
      {cmd:'ALERT',desc:'Alertas'},{cmd:'HELP',desc:'Manual'},
      {cmd:'BACK',desc:'Voltar'},
    ];
    fns.forEach(f => { if (f.cmd.startsWith(q)) results.push(f); });
    return results.slice(0, 8);
  },

  // ── Clock ─────────────────────────────────────────────────
  startClock() {
    const tick = () => {
      const el = document.getElementById('sb-clk');
      if (el) el.textContent = new Date().toLocaleTimeString('pt-BR');
    };
    tick();
    setInterval(tick, 1000);
  },

  // ── Favoritos ─────────────────────────────────────────────
  getFaves() {
    try { return JSON.parse(localStorage.getItem('sit_faves') || '{"teams":[],"athletes":[]}'); }
    catch(e) { return {teams:[], athletes:[]}; }
  },
  addFave(type, key) {
    const f = this.getFaves();
    if (!f[type].includes(key)) {
      f[type].push(key);
      localStorage.setItem('sit_faves', JSON.stringify(f));
    }
  },
  removeFave(type, key) {
    const f = this.getFaves();
    f[type] = f[type].filter(x => x !== key);
    localStorage.setItem('sit_faves', JSON.stringify(f));
  },
  isFave(type, key) {
    return this.getFaves()[type].includes(key);
  },

  // ── Boot de página ────────────────────────────────────────
  // Chamado no início de cada página (exceto index)
  boot(activePage, statusExtra) {
    const s = this.checkAuth();
    if (!s) return false;

    const hEl = document.getElementById('header');
    if (hEl) hEl.innerHTML = this.renderHeader(activePage);

    const sbEl = document.getElementById('statusbar');
    if (sbEl) sbEl.innerHTML = this.renderStatusBar(statusExtra);

    this.renderTicker();
    this.bindCmd();
    this.startClock();

    // Aguardar loader de dados reais e re-renderizar ticker/status
    if (window.LOADER_READY) {
      window.LOADER_READY.then(() => {
        // Atualizar badge de fonte de dados no status bar
        const badge = document.getElementById('sb-datasource');
        if (badge && window.LOADER) badge.innerHTML = window.LOADER.getStatusBadge();
        // Re-renderizar ticker com dados atualizados
        this.renderTicker();
      });
    }

    return s;
  },

  // Status bar com slot para fonte de dados
  renderStatusBar(extra) {
    const s = this.getSession() || {};
    return `
      <div class="status-bar">
        <div class="sb-item">SIT v11 <b style="color:var(--g1)">◉</b></div>
        <div class="sb-item" id="sb-datasource">
          <span style="color:var(--a1);font-size:7px">○ CARREGANDO...</span>
        </div>
        ${extra || ''}
        <div class="sb-item">PLANO <b>${s.level||'—'}</b></div>
        <div class="sb-item">USUÁRIO <b>${(s.user||'—').split('@')[0]}</b></div>
        <div class="sb-clock" id="sb-clk">--:--:--</div>
      </div>`;
  },
};

// ── Tecla F1 = ir para MON (como Bloomberg) ───────────────
document.addEventListener('keydown', e => {
  if (e.key === 'F1') { e.preventDefault(); SIT.go('MON'); }
});
