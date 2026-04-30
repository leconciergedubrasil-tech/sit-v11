#!/usr/bin/env python3
"""
SIT v11 — Coletor Automático
Roda via GitHub Actions a cada 6 horas
Salva tudo no Supabase automaticamente
"""
import os, json, time, sys
from datetime import datetime, timezone
import urllib.request, urllib.error

# ── Configuração via variáveis de ambiente ────────────────
# Localmente: crie um arquivo .env e rode com python-dotenv
# No GitHub: configure em Settings → Secrets → Actions
FD_API_KEY   = os.environ.get('FD_API_KEY', '')
SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '')

# ── Times monitorados ─────────────────────────────────────
TEAMS = {
    'RM':  {'fd_id': 86,  'name': 'Real Madrid CF',     'liga': 'PD'},
    'FCB': {'fd_id': 81,  'name': 'FC Barcelona',        'liga': 'PD'},
    'MCI': {'fd_id': 65,  'name': 'Manchester City FC',  'liga': 'PL'},
    'PSG': {'fd_id': 524, 'name': 'Paris Saint-Germain', 'liga': 'FL1'},
    'BAY': {'fd_id': 5,   'name': 'FC Bayern München',   'liga': 'BL1'},
    'ACM': {'fd_id': 98,  'name': 'AC Milan',            'liga': 'SA'},
    'JUV': {'fd_id': 109, 'name': 'Juventus FC',         'liga': 'SA'},
    'ARS': {'fd_id': 57,  'name': 'Arsenal FC',          'liga': 'PL'},
}

NOW = datetime.now(timezone.utc).isoformat()

# ── HTTP helpers ──────────────────────────────────────────
def fetch_json(url, headers=None):
    h = {'Accept': 'application/json'}
    if headers: h.update(headers)
    try:
        req = urllib.request.Request(url, headers=h)
        with urllib.request.urlopen(req, timeout=12) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        print(f'  HTTP {e.code}: {url[:60]}')
        return None
    except Exception as e:
        print(f'  ERR: {e} — {url[:60]}')
        return None

def fd_get(path):
    """Football-Data.org com rate limit respeitado (10 req/min free)"""
    if not FD_API_KEY:
        return None
    url  = f'https://api.football-data.org/v4/{path}'
    data = fetch_json(url, {'X-Auth-Token': FD_API_KEY})
    time.sleep(6.5)  # 10 req/min = 1 req/6s + margem
    return data

