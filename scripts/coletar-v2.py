#!/usr/bin/env python3
"""
SIT v11 — Coletor Completo v2
Football-Data.org + open.er-api.com → Supabase
Coleta times, partidas, artilheiros e FX
"""
import os, json, time, sys, math
from datetime import datetime, timezone, date
import urllib.request, urllib.error, urllib.parse

FD_API_KEY   = os.environ.get('FD_API_KEY', '')
SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '')
NOW          = datetime.now(timezone.utc).isoformat()
START        = time.time()

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

def fetch(url, headers=None, timeout=12):
    h = {'Accept': 'application/json', 'User-Agent': 'SIT-v11/1.0'}
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

def sb_upsert(table, rows, on_conflict='team_key'):
    if not SUPABASE_URL or not SUPABASE_KEY: return False
    if isinstance(rows, dict): rows = [rows]
    if not rows: return True
    for i in range(0, len(rows), 50):
        batch = rows[i:i+50]
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
        except Exception as e:
            print(f'  ✗ Supabase {table}: {e}')
            return False
    return True

def calc_vpi(matches, team_name):
    if not matches: return 70.0
    wins = gf = ga = 0
    recent = matches[-10:]
    for m in recent:
        home = m.get('homeTeam', {}).get('name', '')
        ft   = m.get('score', {}).get('fullTime', {})
        hg   = ft.get('home', 0) or 0
        ag   = ft.get('away', 0) or 0
        ih   = team_name.lower() in home.lower()
        g, a = (hg, ag) if ih else (ag, hg)
        gf += g; ga += a
        if g > a: wins += 1
    n = len(recent)
    if not n: return 70.0
    off  = min(gf / n / 3 * 100, 100)
    defN = max((1 - ga / (n * 2.5)) * 100, 0)
    imp  = wins / n * 100
    return round(0.40*off + 0.25*defN + 0.20*85 + 0.15*imp, 1)

def calc_pbi(matches, team_name):
    if not matches: return 22.0
    ga = 0
    for m in matches[-10:]:
        home = m.get('homeTeam', {}).get('name', '')
        ft   = m.get('score', {}).get('fullTime', {})
        hg   = ft.get('home', 0) or 0
        ag   = ft.get('away', 0) or 0
        ih   = team_name.lower() in home.lower()
        ga  += ag if ih else hg
    return round(ga / max(len(matches[-10:]), 1) * 6, 1)

