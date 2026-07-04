// ═══════════════════════════════════════════════════════════
// PATCH: Adicionar ao vault-worker.js existente
// Novos endpoints para integração com SIT v11
// Cole as funções abaixo no seu vault-worker.js
// e adicione os paths no router principal
// ═══════════════════════════════════════════════════════════

// ── No router principal, adicionar ANTES do return 404: ───
/*
  if (path === '/sit/analyze')   return await sitAnalyze(request, env);
  if (path === '/sit/news')      return await sitNews(request, env);
  if (path === '/sit/save')      return await sitSave(request, env);
  if (path === '/sit/history')   return await sitHistory(url, env);
*/

// ── ENDPOINT 1: Analisar ativo com todos os conselheiros ──
async function sitAnalyze(request, env) {
  const payload = await request.json();
  const { tipo, nome, indicadores, sentimento, historico } = payload;

  // Construir prompt para os conselheiros
  const contexto = buildSITContext(payload);

  // Lista de conselheiros do Vault
  const CONSELHEIROS = [
    {
      nome: 'KAHNEMAN',
      prompt: `Você é Daniel Kahneman, Nobel de Economia. Analise ${nome} 
               sob a perspectiva de vieses cognitivos, heurísticas e 
               prospect theory. Seja conciso (2-3 frases). 
               Contexto: ${contexto}`,
    },
    {
      nome: 'TALEB',
      prompt: `Você é Nassim Taleb. Identifique os cisnes negros e 
               riscos de cauda em ${nome}. O que o modelo SIT não captura?
               Seja direto (2-3 frases).
               Contexto: ${contexto}`,
    },
    {
      nome: 'BUFFETT',
      prompt: `Você é Warren Buffett. Avalie o MOAT e a vantagem competitiva
               sustentável de ${nome} como ativo esportivo de longo prazo.
               Compraria? Por quê? (2-3 frases)
               Contexto: ${contexto}`,
    },
    {
      nome: 'JUNG',
      prompt: `Você é Carl Jung. Analise o perfil psicológico de ${nome}
               com base no tipo ${indicadores?.jung?.tipo || '?'} 
               e no arquétipo ${indicadores?.jung?.arq || '?'}.
               Qual o shadow (sombra) deste ativo? (2-3 frases)
               Contexto: ${contexto}`,
    },
    {
      nome: 'FEYNMAN',
      prompt: `Você é Richard Feynman. Explique simplesmente por que 
               ${nome} tem eficiência ${indicadores?.feynmann?.score || '?'}%.
               O que os dados escondem? (2-3 frases)
               Contexto: ${contexto}`,
    },
    {
      nome: 'GRAHAM',
      prompt: `Você é Benjamin Graham. O valor intrínseco calculado é 
               ${indicadores?.graham?.vi || '?'} com margem de 
               ${indicadores?.graham?.margin || '?'}%.
               É uma compra segura? (2-3 frases)
               Contexto: ${contexto}`,
    },
  ];

  // Chamar todos os conselheiros em PARALELO
  const promessas = CONSELHEIROS.map(async c => {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         env.ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model:      'claude-haiku-4-5-20251001',
          max_tokens: 200,
          messages: [{ role: 'user', content: c.prompt }],
        }),
      });
      const d = await res.json();
      const texto = d.content?.[0]?.text || 'Sem resposta';

      // Extrair rating se mencionado
      const rating = texto.match(/\bBUY\b/i) ? 'BUY' :
                     texto.match(/\bSELL\b/i) ? 'SELL' :
                     texto.match(/\bHOLD\b/i) ? 'HOLD' : null;

      return { nome: c.nome, analise: texto, rating };
    } catch(e) {
      return { nome: c.nome, analise: `Conselheiro offline: ${e.message}`, rating: null };
    }
  });

  const respostas = await Promise.all(promessas);

  // SOLOMON — síntese final de todas as análises
  const resumoConselheiros = respostas
    .map(r => `${r.nome}: ${r.analise}`)
    .join('\n\n');

  let solomon = '';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Você é Solomon, o conselheiro supremo do Cardinal Protocol.
                    Sintetize as análises abaixo sobre ${nome} em um veredito final
                    claro e acionável. Inclua: 1) Decisão (BUY/HOLD/SELL), 
                    2) Razão principal, 3) Principal risco, 4) Hedge sugerido.
                    
                    ANÁLISES DOS CONSELHEIROS:
                    ${resumoConselheiros}
                    
                    DADOS SIT:
                    ${contexto}`,
        }],
      }),
    });
    const d = await res.json();
    solomon = d.content?.[0]?.text || '';
  } catch(e) {
    solomon = `Solomon offline: ${e.message}`;
  }

  // Salvar no R2 para histórico
  const analiseId = `${tipo}_${payload.id}_${Date.now()}`;
  await env.VAULT_R2.put(`sit/analises/${analiseId}.json`, JSON.stringify({
    ...payload,
    conselheiros: respostas,
    solomon,
    timestamp: new Date().toISOString(),
  }));

  return json({
    ok:          true,
    analise_id:  analiseId,
    conselheiros: respostas,
    solomon,
    timestamp:   new Date().toISOString(),
  });
}

// ── ENDPOINT 2: Proxy para APIs de notícias ──────────────
async function sitNews(request, env) {
  const { query, lang = 'pt', max = 10 } = await request.json();

  if (!query) return json({ error: 'query obrigatório' }, 400);

  // Verificar cache no R2 (1 hora)
  const cacheKey = `sit/news_cache/${btoa(query + lang).replace(/[^a-zA-Z0-9]/g,'')}.json`;
  try {
    const cached = await env.VAULT_R2.get(cacheKey);
    if (cached) {
      const data = JSON.parse(await cached.text());
      const age  = Date.now() - data.ts;
      if (age < 3600000) {
        return json({ articles: data.articles, cached: true });
      }
    }
  } catch(e) {}

  // Buscar do GNews
  const gnewsKey = env.GNEWS_API_KEY;
  if (!gnewsKey) {
    return json({ articles: [], error: 'GNEWS_API_KEY não configurada' });
  }

  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}`
      + `&lang=${lang}&country=any&max=${max}&apikey=${gnewsKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GNews HTTP ${res.status}`);
    const data = await res.json();
    const articles = (data.articles || []).map(a => ({
      title:       a.title,
      description: a.description,
      url:         a.url,
      source:      a.source?.name || '',
      publishedAt: a.publishedAt,
    }));

    // Cachear no R2
    await env.VAULT_R2.put(cacheKey, JSON.stringify({
      articles, ts: Date.now()
    }));

    return json({ articles, cached: false });
  } catch(e) {
    return json({ articles: [], error: e.message });
  }
}

