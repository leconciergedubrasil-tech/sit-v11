// ═══════════════════════════════════════════════════════
// sit-db.js — SIT v10 Data Layer
// Todos os dados separados da lógica
// © 2026 SIT — Sport Intelligence Terminal
// ═══════════════════════════════════════════════════════

/* global window */
'use strict';

const DB={
  FLA:{n:'Flamengo',tk:'FLA.BZ',liga:'BRA',vpi:78,pbi:18,kii:12,tdm:'GOLDEN',goal:68,rating:'BUY',score:'AA',chg:'+1.8%',chgN:1.8,val:'R$2.8B',
    founded:1895,stadium:'Maracanã',cap:78838,coach:'Tite',style:'4-3-3 com alta pressão ofensiva e transição rápida. Dependência de Pedro e Arrascaeta como ativos primários.',
    h2h_home:72,div:'R$520M',rev:'R$1.2B',ebitda:'R$350M',roe:'22.5%',
    sponsors:[{s:'Pix Bet',v:'R$45M/a',vig:'2026',t:'Master'},{s:'Adidas',v:'R$35M/a',vig:'2028',t:'Material'},{s:'BRB',v:'R$15M/a',vig:'2027',t:'Manga'}],
    hold:[{h:'Associação',pct:'70%',v:'R$1.96B'},{h:'Sócios',pct:'20%',v:'R$560M'},{h:'Fundo SAF',pct:'10%',v:'R$280M'}],
    hp:[{d:'30/03',adv:'Palmeiras',pl:'2-1',vp:78.3,var:'+1.8%'},{d:'26/03',adv:'Corinthians',pl:'3-0',vp:76.9,var:'+2.1%'},{d:'22/03',adv:'São Paulo',pl:'1-1',vp:75.3,var:'-0.5%'},{d:'18/03',adv:'Vasco',pl:'4-1',vp:75.7,var:'+3.2%'},{d:'14/03',adv:'Botafogo',pl:'2-2',vp:73.4,var:'-1.2%'}],
    athletes:[
      {n:'Pedro',pos:'CA',vpi:82,pbi:15,kii:10,gols:18,ass:7,min:2840,sal:'R$1.2M/m',clause:'€100M',contrato:'2027',inj:[{d:'15/03',l:'Tornozelo',dur:'5d'},{d:'22/10/25',l:'Estiramento',dur:'12d'}]},
      {n:'Gabigol',pos:'CA',vpi:74,pbi:22,kii:14,gols:12,ass:5,min:2100,sal:'R$900K/m',clause:'€60M',contrato:'2026',inj:[{d:'05/08/24',l:'Fratura mão',dur:'21d'}]},
      {n:'Arrascaeta',pos:'MAE',vpi:76,pbi:17,kii:9,gols:8,ass:12,min:2650,sal:'R$800K/m',clause:'€45M',contrato:'2028',inj:[]},
      {n:'Gerson',pos:'MC',vpi:71,pbi:20,kii:8,gols:4,ass:9,min:2700,sal:'R$700K/m',clause:'€35M',contrato:'2026',inj:[]},
      {n:'De La Cruz',pos:'MAE',vpi:68,pbi:24,kii:11,gols:5,ass:8,min:2200,sal:'R$650K/m',clause:'€30M',contrato:'2027',inj:[]},
      {n:'Wesley',pos:'PD',vpi:70,pbi:19,kii:13,gols:6,ass:10,min:2400,sal:'R$500K/m',clause:'€20M',contrato:'2028',inj:[]}
    ]},
  RM:{n:'Real Madrid',tk:'RM.ES',liga:'ESP',vpi:88,pbi:14,kii:8,tdm:'ACTIVE',goal:74,rating:'BUY',score:'AAA',chg:'+2.1%',chgN:2.1,val:'EUR 8.5B',
    founded:1902,stadium:'Bernabéu',cap:81044,coach:'Ancelotti',style:'Transição ultrarrápida. Dependência de Vinicius Jr. e Bellingham. Pressing alto em casa.',
    h2h_home:68,div:'EUR 200M',rev:'EUR 831M',ebitda:'EUR 320M',roe:'18.2%',
    sponsors:[{s:'Adidas',v:'EUR 120M/a',vig:'2028',t:'Kit'},{s:'Emirates',v:'EUR 70M/a',vig:'2026',t:'Naming'},{s:'HP',v:'EUR 40M/a',vig:'2027',t:'Tech'}],
    hold:[{h:'Socios RM',pct:'100%',v:'EUR 8.5B'}],
    hp:[{d:'30/03',adv:'Barcelona',pl:'3-1',vp:88.5,var:'+2.1%'},{d:'26/03',adv:'Atletico',pl:'2-0',vp:86.2,var:'+1.5%'},{d:'22/03',adv:'Sevilla',pl:'4-0',vp:85.8,var:'+3.2%'},{d:'18/03',adv:'Villarreal',pl:'2-2',vp:84.1,var:'-0.8%'},{d:'14/03',adv:'Betis',pl:'3-1',vp:85.3,var:'+1.9%'}],
    athletes:[
      {n:'Vinicius Jr',pos:'PE',vpi:91,pbi:12,kii:7,gols:22,ass:14,min:3100,sal:'EUR 20M/a',clause:'EUR 1B',contrato:'2027',inj:[]},
      {n:'Bellingham',pos:'MC',vpi:88,pbi:16,kii:9,gols:19,ass:11,min:3050,sal:'EUR 18M/a',clause:'EUR 900M',contrato:'2029',inj:[]},
      {n:'Mbappé',pos:'CA',vpi:85,pbi:18,kii:10,gols:24,ass:8,min:2900,sal:'EUR 25M/a',clause:'EUR 1B',contrato:'2029',inj:[{d:'10/02',l:'Coxa',dur:'8d'}]},
      {n:'Modrić',pos:'MC',vpi:76,pbi:28,kii:6,gols:4,ass:10,min:2200,sal:'EUR 8M/a',clause:'EUR 20M',contrato:'2025',inj:[]},
      {n:'Valverde',pos:'MD',vpi:80,pbi:20,kii:8,gols:8,ass:9,min:2800,sal:'EUR 12M/a',clause:'EUR 500M',contrato:'2028',inj:[]},
      {n:'Rüdiger',pos:'ZAG',vpi:72,pbi:15,kii:7,gols:2,ass:1,min:2950,sal:'EUR 10M/a',clause:'EUR 80M',contrato:'2027',inj:[]}
    ]},
  FCB:{n:'Barcelona',tk:'FCB.ES',liga:'ESP',vpi:60,pbi:35,kii:22,tdm:'N/A',goal:52,rating:'SELL',score:'BB',chg:'-0.5%',chgN:-0.5,val:'EUR 5.1B',
    founded:1899,stadium:'Spotify Camp Nou',cap:99354,coach:'Flick',style:'Tiki-taka moderno. Alta posse. Vulnerável com elenco fadigado. Pedri e Gavi com PBI crítico.',
    h2h_home:55,div:'EUR 300M',rev:'EUR 765M',ebitda:'EUR 180M',roe:'8.5%',
    sponsors:[{s:'Spotify',v:'EUR 60M/a',vig:'2026',t:'Naming'},{s:'Nike',v:'EUR 105M/a',vig:'2028',t:'Kit'},{s:'Rakuten',v:'EUR 55M/a',vig:'2026',t:'Master'}],
    hold:[{h:'Socios FCB',pct:'100%',v:'EUR 5.1B'}],
    hp:[{d:'30/03',adv:'Real Madrid',pl:'1-3',vp:60.2,var:'-1.8%'},{d:'26/03',adv:'Atletico',pl:'2-2',vp:62.1,var:'+0.5%'},{d:'22/03',adv:'Sevilla',pl:'3-1',vp:63.5,var:'+1.2%'},{d:'18/03',adv:'Valencia',pl:'1-2',vp:61.2,var:'-2.1%'},{d:'14/03',adv:'Villarreal',pl:'2-1',vp:62.8,var:'+0.8%'}],
    athletes:[
      {n:'Pedri',pos:'MC',vpi:60,pbi:35,kii:20,gols:7,ass:9,min:1800,sal:'EUR 12M/a',clause:'EUR 1B',contrato:'2026',inj:[{d:'15/03',l:'Tornozelo',dur:'14d'},{d:'01/11/25',l:'Joelho',dur:'30d'}]},
      {n:'Lamine Yamal',pos:'PD',vpi:72,pbi:22,kii:12,gols:14,ass:16,min:2900,sal:'EUR 10M/a',clause:'EUR 1B',contrato:'2027',inj:[]},
      {n:'Lewandowski',pos:'CA',vpi:65,pbi:30,kii:18,gols:18,ass:6,min:2600,sal:'EUR 18M/a',clause:'EUR 200M',contrato:'2025',inj:[]},
      {n:'Gavi',pos:'MC',vpi:58,pbi:38,kii:24,gols:3,ass:7,min:1600,sal:'EUR 12M/a',clause:'EUR 1B',contrato:'2026',inj:[{d:'20/03',l:'Músculo',dur:'10d'}]},
      {n:'Raphinha',pos:'PE',vpi:70,pbi:25,kii:16,gols:11,ass:9,min:2700,sal:'EUR 10M/a',clause:'EUR 200M',contrato:'2027',inj:[]},
      {n:'De Jong',pos:'MC',vpi:62,pbi:32,kii:19,gols:4,ass:8,min:2100,sal:'EUR 14M/a',clause:'EUR 400M',contrato:'2026',inj:[]}
    ]},
  ACM:{n:'AC Milan',tk:'ACM.IT',liga:'ITA',vpi:80,pbi:19,kii:11,tdm:'RISING',goal:65,rating:'BUY',score:'A+',chg:'+3.2%',chgN:3.2,val:'EUR 1.2B',
    founded:1899,stadium:'San Siro',cap:75923,coach:'Fonseca',style:'Contragolpe eficiente. Leão como ativo ofensivo primário. TDM em ascensão.',
    h2h_home:62,div:'EUR 80M',rev:'EUR 450M',ebitda:'EUR 120M',roe:'14.2%',
    sponsors:[{s:'Emirates',v:'EUR 30M/a',vig:'2027',t:'Master'},{s:'Puma',v:'EUR 28M/a',vig:'2026',t:'Kit'}],
    hold:[{h:'RedBird Capital',pct:'99%',v:'EUR 1.2B'}],
    hp:[{d:'30/03',adv:'Napoli',pl:'3-1',vp:80.5,var:'+3.2%'},{d:'26/03',adv:'Roma',pl:'2-0',vp:78.2,var:'+2.1%'},{d:'22/03',adv:'Juve',pl:'1-1',vp:77.5,var:'+0.3%'},{d:'18/03',adv:'Inter',pl:'2-3',vp:76.8,var:'-1.5%'},{d:'14/03',adv:'Lazio',pl:'4-0',vp:78.1,var:'+3.8%'}],
    athletes:[
      {n:'Leão',pos:'PE',vpi:84,pbi:18,kii:10,gols:16,ass:12,min:2800,sal:'EUR 8M/a',clause:'EUR 175M',contrato:'2027',inj:[]},
      {n:'Pulisic',pos:'PD',vpi:78,pbi:20,kii:12,gols:13,ass:10,min:2700,sal:'EUR 7M/a',clause:'EUR 80M',contrato:'2026',inj:[]},
      {n:'Reijnders',pos:'MC',vpi:74,pbi:22,kii:9,gols:8,ass:7,min:2900,sal:'EUR 5M/a',clause:'EUR 60M',contrato:'2028',inj:[]},
      {n:'Theo',pos:'LD',vpi:72,pbi:21,kii:11,gols:4,ass:8,min:2850,sal:'EUR 6M/a',clause:'EUR 70M',contrato:'2027',inj:[]},
      {n:'Giroud',pos:'CA',vpi:68,pbi:28,kii:14,gols:10,ass:5,min:2200,sal:'EUR 4M/a',clause:'EUR 10M',contrato:'2024',inj:[]},
      {n:'Maignan',pos:'GOL',vpi:76,pbi:12,kii:7,gols:0,ass:0,min:3060,sal:'EUR 8M/a',clause:'EUR 80M',contrato:'2026',inj:[]}
    ]},
  MCI:{n:'Manchester City',tk:'MCI.UK',liga:'UK',vpi:85,pbi:22,kii:9,tdm:'ACTIVE',goal:72,rating:'BUY',score:'AAA',chg:'+0.9%',chgN:0.9,val:'GBP 5.8B',
    founded:1880,stadium:'Etihad',cap:53400,coach:'Guardiola',style:'Posse dominante, pressing alto. Sistema rotativo Guardiola. Haaland como ativo de finalização.',
    h2h_home:70,div:'GBP 200M',rev:'GBP 782M',ebitda:'GBP 280M',roe:'16.5%',
    sponsors:[{s:'Puma',v:'GBP 65M/a',vig:'2027',t:'Kit'},{s:'Etihad',v:'GBP 67M/a',vig:'2026',t:'Naming'}],
    hold:[{h:'City Football Group',pct:'78%',v:'GBP 4.5B'},{h:'Silver Lake',pct:'10%',v:'GBP 580M'},{h:'Outros',pct:'12%',v:'GBP 696M'}],
    hp:[{d:'30/03',adv:'Arsenal',pl:'2-1',vp:85.2,var:'+0.9%'},{d:'26/03',adv:'Chelsea',pl:'3-0',vp:84.5,var:'+1.5%'},{d:'22/03',adv:'Liverpool',pl:'1-1',vp:83.8,var:'-0.4%'},{d:'18/03',adv:'Spurs',pl:'4-0',vp:84.2,var:'+2.1%'},{d:'14/03',adv:'Villa',pl:'2-2',vp:83.5,var:'-0.6%'}],
    athletes:[
      {n:'Haaland',pos:'CA',vpi:90,pbi:20,kii:8,gols:27,ass:5,min:2900,sal:'EUR 30M/a',clause:'EUR 200M',contrato:'2027',inj:[]},
      {n:'De Bruyne',pos:'MC',vpi:87,pbi:24,kii:7,gols:8,ass:18,min:2600,sal:'EUR 22M/a',clause:'EUR 300M',contrato:'2025',inj:[{d:'12/01',l:'Joelho',dur:'60d'}]},
      {n:'Foden',pos:'PE',vpi:83,pbi:21,kii:9,gols:14,ass:12,min:2750,sal:'EUR 14M/a',clause:'EUR 400M',contrato:'2027',inj:[]},
      {n:'Bernardo',pos:'MD',vpi:80,pbi:23,kii:8,gols:7,ass:10,min:2850,sal:'EUR 12M/a',clause:'EUR 200M',contrato:'2026',inj:[]},
      {n:'Grealish',pos:'PE',vpi:74,pbi:26,kii:11,gols:6,ass:8,min:2200,sal:'EUR 18M/a',clause:'EUR 100M',contrato:'2027',inj:[]},
      {n:'Ederson',pos:'GOL',vpi:78,pbi:10,kii:6,gols:0,ass:0,min:3060,sal:'EUR 10M/a',clause:'EUR 80M',contrato:'2026',inj:[]}
    ]},
  PSG:{n:'PSG',tk:'PSG.FR',liga:'FRA',vpi:76,pbi:28,kii:18,tdm:'N/A',goal:61,rating:'HOLD',score:'A',chg:'+1.1%',chgN:1.1,val:'EUR 4.2B',
    founded:1970,stadium:'Parc des Princes',cap:48583,coach:'Luis Enrique',style:'Jogo vertical. Velocidade nas alas. PBI elevado reduz eficiência coletiva.',
    h2h_home:58,div:'EUR 250M',rev:'EUR 795M',ebitda:'EUR 150M',roe:'9.8%',
    sponsors:[{s:'QSI',v:'Proprietário',vig:'—',t:'Dono'},{s:'Nike',v:'EUR 80M/a',vig:'2027',t:'Kit'}],
    hold:[{h:'QSI (Qatar)',pct:'100%',v:'EUR 4.2B'}],
    hp:[{d:'30/03',adv:'Lyon',pl:'4-1',vp:76.8,var:'+1.1%'},{d:'26/03',adv:'Monaco',pl:'2-2',vp:75.2,var:'-0.8%'},{d:'22/03',adv:'Marseille',pl:'3-0',vp:76.1,var:'+2.2%'},{d:'18/03',adv:'Lille',pl:'1-0',vp:74.8,var:'+0.5%'},{d:'14/03',adv:'Lens',pl:'2-1',vp:75.5,var:'+1.3%'}],
    athletes:[
      {n:'Dembélé',pos:'PD',vpi:80,pbi:25,kii:16,gols:14,ass:13,min:2700,sal:'EUR 12M/a',clause:'EUR 150M',contrato:'2027',inj:[]},
      {n:'Barcola',pos:'PE',vpi:75,pbi:26,kii:17,gols:16,ass:8,min:2900,sal:'EUR 8M/a',clause:'EUR 80M',contrato:'2028',inj:[]},
      {n:'Vitinha',pos:'MC',vpi:74,pbi:27,kii:15,gols:5,ass:9,min:2800,sal:'EUR 7M/a',clause:'EUR 60M',contrato:'2028',inj:[]},
      {n:'Fabián Ruiz',pos:'MC',vpi:72,pbi:29,kii:19,gols:6,ass:7,min:2600,sal:'EUR 8M/a',clause:'EUR 60M',contrato:'2027',inj:[]},
      {n:'Doué',pos:'PE',vpi:68,pbi:30,kii:20,gols:8,ass:6,min:2200,sal:'EUR 6M/a',clause:'EUR 50M',contrato:'2028',inj:[]},
      {n:'Donnarumma',pos:'GOL',vpi:80,pbi:12,kii:8,gols:0,ass:0,min:3060,sal:'EUR 12M/a',clause:'EUR 80M',contrato:'2026',inj:[]}
    ]},
  PAL:{n:'Palmeiras',tk:'PAL.BZ',liga:'BRA',vpi:72,pbi:22,kii:9,tdm:'RISING',goal:61,rating:'BUY',score:'AA-',chg:'+1.2%',chgN:1.2,val:'R$1.8B',
    founded:1914,stadium:'Allianz Parque',cap:43713,coach:'Abel Ferreira',style:'4-4-2 defensivo sólido. Abel imprime disciplina tática. Endrick foi principal ativo exportado.',
    h2h_home:64,div:'R$380M',rev:'R$980M',ebitda:'R$280M',roe:'18.1%',
    sponsors:[{s:'Crefisa',v:'R$81M/a',vig:'2027',t:'Master'},{s:'Puma',v:'R$28M/a',vig:'2026',t:'Kit'}],
    hold:[{h:'Sociedade Esportiva',pct:'100%',v:'R$1.8B'}],
    hp:[{d:'30/03',adv:'Flamengo (C)',pl:'1-2',vp:72.0,var:'-0.8%'},{d:'26/03',adv:'Botafogo',pl:'2-0',vp:73.1,var:'+1.4%'},{d:'22/03',adv:'Corinthians',pl:'1-0',vp:72.8,var:'+0.9%'},{d:'18/03',adv:'São Paulo (C)',pl:'0-0',vp:71.9,var:'-0.3%'},{d:'14/03',adv:'Grêmio',pl:'3-1',vp:72.4,var:'+2.1%'}],
    athletes:[
      {n:'Estêvão',pos:'PD',vpi:79,pbi:14,kii:11,gols:12,ass:9,min:2500,sal:'R$400K/m',clause:'€60M',contrato:'2027',inj:[]},
      {n:'Raphael Veiga',pos:'MAD',vpi:74,pbi:19,kii:8,gols:10,ass:12,min:2700,sal:'R$650K/m',clause:'€25M',contrato:'2026',inj:[]},
      {n:'Flaco López',pos:'CA',vpi:71,pbi:21,kii:7,gols:14,ass:4,min:2400,sal:'R$500K/m',clause:'€20M',contrato:'2027',inj:[{d:'10/02',l:'Tornozelo',dur:'10d'}]},
      {n:'Aníbal Moreno',pos:'VOL',vpi:70,pbi:20,kii:6,gols:2,ass:7,min:2600,sal:'R$400K/m',clause:'€18M',contrato:'2027',inj:[]}
    ]},
  BAY:{n:'Bayern München',tk:'BAY.GR',liga:'GER',vpi:84,pbi:16,kii:8,tdm:'ACTIVE',goal:71,rating:'BUY',score:'AA+',chg:'+1.5%',chgN:1.5,val:'EUR 3.8B',
    founded:1900,stadium:'Allianz Arena',cap:75024,coach:'Kompany',style:'Alta posse de bola. Pressing intenso. Transição rápida com Kane como referência.',
    h2h_home:69,div:'EUR 190M',rev:'EUR 852M',ebitda:'EUR 310M',roe:'20.1%',
    sponsors:[{s:'Allianz',v:'EUR 60M/a',vig:'2027',t:'Naming'},{s:'Adidas',v:'EUR 60M/a',vig:'2030',t:'Kit'},{s:'T-Mobile',v:'EUR 30M/a',vig:'2025',t:'Telecom'}],
    hold:[{h:'Bayern AG',pct:'75%',v:'EUR 2.85B'},{h:'Adidas',pct:'8.33%',v:'EUR 316M'},{h:'Audi',pct:'8.33%',v:'EUR 316M'},{h:'Allianz',pct:'8.33%',v:'EUR 316M'}],
    hp:[{d:'29/03',adv:'Dortmund (F)',pl:'3-0',vp:84.8,var:'+1.5%'},{d:'25/03',adv:'Leverkusen',pl:'2-1',vp:83.9,var:'+1.1%'},{d:'20/03',adv:'Frankfurt (C)',pl:'1-1',vp:82.7,var:'-0.6%'},{d:'16/03',adv:'Stuttgart',pl:'4-0',vp:83.8,var:'+2.3%'},{d:'12/03',adv:'Wolfsburg',pl:'2-2',vp:82.1,var:'-0.8%'}],
    athletes:[
      {n:'Harry Kane',pos:'CA',vpi:87,pbi:11,kii:9,gols:26,ass:8,min:2800,sal:'£400K/w',clause:'€200M',contrato:'2027',inj:[]},
      {n:'Jamal Musiala',pos:'MAE',vpi:85,pbi:13,kii:12,gols:15,ass:16,min:2650,sal:'€350K/w',clause:'€150M',contrato:'2026',inj:[]},
      {n:'Leroy Sané',pos:'PE',vpi:78,pbi:18,kii:7,gols:11,ass:10,min:2400,sal:'€350K/w',clause:'€60M',contrato:'2025',inj:[{d:'15/01',l:'Coxa',dur:'21d'}]},
      {n:'Leon Goretzka',pos:'MC',vpi:76,pbi:17,kii:6,gols:5,ass:8,min:2550,sal:'€300K/w',clause:'€70M',contrato:'2026',inj:[]}
    ]},
  LIV:{n:'Liverpool',tk:'LIV.UK',liga:'UK',vpi:82,pbi:20,kii:8,tdm:'GOLDEN',goal:69,rating:'BUY',score:'AA',chg:'+1.3%',chgN:1.3,val:'EUR 2.1B',
    founded:1892,stadium:'Anfield',cap:61276,coach:'Slot',style:'Alta pressão. Gegenpressing. Geração nova pós-Klopp. Salah como ativo primário.',
    h2h_home:66,div:'EUR 210M',rev:'EUR 613M',ebitda:'EUR 250M',roe:'17.8%',
    sponsors:[{s:'Standard Chartered',v:'£50M/a',vig:'2027',t:'Master'},{s:'Nike',v:'£80M/a',vig:'2025',t:'Kit'}],
    hold:[{h:'FSG (Fenway Sports)',pct:'85%',v:'EUR 1.79B'},{h:'John Henry',pct:'10%',v:'EUR 210M'},{h:'Público',pct:'5%',v:'EUR 105M'}],
    hp:[{d:'30/03',adv:'Man City (F)',pl:'2-1',vp:82.5,var:'+1.3%'},{d:'26/03',adv:'Arsenal',pl:'2-2',vp:81.8,var:'-0.3%'},{d:'22/03',adv:'Chelsea (C)',pl:'3-1',vp:82.4,var:'+1.8%'},{d:'18/03',adv:'Tottenham',pl:'4-0',vp:81.9,var:'+2.4%'},{d:'14/03',adv:'Everton',pl:'2-0',vp:80.8,var:'+0.9%'}],
    athletes:[
      {n:'Mohamed Salah',pos:'PD',vpi:88,pbi:14,kii:11,gols:24,ass:14,min:2750,sal:'£350K/w',clause:'€120M',contrato:'2025',inj:[]},
      {n:'Luis Díaz',pos:'PE',vpi:82,pbi:19,kii:9,gols:16,ass:10,min:2600,sal:'£150K/w',clause:'€80M',contrato:'2027',inj:[]},
      {n:'Dominik Szoboszlai',pos:'MAE',vpi:78,pbi:21,kii:8,gols:7,ass:12,min:2500,sal:'£120K/w',clause:'€70M',contrato:'2028',inj:[]},
      {n:'Virgil van Dijk',pos:'ZAG',vpi:80,pbi:15,kii:10,gols:4,ass:3,min:2800,sal:'£220K/w',clause:'€60M',contrato:'2025',inj:[]}
    ]},

  LIV:{n:'Liverpool',tk:'LIV.UK',liga:'UK',vpi:86,pbi:16,kii:9,tdm:'ACTIVE',goal:72,rating:'BUY',score:'AAA',chg:'+1.9%',chgN:1.9,val:'GBP 4.2B',
    founded:1892,stadium:'Anfield',cap:54074,coach:'Slot',style:'Pressão alta intensa. Transição rápida. Salah como ativo primário de finalização e criação.',
    h2h_home:70,div:'GBP 120M',rev:'GBP 690M',ebitda:'GBP 240M',roe:'17.1%',
    sponsors:[{s:'Standard Chartered',v:'GBP 50M/a',vig:'2027',t:'Master'},{s:'Nike',v:'GBP 30M/a',vig:'2026',t:'Kit'}],
    hold:[{h:'Fenway Sports Group',pct:'100%',v:'GBP 4.2B'}],
    hp:[{d:'30/03',adv:'Arsenal',pl:'3-1',vp:86.2,var:'+1.9%'},{d:'26/03',adv:'Chelsea',pl:'2-0',vp:84.8,var:'+1.2%'},{d:'22/03',adv:'City',pl:'1-1',vp:83.5,var:'-0.3%'},{d:'18/03',adv:'Everton',pl:'4-0',vp:84.1,var:'+2.8%'},{d:'14/03',adv:'Spurs',pl:'3-2',vp:82.9,var:'+1.5%'}],
    athletes:[
      {n:'Salah',pos:'PD',vpi:89,pbi:14,kii:7,gols:24,ass:16,min:3100,sal:'GBP 350K/w',clause:'EUR 200M',contrato:'2026',inj:[]},
      {n:'Núñez',pos:'CA',vpi:80,pbi:18,kii:10,gols:18,ass:6,min:2700,sal:'GBP 140K/w',clause:'EUR 100M',contrato:'2028',inj:[]},
      {n:'Szoboszlai',pos:'MC',vpi:76,pbi:20,kii:9,gols:8,ass:11,min:2800,sal:'GBP 90K/w',clause:'EUR 80M',contrato:'2028',inj:[]},
      {n:'Van Dijk',pos:'ZAG',vpi:82,pbi:12,kii:6,gols:3,ass:2,min:3060,sal:'GBP 220K/w',clause:'EUR 60M',contrato:'2026',inj:[]},
      {n:'Alisson',pos:'GOL',vpi:84,pbi:10,kii:5,gols:0,ass:0,min:3060,sal:'GBP 180K/w',clause:'EUR 80M',contrato:'2027',inj:[]}
    ]},
  BAY:{n:'Bayern München',tk:'BAY.DE',liga:'GER',vpi:84,pbi:17,kii:10,tdm:'RISING',goal:70,rating:'BUY',score:'AAA',chg:'+2.3%',chgN:2.3,val:'EUR 3.8B',
    founded:1900,stadium:'Allianz Arena',cap:75024,coach:'Kompany',style:'Dominância física e técnica. Alta posse com pressing estruturado. Kane como ativo central de finalização.',
    h2h_home:68,div:'EUR 90M',rev:'EUR 854M',ebitda:'EUR 310M',roe:'19.4%',
    sponsors:[{s:'Deutsche Telekom',v:'EUR 60M/a',vig:'2027',t:'Master'},{s:'Adidas',v:'EUR 60M/a',vig:'2028',t:'Kit'}],
    hold:[{h:'FC Bayern München AG',pct:'75%',v:'EUR 2.85B'},{s:'Adidas',pct:'8.33%',v:'EUR 316M'},{h:'Audi',pct:'8.33%',v:'EUR 316M'}],
    hp:[{d:'30/03',adv:'Dortmund',pl:'4-0',vp:84.5,var:'+2.3%'},{d:'26/03',adv:'Leverkusen',pl:'2-1',vp:83.1,var:'+1.8%'},{d:'22/03',adv:'Stuttgart',pl:'3-0',vp:82.4,var:'+1.5%'},{d:'18/03',adv:'Frankfurt',pl:'2-2',vp:81.8,var:'-0.4%'},{d:'14/03',adv:'Wolfsburg',pl:'5-1',vp:83.2,var:'+3.1%'}],
    athletes:[
      {n:'Kane',pos:'CA',vpi:88,pbi:16,kii:8,gols:30,ass:10,min:3050,sal:'EUR 25M/a',clause:'EUR 200M',contrato:'2027',inj:[]},
      {n:'Müller',pos:'MAE',vpi:74,pbi:22,kii:7,gols:8,ass:14,min:2400,sal:'EUR 12M/a',clause:'EUR 20M',contrato:'2026',inj:[]},
      {n:'Kimmich',pos:'MC',vpi:85,pbi:19,kii:8,gols:6,ass:13,min:2950,sal:'EUR 20M/a',clause:'EUR 200M',contrato:'2027',inj:[]},
      {n:'Musiala',pos:'MAE',vpi:86,pbi:15,kii:9,gols:16,ass:12,min:2800,sal:'EUR 15M/a',clause:'EUR 500M',contrato:'2029',inj:[]},
      {n:'Neuer',pos:'GOL',vpi:78,pbi:13,kii:6,gols:0,ass:0,min:2800,sal:'EUR 15M/a',clause:'EUR 30M',contrato:'2025',inj:[{d:'10/01',l:'Panturrilha',dur:'21d'}]}
    ]},
  PAL:{n:'Palmeiras',tk:'PAL.BZ',liga:'BRA',vpi:77,pbi:20,kii:13,tdm:'ACTIVE',goal:65,rating:'BUY',score:'A+',chg:'+1.4%',chgN:1.4,val:'R$1.9B',
    founded:1914,stadium:'Allianz Parque',cap:43713,coach:'Abel Ferreira',style:'Organização tática defensiva sólida. Transição rápida. Endrick deixou vácuo ofensivo. Estrutura SAF em construção.',
    h2h_home:64,div:'R$280M',rev:'R$780M',ebitda:'R$210M',roe:'14.8%',
    sponsors:[{s:'Crefisa',v:'R$81M/a',vig:'2027',t:'Master'},{s:'Puma',v:'R$30M/a',vig:'2026',t:'Kit'}],
    hold:[{h:'Sociedade Esportiva',pct:'100%',v:'R$1.9B'}],
    hp:[{d:'30/03',adv:'Corinthians',pl:'2-0',vp:77.4,var:'+1.4%'},{d:'26/03',adv:'Santos',pl:'3-1',vp:76.2,var:'+2.1%'},{d:'22/03',adv:'Fluminense',pl:'1-1',vp:75.5,var:'-0.2%'},{d:'18/03',adv:'Botafogo',pl:'2-1',vp:75.8,var:'+1.8%'},{d:'14/03',adv:'Grêmio',pl:'4-0',vp:76.9,var:'+3.2%'}],
    athletes:[
      {n:'Flaco López',pos:'CA',vpi:76,pbi:18,kii:11,gols:15,ass:5,min:2700,sal:'R$600K/m',clause:'EUR 25M',contrato:'2026',inj:[]},
      {n:'Raphael Veiga',pos:'MAE',vpi:78,pbi:17,kii:10,gols:12,ass:13,min:2850,sal:'R$700K/m',clause:'EUR 30M',contrato:'2027',inj:[]},
      {n:'Estêvão',pos:'PD',vpi:80,pbi:14,kii:9,gols:10,ass:11,min:2600,sal:'R$400K/m',clause:'EUR 61.5M',contrato:'2027',inj:[]},
      {n:'Aníbal Moreno',pos:'MC',vpi:73,pbi:20,kii:10,gols:4,ass:7,min:2800,sal:'R$450K/m',clause:'EUR 20M',contrato:'2027',inj:[]},
      {n:'Weverton',pos:'GOL',vpi:75,pbi:11,kii:6,gols:0,ass:0,min:3060,sal:'R$500K/m',clause:'EUR 15M',contrato:'2026',inj:[]}
    ]},
  JUV:{n:'Juventus',tk:'JUV.IT',liga:'ITA',vpi:72,pbi:24,kii:14,tdm:'N/A',goal:58,rating:'HOLD',score:'BB+',chg:'-0.3%',chgN:-0.3,val:'EUR 1.0B',
    founded:1897,stadium:'Allianz Stadium',cap:41507,coach:'Thiago Motta',style:'Transição para novo sistema. Alta rigidez tática. Vlahovic como referência ofensiva. PBI médio elevado.',
    h2h_home:55,div:'EUR 400M',rev:'EUR 530M',ebitda:'EUR 80M',roe:'5.2%',
    sponsors:[{s:'Jeep',v:'EUR 45M/a',vig:'2026',t:'Master'},{s:'Adidas',v:'EUR 51M/a',vig:'2027',t:'Kit'}],
    hold:[{h:'Exor (Agnelli)',pct:'63.8%',v:'EUR 638M'},{h:'Free Float',pct:'36.2%',v:'EUR 362M'}],
    hp:[{d:'30/03',adv:'Inter',pl:'0-1',vp:71.5,var:'-0.3%'},{d:'26/03',adv:'Napoli',pl:'2-2',vp:72.1,var:'+0.4%'},{d:'22/03',adv:'Roma',pl:'1-0',vp:73.2,var:'+1.1%'},{d:'18/03',adv:'Lazio',pl:'2-3',vp:72.8,var:'-1.8%'},{d:'14/03',adv:'Fiorentina',pl:'3-0',vp:73.5,var:'+2.2%'}],
    athletes:[
      {n:'Vlahovic',pos:'CA',vpi:74,pbi:25,kii:14,gols:16,ass:4,min:2600,sal:'EUR 12M/a',clause:'EUR 80M',contrato:'2026',inj:[{d:'20/02',l:'Púbis',dur:'30d'}]},
      {n:'Yildiz',pos:'PE',vpi:72,pbi:20,kii:11,gols:10,ass:9,min:2700,sal:'EUR 3M/a',clause:'EUR 100M',contrato:'2027',inj:[]},
      {n:'Locatelli',pos:'MC',vpi:68,pbi:24,kii:12,gols:4,ass:8,min:2800,sal:'EUR 5M/a',clause:'EUR 40M',contrato:'2027',inj:[]},
      {n:'Bremer',pos:'ZAG',vpi:76,pbi:14,kii:8,gols:2,ass:1,min:2900,sal:'EUR 8M/a',clause:'EUR 60M',contrato:'2028',inj:[{d:'15/09/25',l:'LCA',dur:'180d'}]},
      {n:'Di Gregorio',pos:'GOL',vpi:70,pbi:12,kii:7,gols:0,ass:0,min:2800,sal:'EUR 3M/a',clause:'EUR 30M',contrato:'2028',inj:[]}
    ]},
  BOT:{n:'Botafogo',tk:'BOT.BZ',liga:'BRA',vpi:75,pbi:21,kii:14,tdm:'RISING',goal:63,rating:'BUY',score:'A',chg:'+2.8%',chgN:2.8,val:'R$1.4B',
    founded:1894,stadium:'Nilton Santos',cap:46831,coach:'Renato Paiva',style:'SAF John Textor. Modelo europeu de gestão. Pressing alto, verticalidade. Campeão Libertadores 2024.',
    h2h_home:61,div:'R$190M',rev:'R$620M',ebitda:'R$165M',roe:'12.1%',
    sponsors:[{s:'LG',v:'R$30M/a',vig:'2026',t:'Master'},{s:'Reebok',v:'R$20M/a',vig:'2027',t:'Kit'}],
    hold:[{h:'John Textor (Eagle Football)',pct:'90%',v:'R$1.26B'},{h:'Outros',pct:'10%',v:'R$140M'}],
    hp:[{d:'30/03',adv:'Flamengo',pl:'2-1',vp:75.8,var:'+2.8%'},{d:'26/03',adv:'Vasco',pl:'3-0',vp:74.2,var:'+2.2%'},{d:'22/03',adv:'Fluminense',pl:'2-1',vp:73.1,var:'+1.5%'},{d:'18/03',adv:'Palmeiras',pl:'1-2',vp:72.5,var:'-1.2%'},{d:'14/03',adv:'São Paulo',pl:'3-1',vp:73.8,var:'+2.5%'}],
    athletes:[
      {n:'Savarino',pos:'PE',vpi:78,pbi:18,kii:11,gols:14,ass:10,min:2800,sal:'R$500K/m',clause:'EUR 25M',contrato:'2027',inj:[]},
      {n:'Igor Jesus',pos:'CA',vpi:74,pbi:20,kii:13,gols:16,ass:5,min:2600,sal:'R$400K/m',clause:'EUR 20M',contrato:'2028',inj:[]},
      {n:'Almada',pos:'MAE',vpi:76,pbi:19,kii:10,gols:8,ass:12,min:2750,sal:'R$550K/m',clause:'EUR 30M',contrato:'2026',inj:[]},
      {n:'Marlon Freitas',pos:'MC',vpi:72,pbi:21,kii:11,gols:5,ass:8,min:2900,sal:'R$350K/m',clause:'EUR 15M',contrato:'2027',inj:[]},
      {n:'John',pos:'GOL',vpi:74,pbi:11,kii:7,gols:0,ass:0,min:3060,sal:'R$300K/m',clause:'EUR 15M',contrato:'2027',inj:[]}
    ]},
  ALH:{n:'Al-Hilal',tk:'ALH.SA',liga:'SAU',vpi:82,pbi:20,kii:11,tdm:'ACTIVE',goal:68,rating:'BUY',score:'AA',chg:'+1.6%',chgN:1.6,val:'EUR 2.1B',
    founded:1957,stadium:'Al-Awwal Park',cap:47000,coach:'Jorge Jesus',style:'Recursos ilimitados do fundo soberano PIF. Neymar em recuperação. Milinkovic-Savic e Malcom como peças centrais.',
    h2h_home:65,div:'EUR 50M',rev:'EUR 520M',ebitda:'EUR 280M',roe:'21.5%',
    sponsors:[{s:'PIF (Saudi Arabia)',v:'Proprietário',vig:'—',t:'Fundo Soberano'},{s:'PUMA',v:'EUR 25M/a',vig:'2027',t:'Kit'}],
    hold:[{h:'Public Investment Fund (PIF)',pct:'100%',v:'EUR 2.1B'}],
    hp:[{d:'30/03',adv:'Al-Nassr',pl:'3-1',vp:82.5,var:'+1.6%'},{d:'26/03',adv:'Al-Ittihad',pl:'2-0',vp:81.2,var:'+1.1%'},{d:'22/03',adv:'Al-Ahli',pl:'4-1',vp:80.8,var:'+2.4%'},{d:'18/03',adv:'Al-Qadsiah',pl:'2-2',vp:80.1,var:'-0.5%'},{d:'14/03',adv:'Al-Shabab',pl:'3-0',vp:81.5,var:'+2.0%'}],
    athletes:[
      {n:'Malcom',pos:'PD',vpi:84,pbi:17,kii:9,gols:18,ass:12,min:2900,sal:'EUR 18M/a',clause:'EUR 100M',contrato:'2027',inj:[]},
      {n:'Milinkovic-Savic',pos:'MC',vpi:80,pbi:18,kii:10,gols:10,ass:14,min:2850,sal:'EUR 20M/a',clause:'EUR 80M',contrato:'2026',inj:[]},
      {n:'Neymar',pos:'PE',vpi:65,pbi:35,kii:22,gols:4,ass:6,min:1200,sal:'EUR 90M/a',clause:'EUR 200M',contrato:'2025',inj:[{d:'10/08/24',l:'LCA',dur:'180d'},{d:'20/03',l:'Tornozelo',dur:'14d'}]},
      {n:'Al-Dawsari',pos:'PE',vpi:76,pbi:19,kii:11,gols:12,ass:9,min:2700,sal:'EUR 8M/a',clause:'EUR 40M',contrato:'2026',inj:[]},
      {n:'Bounou',pos:'GOL',vpi:79,pbi:11,kii:6,gols:0,ass:0,min:3060,sal:'EUR 12M/a',clause:'EUR 30M',contrato:'2026',inj:[]}
    ]}

};

