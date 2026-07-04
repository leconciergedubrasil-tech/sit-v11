// sit-auth.js — SIT v11 · Controle de Tier e Sessões
'use strict';
const AUTH = {
  PLANS: {
    VIEWER:       { label:'VIEWER',       price:'R$290/mês',    max_sessions:2,        indicators:['VPI','PBI','KII'],                                                                              tabs_blocked:['BUFFETT','BLACKROCK','NASH','JUNG','FEYNMANN','SIT-QUANT','VAULT'], color:'var(--t3)' },
    PROFESSIONAL: { label:'PROFESSIONAL', price:'R$1.900/mês',  max_sessions:5,        indicators:['VPI','PBI','KII','RSI','TDM','GRAHAM'],                                                        tabs_blocked:['BUFFETT','BLACKROCK','NASH','JUNG','FEYNMANN','SIT-QUANT'],          color:'var(--a1)' },
    INSTITUTIONAL:{ label:'INSTITUTIONAL',price:'R$9.900/mês',  max_sessions:10,       indicators:['VPI','PBI','KII','RSI','TDM','GRAHAM','BUFFETT','BLACKROCK','NASH','JUNG','FEYNMANN','SCHRÖDINGER','SIT-QUANT'], tabs_blocked:[], color:'var(--c1)' },
    DIAMOND:      { label:'DIAMOND',      price:'R$19.900/mês', max_sessions:Infinity, indicators:['VPI','PBI','KII','RSI','TDM','GRAHAM','BUFFETT','BLACKROCK','NASH','JUNG','FEYNMANN','SCHRÖDINGER','SIT-QUANT'], tabs_blocked:[], color:'var(--p1)' },
  },
  get plan() { return window.SIT?.getPlan() || 'VIEWER'; },
  get cfg()  { return this.PLANS[this.plan] || this.PLANS.VIEWER; },

  canUseIndicator(ind) { return this.cfg.indicators.includes(ind.toUpperCase()); },
  canUseTab(tab)       { return !this.cfg.tabs_blocked.includes(tab.toUpperCase()); },

  lockTabs(rowId = 'tabs') {
    const blocked = this.cfg.tabs_blocked;
    document.querySelectorAll(`#${rowId} .tab-btn`).forEach(btn => {
      const name = btn.textContent.trim().replace('◆ ','').toUpperCase();
      if (blocked.some(b => name.includes(b))) {
        btn.style.opacity = '0.35';
        btn.style.cursor  = 'not-allowed';
        btn.title = `Plano DIAMOND necessário`;
        const orig = btn.onclick;
        btn.onclick = e => { e.stopPropagation(); AUTH.showUpgradeModal(btn.textContent.trim()); };
      }
    });
  },

  lockKPIStrip() {
    this.cfg.tabs_blocked.forEach(ind => {
      const el = document.getElementById(`ks-${ind.toLowerCase().replace('-','').replace('ö','o')}`);
      if (el) { el.textContent = '🔒'; el.style.color = 'var(--t5)'; }
    });
  },

  wrapIndicators() {
    if (!window.IND) return;
    const orig = window.IND.calcAll.bind(window.IND);
    const plan = this.plan;
    window.IND.calcAll = (t, anr) => {
      const full = orig(t, anr);
      if (plan === 'DIAMOND' || plan === 'INSTITUTIONAL') return full;
      const locked = { score:'🔒', label:'DIAMOND', vi:'🔒', margin:'🔒', rating:'🔒',
                       color:'var(--t5)', fatores:{}, checklist:[], pUp:'🔒',
                       pDown:'🔒', state:'DIAMOND', breakdown:{}, tipo:'🔒', arq:'DIAMOND' };
      if (plan === 'VIEWER') {
        return { ...full, rsi:'🔒', tdm:'🔒', graham:locked, buffett:locked,
                 blackrock:{...locked,label:'PROFESSIONAL+'}, nash:locked,
                 jung:{...locked,score:0}, feynmann:locked, schro:locked, quant:locked };
      }
      if (plan === 'PROFESSIONAL') {
        return { ...full, buffett:locked, blackrock:locked, nash:locked,
                 jung:{...locked,score:0}, feynmann:locked, schro:locked, quant:locked };
      }
      return full;
    };
  },

  showUpgradeModal(feature = '') {
    document.getElementById('sit-upgrade-modal')?.remove();
    const m = document.createElement('div');
    m.id = 'sit-upgrade-modal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;display:flex;align-items:center;justify-content:center';
    m.innerHTML = `<div style="background:var(--bg1);border:1px solid var(--p1);padding:24px;max-width:400px;width:90%">
      <div style="font-size:22px;text-align:center;margin-bottom:8px">◆</div>
      <div style="font-size:12px;font-weight:700;color:var(--p1);font-family:var(--fu);text-align:center;letter-spacing:2px;margin-bottom:6px">DIAMOND REQUIRED</div>
      <div style="font-size:9px;color:var(--t3);text-align:center;margin-bottom:14px">
        ${feature ? `<b style="color:var(--t1)">${feature}</b> requer plano ` : 'Funcionalidade requer plano '}<b style="color:var(--p1)">DIAMOND</b>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:14px">
        ${Object.entries(this.PLANS).map(([k,p])=>`
          <div style="border:1px solid ${k===this.plan?'var(--g2)':'var(--b1)'};padding:7px;background:var(--bg0)">
            <div style="font-size:7px;font-family:var(--fu);font-weight:700;color:${p.color}">${p.label}</div>
            <div style="font-size:8px;color:var(--t2);margin-top:1px">${p.price}</div>
            ${k===this.plan?'<div style="font-size:7px;color:var(--g2)">← atual</div>':''}
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:6px">
        <button onclick="document.getElementById('sit-upgrade-modal').remove()"
          style="flex:1;padding:7px;font-size:9px;font-family:var(--fu);border:1px solid var(--b2);background:transparent;color:var(--t3);cursor:pointer">FECHAR</button>
        <button onclick="document.getElementById('sit-upgrade-modal').remove()"
          style="flex:2;padding:7px;font-size:9px;font-family:var(--fu);font-weight:700;border:1px solid var(--p1);background:rgba(192,132,252,.1);color:var(--p1);cursor:pointer">
          UPGRADE → DIAMOND</button>
      </div>
    </div>`;
    m.addEventListener('click', e => { if(e.target===m) m.remove(); });
    document.body.appendChild(m);
  },

  initSessionControl() {
    const max = this.cfg.max_sessions;
    if (max === Infinity) return;
    const id = Math.random().toString(36).slice(2);
    const bc = new BroadcastChannel('sit_sessions');
    const active = [id];
    bc.postMessage({ type:'JOIN', id, plan:this.plan });
    bc.onmessage = e => {
      if (e.data.type==='JOIN' && !active.includes(e.data.id)) {
        active.push(e.data.id);
        if (active.length > max) this._warnSession(active.length, max);
      }
      if (e.data.type==='LEAVE') { const i=active.indexOf(e.data.id); if(i>-1) active.splice(i,1); }
    };
    window.addEventListener('beforeunload', () => { bc.postMessage({type:'LEAVE',id}); bc.close(); });
  },

  _warnSession(cur, max) {
    if (document.getElementById('sit-sess-warn')) return;
    const el = document.createElement('div');
    el.id = 'sit-sess-warn';
    el.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:8888;background:var(--bg1);border:1px solid var(--a2);padding:10px 14px;font-family:var(--fu);max-width:260px';
    el.innerHTML = `<div style="font-size:8px;font-weight:700;color:var(--a1);margin-bottom:3px">⚠ LIMITE DE SESSÕES</div>
      <div style="font-size:8px;color:var(--t2)">${cur}/${max} sessões ativas (plano ${this.plan}).</div>
      <button onclick="this.parentElement.remove()" style="margin-top:5px;font-size:7px;border:none;background:transparent;color:var(--t4);cursor:pointer">✕ fechar</button>`;
    document.body.appendChild(el);
    setTimeout(() => el?.remove(), 8000);
  },

  boot(tabsRowId = 'tabs') {
    this.wrapIndicators();
    this.initSessionControl();
    setTimeout(() => { this.lockTabs(tabsRowId); this.lockKPIStrip(); }, 150);
  },
};
window.AUTH = AUTH;
