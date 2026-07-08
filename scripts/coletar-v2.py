#!/usr/bin/env python3
"""
SIT v11 — Coletor Completo v3
Otimizado para rodar em menos de 50min no GitHub Actions
football-data.org + soccer-data6 RapidAPI + open.er-api.com → Supabase
"""
import os, json, time, sys
from datetime import datetime, timezone, date
import urllib.request, urllib.error, urllib.parse

FD_API_KEY    = os.environ.get('FD_API_KEY', '')
SUPABASE_URL  = os.environ.get('SUPABASE_URL', '')
SUPABASE_KEY  = os.environ.get('SUPABASE_KEY', '')
RAPID_API_KEY = os.environ.get('RAPID_API_KEY', '62f175b146msh1c15d0dc3145aafp1fd6f4jsn4e740bf01163')
NOW           = datetime.now(timezone.utc).isoformat()
START         = time.time()

# Ligas a coletar
LIGAS_FD = {
    'PD' : 'ESP',
    'PL' : 'UK',
    'SA' : 'ITA',
    'BL1': 'GER',
    'FL1': 'FRA',
    'BSA': 'BRA',
    'PPL': 'POR',
    'DED': 'NED',
}

# Mapeamento posições
POS_MAP = {
    'Goalkeeper':'GOL','Defence':'ZAG','Midfield':'MC','Offence':'CA',
    'Winger':'PE','Forward':'CA','Attacking Midfield':'MAT',
    'Central Midfield':'MC','Defensive Midfield':'MD','Centre-Back':'ZAG',
    'Left-Back':'LE','Right-Back':'LD','GK':'GOL','CB':'ZAG','LB':'LE',
    'RB':'LD','CM':'MC','DM':'MD','AM':'MAT','LW':'PE','RW':'PD',
    'ST':'CA','CF':'CA','FW':'CA',
}

# Times conhecidos
KNOWN_TEAMS = {
    'Flamengo':'FLA','Palmeiras':'PAL','Corinthians':'COR',
    'São Paulo FC':'SAO','Vasco da Gama':'VAS','Botafogo':'BOT',
    'Clube Atlético Mineiro':'ATM','Grêmio FBPA':'GRE',
    'Sport Club Internacional':'INTS','Fluminense FC':'FLU',
    'Real Madrid CF':'RM','FC Barcelona':'FCB','Club Atlético de Madrid':'ATLM',
    'Manchester City FC':'MCI','Arsenal FC':'ARS','Chelsea FC':'CHE',
    'Liverpool FC':'LIV','Manchester United FC':'MUN',
    'Tottenham Hotspur FC':'TOT','Newcastle United FC':'NEW',
    'AC Milan':'ACM','FC Internazionale Milano':'INTE','Juventus FC':'JUV',
    'AS Roma':'ROM','SSC Napoli':'NAP',
    'FC Bayern München':'BAY','Borussia Dortmund':'DOR',
    'Bayer 04 Leverkusen':'LEV','RB Leipzig':'RBL',
    'Paris Saint-Germain FC':'PSG','Olympique de Marseille':'OLM',
    'SL Benfica':'BEN','FC Porto':'POR','Sporting CP':'SPO',
    'AFC Ajax':'AJX','PSV':'PSV','Feyenoord':'FEY',
}

# ── HTTP helpers ──────────────────────────────────────────
def fetch(url, headers=None, timeout=12):
    h = {'Accept':'application/json','User-Agent':'SIT-v11/1.0'}
    if headers: h.update(headers)
    try:
        req = urllib.request.Request(url, headers=h)
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        if e.code == 429:
            print('  RATE LIMIT — aguardando 65s...')
            time.sleep(65)
        else:
            print(f'  HTTP {e.code}: {url[:60]}')
        return None
    except Exception as e:
        print(f'  ERR: {e}')
        return None

def fd(path, delay=6.5):
    if not FD_API_KEY: return None
    data = fetch(f'https://api.football-data.org/v4/{path}',
                 {'X-Auth-Token': FD_API_KEY})
    time.sleep(delay)
    return data

def rapid(path, delay=1.0):
    if not RAPID_API_KEY: return None
    data = fetch(f'https://api-football-v1.p.rapidapi.com/v3/{path}', {
        'x-rapidapi-key':  RAPID_API_KEY,
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
    })
    time.sleep(delay)
    return data