const COPA_GROUPS={
  A:{teams:['Brasil','México','Alemanha','Coreia do Sul']},
  B:{teams:['Argentina','França','Marrocos','Senegal']},
  C:{teams:['England','Espanha','Japão','Polônia']},
  D:{teams:['Portugal','Holanda','EUA','Equador']},
  E:{teams:['Itália','Croácia','Camarões','Canadá']},
  F:{teams:['Bélgica','Suíça','Gana','Austrália']},
  G:{teams:['Uruguai','Dinamarca','Irã','Costa Rica']},
  H:{teams:['Colômbia','Turquia','Tunísia','Arábia Saudita']},
};

const COPA_NATIONS={
  'Brasil':{code:'BRA',flag:'🇧🇷',vpi:88,pbi:16,kii:10,prob:22,rating:'AAA',coach:'Dorival Jr',style:'Transição rápida, alta pressão, talento individual máximo.',athletes:[
    {n:'Vinicius Jr',pos:'PE',vpi:91,pbi:12,clube:'Real Madrid',gols:8},
    {n:'Rodrygo',pos:'PD',vpi:83,pbi:18,clube:'Real Madrid',gols:5},
    {n:'Endrick',pos:'CA',vpi:80,pbi:15,clube:'Real Madrid',gols:6},
    {n:'L. Paquetá',pos:'MC',vpi:78,pbi:20,clube:'West Ham',gols:4},
    {n:'Raphinha',pos:'PE',vpi:76,pbi:22,clube:'Barcelona',gols:7},
    {n:'Alisson',pos:'GOL',vpi:84,pbi:10,clube:'Liverpool',gols:0},
  ]},
  'Argentina':{code:'ARG',flag:'🇦🇷',vpi:86,pbi:18,kii:9,prob:18,rating:'AAA',coach:'Scaloni',style:'Posse e contra-ataque. Defesa sólida. Campeã vigente.',athletes:[
    {n:'L. Messi',pos:'CAM',vpi:90,pbi:20,clube:'Inter Miami',gols:12},
    {n:'J. Álvarez',pos:'CA',vpi:82,pbi:18,clube:'Atlético de Madrid',gols:8},
    {n:'Di María',pos:'PD',vpi:75,pbi:28,clube:'Benfica',gols:3},
    {n:'Mac Allister',pos:'MC',vpi:80,pbi:19,clube:'Liverpool',gols:5},
    {n:'De Paul',pos:'MC',vpi:77,pbi:22,clube:'Atlético de Madrid',gols:3},
    {n:'E. Martínez',pos:'GOL',vpi:86,pbi:12,clube:'Aston Villa',gols:0},
  ]},
  'França':{code:'FRA',flag:'🇫🇷',vpi:85,pbi:19,kii:14,prob:16,rating:'AA+',coach:'Deschamps',style:'Profundidade de elenco excepcional. Equilíbrio tático.',athletes:[
    {n:'Mbappé',pos:'CA',vpi:88,pbi:18,clube:'Real Madrid',gols:10},
    {n:'Griezmann',pos:'CAM',vpi:80,pbi:24,clube:'Atletico Madrid',gols:6},
    {n:'Dembélé',pos:'PD',vpi:78,pbi:26,clube:'PSG',gols:5},
    {n:'Tchouaméni',pos:'MD',vpi:79,pbi:17,clube:'Real Madrid',gols:2},
    {n:'Camavinga',pos:'MC',vpi:77,pbi:18,clube:'Real Madrid',gols:2},
    {n:'Maignan',pos:'GOL',vpi:83,pbi:12,clube:'AC Milan',gols:0},
  ]},
  'England':{code:'ENG',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',vpi:82,pbi:21,kii:12,prob:12,rating:'AA',coach:'Southgate',style:'Alta intensidade, força física. Elenco jovem e promissor.',athletes:[
    {n:'Bellingham',pos:'MC',vpi:88,pbi:16,clube:'Real Madrid',gols:7},
    {n:'Kane',pos:'CA',vpi:85,pbi:22,clube:'Bayern',gols:9},
    {n:'Saka',pos:'PD',vpi:82,pbi:19,clube:'Arsenal',gols:6},
    {n:'Foden',pos:'PE',vpi:80,pbi:21,clube:'Man. City',gols:5},
    {n:'Trent',pos:'LD',vpi:76,pbi:18,clube:'Real Madrid',gols:3},
    {n:'Pickford',pos:'GOL',vpi:78,pbi:14,clube:'Everton',gols:0},
  ]},
  'Alemanha':{code:'GER',flag:'🇩🇪',vpi:80,pbi:22,kii:11,prob:10,rating:'AA',coach:'Nagelsmann',style:'Organização tática, pressing sistemático. Geração renovada.',athletes:[
    {n:'Musiala',pos:'CAM',vpi:86,pbi:17,clube:'Bayern',gols:8},
    {n:'Wirtz',pos:'CAM',vpi:84,pbi:18,clube:'Leverkusen',gols:7},
    {n:'Havertz',pos:'CA',vpi:78,pbi:22,clube:'Arsenal',gols:6},
    {n:'Kimmich',pos:'MD',vpi:82,pbi:20,clube:'Bayern',gols:4},
    {n:'Kroos',pos:'MC',vpi:80,pbi:26,clube:'Real Madrid',gols:3},
    {n:'Neuer',pos:'GOL',vpi:80,pbi:15,clube:'Bayern',gols:0},
  ]},
  'Espanha':{code:'ESP',flag:'🇪🇸',vpi:84,pbi:19,kii:10,prob:14,rating:'AA+',coach:'De la Fuente',style:'Tiki-taka evoluído. Yamal e Pedri lideram geração dourada.',athletes:[
    {n:'Lamine Yamal',pos:'PD',vpi:85,pbi:20,clube:'Barcelona',gols:9},
    {n:'Pedri',pos:'MC',vpi:78,pbi:30,clube:'Barcelona',gols:5},
    {n:'Morata',pos:'CA',vpi:76,pbi:25,clube:'Atletico Madrid',gols:7},
    {n:'Rodri',pos:'MD',vpi:86,pbi:18,clube:'Man. City',gols:3},
    {n:'Williams',pos:'PE',vpi:80,pbi:21,clube:'Athletic Bilbao',gols:6},
    {n:'Unai Simón',pos:'GOL',vpi:80,pbi:13,clube:'Athletic Bilbao',gols:0},
  ]},
  'Portugal':{code:'POR',flag:'🇵🇹',vpi:83,pbi:20,kii:13,prob:11,rating:'AA',coach:'R. Martínez',style:'Experiência e talento individual. C. Ronaldo como ativo histórico.',athletes:[
    {n:'C. Ronaldo',pos:'CA',vpi:82,pbi:24,clube:'Al Nassr',gols:11},
    {n:'B. Fernandes',pos:'CAM',vpi:81,pbi:20,clube:'Man. United',gols:7},
    {n:'Leão',pos:'PE',vpi:84,pbi:18,clube:'AC Milan',gols:8},
    {n:'Vitinha',pos:'MC',vpi:76,pbi:24,clube:'PSG',gols:3},
    {n:'Pepe',pos:'ZAG',vpi:68,pbi:30,clube:'Porto',gols:1},
    {n:'D. Costa',pos:'GOL',vpi:79,pbi:13,clube:'Porto',gols:0},
  ]},
  'México':{code:'MEX',flag:'🇲🇽',vpi:70,pbi:26,kii:16,prob:5,rating:'A',coach:'Aguirre',style:'País sede. Organização defensiva. Ataque variável.',athletes:[
    {n:'Lozano',pos:'PD',vpi:74,pbi:24,clube:'PSV',gols:5},
    {n:'Giménez',pos:'CA',vpi:76,pbi:22,clube:'Feyenoord',gols:8},
    {n:'Herrera',pos:'MC',vpi:70,pbi:28,clube:'Porto',gols:2},
    {n:'Álvarez GK',pos:'GOL',vpi:75,pbi:14,clube:'Chivas',gols:0},
    {n:'Moreno',pos:'PE',vpi:68,pbi:26,clube:'Atlético de Madrid',gols:3},
    {n:'Tecatito',pos:'PD',vpi:66,pbi:30,clube:'Sevilla',gols:2},
  ]},
};

