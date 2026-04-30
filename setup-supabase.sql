-- ═══════════════════════════════════════════════════════════
-- SIT v11 — Setup Supabase
-- Cole isso no SQL Editor do Supabase e execute
-- ═══════════════════════════════════════════════════════════

-- Tabela FX (câmbio)
create table if not exists sit_fx (
  id         text primary key default 'latest',
  "USDBRL"   numeric,
  "EURBRL"   numeric,
  "GBPBRL"   numeric,
  "EURUSD"   numeric,
  "SARBRL"   numeric,
  "JPYBRL"   numeric,
  updated_at timestamptz,
  source     text
);

-- Tabela Times
create table if not exists sit_teams (
  team_key     text primary key,
  team_name    text,
  liga         text,
  vpi          numeric,
  pbi          numeric,
  hp           text,  -- JSON string do histórico de partidas
  venue        text,
  founded      text,
  crest_url    text,
  standing_pos integer,
  standing_pts integer,
  updated_at   timestamptz
);

-- Tabela Artilheiros
create table if not exists sit_scorers (
  id         text primary key,
  liga       text,
  player     text,
  team       text,
  goals      integer,
  assists    integer,
  updated_at timestamptz
);

-- Tabela Logs de coleta
create table if not exists sit_logs (
  id            text primary key default 'latest',
  collected_at  timestamptz,
  teams_count   integer,
  fx_ok         boolean,
  errors        integer,
  fd_api        boolean
);

-- Habilitar acesso público de leitura (o SIT só lê, nunca escreve direto)
alter table sit_fx      enable row level security;
alter table sit_teams   enable row level security;
alter table sit_scorers enable row level security;
alter table sit_logs    enable row level security;

create policy "leitura publica sit_fx"
  on sit_fx for select using (true);

create policy "leitura publica sit_teams"
  on sit_teams for select using (true);

create policy "leitura publica sit_scorers"
  on sit_scorers for select using (true);

create policy "leitura publica sit_logs"
  on sit_logs for select using (true);

-- Confirmar
select 'Setup Supabase SIT v11 concluído!' as resultado;
