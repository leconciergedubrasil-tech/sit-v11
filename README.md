# SIT v11 — Sport Intelligence Terminal
**Cardinal Protocol · 2026**

Terminal Bloomberg-style de inteligência esportiva com 13 indicadores proprietários.

## Como funciona

```
GitHub (este repo)
  ├── push → Cloudflare Pages (deploy automático)
  └── cron 6h → coletar-v2.py → Supabase (dados reais)
```

## Setup — 4 passos

### 1. Supabase (banco)
- supabase.com → novo projeto
- SQL Editor → cole o conteúdo de `setup-supabase-v2.sql`
- Copie a **Project URL** e **anon key**

### 2. Cloudflare Pages (site)
- dash.cloudflare.com → Workers & Pages → Create
- Connect to Git → selecione este repositório
- Build settings:
  - Framework: **None**
  - Build command: **(vazio)**
  - Output directory: **/**

### 3. GitHub Secrets
Settings → Secrets → Actions → New secret:

| Secret | Valor |
|--------|-------|
| `SUPABASE_URL` | URL do seu projeto Supabase |
| `SUPABASE_KEY` | anon key do Supabase |
| `FD_API_KEY` | key de football-data.org |
| `CF_API_TOKEN` | Cloudflare API Token (para deploy automático) |
| `CF_ACCOUNT_ID` | Cloudflare Account ID |

### 4. Ativar dados no site
Acesse `seu-site.pages.dev/config.html` e cole as credenciais do Supabase.

## Estrutura do repositório

```
sit-v11/
├── .github/
│   └── workflows/
│       ├── deploy.yml      ← deploy automático no Cloudflare
│       └── coletar.yml     ← coleta dados a cada 6h
├── scripts/
│   └── coletar-v2.py      ← busca dados de futebol + FX
├── index.html             ← login
├── mon.html               ← monitor principal
├── team.html              ← dossiê de times
├── athlete.html           ← dossiê de atletas
├── copa.html              ← Copa 2026
├── config.html            ← configurações
├── sit-*.js               ← módulos JS
└── sit-shell.css          ← design system
```

© 2026 Cardinal Protocol — Confidencial