# ── Supabase ──────────────────────────────────────────────
def sb_upsert(table, rows, conflict='id'):
    if not SUPABASE_URL or not SUPABASE_KEY: return False
    if isinstance(rows, dict): rows = [rows]
    if not rows: return True
    for i in range(0, len(rows), 100):
        batch = rows[i:i+100]
        body  = json.dumps(batch).encode()
        req   = urllib.request.Request(
            f'{SUPABASE_URL}/rest/v1/{table}',
            data=body, method='POST',
            headers={
                'Content-Type':  'application/json',
                'apikey':        SUPABASE_KEY,
                'Authorization': f'Bearer {SUPABASE_KEY}',
                'Prefer':        'resolution=merge-duplicates,return=minimal',
            })
        try:
            with urllib.request.urlopen(req, timeout=15): pass
        except urllib.error.HTTPError as e:
            body_err = e.read().decode()[:200]
            print(f'  ✗ Supabase {table} HTTP {e.code}: {body_err}')
            return False
        except Exception as e:
            print(f'  ✗ Supabase {table}: {e}')
            return False
    return True

# ── Helpers ───────────────────────────────────────────────
def gen_key(name):
    if name in KNOWN_TEAMS: return KNOWN_TEAMS[name]
    words = [w for w in name.upper().split()
             if w not in ('FC','CF','AC','SC','FK','NK','DE','DA','DO','DOS',
                          'VFB','VFL','TSG','RB','1.','UNITED','CITY','SPORT','CLUB')]
    if not words: words = name.upper().split()
    if len(words) == 1:   return words[0][:5]
    elif len(words) == 2: return (words[0][:2] + words[1][:2]).strip('.')
    else:                 return (words[0][0] + words[1][0] + words[2][0]).strip('.')

def calc_vpi(matches, team_name):
    if not matches: return 70.0
    wins = gf = ga = 0
    recent = matches[-10:]
    for m in recent:
        home = m.get('homeTeam',{}).get('name','')
        ft   = m.get('score',{}).get('fullTime',{})
        hg   = ft.get('home',0) or 0
        ag   = ft.get('away',0) or 0
        ih   = team_name.lower() in home.lower()
        g, a = (hg,ag) if ih else (ag,hg)
        gf += g; ga += a
        if g > a: wins += 1
    n = len(recent)
    if not n: return 70.0
    off  = min(gf/n/3*100, 100)
    defN = max((1-ga/(n*2.5))*100, 0)
    imp  = wins/n*100
    return round(0.40*off + 0.25*defN + 0.20*85 + 0.15*imp, 1)

def calc_pbi(matches, team_name):
    if not matches: return 22.0
    ga = 0
    for m in matches[-10:]:
        home = m.get('homeTeam',{}).get('name','')
        ft   = m.get('score',{}).get('fullTime',{})
        hg   = ft.get('home',0) or 0
        ag   = ft.get('away',0) or 0
        ih   = team_name.lower() in home.lower()
        ga  += ag if ih else hg
    return round(ga/max(len(matches[-10:]),1)*6, 1)

# ── FX ────────────────────────────────────────────────────
def collect_fx():
    print('\n[FX] Coletando câmbio...')
    d = fetch('https://open.er-api.com/v6/latest/USD')
    if not d: return False
    r   = d.get('rates',{})
    brl = r.get('BRL', 5.15)
    rows = [
        {'pair':'USDBRL','rate':round(brl,4),'flag':'🇺🇸🇧🇷','updated_at':NOW,'source':'open.er-api.com'},
        {'pair':'EURBRL','rate':round(brl/r.get('EUR',0.92),4),'flag':'🇪🇺🇧🇷','updated_at':NOW,'source':'open.er-api.com'},
        {'pair':'GBPBRL','rate':round(brl/r.get('GBP',0.79),4),'flag':'🇬🇧🇧🇷','updated_at':NOW,'source':'open.er-api.com'},
        {'pair':'EURUSD','rate':round(1/r.get('EUR',0.92),4),'flag':'🇪🇺🇺🇸','updated_at':NOW,'source':'open.er-api.com'},
        {'pair':'SARBRL','rate':round(brl/r.get('SAR',3.75),4),'flag':'🇸🇦🇧🇷','updated_at':NOW,'source':'open.er-api.com'},
    ]
    ok = sb_upsert('sit_fx', rows, 'pair')
    print(f'  {"✓" if ok else "✗"} USD/BRL={round(brl,4)} · {len(rows)} pares')
    return ok

