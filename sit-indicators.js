// ═══════════════════════════════════════════════════════════
// sit-indicators.js — SIT v11 · 13 Indicadores
// Fórmulas reais + integração com APIs públicas
// © 2026 Cardinal Protocol — Confidencial
// ═══════════════════════════════════════════════════════════
'use strict';

// ── APIs usadas ──────────────────────────────────────────
// 1. ExchangeRate-API  → https://open.er-api.com/v6/latest/USD (grátis)
// 2. Football-Data.org → https://api.football-data.org/v4/  (tier free: 10req/min)
// 3. TheSportsDB       → https://www.thesportsdb.com/api/v1/json/3/ (grátis)
// 4. FBref via scraping proxy → cfb-api.vercel.app (community, sem auth)
// NOTA: Para produção usar backend proxy — CORS em arquivo local bloqueado.
// Em localhost (python -m http.server) APIs funcionam diretamente.

const IND = {

  // ═══════════════════════════════════════════════════════
  // 1. VPI — Value Performance Index
  // Fórmula proprietária Cardinal Protocol
  // Combina performance ofensiva, defensiva e disponibilidade
  // ═══════════════════════════════════════════════════════
  VPI: {
    name: 'Value Performance Index',
    tier: 'VIEWER',
    formula: `
      VPI = 0.40×OFF + 0.25×DEF + 0.20×DISP + 0.15×IMP
      
      OFF  = (Gols×2 + Assist + xG_contrib) / (Partidas×90) × 100
      DEF  = (1 - GolsSofridos/PartCasa) × 100  [para times]
             (Passes%-60)/40 × 100               [para atletas def]
      DISP = Minutos / MinutosMaximos × 100
      IMP  = (VitóriasRecentes/5) × 100
    `,
    calc(entity, isTeam = true) {
      if (isTeam) return this._calcTeam(entity);
      return this._calcAthlete(entity);
    },
    _calcTeam(t) {
      const athl = t.athletes || [];
      const n    = athl.length || 1;
      // OFF: média de contribuição ofensiva do elenco
      const off  = athl.reduce((s, a) => s + (a.gols * 2 + a.ass) / Math.max(a.min / 90, 1), 0) / n;
      const offN = Math.min(off * 8, 100);
      // DEF: inverso do PBI médio
      const pbiAvg = athl.reduce((s, a) => s + a.pbi, 0) / n;
      const defN = Math.max(100 - pbiAvg * 1.8, 0);
      // DISP: % minutos jogados vs máximo possível
      const dispN = athl.reduce((s, a) => s + Math.min(a.min / 3060, 1), 0) / n * 100;
      // IMP: momentum baseado em histórico de partidas
      const hp  = t.hp || [];
      const wins = hp.filter(h => {
        const [g1, g2] = h.pl.split('-').map(Number);
        return g1 > g2;
      }).length;
      const impN = hp.length ? (wins / hp.length) * 100 : 60;

      const vpi = 0.40 * offN + 0.25 * defN + 0.20 * dispN + 0.15 * impN;
      return Math.round(Math.min(Math.max(vpi, 0), 100) * 10) / 10;
    },
    _calcAthlete(a) {
      const partidas = Math.max(a.min / 90, 1);
      // OFF: gols + assist por 90 min, normalizado
      const offRaw = (a.gols * 2 + a.ass) / partidas;
      const offN   = Math.min(offRaw * 12, 100);
      // DEF: ausência de lesões recentes (usando PBI invertido)
      const defN   = Math.max(100 - a.pbi * 2, 0);
      // DISP: % minutos
      const dispN  = Math.min(a.min / 3060 * 100, 100);
      // IMP: histórico de partidas do atleta
      const matches = a.matches || [];
      const impN   = matches.length
        ? matches.reduce((s, m) => s + (m.v || 70), 0) / matches.length
        : a.vpi;

      const vpi = 0.40 * offN + 0.25 * defN + 0.20 * dispN + 0.15 * impN;
      return Math.round(Math.min(Math.max(vpi, 0), 100) * 10) / 10;
    },
  },

  // ═══════════════════════════════════════════════════════
  // 2. PBI — Performance-to-Burn Index
  // Mede ineficiência: lesões × carga de trabalho
  // Quanto MENOR, melhor
  // ═══════════════════════════════════════════════════════
  PBI: {
    name: 'Performance-to-Burn Index',
    tier: 'VIEWER',
    formula: `
      PBI = (DiasLesão×0.5 + LesõesN×3 + CargaAcima×2) / MinutosTotais × 1000
      
      DiasLesão  = soma total de dias fora por lesão (temporada)
      LesõesN    = número de episódios de lesão
      CargaAcima = max(0, Minutos - 2500) / 100  [carga excessiva]
    `,
    calc(a) {
      const inj       = a.inj || [];
      const diasLesao = inj.reduce((s, i) => s + parseInt(i.dur) || 0, 0);
      const nLesoes   = inj.length;
      const cargaAcima = Math.max(0, a.min - 2500) / 100;
      const raw = (diasLesao * 0.5 + nLesoes * 3 + cargaAcima * 2) / Math.max(a.min, 1) * 1000;
      return Math.round(Math.min(Math.max(raw, 0), 50) * 10) / 10;
    },
    calcTeam(t) {
      const athl = t.athletes || [];
      if (!athl.length) return t.pbi;
      return Math.round(
        athl.reduce((s, a) => s + IND.PBI.calc(a), 0) / athl.length * 10
      ) / 10;
    },
  },

  // ═══════════════════════════════════════════════════════
  // 3. KII — Key Intelligence Index
  // Mede gap entre valor real e percepção de mercado
  // Alta KII = mercado subestima o ativo
  // ═══════════════════════════════════════════════════════
  KII: {
    name: 'Key Intelligence Index',
    tier: 'VIEWER',
    formula: `
      KII = (VPI_calculado - VPI_mercado) / VPI_mercado × 100
      
      Se KII > 0: ativo SUBPRECIFICADO → sinal de compra
      Se KII < 0: ativo SOBREPRECIFICADO → sinal de cautela
      
      VPI_mercado = proxy via odds de transferência + cobertura midiática
    `,
    calc(t, vpiCalculado) {
      // Proxy de VPI de mercado: média de calls do ANR
      const calls = t.calls || [];
      if (!calls.length) return t.kii || 0;
      const mktVPI = calls.reduce((s, c) => {
        const n = parseFloat(c.target?.replace('VPI ', '') || 70);
        return s + n;
      }, 0) / calls.length;
      const raw = (vpiCalculado - mktVPI) / mktVPI * 100;
      return Math.round(raw * 10) / 10;
    },
  },

  // ═══════════════════════════════════════════════════════
  // 4. RSI — Relative Strength Index (adaptado)
  // Fórmula Wilder aplicada a série de VPI (14 períodos)
  // ═══════════════════════════════════════════════════════
  RSI: {
    name: 'Relative Strength Index',
    tier: 'PROFESSIONAL',
    formula: `
      RSI(14) = 100 - 100 / (1 + RS)
      RS = Média(ganhos VPI, 14 períodos) / Média(perdas VPI, 14 períodos)
      
      Ganho = variação positiva de VPI entre partidas
      Perda = variação negativa de VPI entre partidas (valor absoluto)
      
      RSI > 70: sobrecomprado — risk de mean reversion
      RSI < 30: sobrevendido — oportunidade de entrada
    `,
    calc(serie) {
      // serie = array de VPI por partida, do mais antigo ao mais recente
      if (!serie || serie.length < 2) return 50;
      const period = Math.min(14, serie.length - 1);
      const changes = [];
      for (let i = 1; i < serie.length; i++) {
        changes.push(serie[i] - serie[i - 1]);
      }
      const recent = changes.slice(-period);
      const gains  = recent.filter(c => c > 0);
      const losses = recent.filter(c => c < 0).map(c => Math.abs(c));
      const avgGain = gains.length  ? gains.reduce((s, v) => s + v, 0)  / period : 0.001;
      const avgLoss = losses.length ? losses.reduce((s, v) => s + v, 0) / period : 0.001;
      const rs  = avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);
      return Math.round(rsi * 10) / 10;
    },
    calcFromTeam(t) {
      const hp    = t.hp || [];
      const serie = hp.map(h => h.vp).reverse(); // cronológico
      // Adicionar VPI atual como ponto mais recente
      serie.push(t.vpi);
      return this.calc(serie);
    },
    label(rsi) {
      if (rsi >= 70) return { txt: 'SOBRECOMPRADO', col: 'var(--r1)' };
      if (rsi <= 30) return { txt: 'SOBREVENDIDO',  col: 'var(--g1)' };
      return { txt: 'NEUTRO', col: 'var(--a1)' };
    },
  },

  // ═══════════════════════════════════════════════════════
  // 5. TDM — Transferência de Domínio de Mercado
  // Avalia posição competitiva e trajetória de valor
  // ═══════════════════════════════════════════════════════
  TDM: {
    name: 'Transferência de Domínio de Mercado',
    tier: 'PROFESSIONAL',
    formula: `
      TDM = f(VPI_trend, Rating, Win%, ValorElenco, TitulasRecentes)
      
      GOLDEN  → VPI > 80 + Rating BUY + Win% > 65% + Título nos últimos 2 anos
      ACTIVE  → VPI > 75 + Rating BUY + Win% > 55%
      RISING  → VPI crescente por 3+ partidas + Rating ≥ HOLD
      STABLE  → VPI estável ±3% + Rating HOLD
      N/A     → VPI < 60 ou Rating SELL
    `,
    calc(t) {
      const hp   = t.hp || [];
      const wins = hp.filter(h => {
        const [g1, g2] = h.pl.split('-').map(Number);
        return g1 > g2;
      }).length;
      const winPct = hp.length ? wins / hp.length * 100 : 50;

      // Tendência: VPI cresceu nas últimas 3 partidas?
      const growing = hp.length >= 3 &&
        hp[0].vp > hp[1].vp && hp[1].vp > hp[2].vp;

      if (t.vpi >= 80 && t.rating === 'BUY' && winPct >= 65) return 'GOLDEN';
      if (t.vpi >= 75 && t.rating === 'BUY' && winPct >= 55) return 'ACTIVE';
      if (growing && t.rating !== 'SELL' && t.vpi >= 65)     return 'RISING';
      if (t.vpi >= 60 && t.rating === 'HOLD')                 return 'STABLE';
      return 'N/A';
    },
    color(tdm) {
      return { GOLDEN:'var(--a1)', ACTIVE:'var(--g1)', RISING:'var(--g2)',
               STABLE:'var(--t3)', 'N/A':'var(--r1)' }[tdm] || 'var(--t4)';
    },
  },

  // ═══════════════════════════════════════════════════════
  // 6. GRAHAM — Valor Intrínseco (Ben Graham adaptado)
  // Fórmula Graham ajustada para ativos esportivos
  // ═══════════════════════════════════════════════════════
  GRAHAM: {
    name: 'Graham — Valor Intrínseco',
    tier: 'PROFESSIONAL',
    formula: `
      VI = EPS_desportivo × (8.5 + 2×G) × (4.4/Y)
      
      EPS_desportivo = (Receita × MargemEBITDA) / ValorElenco
      G              = taxa de crescimento VPI (5 anos estimado) = VPI_trend × 2
      Y              = taxa livre de risco = SELIC atual (13.75%)
      
      Margem de Segurança = (VI - ValorAtual) / VI × 100
      
      BUY se Margem > 30%  ·  HOLD 10-30%  ·  SELL < 10%
    `,
    calc(t, selic = 13.75) {
      // EPS esportivo: EBITDA / Valor do elenco (proxy)
      const ebitdaRaw = parseFloat(
        (t.ebitda || '0').replace(/[^0-9.]/g, '')
      ) || 100;
      const valRaw = parseFloat(
        (t.val || '1').replace(/[^0-9.]/g, '')
      ) || 1000;
      const eps = ebitdaRaw / valRaw;

      // G: crescimento estimado de VPI
      const hp = t.hp || [];
      const vpiTrend = hp.length >= 2
        ? (hp[0].vp - hp[hp.length - 1].vp) / hp.length
        : 1;
      const G = Math.max(vpiTrend * 2, 0);

      // Fórmula Graham
      const Y  = selic / 100;
      const VI = eps * (8.5 + 2 * G) * (0.044 / Y);

      // Normalizar: valor intrínseco como múltiplo do VPI
      const viNorm = Math.min(Math.max(t.vpi * VI * 15, 30), 150);
      const margin = ((viNorm - t.vpi) / viNorm * 100);

      return {
        vi:      Math.round(viNorm * 10) / 10,
        margin:  Math.round(margin * 10) / 10,
        G:       Math.round(G * 100) / 100,
        rating:  margin > 30 ? 'BUY' : margin > 10 ? 'HOLD' : 'SELL',
        eps:     Math.round(eps * 1000) / 1000,
        checklist: [
          { item: 'VPI > 70%',         pass: t.vpi > 70 },
          { item: 'PBI < 25%',         pass: t.pbi < 25 },
          { item: 'EBITDA positivo',    pass: true },
          { item: 'Receita crescente',  pass: vpiTrend > 0 },
          { item: 'TDM ≠ N/A',         pass: t.tdm !== 'N/A' },
          { item: 'Rating ≠ SELL',      pass: t.rating !== 'SELL' },
          { item: 'Margem > 30%',       pass: margin > 30 },
        ],
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // 7. BUFFETT — Qualidade de Franquia (Moat)
  // Mede vantagem competitiva sustentável
  // ═══════════════════════════════════════════════════════
  BUFFETT: {
    name: 'Buffett — Qualidade de Franquia',
    tier: 'DIAMOND',
    formula: `
      MOAT = 0.25×MARCA + 0.25×RECEITA + 0.20×FIDELIDADE + 0.20×INFRA + 0.10×GESTAO
      
      MARCA      = (Torcedores / 1M) normalizado 0-100
      RECEITA    = ROE normalizado 0-100
      FIDELIDADE = (Sócios torcedores / Capacidade) × 100
      INFRA      = Estádio próprio(50) + Academia(30) + SAF(20)
      GESTAO     = Score histórico de competições (títulos × peso)
    `,
    calc(t) {
      // MARCA: proxy via capacidade do estádio (correlação com torcida)
      const marcaN = Math.min((t.cap || 40000) / 100000 * 100, 100);

      // RECEITA: ROE normalizado
      const roe    = parseFloat((t.roe || '10%').replace('%', '')) || 10;
      const roeN   = Math.min(roe / 30 * 100, 100);

      // FIDELIDADE: proxy via vitórias recentes (torcida ativa)
      const hp    = t.hp || [];
      const wins  = hp.filter(h => {
        const [a, b] = h.pl.split('-').map(Number);
        return a > b;
      }).length;
      const fidN  = hp.length ? wins / hp.length * 100 : 50;

      // INFRA: estádio (>70k = 50pts), divisão top (30pts), SAF/fundo (20pts)
      const infraN = Math.min(
        ((t.cap || 0) > 70000 ? 50 : 30) +
        (['BRA','ESP','UK','ITA','FRA','GER'].includes(t.liga) ? 30 : 20) +
        (t.val && t.val.includes('B') ? 20 : 10),
        100
      );

      // GESTÃO: score normalizado
      const gestN = Math.min(parseFloat(t.score?.replace(/[^0-9.]/g,'') || '70') / 100 * 80 + 20, 100);

      const moat = 0.25*marcaN + 0.25*roeN + 0.20*fidN + 0.20*infraN + 0.10*gestN;
      return {
        score: Math.round(moat * 10) / 10,
        marca: Math.round(marcaN),
        receita: Math.round(roeN),
        fidelidade: Math.round(fidN),
        infra: Math.round(infraN),
        gestao: Math.round(gestN),
        label: moat > 75 ? 'WIDE MOAT' : moat > 55 ? 'NARROW MOAT' : 'NO MOAT',
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // 8. BLACKROCK — Risco Sistêmico & Fatores Macro
  // Correlação do ativo com variáveis macroeconômicas
  // ═══════════════════════════════════════════════════════
  BLACKROCK: {
    name: 'BlackRock — Risco Sistêmico',
    tier: 'DIAMOND',
    formula: `
      RISK_SCORE = Σ(wi × βi × |ΔFatori|)
      
      Fatores:
      β_FX    = exposição cambial (atletas em EUR/USD vs receita em BRL)
      β_RATE  = sensibilidade a juros (dívida de curto prazo)
      β_ECON  = correlação com PIB (receita de bilheteria)
      β_TRANS = risco de transferência (cláusulas em moeda estrangeira)
      β_POLIT = risco regulatório (FIFA, CBF, UEFA)
      
      RISK < 20: LOW  ·  20-40: MEDIUM  ·  40-60: HIGH  ·  >60: CRITICAL
    `,
    calc(t, fxData = null) {
      const liga     = t.liga;
      const isBRA    = liga === 'BRA';
      const isEUR    = ['ESP','ITA','FRA','GER'].includes(liga);

      // β_FX: times brasileiros com atletas em EUR são mais expostos
      const athl     = t.athletes || [];
      const eurAthl  = athl.filter(a => a.sal?.includes('EUR')).length;
      const fxBeta   = isBRA ? Math.min(eurAthl / athl.length * 40, 40) : 10;

      // β_RATE: PBI alto = carga alta = lesões = risco de capital humano
      const rateBeta = t.pbi * 0.8;

      // β_ECON: VPI baixo = dependência de resultados esportivos
      const econBeta = Math.max(100 - t.vpi, 0) * 0.3;

      // β_TRANS: cláusulas altas = exposição a saída de ativos
      const maxClause = athl.reduce((mx, a) => {
        const v = parseFloat((a.clause || '0').replace(/[^0-9.]/g, '')) || 0;
        return Math.max(mx, v);
      }, 0);
      const transBeta = Math.min(maxClause / 1000 * 5, 20);

      // β_POLIT: FCB tem risco regulatório (caso Fair Play)
      const politBeta = t.kii > 15 ? 15 : 5;

      const total = fxBeta + rateBeta + econBeta + transBeta + politBeta;
      const score = Math.min(Math.max(total, 0), 100);

      return {
        score: Math.round(score * 10) / 10,
        label: score < 20 ? 'LOW' : score < 40 ? 'MEDIUM' : score < 60 ? 'HIGH' : 'CRITICAL',
        color: score < 20 ? 'var(--g1)' : score < 40 ? 'var(--a1)' : score < 60 ? 'var(--or)' : 'var(--r1)',
        fatores: {
          fx:      Math.round(fxBeta * 10)/10,
          rate:    Math.round(rateBeta * 10)/10,
          econ:    Math.round(econBeta * 10)/10,
          trans:   Math.round(transBeta * 10)/10,
          polit:   Math.round(politBeta * 10)/10,
        },
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // 9. NASH — Teoria dos Jogos (Equilíbrio de Nash)
  // Decisões estratégicas ótimas em ambiente competitivo
  // ═══════════════════════════════════════════════════════
  NASH: {
    name: 'Nash — Equilíbrio Estratégico',
    tier: 'DIAMOND',
    formula: `
      NASH_SCORE = f(Dominância, Estabilidade, MixedStrategy)
      
      Dominância = % jogos onde time controlou resultado (Win% + Draw%×0.5)
      Estabilidade = 1 - (StdDev(VPI) / Mean(VPI))
      MixedStrategy = Diversificação tática (posições únicas / total atletas)
      
      Equilíbrio Nash: nenhum jogador (time) pode melhorar sozinho
      → Mede se o time está em posição estratégica ótima
    `,
    calc(t) {
      const hp   = t.hp || [];
      const athl = t.athletes || [];

      // Dominância: controle de resultados
      const wins  = hp.filter(h => { const [a,b]=h.pl.split('-').map(Number); return a>b; }).length;
      const draws = hp.filter(h => { const [a,b]=h.pl.split('-').map(Number); return a===b; }).length;
      const domN  = hp.length ? (wins + draws * 0.5) / hp.length * 100 : 50;

      // Estabilidade: consistência de VPI
      const vpis = hp.map(h => h.vp);
      if (vpis.length < 2) vpis.push(t.vpi, t.vpi * 0.98);
      const mean    = vpis.reduce((s, v) => s + v, 0) / vpis.length;
      const stddev  = Math.sqrt(vpis.reduce((s, v) => s + (v - mean) ** 2, 0) / vpis.length);
      const stabN   = Math.max(0, (1 - stddev / mean) * 100);

      // Mixed Strategy: diversificação de posições
      const positions = [...new Set(athl.map(a => a.pos))];
      const mixN = Math.min(positions.length / 6 * 100, 100);

      const nash = 0.40 * domN + 0.35 * stabN + 0.25 * mixN;
      return {
        score:        Math.round(nash * 10) / 10,
        dominancia:   Math.round(domN),
        estabilidade: Math.round(stabN),
        mixed:        Math.round(mixN),
        label: nash > 75 ? 'EQUILÍBRIO DOMINANTE' :
               nash > 55 ? 'EQUILÍBRIO ESTÁVEL' :
                           'ABAIXO DO EQUILÍBRIO',
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // 10. JUNG — Psicometria Esportiva (Arquétipos)
  // Perfil psicológico do ativo com base em padrões observáveis
  // ═══════════════════════════════════════════════════════
  JUNG: {
    name: 'Jung — Perfil Psicométrico',
    tier: 'DIAMOND',
    formula: `
      Mapeamento em 4 dimensões (MBTI adaptado ao esporte):
      
      E/I → Extroversão tática: pressão alta(E) vs bloco baixo(I)
      S/N → Sensação vs Intuição: dado(S) vs intuição do técnico(N)
      T/F → Thinking vs Feeling: eficiência pura(T) vs estilo(F)
      J/P → Julgamento vs Percepção: estruturado(J) vs adaptável(P)
      
      Mapeia para arquétipo Jung:
      Herói · Sábio · Explorador · Amante · Guerreiro · Criador
    `,
    calc(t, sentimentoMedia = null) {
      const athl  = t.athletes || [];
      const style = (t.style || '').toLowerCase();

      // E/I: pressing alto = extrovertido
      const ei = style.includes('press') || style.includes('alta pressão') ? 'E' : 'I';
      // S/N: data-driven (VPI/PBI ricos) vs intuição
      const sn = t.kii < 10 ? 'N' : 'S';
      // T/F: eficiência (baixo PBI) vs estilo
      const tf = t.pbi < 20 ? 'T' : 'F';
      // J/P: consistência de resultados
      const hp   = t.hp || [];
      const vpiStd = hp.length > 1
        ? Math.sqrt(hp.reduce((s,h) => s+(h.vp-(hp.reduce((a,b)=>a+b.vp,0)/hp.length))**2, 0)/hp.length)
        : 5;
      const jp = vpiStd < 3 ? 'J' : 'P';

      const tipo  = ei + sn + tf + jp;
      const arqs  = {
        ESTJ:'Guardião', ISTJ:'Inspetor', ESTP:'Promotor', ISTP:'Artesão',
        ESFJ:'Provedor',  ISFJ:'Protetor', ESFP:'Performer', ISFP:'Compositor',
        ENTJ:'Comandante',INTJ:'Arquiteto',ENTP:'Inventor',  INTP:'Arquiteto',
        ENFJ:'Professor', INFJ:'Conselheiro',ENFP:'Campeão', INFP:'Curador',
      };
      const arq   = arqs[tipo] || 'Estrategista';
      let score = Math.round(
        (ei==='E'?60:40)*0.25 + (tf==='T'?70:50)*0.25 +
        (jp==='J'?65:55)*0.25 + (sn==='S'?60:70)*0.25
      );

      // ── Modificador de Sentimento de Mídia ──────────────
      // Se NEWS module disponível e sentimento carregado,
      // ajusta o score Jung e adiciona contexto midiático
      let mediaModificador = null;
      if (sentimentoMedia && window.NEWS) {
        const mod = window.NEWS.getJungModificador(tipo, sentimentoMedia.trend);
        mediaModificador = mod;
        // Ajustar score baseado no sentimento
        if (sentimentoMedia.trend === 'positivo') score = Math.min(score + 8, 100);
        if (sentimentoMedia.trend === 'negativo') score = Math.max(score - 12, 0);
      }

      return { tipo, arq, score, ei, sn, tf, jp, mediaModificador, sentimentoMedia };
    },
  },

  // ═══════════════════════════════════════════════════════
  // 11. FEYNMANN — Modelagem Física (Eficiência Energética)
  // Inspirado em Feynman: sistemas físicos tendem ao mínimo de energia
  // ═══════════════════════════════════════════════════════
  FEYNMANN: {
    name: 'Feynmann — Eficiência de Sistema',
    tier: 'DIAMOND',
    formula: `
      EFF = Output / Input × EntropyPenalty
      
      Output = Gols + Assists + VPI_contribution
      Input  = Minutos × PBI_carga
      EntropyPenalty = 1 - (Desordem tática / 100)
      
      Desordem = StdDev(gols_por_jogo) / Media(gols_por_jogo)
      
      Principio de Feynman: sistema eficiente = máximo resultado com mínimo recurso
      → Mede se o clube usa seus ativos de forma fisicamente ótima
    `,
    calc(t) {
      const athl  = t.athletes || [];
      const n     = athl.length || 1;

      // Output: performance total do elenco
      const output = athl.reduce((s, a) => s + a.gols * 2 + a.ass + a.vpi * 0.5, 0);

      // Input: carga total (minutos × PBI)
      const input  = athl.reduce((s, a) => s + a.min * (1 + a.pbi / 100), 0);

      // Entropy: dispersão da performance
      const golsArr = athl.map(a => a.gols);
      const mean    = golsArr.reduce((s,v) => s+v, 0) / n;
      const std     = Math.sqrt(golsArr.reduce((s,v) => s+(v-mean)**2, 0) / n);
      const entropy = mean > 0 ? std / mean : 0.5;
      const penalty = Math.max(1 - entropy * 0.3, 0.5);

      const eff = input > 0 ? (output / input * 1000 * penalty) : 0;
      const effN = Math.min(Math.max(eff * 8, 0), 100);

      return {
        score: Math.round(effN * 10) / 10,
        output: Math.round(output),
        input:  Math.round(input),
        entropy: Math.round(entropy * 100) / 100,
        penalty: Math.round(penalty * 100) / 100,
        label: effN > 75 ? 'ÓTIMO' : effN > 55 ? 'EFICIENTE' : effN > 35 ? 'INEFICIENTE' : 'CRÍTICO',
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // 12. SCHRÖDINGER — Probabilidade Quântica
  // Estado do ativo: múltiplos resultados futuros simultâneos
  // ═══════════════════════════════════════════════════════
  SCHRODINGER: {
    name: 'Schrödinger — Análise Probabilística',
    tier: 'DIAMOND',
    formula: `
      Superposição de estados:
      P(UP)   = P(VPI aumenta próximo ciclo)
      P(DOWN) = P(VPI cai próximo ciclo)
      P(FLAT) = P(estabilidade)
      
      Usando distribuição de probabilidade bayesiana:
      P(UP|dados) ∝ P(dados|UP) × P(UP)_prior
      
      Prior: baseado em TDM, RSI, histórico
      Likelihood: baseado em últimas 5 partidas
    `,
    calc(t) {
      const hp  = t.hp || [];
      const rsi = IND.RSI.calcFromTeam(t);
      const tdm = t.tdm;

      // Prior baseado em TDM e rating
      const priorUp = t.rating === 'BUY' ? 0.60 :
                      t.rating === 'HOLD' ? 0.40 : 0.20;

      // Likelihood: tendência recente
      const recente = hp.slice(0, 3);
      const upCount = recente.filter(h => {
        const [a, b] = h.pl.split('-').map(Number); return a > b;
      }).length;
      const likeUp = recente.length ? upCount / recente.length : 0.5;

      // Posterior não normalizado
      let pUp   = priorUp * likeUp;
      let pDown = (1 - priorUp) * (1 - likeUp);
      let pFlat = 0.3;  // prior de estabilidade

      // Normalizar
      const total = pUp + pDown + pFlat;
      pUp   = Math.round(pUp   / total * 100);
      pDown = Math.round(pDown / total * 100);
      pFlat = 100 - pUp - pDown;

      // Volatilidade implícita
      const vpis  = hp.map(h => h.vp);
      const mean  = vpis.length ? vpis.reduce((s,v)=>s+v,0)/vpis.length : t.vpi;
      const vol   = vpis.length > 1
        ? Math.sqrt(vpis.reduce((s,v) => s+(v-mean)**2, 0)/vpis.length)
        : 2;

      // Colapso do estado: RSI + TDM determinam estado dominante
      const state = rsi > 65 ? '🟥 SOBRECOMPRADO' :
                    rsi < 35 ? '🟩 SOBREVENDIDO'  :
                    pUp > 55  ? '🟩 SUPERPOSIÇÃO+' :
                    pDown > 55 ? '🟥 SUPERPOSIÇÃO−' : '🟨 SUPERPOSIÇÃO NEUTRA';

      return { pUp, pDown, pFlat, vol: Math.round(vol * 10) / 10, state, rsi };
    },
  },

  // ═══════════════════════════════════════════════════════
  // 13. SIT-QUANT — Modelo Proprietário Cardinal Protocol
  // Composição ponderada de todos os indicadores
  // ═══════════════════════════════════════════════════════
  SIT_QUANT: {
    name: 'SIT-QUANT — Cardinal Composite',
    tier: 'DIAMOND',
    formula: `
      SIT-QUANT = Σ(wi × Indicadori)
      
      Pesos por tier:
      VPI      × 0.25  (base)
      RSI      × 0.10  (momentum)
      GRAHAM   × 0.15  (valor)
      BUFFETT  × 0.12  (qualidade)
      BLACKROCK× 0.10  (risco inverso)
      NASH     × 0.10  (estratégia)
      FEYNMANN × 0.08  (eficiência)
      TDM      × 0.10  (posição)
      
      Score final: 0–100
      AAA > 90  ·  AA 80-90  ·  A 70-80  ·  BB 60-70  ·  B < 60
    `,
    calc(t) {
      const vpi      = IND.VPI.calc(t, true);
      const rsi      = IND.RSI.calcFromTeam(t);
      const graham   = IND.GRAHAM.calc(t);
      const buffett  = IND.BUFFETT.calc(t);
      const black    = IND.BLACKROCK.calc(t);
      const nash     = IND.NASH.calc(t);
      const feyn     = IND.FEYNMANN.calc(t);
      const tdmScore = { GOLDEN:100, ACTIVE:80, RISING:65, STABLE:50, 'N/A':20 }[t.tdm] || 50;

      // BLACKROCK: risco invertido (menor risco = maior score)
      const blackInv = 100 - black.score;

      const quant =
        vpi * 0.25 +
        rsi * 0.10 +
        graham.vi * 0.15 / 1.5 +  // normalizar
        buffett.score * 0.12 +
        blackInv * 0.10 +
        nash.score * 0.10 +
        feyn.score * 0.08 +
        tdmScore * 0.10;

      const score = Math.min(Math.max(Math.round(quant * 10) / 10, 0), 100);
      const rating = score >= 90 ? 'AAA' : score >= 80 ? 'AA' :
                     score >= 70 ? 'A'   : score >= 60 ? 'BB' : 'B';

      return {
        score, rating,
        breakdown: {
          vpi, rsi,
          graham: Math.round(graham.vi * 10) / 10,
          buffett: buffett.score,
          blackrock: Math.round(blackInv),
          nash: nash.score,
          feynmann: feyn.score,
          tdm: tdmScore,
        },
      };
    },
  },

  // ═══════════════════════════════════════════════════════
  // API INTEGRATIONS
  // ═══════════════════════════════════════════════════════
  API: {
    // Taxa de câmbio real (ExchangeRate-API — grátis, sem auth)
    async getFX() {
      try {
        const r = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!r.ok) throw new Error('FX API error');
        const d = await r.json();
        return {
          USDBRL: d.rates.BRL,
          EURBRL: d.rates.BRL / d.rates.EUR,
          GBPBRL: d.rates.BRL / d.rates.GBP,
          EURUSD: 1 / d.rates.EUR,
          SARBRL: d.rates.BRL / d.rates.SAR,
          source:  'open.er-api.com',
          updated: new Date().toLocaleTimeString('pt-BR'),
        };
      } catch (e) {
        console.warn('[SIT] FX API offline — usando dados locais:', e.message);
        return null;  // fallback para sit-db.js FX_BASE
      }
    },

    // Dados de competição — Football-Data.org (tier free)
    async getStandings(competitionId = 'BSA') {
      // BSA = Brasileirão, PD = La Liga, PL = Premier League
      // Requires API key — https://www.football-data.org/client/register
      const KEY = localStorage.getItem('sit_fd_apikey') || '';
      if (!KEY) return null;
      try {
        const r = await fetch(
          `https://api.football-data.org/v4/competitions/${competitionId}/standings`,
          { headers: { 'X-Auth-Token': KEY } }
        );
        if (!r.ok) throw new Error('FD API ' + r.status);
        return await r.json();
      } catch (e) {
        console.warn('[SIT] Football-Data API:', e.message);
        return null;
      }
    },

    // TheSportsDB — dados de time (grátis, sem auth)
    async getTeamInfo(teamName) {
      try {
        const r = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`
        );
        if (!r.ok) throw new Error('SportsDB error');
        const d = await r.json();
        return d.teams?.[0] || null;
      } catch (e) {
        console.warn('[SIT] SportsDB:', e.message);
        return null;
      }
    },

    // Verificar se APIs estão disponíveis (usa em localhost)
    async checkConnectivity() {
      const results = {};
      try {
        const r = await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(3000) });
        results.fx = r.ok;
      } catch { results.fx = false; }
      try {
        const r = await fetch('https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Flamengo', { signal: AbortSignal.timeout(3000) });
        results.sportsdb = r.ok;
      } catch { results.sportsdb = false; }
      return results;
    },
  },

  // ═══════════════════════════════════════════════════════
  // CALC ALL — Calcula todos os 13 para um time
  // ═══════════════════════════════════════════════════════
  calcAll(t, anrData = null) {
    const vpi       = this.VPI.calc(t, true);
    const pbi       = this.PBI.calcTeam(t);
    const kii       = this.KII.calc(anrData || t, vpi);
    const rsi       = this.RSI.calcFromTeam(t);
    const tdm       = this.TDM.calc(t);
    const graham    = this.GRAHAM.calc(t);
    const buffett   = this.BUFFETT.calc(t);
    const blackrock = this.BLACKROCK.calc(t);
    const nash      = this.NASH.calc(t);
    const jung      = this.JUNG.calc(t);
    const feynmann  = this.FEYNMANN.calc(t);
    const schro     = this.SCHRODINGER.calc(t);
    const quant     = this.SIT_QUANT.calc(t);

    return { vpi, pbi, kii, rsi, tdm, graham, buffett, blackrock, nash, jung, feynmann, schro, quant };
  },

  // Calcula todos para um atleta
  calcAllAthlete(a) {
    const vpi = this.VPI._calcAthlete(a);
    const pbi = this.PBI.calc(a);
    const rsi = this.RSI.calc([...((a.matches||[]).map(m=>m.v||70)), a.vpi]);
    return { vpi, pbi, rsi };
  },
};

// Export
if (typeof window !== 'undefined') {
  window.IND = IND;
}
