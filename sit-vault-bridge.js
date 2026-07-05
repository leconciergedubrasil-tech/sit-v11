// ═══════════════════════════════════════════════════════════
// sit-vault-bridge.js — SIT v11 · Ponte SIT ↔ Vault
// Envia análises para os conselheiros do Vault
// Recebe síntese do Solomon
// © 2026 Cardinal Protocol
// ═══════════════════════════════════════════════════════════
'use strict';

const VAULT_BRIDGE = {

  // ── Config ───────────────────────────────────────────────
  get vaultUrl()   { return localStorage.getItem('sit_vault_url')   || ''; },
  get vaultToken() { return localStorage.getItem('sit_vault_token') || ''; },
  get configured() { return !!(this.vaultUrl && this.vaultToken); },

  // ── Serializar ativo do SIT para envio ───────────────────
  serializarTime(teamKey, t, ind, sentimento) {
    return {
      tipo:      'team',
      id:        teamKey,
      nome:      t.n,
      liga:      t.liga,
      timestamp: new Date().toISOString(),

      // 13 Indicadores
      indicadores: {
        vpi:       ind.vpi,
        pbi:       ind.pbi,
        kii:       t.kii || 10,
        rsi:       ind.rsi,
        tdm:       ind.tdm,
        graham:    { vi: ind.graham?.vi, margin: ind.graham?.margin, rating: ind.graham?.rating },
        buffett:   { score: ind.buffett?.score, label: ind.buffett?.label },
        blackrock: { score: ind.blackrock?.score, label: ind.blackrock?.label },
        nash:      { score: ind.nash?.score, label: ind.nash?.label },
        jung:      {
          tipo:    ind.jung?.tipo,
          arq:     ind.jung?.arq,
          score:   ind.jung?.score,
          media:   ind.jung?.mediaModificador,
        },
        feynmann:  { score: ind.feynmann?.score, label: ind.feynmann?.label },
        schrodinger: { pUp: ind.schro?.pUp, pDown: ind.schro?.pDown, state: ind.schro?.state },
        sit_quant: { score: ind.quant?.score, rating: ind.quant?.rating },
      },

      // Contexto de mídia
      sentimento: sentimento ? {
        score:    sentimento.score,
        trend:    sentimento.trend,
        label:    sentimento.label,
        total:    sentimento.total,
        positivo: sentimento.positivo,
        negativo: sentimento.negativo,
        headlines: (sentimento.articles || []).slice(0,5).map(a => ({
          titulo: a.title,
          tom:    a.sentiment,
          fonte:  a.source,
        })),
      } : null,

      // Contexto financeiro
      financeiro: {
        valor:   t.val,
        receita: t.rev,
        ebitda:  t.ebitda,
        roe:     t.roe,
      },

      // Histórico recente
      historico: (t.hp || []).slice(0,5).map(h => ({
        data:    h.d,
        adversario: h.adv,
        placar:  h.pl,
        vpi:     h.vp,
      })),
    };
  },

  serializarAtleta(teamKey, a, t, sentimento) {
    const vpiCalc = window.IND?.VPI._calcAthlete(a) || a.vpi;
    const pbi     = window.IND?.PBI.calc(a) || a.pbi;
    return {
      tipo:      'athlete',
      id:        `${teamKey}/${a.n}`,
      nome:      a.n,
      clube:     t?.n || teamKey,
      posicao:   a.pos,
      idade:     a.age,
      timestamp: new Date().toISOString(),

      indicadores: {
        vpi:   vpiCalc,
        pbi:   pbi,
        rsi:   window.IND?.RSI.calc([...(a.matches||[]).map(m=>m.v||a.vpi), a.vpi]) || 50,
        jung:  window.IND?.JUNG.calc({
          ...t, athletes:[a], pbi, vpi: vpiCalc,
          hp: a.matches?.map(m=>({vp:m.v||70,pl:m.pl||'0-0'})) || []
        }, sentimento),
      },

      performance: {
        gols:       a.gols,
        assistencias: a.ass,
        minutos:    a.min,
        gols_por90: Math.round(a.gols / Math.max(a.min/90,1) * 100) / 100,
      },

      contrato: {
        salario:  a.sal,
        clausula: a.clause,
        vigencia: a.ctr,
      },

      lesoes: (a.inj || []).length,

      sentimento: sentimento ? {
        score:     sentimento.score,
        trend:     sentimento.trend,
        label:     sentimento.label,
        headlines: (sentimento.articles||[]).slice(0,3).map(a=>({
          titulo: a.title, tom: a.sentiment
        })),
      } : null,
    };
  },

  // ── Enviar para Vault e receber análise dos conselheiros ─
  async analisar(payload) {
    if (!this.configured) {
      return {
        erro: true,
        msg: 'Vault não configurado. Configure em ⚙ Settings.',
      };
    }

    try {
      const r = await fetch(`${this.vaultUrl}/sit/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${this.vaultToken}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000), // 30s — conselheiros levam tempo
      });

      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch(e) {
      console.error('[VAULT BRIDGE] Erro:', e.message);
      return { erro: true, msg: e.message };
    }
  },

  // ── Renderizar painel de resposta dos conselheiros ────────
  renderResposta(analise) {
    if (!analise) return '<div class="dim" style="padding:12px">Aguardando análise...</div>';
    if (analise.erro) return `
      <div style="padding:12px;border:1px solid var(--r2);background:rgba(255,51,51,.05)">
        <div style="color:var(--r1);font-size:9px;font-family:var(--fu);font-weight:700">VAULT OFFLINE</div>
        <div style="color:var(--t3);font-size:8.5px;margin-top:4px">${analise.msg}</div>
        <div style="color:var(--t5);font-size:8px;margin-top:6px">
          Configure em: <span class="lk" onclick="VAULT_BRIDGE.abrirConfig()">⚙ Vault Settings</span>
        </div>
      </div>`;

    const conselheiros = analise.conselheiros || [];
    const solomon      = analise.solomon || '';

    return `
      <div class="sec">◆ VAULT — ANÁLISE DOS CONSELHEIROS</div>

      ${solomon ? `
      <div style="border:1px solid var(--p1);padding:10px;background:rgba(192,132,252,.05);margin-bottom:10px">
        <div style="font-size:7px;color:var(--p1);font-family:var(--fu);font-weight:700;letter-spacing:1px;margin-bottom:6px">
          ◆ SOLOMON — SÍNTESE FINAL
        </div>
        <div style="font-size:9.5px;color:var(--t1);line-height:1.7">${solomon}</div>
      </div>` : ''}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${conselheiros.map(c => `
          <div style="border:1px solid var(--b1);padding:8px;background:var(--bg0)">
            <div style="font-size:7px;color:var(--a1);font-family:var(--fu);font-weight:700;
                        letter-spacing:.8px;margin-bottom:4px">${c.nome}</div>
            <div style="font-size:8.5px;color:var(--t2);line-height:1.6">${c.analise}</div>
            ${c.rating ? `<div style="margin-top:4px">
              <span class="bg ${c.rating==='BUY'?'buy':c.rating==='SELL'?'sell':'hold'}">
                ${c.rating}
              </span>
            </div>` : ''}
          </div>`
        ).join('')}
      </div>

      <div style="font-size:7px;color:var(--t5);font-family:var(--fu);margin-top:8px;text-align:right">
        ${new Date(analise.timestamp||Date.now()).toLocaleString('pt-BR')}
        · Cardinal Protocol · Confidencial
      </div>`;
  },

  abrirConfig() {
    const url   = prompt('Vault Worker URL:', this.vaultUrl);
    const token = prompt('Vault Token:', '');
    if (url)   localStorage.setItem('sit_vault_url', url);
    if (token) localStorage.setItem('sit_vault_token', token);
    alert('Configuração salva! Recarregue a página.');
  },
};

window.VAULT_BRIDGE = VAULT_BRIDGE;