def generate_key(name):
    KNOWN = {
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
    if name in KNOWN: return KNOWN[name]
    words = [w for w in name.upper().split()
             if w not in ('FC','CF','AC','SC','FK','NK','DE','DA','DO','DOS',
                          'VFB','VFL','TSG','RB','1.','UNITED','CITY','SPORT')]
    if not words: words = name.upper().split()
    if len(words) == 1:   key = words[0][:4]
    elif len(words) == 2: key = words[0][:2] + words[1][:2]
    else:                 key = words[0][0] + words[1][0] + words[2][0]
    return key.strip('.')[:5]

def collect_fx():
    print('\n[FX] Coletando câmbio...')
    d = fetch('https://open.er-api.com/v6/latest/USD')
    if not d: return False
    r   = d.get('rates', {})
    brl = r.get('BRL', 5.15)
    rows = [
        {'pair':'USDBRL','rate':round(brl,4),'prev_rate':round(brl*0.998,4),'flag':'🇺🇸🇧🇷','updated_at':NOW,'source':'open.er-api.com'},
        {'pair':'EURBRL','rate':round(brl/r.get('EUR',0.92),4),'prev_rate':round(brl/r.get('EUR',0.92)*0.998,4),'flag':'🇪🇺🇧🇷','updated_at':NOW,'source':'open.er-api.com'},
        {'pair':'GBPBRL','rate':round(brl/r.get('GBP',0.79),4),'prev_rate':round(brl/r.get('GBP',0.79)*0.998,4),'flag':'🇬🇧🇧🇷','updated_at':NOW,'source':'open.er-api.com'},
        {'pair':'EURUSD','rate':round(1/r.get('EUR',0.92),4),'prev_rate':round(1/r.get('EUR',0.92)*0.998,4),'flag':'🇪🇺🇺🇸','updated_at':NOW,'source':'open.er-api.com'},
        {'pair':'SARBRL','rate':round(brl/r.get('SAR',3.75),4),'prev_rate':round(brl/r.get('SAR',3.75)*0.998,4),'flag':'🇸🇦🇧🇷','updated_at':NOW,'source':'open.er-api.com'},
    ]
    ok = sb_upsert('sit_fx', rows, 'pair')
    print(f'  {"✓" if ok else "✗"} USD/BRL={round(brl,4)} · {len(rows)} pares')
    return ok

def collect_liga(liga_fd, sit_liga):
    print(f'\n[LIGA] {liga_fd} → {sit_liga}')
    standings = fd(f'competitions/{liga_fd}/standings')
    if not standings:
        print(f'  ✗ Sem dados')
        return []

    team_rows = []
    all_teams = []
    for table in standings.get('standings', []):
        all_teams.extend(table.get('table', []))

    print(f'  {len(all_teams)} times')

    for row in all_teams:
        t     = row.get('team', {})
        fd_id = t.get('id')
        name  = t.get('name', '')
        key   = generate_key(name)
        pos   = row.get('position', 0)
        pts   = row.get('points', 0)
        won   = row.get('won', 0)
        lost  = row.get('lost', 0)
        draw  = row.get('draw', 0)
        total = won + draw + lost

        # Buscar partidas
        m_data  = fd(f'teams/{fd_id}/matches?status=FINISHED&limit=10')
        matches = m_data.get('matches', []) if m_data else []

        vpi = calc_vpi(matches, name)
        pbi = calc_pbi(matches, name)
        rsi = 50.0
        chg_n = round((vpi - 70) * 0.05, 1)

        if vpi >= 78:   rating, score = 'BUY',  'AA'
        elif vpi >= 68: rating, score = 'HOLD', 'A'
        else:           rating, score = 'SELL', 'BB'

        tdm_opts = ['GOLDEN','ACTIVE','RISING','STABLE','N/A']
        if vpi >= 80 and rating == 'BUY': tdm = 'GOLDEN'
        elif vpi >= 75: tdm = 'ACTIVE'
        elif vpi >= 65: tdm = 'RISING'
        elif vpi >= 60: tdm = 'STABLE'
        else: tdm = 'N/A'

        sit_quant = round(vpi*0.35 + rsi*0.15 + max(0,100-pbi*1.5)*0.15 + 68, 1)

        team_rows.append({
            'team_key':    key,
            'ticker':      key + '.' + sit_liga[:2],
            'name':        name,
            'short_name':  t.get('shortName', name[:12]),
            'liga_id':     sit_liga,
            'vpi':         vpi,
            'pbi':         pbi,
            'rsi':         rsi,
            'tdm':         tdm,
            'rating':      rating,
            'score':       score,
            'sit_quant':   sit_quant,
            'standing_pos':pos,
            'standing_pts':pts,
            'chg':         f'+{chg_n}%' if chg_n >= 0 else f'{chg_n}%',
            'chg_num':     chg_n,
            'logo_url':    t.get('crest', ''),
            'fd_id':       fd_id,
            'data_source': 'football-data.org',
            'updated_at':  NOW,
        })
        print(f'    {key:<6} {name[:20]:<20} VPI={vpi}% {rating} pos={pos}')

    if team_rows:
        ok = sb_upsert('sit_teams', team_rows)
        print(f'  {"✓" if ok else "✗"} {len(team_rows)} times salvos')

    return team_rows

def collect_scorers(liga_fd, sit_liga):
    print(f'  [SCORERS] {liga_fd}...')
    data = fd(f'competitions/{liga_fd}/scorers?limit=15')
    if not data: return 0
    rows = []
    for s in data.get('scorers', []):
        p    = s.get('player', {})
        t    = s.get('team', {})
        name = p.get('name', '')
        if not name: continue
        team_key = generate_key(t.get('name', ''))
        pos_map  = {'Goalkeeper':'GOL','Defender':'ZAG','Midfielder':'MC','Forward':'CA','Attacker':'CA','Winger':'PE'}
        pos      = pos_map.get(p.get('section', ''), 'MC')
        goals    = s.get('goals', 0) or 0
        assists  = s.get('assists', 0) or 0
        mins     = s.get('playedMinutes', 0) or 0
        vpi      = min(round(60 + goals*1.5 + assists*0.8 + mins/3060*15, 1), 95)
        pbi      = round(max(10, 30-goals*0.5), 1)
        age_raw  = p.get('dateOfBirth', '')
        age      = 0
        if age_raw:
            try: age = (date.today()-date.fromisoformat(age_raw[:10])).days//365
            except: pass
        rows.append({
            'team_key':    team_key,
            'name':        name,
            'short_name':  name.split()[-1],
            'position':    pos,
            'nationality': p.get('nationality', ''),
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
        ok = sb_upsert('sit_athletes', rows)
        print(f'    {"✓" if ok else "✗"} {len(rows)} atletas')
    return len(rows)

def main():
    print('='*52)
    print('  SIT v11 — Coletor Completo v2')
    print(f'  {datetime.now().strftime("%d/%m/%Y %H:%M UTC")}')
    print(f'  FD API:   {"✓" if FD_API_KEY else "✗ AUSENTE"}')
    print(f'  Supabase: {"✓" if SUPABASE_URL else "✗ AUSENTE"}')
    print('='*52)

    erros = 0
    total_teams = 0
    total_athl  = 0

    if not collect_fx(): erros += 1

    if not FD_API_KEY:
        print('\n⚠ Sem FD_API_KEY — só FX coletado')
        sys.exit(0)

    for liga_fd, sit_liga in LIGAS_FD.items():
        try:
            rows = collect_liga(liga_fd, sit_liga)
            total_teams += len(rows)
            n = collect_scorers(liga_fd, sit_liga)
            total_athl += n
            print(f'  Aguardando 10s...')
            time.sleep(10)
        except Exception as e:
            print(f'  ✗ Erro liga {liga_fd}: {e}')
            erros += 1

    duration = round(time.time()-START, 1)
    sb_upsert('sit_logs', [{
        'collected_at':   NOW,
        'teams_count':    total_teams,
        'athletes_count': total_athl,
        'fx_ok':          True,
        'errors':         erros,
        'duration_s':     duration,
        'fd_api':         bool(FD_API_KEY),
        'notes':          f'{len(LIGAS_FD)} ligas',
    }])

    print(f'\n{"="*52}')
    print(f'  ✓ Times:   {total_teams}')
    print(f'  ✓ Atletas: {total_athl}')
    print(f'  ✗ Erros:   {erros}')
    print(f'  ⏱ Duração: {duration}s')
    print(f'{"="*52}\n')
    sys.exit(1 if erros > 3 else 0)

if __name__ == '__main__':
    main()