def supabase_upsert(table, rows):
    """Upsert no Supabase via REST API"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        print(f'  [SUPABASE] Não configurado — pulando upsert em {table}')
        return False
    url  = f'{SUPABASE_URL}/rest/v1/{table}'
    body = json.dumps(rows if isinstance(rows, list) else [rows]).encode()
    headers = {
        'Content-Type':  'application/json',
        'apikey':        SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Prefer':        'resolution=merge-duplicates',
    }
    try:
        req = urllib.request.Request(url, data=body, headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=10) as r:
            print(f'  ✓ Supabase {table}: {r.status}')
            return True
    except Exception as e:
        print(f'  ✗ Supabase {table}: {e}')
        return False

# ── Cálculo de VPI ────────────────────────────────────────
def calc_vpi(matches, team_name):
    if not matches: return None
    wins=draws=losses=gf_total=ga_total=0
    for m in matches[-10:]:
        home = m.get('homeTeam',{}).get('name','')
        ft   = m.get('score',{}).get('fullTime',{})
        hg   = ft.get('home',0) or 0
        ag   = ft.get('away',0) or 0
        ih   = team_name.lower() in home.lower()
        gf   = hg if ih else ag
        ga   = ag if ih else hg
        gf_total += gf; ga_total += ga
        if gf>ga: wins+=1
        elif gf==ga: draws+=1
        else: losses+=1
    n = wins+draws+losses
    if not n: return None
    off  = min(gf_total/n/3*100, 100)
    defN = max((1 - ga_total/(n*2.5))*100, 0)
    imp  = wins/n*100
    return round(0.40*off + 0.25*defN + 0.20*85 + 0.15*imp, 1)

def parse_matches(matches, team_name):
    results = []
    for m in matches[-8:]:
        home = m.get('homeTeam',{}).get('name','')
        away = m.get('awayTeam',{}).get('name','')
        ft   = m.get('score',{}).get('fullTime',{})
        hg   = ft.get('home',0) or 0
        ag   = ft.get('away',0) or 0
        ih   = team_name.lower() in home.lower()
        gf   = hg if ih else ag
        ga   = ag if ih else hg
        opp  = (away if ih else home)[:22]
        date = m.get('utcDate','')[:10]
        vp   = round(60 + (gf/(gf+ga+0.1))*25 + (1 if gf>ga else 0)*5, 1)
        results.append({
            'd': date, 'adv': opp,
            'pl': f'{gf}-{ga}', 'vp': vp,
            'var': f'+{vp-70:.1f}%' if vp>=70 else f'{vp-70:.1f}%',
        })
    return list(reversed(results))

# ── Coletar FX ───────────────────────────────────────────
def collect_fx():
    print('\n[FX] ExchangeRate-API...')
    d = fetch_json('https://open.er-api.com/v6/latest/USD')
    if not d: return None
    r = d.get('rates', {})
    brl = r.get('BRL', 5.15)
    fx = {
        'id':       'latest',
        'USDBRL':   round(brl, 4),
        'EURBRL':   round(brl / r.get('EUR', 0.92), 4),
        'GBPBRL':   round(brl / r.get('GBP', 0.79), 4),
        'EURUSD':   round(1   / r.get('EUR', 0.92), 4),
        'SARBRL':   round(brl / r.get('SAR', 3.75), 4),
        'JPYBRL':   round(brl / r.get('JPY', 149),  6),
        'updated_at': NOW,
        'source':   'open.er-api.com',
    }
    print(f"  ✓ USD/BRL={fx['USDBRL']} EUR/BRL={fx['EURBRL']}")
    return fx

# ── Coletar times ─────────────────────────────────────────
def collect_teams():
    print('\n[TIMES] Football-Data.org...')
    if not FD_API_KEY:
        print('  ⚠ FD_API_KEY não configurada')
        return []

    rows = []
    ligas_feitas = set()

    for tk, cfg in TEAMS.items():
        print(f'\n  [{tk}] {cfg["name"]}')

        # Info do time
        info = fd_get(f'teams/{cfg["fd_id"]}')
        venue   = info.get('venue','')   if info else ''
        founded = info.get('founded','') if info else ''
        crest   = info.get('crest','')   if info else ''

        # Partidas
        m_data = fd_get(f'teams/{cfg["fd_id"]}/matches?status=FINISHED&limit=12')
        matches = m_data.get('matches', []) if m_data else []
        vpi = calc_vpi(matches, cfg['name'])
        hp  = parse_matches(matches, cfg['name'])
        pbi = round(sum(
            (m.get('score',{}).get('fullTime',{}).get(
                'away' if cfg['name'].lower() in m.get('homeTeam',{}).get('name','').lower()
                else 'home', 0) or 0)
            for m in matches[-10:]
        ) / max(len(matches[-10:]), 1) * 6, 1) if matches else None

        # Standings
        liga = cfg['liga']
        standing_pos = None
        standing_pts = None
        if liga not in ligas_feitas:
            s_data = fd_get(f'competitions/{liga}/standings')
            if s_data:
                for table in s_data.get('standings', []):
                    for row in table.get('table', []):
                        if row.get('team',{}).get('id') == cfg['fd_id']:
                            standing_pos = row.get('position')
                            standing_pts = row.get('points')
            ligas_feitas.add(liga)

        row = {
            'team_key':    tk,
            'team_name':   cfg['name'],
            'liga':        liga,
            'vpi':         vpi,
            'pbi':         pbi,
            'hp':          json.dumps(hp),
            'venue':       venue,
            'founded':     founded,
            'crest_url':   crest,
            'standing_pos': standing_pos,
            'standing_pts': standing_pts,
            'updated_at':  NOW,
        }
        rows.append(row)
        print(f'    ✓ VPI={vpi}% PBI={pbi}% partidas={len(hp)} pos={standing_pos}')

    return rows

# ── Coletar artilheiros ───────────────────────────────────
def collect_scorers():
    print('\n[ARTILHEIROS] Por liga...')
    if not FD_API_KEY:
        return []
    ligas = {cfg['liga'] for cfg in TEAMS.values()}
    rows  = []
    for liga in ligas:
        data = fd_get(f'competitions/{liga}/scorers?limit=10')
        if not data: continue
        for s in data.get('scorers', []):
            rows.append({
                'id':        f"{liga}_{s.get('player',{}).get('id',0)}",
                'liga':      liga,
                'player':    s.get('player',{}).get('name',''),
                'team':      s.get('team',{}).get('name',''),
                'goals':     s.get('goals', 0),
                'assists':   s.get('assists', 0),
                'updated_at': NOW,
            })
        print(f'  ✓ {liga}: {len([r for r in rows if r["liga"]==liga])} artilheiros')
    return rows

# ── Main ──────────────────────────────────────────────────
def main():
    print('=' * 52)
    print(f'  SIT v11 — COLETOR AUTOMÁTICO')
    print(f'  {datetime.now().strftime("%d/%m/%Y %H:%M:%S UTC")}')
    print(f'  FD API: {"✓ configurada" if FD_API_KEY else "✗ ausente"}')
    print(f'  Supabase: {"✓ configurado" if SUPABASE_URL else "✗ ausente"}')
    print('=' * 52)

    erros = 0

    # FX
    fx = collect_fx()
    if fx:
        if not supabase_upsert('sit_fx', fx): erros += 1
    else:
        print('  ✗ FX falhou'); erros += 1

    # Times
    teams = collect_teams()
    if teams:
        if not supabase_upsert('sit_teams', teams): erros += 1
    else:
        print('  ⚠ Nenhum time coletado (sem API key)')

    # Artilheiros
    scorers = collect_scorers()
    if scorers:
        if not supabase_upsert('sit_scorers', scorers): erros += 1

    # Log final
    log = {
        'id':          'latest',
        'collected_at': NOW,
        'teams_count':  len(teams),
        'fx_ok':        fx is not None,
        'errors':       erros,
        'fd_api':       bool(FD_API_KEY),
    }
    supabase_upsert('sit_logs', log)

    print(f'\n{"="*52}')
    print(f'  Concluído: {len(teams)} times · {len(scorers)} artilheiros')
    print(f'  Erros: {erros}')
    print(f'{"="*52}\n')

    sys.exit(1 if erros > 2 else 0)

if __name__ == '__main__':
    main()