const COPA_RANK=[
  {n:'Brasil',flag:'🇧🇷',prob:22,vpi:88,rating:'AAA'},
  {n:'Argentina',flag:'🇦🇷',prob:18,vpi:86,rating:'AAA'},
  {n:'França',flag:'🇫🇷',prob:16,vpi:85,rating:'AA+'},
  {n:'Espanha',flag:'🇪🇸',prob:14,vpi:84,rating:'AA+'},
  {n:'England',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',prob:12,vpi:82,rating:'AA'},
  {n:'Portugal',flag:'🇵🇹',prob:11,vpi:83,rating:'AA'},
  {n:'Alemanha',flag:'🇩🇪',prob:10,vpi:80,rating:'AA'},
  {n:'México',flag:'🇲🇽',prob:5,vpi:70,rating:'A'},
];

const NEWS=[
  {tag:'brk',txt:'LESÃO: Pedri (FCB.ES) confirmado fora — PBI 35%, impacto -12% VPI ofensivo',time:'09:14'},
  {tag:'ins',txt:'INSIDER: Vestiário Flamengo positivo — KII 12 mínimo histórico, moral elevada',time:'08:52'},
  {tag:'upd',txt:'ESCALAÇÃO: Vinicius Jr (RM.ES) titular — VPI 91%, PBI 12% FRESCO',time:'08:30'},
  {tag:'brk',txt:'TRANSFERÊNCIA: Leão (ACM.IT) 62% probabilidade saída — Premier reage',time:'08:10'},
  {tag:'rpt',txt:'SIT RESEARCH: Real Madrid AAA mantido — consistência 92% gramados secos',time:'07:55'},
  {tag:'ins',txt:'COPA 2026: Vinicius Jr lidera VPI — Brasil favorito no Grupo A',time:'07:40'},
  {tag:'upd',txt:'GRAMADO: San Siro seco — histórico +8% gols em condições idênticas',time:'07:20'},
  {tag:'rpt',txt:'H2H ANALYSIS: BRA × ARG — 14 confrontos, BRA 6V 5E 3D, VPI BRA +2.4pts',time:'07:00'},
];

const MAESTRO=[
  {tk:'RM.ES',r:'BUY',s:'AAA',d:'VPI 88, PBI 14 — Golden Cross iminente. Entrada forte.'},
  {tk:'FLA.BZ',r:'BUY',s:'AA',d:'KII 12, moral alta. Vantagem em casa confirmada.'},
  {tk:'ACM.IT',r:'BUY',s:'A+',d:'TDM RISING. Monitorar próximo ciclo.'},
  {tk:'PSG.FR',r:'HOLD',s:'A',d:'PBI 28%. Aguardar confirmação de escalação.'},
  {tk:'MCI.UK',r:'BUY',s:'AAA',d:'Haaland VPI 90%. Maquinaria Guardiola ativa.'},
  {tk:'FCB.ES',r:'SELL',s:'BB',d:'PBI crítico 35%. Pedri e Gavi ausentes.'},
];

const ANR_HISTORY = {
  'FLA':{
    calls:[
      {date:'06/04',r:'BUY',s:'AA',target:'VPI 82',analyst:'Maestro',note:'TDM Golden Cross confirmado. Pedro em boa fase. Entrada forte recomendada.'},
      {date:'22/03',r:'BUY',s:'AA',target:'VPI 80',analyst:'Maestro',note:'KII 12 — moral do vestiário em máxima histórica. Manter posição.'},
      {date:'08/03',r:'HOLD',s:'A+',target:'VPI 76',analyst:'Maestro',note:'PBI subindo para 22%. Monitorar fadiga do meio-campo.'},
      {date:'22/02',r:'BUY',s:'AA-',target:'VPI 78',analyst:'Maestro',note:'Vitória sobre Palmeiras confirma dominância. RSI 68 — zona neutra saudável.'},
    ],
    buy:3,hold:1,sell:0,
    pt_low:'VPI 74',pt_mid:'VPI 80',pt_high:'VPI 88',
    upside:'+12%',consensus:'BUY'
  },
  'RM':{
    calls:[
      {date:'05/04',r:'BUY',s:'AAA',target:'VPI 90',analyst:'Maestro',note:'Vinicius Jr em forma. Bernabéu factor confirmado. TDM ACTIVE.'},
      {date:'20/03',r:'BUY',s:'AAA',target:'VPI 88',analyst:'Maestro',note:'Ancelotti sistema funcionando. PBI 14% excelente para esta fase da temporada.'},
      {date:'05/03',r:'BUY',s:'AA+',target:'VPI 86',analyst:'Maestro',note:'Champions League momentum. Entrada agressiva confirmada.'},
    ],
    buy:3,hold:0,sell:0,
    pt_low:'VPI 84',pt_mid:'VPI 90',pt_high:'VPI 96',
    upside:'+8%',consensus:'BUY'
  },
  'FCB':{
    calls:[
      {date:'04/04',r:'SELL',s:'BB',target:'VPI 55',analyst:'Maestro',note:'Pedri e Gavi ausentes. PBI crítico 35%. Evitar até recuperação do elenco.'},
      {date:'18/03',r:'SELL',s:'BB',target:'VPI 58',analyst:'Maestro',note:'RSI 28 — sobrevendido mas sem catalisador de recuperação visível.'},
      {date:'02/03',r:'HOLD',s:'BBB',target:'VPI 65',analyst:'Maestro',note:'Aguardar retorno de Pedri. PBI elevado preocupa.'},
    ],
    buy:0,hold:1,sell:2,
    pt_low:'VPI 50',pt_mid:'VPI 60',pt_high:'VPI 68',
    upside:'-5%',consensus:'SELL'
  },
  'MCI':{
    calls:[
      {date:'05/04',r:'BUY',s:'AAA',target:'VPI 88',analyst:'Maestro',note:'Guardiola sistema + Haaland VPI 90%. Maquinaria inglesa em alta rotação.'},
      {date:'20/03',r:'BUY',s:'AAA',target:'VPI 86',analyst:'Maestro',note:'Premier League momentum. TDM ACTIVE.'},
    ],
    buy:2,hold:0,sell:0,
    pt_low:'VPI 80',pt_mid:'VPI 87',pt_high:'VPI 93',
    upside:'+7%',consensus:'BUY'
  },
  'ACM':{
    calls:[
      {date:'06/04',r:'BUY',s:'A+',target:'VPI 83',analyst:'Maestro',note:'TDM RISING. Leão em crescimento. Monitorar próximo ciclo de resultados.'},
      {date:'21/03',r:'HOLD',s:'A',target:'VPI 78',analyst:'Maestro',note:'Fase de transição tática. Aguardar consolidação do sistema.'},
    ],
    buy:1,hold:1,sell:0,
    pt_low:'VPI 74',pt_mid:'VPI 82',pt_high:'VPI 88',
    upside:'+10%',consensus:'BUY'
  },
  'PSG':{
    calls:[
      {date:'03/04',r:'HOLD',s:'A',target:'VPI 78',analyst:'Maestro',note:'PBI 28% — fadiga preocupante. Aguardar confirmação de escalação.'},
      {date:'17/03',r:'HOLD',s:'A',target:'VPI 76',analyst:'Maestro',note:'Transição pós-Mbappé ainda em curso. Manter posição neutra.'},
    ],
    buy:0,hold:2,sell:0,
    pt_low:'VPI 70',pt_mid:'VPI 78',pt_high:'VPI 84',
    upside:'+2%',consensus:'HOLD'
  },
};

const ECO_DATA = {
  macro:[
    {lbl:'SELIC',val:'13.75%',chg:'-0.25pp',chgN:-1,impact:'Alto',note:'Juros altos reduzem investimento em clubes'},
    {lbl:'IPCA (12m)',val:'4.83%',chg:'+0.12pp',chgN:1,impact:'Médio',note:'Inflação eleva custo de salários e operação'},
    {lbl:'PIB (a/a)',val:'+2.4%',chg:'+0.3pp',chgN:1,impact:'Baixo',note:'Crescimento sustenta consumo de ingressos'},
    {lbl:'DESEMPREGO',val:'7.8%',chg:'-0.4pp',chgN:-1,impact:'Médio',note:'Queda no desemprego aumenta renda disponível'},
    {lbl:'CÂMBIO USD/BRL',val:'5.15',chg:'+0.08',chgN:1,impact:'Alto',note:'Dólar alto valoriza atletas exportáveis'},
    {lbl:'IBOVESPA',val:'128.4k',chg:'+1.2%',chgN:1,impact:'Baixo',note:'Bolsa aquecida favorece captação de SAFs'},
    {lbl:'RISCO-PAÍS (CDS)',val:'178bps',chg:'-4bps',chgN:-1,impact:'Médio',note:'Queda atrai capital estrangeiro para clubes'},
    {lbl:'BALANÇA COMERC.',val:'USD 6.2B',chg:'+0.4B',chgN:1,impact:'Baixo',note:'Superávit sustenta Real no médio prazo'},
  ],
  forecast:[
    {ind:'SELIC FIM 2026',cons:'12.25%',min:'11.50%',max:'13.00%',trend:'↓'},
    {ind:'IPCA FIM 2026',cons:'3.80%',min:'3.20%',max:'4.50%',trend:'↓'},
    {ind:'USD/BRL FIM 2026',cons:'5.30',min:'4.90',max:'5.70',trend:'↑'},
    {ind:'PIB 2026',cons:'+2.1%',min:'+1.6%',max:'+2.8%',trend:'→'},
    {ind:'DESEMPREGO FIM 2026',cons:'7.2%',min:'6.8%',max:'7.8%',trend:'↓'},
  ],
  calendar:[
    {date:'10/04',event:'IPCA Março',prev:'4.71%',cons:'4.83%',impact:'alto'},
    {date:'16/04',event:'Reunião COPOM',prev:'13.75%',cons:'13.50%',impact:'alto'},
    {date:'18/04',event:'IGP-M Abril',prev:'0.22%',cons:'0.38%',impact:'médio'},
    {date:'24/04',event:'PNAD Contínua',prev:'7.8%',cons:'7.7%',impact:'médio'},
    {date:'30/04',event:'PIB Flash Q1',prev:'+2.1%',cons:'+2.3%',impact:'alto'},
    {date:'05/05',event:'Taxa de Desemprego EUA',prev:'3.7%',cons:'3.8%',impact:'médio'},
    {date:'14/05',event:'FOMC Minutes',prev:'—',cons:'—',impact:'alto'},
  ],
  commod:[
    {nm:'DIREITOS TV GLOB.',val:'R$5.2B',chg:'+8%',chgN:1,note:'CBF · renovação 2026-2030'},
    {nm:'LICENÇ. FIFA WC 2026',val:'USD 48B',chg:'+22%',chgN:1,note:'Maior edição da história'},
    {nm:'DIREITOS STREAMING',val:'USD 2.1B',chg:'+34%',chgN:1,note:'Amazon/Apple· crescimento digital'},
    {nm:'PATROCÍNIO MASTER',val:'R$180M/a',chg:'+12%',chgN:1,note:'Média Série A 2026'},
    {nm:'VALOR JOGADOR BRA',val:'€42M',chg:'+15%',chgN:1,note:'Mediana top-10 Transfermarkt'},
    {nm:'COTA LIBERTADORES',val:'USD 23M',chg:'+5%',chgN:1,note:'Campeão · CONMEBOL 2026'},
  ]
};

const FX_BASE = {
  'USD/BRL':{rate:5.15,prev:5.07,lo:4.92,hi:5.28,flag:'🇺🇸🇧🇷'},
  'EUR/BRL':{rate:5.63,prev:5.58,lo:5.40,hi:5.80,flag:'🇪🇺🇧🇷'},
  'EUR/USD':{rate:1.093,prev:1.101,lo:1.072,hi:1.115,flag:'🇪🇺🇺🇸'},
  'GBP/BRL':{rate:6.51,prev:6.44,lo:6.20,hi:6.70,flag:'🇬🇧🇧🇷'},
  'GBP/USD':{rate:1.265,prev:1.271,lo:1.240,hi:1.290,flag:'🇬🇧🇺🇸'},
  'CHF/BRL':{rate:5.78,prev:5.72,lo:5.55,hi:5.95,flag:'🇨🇭🇧🇷'},
};

// ── Export ──────────────────────────────────────────────
if (typeof window !== "undefined") {
  window.SIT_DB = { DB, COPA_GROUPS, COPA_NATIONS, COPA_RANK, NEWS, MAESTRO, ANR_HISTORY, ECO_DATA, FX_BASE };
}
