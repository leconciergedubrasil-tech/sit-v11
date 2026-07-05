// ═══════════════════════════════════════════════════════════
// sit-panels.js — SIT v11 · Multi-Monitor Manager
// Estilo MetaTrader: destaca painéis em janelas independentes
// Cada painel pode ir para um monitor diferente
// © 2026 Cardinal Protocol
// ═══════════════════════════════════════════════════════════
'use strict';

const PANELS = {
  // Registro de janelas abertas
  _windows: {},
  _bc: null,

  // Configuração de cada painel disponível
  CATALOG: {
    news:    { title:'NEWS · INSIDER FEED',   file:'panel-news.html',   w:500, h:700, icon:'📰' },
    wei:     { title:'WEI · WORLD INDEX',     file:'panel-wei.html',    w:420, h:560, icon:'🌍' },
    fx:      { title:'FX · CÂMBIO',           file:'panel-fx.html',     w:380, h:440, icon:'💱' },
    teams:   { title:'TIMES · VPI MONITOR',   file:'panel-teams.html',  w:440, h:600, icon:'⊞'  },
    ticker:  { title:'TICKER · STRIP',        file:'panel-ticker.html', w:1400,h:36,  icon:'▶'  },
    alerts:  { title:'ALERTAS ATIVOS',        file:'panel-alerts.html', w:380, h:500, icon:'⚡'  },
  },

  // Posições automáticas para múltiplos monitores
  // O browser não tem acesso direto à posição dos monitores,
  // mas podemos usar screen.width * N para empurrar para o monitor N
  POSITIONS: {
    1: { x: 0,                  y: 0   },  // Monitor 1 — esquerda
    2: { x: 'screen.width',     y: 0   },  // Monitor 2 — direita
    3: { x: 'screen.width*2',   y: 0   },  // Monitor 3
    4: { x: 0,                  y: 600 },  // Monitor 1 — embaixo
  },

  // Inicializar BroadcastChannel
  init() {
    this._bc = new BroadcastChannel('sit_panels');
    this._bc.onmessage = (e) => {
      const { type, cmd } = e.data;
      if (type === 'NAV' && cmd && window.SIT) {
        SIT.go(cmd);
      }
      if (type === 'CLOSE_ALL') {
        this.closeAll();
      }
    };

    // Restaurar painéis abertos na sessão anterior
    this._restoreSession();
  },

  // Abrir painel destacado
  open(panelId, monitor = null) {
    const cfg = this.CATALOG[panelId];
    if (!cfg) { console.warn('[PANELS] Painel não encontrado:', panelId); return; }

    // Se já está aberto, focar
    if (this._windows[panelId] && !this._windows[panelId].closed) {
      this._windows[panelId].focus();
      return;
    }

    // Calcular posição
    let left = 100, top = 100;
    if (monitor) {
      const pos = this.POSITIONS[monitor] || this.POSITIONS[1];
      left = typeof pos.x === 'string' ? eval(pos.x) + 20 : pos.x + 20;
      top  = pos.y + 40;
    } else {
      // Escalonar janelas automaticamente
      const count = Object.values(this._windows).filter(w => w && !w.closed).length;
      left = 80 + count * 30;
      top  = 80 + count * 30;
    }

    // Parâmetros da janela — sem chrome, igual MT5
    const params = [
      `width=${cfg.w}`,
      `height=${cfg.h}`,
      `left=${left}`,
      `top=${top}`,
      'menubar=no',
      'toolbar=no',
      'location=no',
      'status=no',
      'resizable=yes',
      'scrollbars=no',
    ].join(',');

    const win = window.open(cfg.file, `sit_panel_${panelId}`, params);
    if (win) {
      this._windows[panelId] = win;
      this._saveSession();
      console.log(`[PANELS] Aberto: ${cfg.title}`);
    } else {
      alert('Popups bloqueados!\nPermita popups para sit-v11.pages.dev nas configurações do browser.');
    }
    return win;
  },

  // Abrir painel em monitor específico
  openOnMonitor(panelId, monitorNum) {
    return this.open(panelId, monitorNum);
  },

  // Fechar painel
  close(panelId) {
    if (this._windows[panelId] && !this._windows[panelId].closed) {
      this._windows[panelId].close();
    }
    delete this._windows[panelId];
    this._saveSession();
  },

  // Fechar todos
  closeAll() {
    Object.entries(this._windows).forEach(([id, win]) => {
      if (win && !win.closed) win.close();
    });
    this._windows = {};
    this._saveSession();
  },

  // Verificar se painel está aberto
  isOpen(panelId) {
    return !!(this._windows[panelId] && !this._windows[panelId].closed);
  },

  // Salvar estado na sessão
  _saveSession() {
    const open = Object.keys(this._windows).filter(k =>
      this._windows[k] && !this._windows[k].closed
    );
    localStorage.setItem('sit_panels_open', JSON.stringify(open));
  },

  // Restaurar painéis da sessão (opcional — comentado por padrão)
  _restoreSession() {
    // Descomentado pelo usuário se quiser auto-restaurar
    // const open = JSON.parse(localStorage.getItem('sit_panels_open') || '[]');
    // open.forEach(id => this.open(id));
  },

  // Renderizar barra de controle de painéis
  renderControlBar() {
    return `
      <div id="panel-control-bar" style="
        background:var(--bg0);border-bottom:1px solid var(--b1);
        display:flex;align-items:center;gap:1px;padding:0 6px;
        flex-shrink:0;height:24px;overflow-x:auto;
      ">
        <span style="font-size:7px;color:var(--t5);font-family:var(--fu);letter-spacing:1px;margin-right:4px;white-space:nowrap">PAINÉIS ↗</span>
        ${Object.entries(this.CATALOG).map(([id, cfg]) => `
          <button
            id="panelbtn-${id}"
            onclick="PANELS.toggle('${id}')"
            style="
              padding:2px 8px;font-size:7.5px;font-family:var(--fu);font-weight:700;
              background:transparent;border:1px solid var(--b1);color:var(--t4);
              cursor:pointer;white-space:nowrap;letter-spacing:.3px;
              transition:all .1s;height:18px;
            "
            onmouseover="this.style.borderColor='var(--b3)';this.style.color='var(--t2)'"
            onmouseout="this.style.borderColor='var(--b1)';this.style.color='var(--t4)'"
          >${cfg.icon} ${id.toUpperCase()}</button>
        `).join('')}
        <div style="margin-left:auto;display:flex;gap:2px">
          <button onclick="PANELS.openLayout('trader')"
            style="padding:2px 8px;font-size:7px;font-family:var(--fu);border:1px solid var(--b2);background:rgba(0,255,65,.05);color:var(--g3);cursor:pointer">
            ⊞ TRADER
          </button>
          <button onclick="PANELS.openLayout('analyst')"
            style="padding:2px 8px;font-size:7px;font-family:var(--fu);border:1px solid var(--b2);background:rgba(0,255,65,.05);color:var(--g3);cursor:pointer">
            ⊞ ANALYST
          </button>
          <button onclick="PANELS.closeAll()"
            style="padding:2px 8px;font-size:7px;font-family:var(--fu);border:1px solid var(--r2);background:transparent;color:var(--r1);cursor:pointer">
            ✕ FECHAR TUDO
          </button>
        </div>
      </div>`;
  },

  // Toggle: abre se fechado, fecha se aberto
  toggle(panelId) {
    if (this.isOpen(panelId)) {
      this.close(panelId);
    } else {
      this.open(panelId);
    }
    this._updateButtons();
  },

  // Atualizar visual dos botões
  _updateButtons() {
    Object.keys(this.CATALOG).forEach(id => {
      const btn = document.getElementById(`panelbtn-${id}`);
      if (!btn) return;
      if (this.isOpen(id)) {
        btn.style.background   = 'rgba(0,255,65,.12)';
        btn.style.borderColor  = 'var(--g3)';
        btn.style.color        = 'var(--g1)';
      } else {
        btn.style.background  = 'transparent';
        btn.style.borderColor = 'var(--b1)';
        btn.style.color       = 'var(--t4)';
      }
    });
  },

  // Layouts pré-definidos — abre conjunto de painéis
  openLayout(name) {
    this.closeAll();
    setTimeout(() => {
      if (name === 'trader') {
        // Layout trader: ticker em cima + news + fx + alerts
        this.open('ticker');
        setTimeout(() => this.open('news'),   200);
        setTimeout(() => this.open('fx'),     400);
        setTimeout(() => this.open('alerts'), 600);
      }
      if (name === 'analyst') {
        // Layout analista: wei + teams + fx + alerts
        this.open('wei');
        setTimeout(() => this.open('teams'),  200);
        setTimeout(() => this.open('fx'),     400);
        setTimeout(() => this.open('alerts'), 600);
      }
      setTimeout(() => this._updateButtons(), 800);
    }, 100);
  },
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
  PANELS.init();
});

window.PANELS = PANELS;
