

-- sit_vault_analises (análises dos conselheiros)
create table if not exists sit_vault_analises (
  id            text primary key,
  tipo          text not null,
  nome          text not null,
  liga          text,
  indicadores   jsonb,
  sentimento    jsonb,
  conselheiros  jsonb,
  solomon       text,
  criado_em     timestamptz default now()
);
create index if not exists idx_vault_nome on sit_vault_analises(nome);
create index if not exists idx_vault_data on sit_vault_analises(criado_em desc);
alter table sit_vault_analises enable row level security;
create policy "pub_vault" on sit_vault_analises for select using (true);
