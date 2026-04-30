# SIT v11 — Sport Intelligence Terminal
## Cardinal Protocol · 2026

Terminal profissional de inteligência esportiva com 13 indicadores proprietários.

---

## Estrutura do repositório

```
sit-v11/
├── .github/
│   └── workflows/
│       └── coletar.yml       ← agendador automático (GitHub Actions)
├── scripts/
│   ├── coletar.py            ← coletor Python (roda a cada 6h)
│   ├── sit-supabase.js       ← cliente Supabase para o browser
│   └── setup-supabase.sql    ← SQL para criar as tabelas
├── public/                   ← arquivos do terminal (deploy no Cloudflare)
│   ├── index.html
│   ├── mon.html
│   ├── team.html
│   ├── athlete.html
│   ├── copa.html
│   ├── h2h.html
│   ├── sit-core.js
│   ├── sit-db.js
│   ├── sit-shell.css
│   ├── sit-indicators.js
│   └── sit-supabase.js       ← copiar de scripts/
└── README.md
```

---

## Setup em 4 passos

### 1. Supabase (banco de dados)

1. Acesse [supabase.com](https://supabase.com) → criar conta grátis
2. Criar novo projeto (ex: `sit-v11`)
3. Abrir **SQL Editor** e colar o conteúdo de `scripts/setup-supabase.sql`
4. Executar → tabelas criadas
5. Ir em **Settings → API** e copiar:
   - `Project URL` → será o `SUPABASE_URL`
   - `anon public key` → será o `SUPABASE_KEY`

### 2. Football-Data.org (dados de partidas)

1. Cadastro grátis: [football-data.org/client/register](https://www.football-data.org/client/register)
2. Copiar a API key do email de confirmação

### 3. GitHub Secrets (configurar chaves)

No seu repositório GitHub:
`Settings → Secrets and variables → Actions → New repository secret`

| Nome | Valor |
|------|-------|
| `FD_API_KEY` | sua key do football-data.org |
| `SUPABASE_URL` | URL do seu projeto Supabase |
| `SUPABASE_KEY` | anon public key do Supabase |

### 4. Cloudflare Pages (hospedar o terminal)

1. Cloudflare Dashboard → **Pages → Create project**
2. Conectar ao repositório GitHub
3. **Build settings:**
   - Framework: `None`
   - Build command: *(deixar vazio)*
   - Output directory: `public`
4. Deploy → URL gerada automaticamente

---

## Como funciona automaticamente

```
GitHub Actions (a cada 6h)
  └── scripts/coletar.py
        ├── Football-Data.org → VPI, partidas, standings
        ├── ExchangeRate-API  → câmbio em tempo real
        └── Supabase          → salva tudo no banco

Cloudflare Pages (SIT browser)
  └── sit-supabase.js
        └── Supabase → busca dados → mescla no SIT_DB → indicadores calculados
```

### Prioridade de dados:
```
1. Supabase (automático, sempre fresco)
2. sit-data-real.json (manual, coleta local)  
3. sit-db.js (mock, sempre funciona)
```

---

## Rodar localmente

```bash
# Instalar dependências
pip install requests supabase

# Configurar variáveis (Windows)
set FD_API_KEY=sua_key_aqui
set SUPABASE_URL=https://xxx.supabase.co
set SUPABASE_KEY=eyJ...

# Rodar coletor
python scripts/coletar.py

# Servir o terminal
cd public
python -m http.server 8080
# Abrir: http://localhost:8080
```

---

## Indicadores — 13 módulos

| Indicador | Tier | Fórmula |
|-----------|------|---------|
| VPI | VIEWER | OFF×0.40 + DEF×0.25 + DISP×0.20 + IMP×0.15 |
| PBI | VIEWER | DiasLesão×0.5 + Lesões×3 + Carga |
| KII | VIEWER | (VPI_calc - VPI_mercado) / VPI_mercado |
| RSI(14) | PROFESSIONAL | Wilder — AvgGain/AvgLoss |
| TDM | PROFESSIONAL | GOLDEN/ACTIVE/RISING/STABLE/N/A |
| GRAHAM | PROFESSIONAL | VI = EPS×(8.5+2G)×(4.4/Y) |
| BUFFETT | DIAMOND | MOAT: marca+receita+fidelidade+infra+gestão |
| BLACKROCK | DIAMOND | β_FX + β_RATE + β_ECON + β_TRANS + β_POLIT |
| NASH | DIAMOND | dominância + estabilidade + mixed strategy |
| JUNG | DIAMOND | MBTI adaptado → arquétipo esportivo |
| FEYNMANN | DIAMOND | output/input × entropy penalty |
| SCHRÖDINGER | DIAMOND | probabilidade bayesiana P(UP/DOWN/FLAT) |
| SIT-QUANT | DIAMOND | composição ponderada dos 13 |

---

## APIs utilizadas

| API | Uso | Custo |
|-----|-----|-------|
| [football-data.org](https://football-data.org) | Partidas, standings, artilheiros | Grátis (10 req/min) |
| [open.er-api.com](https://open.er-api.com) | Câmbio em tempo real | Grátis |
| [thesportsdb.com](https://thesportsdb.com) | Dados de times, estádios | Grátis |
| [supabase.com](https://supabase.com) | Banco de dados PostgreSQL | Grátis até 500MB |

---

© 2026 Cardinal Protocol — Uso restrito