// ── ENDPOINT 3: Buscar histórico de análises ────────────
async function sitHistory(url, env) {
  const entityId = url.searchParams.get('id') || '';
  const limit    = parseInt(url.searchParams.get('limit') || '10');

  const listed = await env.VAULT_R2.list({
    prefix: `sit/analises/${entityId}`,
    limit,
  });

  const items = [];
  for (const obj of listed.objects.slice(0, limit)) {
    try {
      const raw  = await env.VAULT_R2.get(obj.key);
      const data = JSON.parse(await raw.text());
      items.push({
        id:        obj.key,
        nome:      data.nome,
        tipo:      data.tipo,
        solomon:   data.solomon?.slice(0, 200) + '...',
        quant:     data.indicadores?.sit_quant?.score,
        timestamp: data.timestamp,
      });
    } catch(e) {}
  }

  return json({ items });
}

// ── Helper: contexto resumido para os conselheiros ───────
function buildSITContext(payload) {
  const ind = payload.indicadores || {};
  return [
    `Tipo: ${payload.tipo} | Nome: ${payload.nome} | Liga: ${payload.liga || '?'}`,
    `VPI: ${ind.vpi}% | PBI: ${ind.pbi}% | RSI: ${ind.rsi}`,
    `TDM: ${ind.tdm} | SIT-QUANT: ${ind.sit_quant?.score} (${ind.sit_quant?.rating})`,
    `JUNG: ${ind.jung?.tipo} — ${ind.jung?.arq}`,
    `GRAHAM: VI=${ind.graham?.vi} margin=${ind.graham?.margin}%`,
    `BLACKROCK: ${ind.blackrock?.label} (${ind.blackrock?.score})`,
    payload.sentimento
      ? `MÍDIA: score=${payload.sentimento.score} trend=${payload.sentimento.trend} (${payload.sentimento.total} artigos)`
      : 'MÍDIA: sem dados',
    payload.historico?.length
      ? `ÚLTIMOS ${payload.historico.length} JOGOS: ${payload.historico.map(h=>h.placar).join(', ')}`
      : '',
  ].filter(Boolean).join('\n');
}

// Nota: a função json() já existe no vault-worker.js original