# ── Coletar times de uma liga ─────────────────────────────
def collect_liga(liga_fd, sit_liga):
    print(f'\n[LIGA] {liga_fd} → {sit_liga}')
    standings = fd(f'competitions/{liga_fd}/standings')
    if not standings:
        print('  ✗ Sem dados')
        return []

    team_rows = []
    all_teams = []
    for table in standings.get('standings',[]):
        all_teams.extend(table.get('table',[]))

    print(f'  {len(all_teams)} times encontrados')

    for row in all_teams:
        t     = row.get('team',{})
        fd_id = t.get('id')
        name  = t.get('name','')
        key   = gen_key(name)
        pos   = row.get('position',0)
        pts   = row.get('points',0)
        won   = row.get('won',0)
        draw  = row.get('draw',0)
        lost  = row.get('lost',0)

        # Buscar partidas para VPI real
        m_data  = fd(f'teams/{fd_id}/matches?status=FINISHED&limit=10')
        matches = m_data.get('matches',[]) if m_data else []

        vpi = calc_vpi(matches, name)
        pbi = calc_pbi(matches, name)
        chg_n = round((vpi-70)*0.05, 1)

        if vpi >= 78:   rating, score = 'BUY',  'AA'
        elif vpi >= 68: rating, score = 'HOLD', 'A'
        else:           rating, score = 'SELL', 'BB'

        if vpi >= 80 and rating == 'BUY': tdm = 'GOLDEN'
        elif vpi >= 75: tdm = 'ACTIVE'
        elif vpi >= 65: tdm = 'RISING'
        elif vpi >= 60: tdm = 'STABLE'
        else:           tdm = 'N/A'

        sit_quant = round(vpi*0.35 + 50*0.15 + max(0,100-pbi*1.5)*0.15 + 68, 1)

        team_rows.append({
            'team_key':    key,
            'ticker':      key + '.' + sit_liga[:2],
            'name':        name,
            'short_name':  t.get('shortName', name[:12]),
            'liga_id':     sit_liga,
            'vpi':         vpi,
            'pbi':         pbi,
            'rsi':         50.0,
            'tdm':         tdm,
            'rating':      rating,
            'score':       score,
            'sit_quant':   sit_quant,
            'standing_pos':pos,
            'standing_pts':pts,
            'chg':         f'+{chg_n}%' if chg_n >= 0 else f'{chg_n}%',
            'chg_num':     chg_n,
            'logo_url':    t.get('crest',''),
            'fd_id':       fd_id,
            'data_source': 'football-data.org',
            'updated_at':  NOW,
        })
        print(f'    {key:<6} {name[:22]:<22} VPI={vpi}% {rating} pos={pos}')

    if team_rows:
        ok = sb_upsert('sit_teams', team_rows, 'team_key')
        print(f'  {"✓" if ok else "✗"} {len(team_rows)} times salvos')

    return team_rows

# ── Coletar atletas via API-Football RapidAPI ─────────────
def collect_athletes_rapid(team_rows, liga_id):
    """Busca elenco completo via API-Football (RapidAPI)"""
    if not RAPID_API_KEY:
        print('  ⚠ RAPID_API_KEY não configurada — pulando atletas')
        return 0

    # Mapear liga_id para season_id do API-Football
    LIGA_MAP = {
        'ESP':'140', 'UK':'39', 'ITA':'135', 'GER':'78',
        'FRA':'61', 'BRA':'71', 'POR':'94', 'NED':'88',
    }
    league_id = LIGA_MAP.get(liga_id)
    if not league_id:
        print(f'  ⚠ Liga {liga_id} sem mapeamento RapidAPI')
        return 0

    total = 0
    for tr in team_rows:
        team_key = tr['team_key']
        team_name = tr['name']

        # Buscar elenco via API-Football
        data = rapid(f'players/squads?team={tr.get("fd_id",0)}&league={league_id}&season=2025')
        if not data:
            # Tentar pelo nome
            data = rapid(f'players/squads?team={tr.get("fd_id",0)}')

        if not data:
            continue

        squads = data.get('response', [])
        if not squads:
            continue

        players = squads[0].get('players', []) if squads else []
        rows = []
        for p in players:
            name = p.get('name','')
            if not name: continue
            pos_raw = p.get('position','Midfield')
            pos = POS_MAP.get(pos_raw, 'MC')
            age = p.get('age', 0) or 0
            nat = p.get('nationality','')

            rows.append({
                'team_key':    team_key,
                'name':        name,
                'short_name':  name.split()[-1],
                'position':    pos,
                'nationality': nat,
                'age':         age or None,
                'vpi':         70.0,
                'pbi':         22.0,
                'goals':       0,
                'assists':     0,
                'minutes':     0,
                'photo_url':   p.get('photo',''),
                'data_source': 'api-football',
                'updated_at':  NOW,
            })

        if rows:
            ok = sb_upsert('sit_athletes', rows, 'id')
            if ok:
                total += len(rows)
                print(f'    ✓ {team_name[:20]:<20} {len(rows)} atletas')

    return total

# ── Coletar artilheiros (fallback) ────────────────────────
def collect_scorers(liga_fd, sit_liga):
    print(f'  [SCORERS] {liga_fd}...')
    data = fd(f'competitions/{liga_fd}/scorers?limit=20')
    if not data: return 0
    rows = []
    for s in data.get('scorers',[]):
        p    = s.get('player',{})
        t    = s.get('team',{})
        name = p.get('name','')
        if not name: continue
        team_key = gen_key(t.get('name',''))
        pos      = POS_MAP.get(p.get('section','Midfield'), 'MC')
        goals    = s.get('goals',0) or 0
        assists  = s.get('assists',0) or 0
        mins     = s.get('playedMinutes',0) or 0
        vpi      = min(round(60 + goals*1.5 + assists*0.8 + mins/3060*15, 1), 95)
        pbi      = round(max(10, 30-goals*0.5), 1)
        age_raw  = p.get('dateOfBirth','')
        age = 0
        if age_raw:
            try: age = (date.today()-date.fromisoformat(age_raw[:10])).days//365
            except: pass
        rows.append({
            'team_key':    team_key,
            'name':        name,
            'short_name':  name.split()[-1],
            'position':    pos,
            'nationality': p.get('nationality',''),
            'age':         age or None,
            'vpi':         vpi,
            'pbi':         pbi,
            'goals':       goals,
            'assists':     assists,
            'minutes':     mins,
            'data_source': 'football-data.org',
            'updated_at':  NOW,
        })
    if rows:
        ok = sb_upsert('sit_athletes', rows, 'id')
        print(f'    {"✓" if ok else "✗"} {len(rows)} atletas (scorers)')
    return len(rows)

# ── MAIN ──────────────────────────────────────────────────
def main():
    print('='*54)
    print('  SIT v11 — Coletor Completo v3')
    print(f'  {datetime.now().strftime("%d/%m/%Y %H:%M UTC")}')
    print(f'  FD API:    {"✓" if FD_API_KEY else "✗ AUSENTE"}')
    print(f'  Supabase:  {"✓" if SUPABASE_URL else "✗ AUSENTE"}')
    print(f'  RapidAPI:  {"✓" if RAPID_API_KEY else "✗ não configurado"}')
    print('='*54)

    erros = 0
    total_teams = 0
    total_athl  = 0

    # 1. FX sempre primeiro
    if not collect_fx(): erros += 1

    if not FD_API_KEY:
        print('\n⚠ Sem FD_API_KEY — só FX coletado')
        sys.exit(0)

    # 2. Times de cada liga
    all_team_rows = {}
    for liga_fd, sit_liga in LIGAS_FD.items():
        try:
            rows = collect_liga(liga_fd, sit_liga)
            total_teams += len(rows)
            all_team_rows[sit_liga] = rows
            print(f'  Aguardando 8s...')
            time.sleep(8)
        except Exception as e:
            print(f'  ✗ Erro liga {liga_fd}: {e}')
            erros += 1

    # 3. Atletas — tentar API-Football primeiro, fallback scorers
    print('\n[ATLETAS] Coletando elencos completos...')
    for sit_liga, rows in all_team_rows.items():
        print(f'\n  Liga {sit_liga} — {len(rows)} times')
        n = collect_athletes_rapid(rows, sit_liga)
        if n > 0:
            total_athl += n
            print(f'  ✓ {n} atletas via RapidAPI')
        else:
            # Fallback: artilheiros via football-data.org
            liga_fd = [k for k,v in LIGAS_FD.items() if v == sit_liga]
            if liga_fd:
                n = collect_scorers(liga_fd[0], sit_liga)
                total_athl += n
        time.sleep(5)

    # 4. Log
    duration = round(time.time()-START, 1)
    sb_upsert('sit_logs', [{
        'collected_at':   NOW,
        'teams_count':    total_teams,
        'athletes_count': total_athl,
        'fx_ok':          True,
        'errors':         erros,
        'duration_s':     duration,
        'fd_api':         bool(FD_API_KEY),
        'notes':          f'{len(LIGAS_FD)} ligas · RapidAPI={bool(RAPID_API_KEY)}',
    }])

    print(f'\n{"="*54}')
    print(f'  ✓ Times:   {total_teams}')
    print(f'  ✓ Atletas: {total_athl}')
    print(f'  ✗ Erros:   {erros}')
    print(f'  ⏱ Duração: {duration}s')
    print(f'{"="*54}\n')
    sys.exit(1 if erros > 3 else 0)

if __name__ == '__main__':
    main()
