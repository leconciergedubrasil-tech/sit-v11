// ═══════════════════════════════════════════════════════════
// sit-db.js — SIT v11 · Data Layer
// Times + Atletas + Copa 2026 + Seleções completas
// © 2026 Cardinal Protocol — Confidencial
// ═══════════════════════════════════════════════════════════
'use strict';

// ── TIMES (clubes) ────────────────────────────────────────
const DB = {

  FLA:{
    n:'Flamengo',tk:'FLA.BZ',liga:'BRA',vpi:78,pbi:18,kii:12,tdm:'GOLDEN',
    rating:'BUY',score:'AA',chg:'+1.8%',chgN:1.8,val:'R$2.8B',
    founded:1895,stadium:'Maracanã',cap:78838,coach:'Tite',
    style:'4-3-3 com alta pressão ofensiva. Transição rápida verticalizando por Pedro e Wesley. Arrascaeta como pivô criativo central.',
    rev:'R$1.2B',ebitda:'R$350M',roe:'22.5%',
    sponsors:[
      {s:'Pixbet',v:'R$45M/a',vig:'2026',t:'Master'},
      {s:'Adidas',v:'R$35M/a',vig:'2028',t:'Material'},
      {s:'BRB',v:'R$15M/a',vig:'2027',t:'Manga'},
      {s:'Vivo',v:'R$12M/a',vig:'2026',t:'Telecomunicações'},
    ],
    hold:[
      {h:'Associação Flamengo',pct:'100%',v:'R$2.8B'},
    ],
    hp:[
      {d:'28/04',adv:'Palmeiras',pl:'2-1',vp:79.2,var:'+1.8%'},
      {d:'24/04',adv:'Corinthians',pl:'3-0',vp:78.5,var:'+2.1%'},
      {d:'20/04',adv:'São Paulo',pl:'1-1',vp:76.8,var:'-0.5%'},
      {d:'16/04',adv:'Vasco',pl:'4-1',vp:77.4,var:'+3.2%'},
      {d:'12/04',adv:'Botafogo',pl:'2-2',vp:74.9,var:'-1.2%'},
      {d:'08/04',adv:'Atlético-MG',pl:'1-0',vp:76.1,var:'+1.5%'},
      {d:'04/04',adv:'Grêmio',pl:'3-1',vp:77.8,var:'+2.4%'},
    ],
    athletes:[
      {n:'Pedro',pos:'CA',vpi:84,pbi:14,kii:10,gols:21,ass:8,min:2980,nat:'Brasil',age:27,
       sal:'R$1.2M/m',clause:'€120M',ctr:'2027',
       vel:82,tec:85,fis:88,men:86,tat:80,cri:90,
       inj:[{d:'15/03',l:'Tornozelo',dur:'5d'}],
       bio:'Artilheiro nato. Cabeceador excepcional, finalização clínica.',
       matches:[{d:'28/04',adv:'Palmeiras',pl:'2-1',g:1,a:0,v:84,nota:8.2},{d:'24/04',adv:'Corinthians',pl:'3-0',g:2,a:1,v:86,nota:9.1},{d:'20/04',adv:'São Paulo',pl:'1-1',g:0,a:0,v:75,nota:6.8},{d:'16/04',adv:'Vasco',pl:'4-1',g:2,a:0,v:82,nota:8.5},{d:'12/04',adv:'Botafogo',pl:'2-2',g:1,a:0,v:78,nota:7.2}]},
      {n:'Arrascaeta',pos:'MAE',vpi:79,pbi:16,kii:9,gols:10,ass:14,min:2780,nat:'Uruguai',age:30,
       sal:'R$900K/m',clause:'€50M',ctr:'2028',
       vel:76,tec:90,fis:72,men:88,tat:85,cri:82,
       inj:[],
       bio:'Maestro criativo. Melhor passador do elenco. Visão de jogo excepcional.',
       matches:[{d:'28/04',adv:'Palmeiras',pl:'2-1',g:0,a:1,v:80,nota:8.0},{d:'24/04',adv:'Corinthians',pl:'3-0',g:1,a:2,v:82,nota:8.8},{d:'20/04',adv:'São Paulo',pl:'1-1',g:0,a:0,v:72,nota:6.5},{d:'16/04',adv:'Vasco',pl:'4-1',g:1,a:1,v:81,nota:8.3},{d:'12/04',adv:'Botafogo',pl:'2-2',g:0,a:1,v:76,nota:7.0}]},
      {n:'Gerson',pos:'MC',vpi:74,pbi:19,kii:8,gols:5,ass:10,min:2820,nat:'Brasil',age:27,
       sal:'R$750K/m',clause:'€40M',ctr:'2027',
       vel:74,tec:82,fis:84,men:80,tat:86,cri:76,
       inj:[],
       bio:'Motor do meio-campo. Recuperação de bola e lançamentos longos.',
       matches:[{d:'28/04',adv:'Palmeiras',pl:'2-1',g:0,a:0,v:75,nota:7.2},{d:'24/04',adv:'Corinthians',pl:'3-0',g:1,a:1,v:76,nota:7.8},{d:'20/04',adv:'São Paulo',pl:'1-1',g:0,a:0,v:70,nota:6.8},{d:'16/04',adv:'Vasco',pl:'4-1',g:0,a:1,v:74,nota:7.5},{d:'12/04',adv:'Botafogo',pl:'2-2',g:1,a:0,v:72,nota:7.0}]},
      {n:'De La Cruz',pos:'MAE',vpi:72,pbi:22,kii:11,gols:6,ass:9,min:2350,nat:'Uruguai',age:27,
       sal:'R$700K/m',clause:'€35M',ctr:'2027',
       vel:78,tec:84,fis:74,men:76,tat:80,cri:78,
       inj:[{d:'10/03',l:'Muscular',dur:'8d'}],
       bio:'Criatividade e drible. Parceria natural com Arrascaeta.',
       matches:[{d:'28/04',adv:'Palmeiras',pl:'2-1',g:1,a:0,v:74,nota:7.5},{d:'24/04',adv:'Corinthians',pl:'3-0',g:0,a:1,v:73,nota:7.2},{d:'16/04',adv:'Vasco',pl:'4-1',g:1,a:2,v:76,nota:8.0},{d:'12/04',adv:'Botafogo',pl:'2-2',g:0,a:0,v:68,nota:6.5}]},
      {n:'Wesley',pos:'PD',vpi:73,pbi:18,kii:13,gols:7,ass:11,min:2550,nat:'Brasil',age:21,
       sal:'R$500K/m',clause:'€25M',ctr:'2028',
       vel:92,tec:76,fis:86,men:74,tat:72,cri:78,
       inj:[],
       bio:'Ponta explosivo. Velocidade excepcional. Em ascensão.',
       matches:[{d:'28/04',adv:'Palmeiras',pl:'2-1',g:0,a:1,v:74,nota:7.6},{d:'24/04',adv:'Corinthians',pl:'3-0',g:1,a:0,v:75,nota:7.8},{d:'20/04',adv:'São Paulo',pl:'1-1',g:0,a:0,v:68,nota:6.5},{d:'16/04',adv:'Vasco',pl:'4-1',g:1,a:1,v:76,nota:8.2},{d:'12/04',adv:'Botafogo',pl:'2-2',g:0,a:0,v:70,nota:7.0}]},
      {n:'Léo Ortiz',pos:'ZAG',vpi:70,pbi:15,kii:7,gols:2,ass:1,min:2900,nat:'Brasil',age:28,
       sal:'R$400K/m',clause:'€20M',ctr:'2027',
       vel:72,tec:74,fis:88,men:82,tat:84,cri:70,
       inj:[],
       bio:'Zagueiro robusto. Liderança defensiva. Bom no aéreo.',
       matches:[{d:'28/04',adv:'Palmeiras',pl:'2-1',g:0,a:0,v:71,nota:7.3},{d:'24/04',adv:'Corinthians',pl:'3-0',g:0,a:0,v:72,nota:7.5},{d:'20/04',adv:'São Paulo',pl:'1-1',g:0,a:0,v:68,nota:6.8},{d:'16/04',adv:'Vasco',pl:'4-1',g:0,a:0,v:74,nota:7.8}]},
      {n:'Gabigol',pos:'CA',vpi:70,pbi:24,kii:14,gols:8,ass:4,min:1800,nat:'Brasil',age:28,
       sal:'R$800K/m',clause:'€60M',ctr:'2026',
       vel:80,tec:80,fis:76,men:70,tat:74,cri:82,
       inj:[{d:'05/08/25',l:'Fratura mão',dur:'21d'}],
       bio:'Ídolo histórico. PBI em alta. Contrato vencendo.',
       matches:[{d:'28/04',adv:'Palmeiras',pl:'2-1',g:0,a:0,v:70,nota:6.8},{d:'16/04',adv:'Vasco',pl:'4-1',g:2,a:0,v:78,nota:8.5}]},
      {n:'Rossi',pos:'GOL',vpi:76,pbi:12,kii:6,gols:0,ass:0,min:3060,nat:'Argentina',age:26,
       sal:'R$350K/m',clause:'€30M',ctr:'2028',
       vel:60,tec:84,fis:82,men:86,tat:84,cri:80,
       inj:[],
       bio:'Goleiro consistente. Reflexos rápidos. Sólido na saída de bola.',
       matches:[{d:'28/04',adv:'Palmeiras',pl:'2-1',g:0,a:0,v:76,nota:7.8},{d:'24/04',adv:'Corinthians',pl:'3-0',g:0,a:0,v:78,nota:8.0},{d:'20/04',adv:'São Paulo',pl:'1-1',g:0,a:0,v:72,nota:7.2}]},
    ]
  },

  RM:{
    n:'Real Madrid',tk:'RM.ES',liga:'ESP',vpi:88,pbi:14,kii:8,tdm:'ACTIVE',
    rating:'BUY',score:'AAA',chg:'+2.1%',chgN:2.1,val:'EUR 8.5B',
    founded:1902,stadium:'Santiago Bernabéu',cap:81044,coach:'Carlo Ancelotti',
    style:'Transição ultrarrápida. Vinicius e Mbappé como vetores ofensivos. Pressing alto em casa, bloco médio fora.',
    rev:'EUR 831M',ebitda:'EUR 320M',roe:'18.2%',
    sponsors:[{s:'Adidas',v:'EUR 120M/a',vig:'2028',t:'Kit'},{s:'Emirates',v:'EUR 70M/a',vig:'2026',t:'Naming'},{s:'HP',v:'EUR 40M/a',vig:'2027',t:'Tech'}],
    hold:[{h:'Socios Real Madrid',pct:'100%',v:'EUR 8.5B'}],
    hp:[
      {d:'28/04',adv:'Barcelona',pl:'3-1',vp:89.2,var:'+2.1%'},
      {d:'24/04',adv:'Atletico',pl:'2-0',vp:87.5,var:'+1.5%'},
      {d:'20/04',adv:'Sevilla',pl:'4-0',vp:86.8,var:'+3.2%'},
      {d:'16/04',adv:'Villarreal',pl:'2-2',vp:84.9,var:'-0.8%'},
      {d:'12/04',adv:'Betis',pl:'3-1',vp:86.1,var:'+1.9%'},
      {d:'08/04',adv:'Getafe',pl:'2-0',vp:85.5,var:'+1.2%'},
      {d:'04/04',adv:'Valencia',pl:'1-0',vp:84.2,var:'+0.7%'},
    ],
    athletes:[
      {n:'Vinicius Jr',pos:'PE',vpi:92,pbi:11,kii:7,gols:24,ass:15,min:3100,nat:'Brasil',age:24,
       sal:'EUR 20M/a',clause:'EUR 1B',ctr:'2027',
       vel:97,tec:88,fis:86,men:88,tat:80,cri:90,
       inj:[],bio:'Melhor jogador do mundo. Velocidade e drible únicos.',
       matches:[{d:'28/04',adv:'Barcelona',pl:'3-1',g:2,a:1,v:92,nota:9.5},{d:'24/04',adv:'Atletico',pl:'2-0',g:1,a:0,v:90,nota:9.0},{d:'20/04',adv:'Sevilla',pl:'4-0',g:2,a:1,v:91,nota:9.2},{d:'16/04',adv:'Villarreal',pl:'2-2',g:0,a:1,v:86,nota:8.0}]},
      {n:'Mbappé',pos:'CA',vpi:88,pbi:17,kii:10,gols:26,ass:9,min:2950,nat:'França',age:26,
       sal:'EUR 25M/a',clause:'EUR 1B',ctr:'2029',
       vel:96,tec:86,fis:88,men:84,tat:82,cri:88,
       inj:[{d:'10/02',l:'Coxa',dur:'8d'}],bio:'Velocidade e gol. Maior salário do clube.',
       matches:[{d:'28/04',adv:'Barcelona',pl:'3-1',g:1,a:0,v:88,nota:8.8},{d:'24/04',adv:'Atletico',pl:'2-0',g:1,a:1,v:87,nota:8.5},{d:'20/04',adv:'Sevilla',pl:'4-0',g:2,a:0,v:89,nota:9.0}]},
      {n:'Bellingham',pos:'MC',vpi:89,pbi:15,kii:9,gols:20,ass:12,min:3050,nat:'Inglaterra',age:21,
       sal:'EUR 18M/a',clause:'EUR 900M',ctr:'2029',
       vel:84,tec:88,fis:90,men:92,tat:88,cri:88,
       inj:[],bio:'Completo. Gol, assistência e liderança. Melhor do meio-campo mundial.',
       matches:[{d:'28/04',adv:'Barcelona',pl:'3-1',g:0,a:1,v:89,nota:9.0},{d:'24/04',adv:'Atletico',pl:'2-0',g:0,a:1,v:87,nota:8.5},{d:'20/04',adv:'Sevilla',pl:'4-0',g:1,a:2,v:90,nota:9.2}]},
      {n:'Valverde',pos:'MD',vpi:82,pbi:19,kii:8,gols:9,ass:10,min:2850,nat:'Uruguai',age:25,
       sal:'EUR 12M/a',clause:'EUR 500M',ctr:'2028',
       vel:86,tec:82,fis:92,men:84,tat:84,cri:80,
       inj:[],bio:'Motor físico. Cobre todo o campo. Gols importantes.',
       matches:[{d:'28/04',adv:'Barcelona',pl:'3-1',g:0,a:0,v:82,nota:8.0},{d:'24/04',adv:'Atletico',pl:'2-0',g:0,a:0,v:80,nota:7.8}]},
      {n:'Rüdiger',pos:'ZAG',vpi:74,pbi:14,kii:7,gols:2,ass:1,min:2950,nat:'Alemanha',age:31,
       sal:'EUR 10M/a',clause:'EUR 80M',ctr:'2027',
       vel:78,tec:74,fis:90,men:86,tat:82,cri:72,
       inj:[],bio:'Liderança defensiva. Sólido e consistente.',
       matches:[{d:'28/04',adv:'Barcelona',pl:'3-1',g:0,a:0,v:74,nota:7.5}]},
      {n:'Courtois',pos:'GOL',vpi:86,pbi:10,kii:6,gols:0,ass:0,min:2700,nat:'Bélgica',age:32,
       sal:'EUR 15M/a',clause:'EUR 100M',ctr:'2026',
       vel:65,tec:88,fis:86,men:90,tat:88,cri:86,
       inj:[{d:'01/09/25',l:'LCA joelho',dur:'120d'}],bio:'Melhor goleiro do mundo quando em forma.',
       matches:[{d:'28/04',adv:'Barcelona',pl:'3-1',g:0,a:0,v:86,nota:8.8}]},
    ]
  },

  FCB:{
    n:'FC Barcelona',tk:'FCB.ES',liga:'ESP',vpi:62,pbi:33,kii:22,tdm:'N/A',
    rating:'SELL',score:'BB',chg:'-0.5%',chgN:-0.5,val:'EUR 5.1B',
    founded:1899,stadium:'Spotify Camp Nou',cap:99354,coach:'Hansi Flick',
    style:'Tiki-taka moderno. Alta posse. PBI crítico compromete continuidade. Yamal como ativo de futuro.',
    rev:'EUR 765M',ebitda:'EUR 180M',roe:'8.5%',
    sponsors:[{s:'Spotify',v:'EUR 60M/a',vig:'2026',t:'Naming'},{s:'Nike',v:'EUR 105M/a',vig:'2028',t:'Kit'}],
    hold:[{h:'Socios FC Barcelona',pct:'100%',v:'EUR 5.1B'}],
    hp:[
      {d:'28/04',adv:'Real Madrid',pl:'1-3',vp:61.2,var:'-1.8%'},
      {d:'24/04',adv:'Atletico',pl:'2-2',vp:63.4,var:'+0.5%'},
      {d:'20/04',adv:'Sevilla',pl:'3-1',vp:64.8,var:'+1.2%'},
      {d:'16/04',adv:'Valencia',pl:'1-2',vp:62.5,var:'-2.1%'},
      {d:'12/04',adv:'Villarreal',pl:'2-1',vp:63.9,var:'+0.8%'},
    ],
    athletes:[
      {n:'Lamine Yamal',pos:'PD',vpi:78,pbi:18,kii:12,gols:16,ass:18,min:2900,nat:'Espanha',age:17,
       sal:'EUR 10M/a',clause:'EUR 1B',ctr:'2027',
       vel:90,tec:88,fis:76,men:80,tat:76,cri:84,
       inj:[],bio:'Prodígio de 17 anos. Melhor do Barcelona. Futuro do futebol mundial.',
       matches:[{d:'28/04',adv:'Real Madrid',pl:'1-3',g:1,a:0,v:78,nota:7.8},{d:'24/04',adv:'Atletico',pl:'2-2',g:1,a:1,v:80,nota:8.2}]},
      {n:'Pedri',pos:'MC',vpi:62,pbi:34,kii:20,gols:7,ass:10,min:1850,nat:'Espanha',age:22,
       sal:'EUR 12M/a',clause:'EUR 1B',ctr:'2026',
       vel:76,tec:90,fis:68,men:82,tat:86,cri:80,
       inj:[{d:'15/03',l:'Tornozelo',dur:'14d'},{d:'01/11/25',l:'Joelho',dur:'30d'}],
       bio:'Talento excecional mas PBI crítico. Histórico de lesões preocupa.',
       matches:[{d:'24/04',adv:'Atletico',pl:'2-2',g:0,a:1,v:65,nota:7.0}]},
      {n:'Gavi',pos:'MC',vpi:60,pbi:36,kii:24,gols:3,ass:7,min:1650,nat:'Espanha',age:20,
       sal:'EUR 12M/a',clause:'EUR 1B',ctr:'2026',
       vel:78,tec:84,fis:70,men:80,tat:82,cri:78,
       inj:[{d:'20/03',l:'Músculo',dur:'10d'}],bio:'PBI mais alto do elenco. Risco operacional elevado.',
       matches:[{d:'24/04',adv:'Atletico',pl:'2-2',g:1,a:0,v:62,nota:7.2}]},
      {n:'Raphinha',pos:'PE',vpi:72,pbi:24,kii:16,gols:12,ass:10,min:2750,nat:'Brasil',age:27,
       sal:'EUR 10M/a',clause:'EUR 200M',ctr:'2027',
       vel:86,tec:80,fis:80,men:76,tat:74,cri:80,
       inj:[],bio:'Consistente. Melhor atleta disponível do elenco atual.',
       matches:[{d:'28/04',adv:'Real Madrid',pl:'1-3',g:0,a:1,v:72,nota:7.2},{d:'24/04',adv:'Atletico',pl:'2-2',g:1,a:0,v:74,nota:7.5}]},
      {n:'Lewandowski',pos:'CA',vpi:68,pbi:28,kii:18,gols:19,ass:6,min:2650,nat:'Polônia',age:36,
       sal:'EUR 18M/a',clause:'EUR 200M',ctr:'2025',
       vel:72,tec:84,fis:74,men:82,tat:80,cri:86,
       inj:[],bio:'Ainda eficiente mas declínio físico evidente. Contrato terminando.',
       matches:[{d:'28/04',adv:'Real Madrid',pl:'1-3',g:1,a:0,v:68,nota:6.8}]},
    ]
  },

  MCI:{
    n:'Manchester City',tk:'MCI.UK',liga:'UK',vpi:86,pbi:16,kii:9,tdm:'ACTIVE',
    rating:'BUY',score:'AAA',chg:'+1.5%',chgN:1.5,val:'EUR 4.8B',
    founded:1880,stadium:'Etihad Stadium',cap:53400,coach:'Pep Guardiola',
    style:'Posse total. Pressing alto. Sistema Guardiola ao máximo. Haaland como finalizador clínico.',
    rev:'EUR 715M',ebitda:'EUR 280M',roe:'16.8%',
    sponsors:[{s:'Puma',v:'EUR 65M/a',vig:'2027',t:'Kit'},{s:'Etihad',v:'EUR 67.5M/a',vig:'2026',t:'Naming'}],
    hold:[{h:'Abu Dhabi United Group',pct:'78%',v:'EUR 3.7B'},{h:'Silver Lake',pct:'12%',v:'EUR 576M'}],
    hp:[
      {d:'28/04',adv:'Arsenal',pl:'2-1',vp:87.2,var:'+1.5%'},
      {d:'24/04',adv:'Chelsea',pl:'3-0',vp:86.5,var:'+2.0%'},
      {d:'20/04',adv:'Liverpool',pl:'1-1',vp:84.8,var:'-0.5%'},
      {d:'16/04',adv:'Man. United',pl:'3-1',vp:85.9,var:'+2.2%'},
      {d:'12/04',adv:'Tottenham',pl:'4-0',vp:87.0,var:'+3.1%'},
    ],
    athletes:[
      {n:'Haaland',pos:'CA',vpi:92,pbi:13,kii:8,gols:32,ass:6,min:2950,nat:'Noruega',age:24,
       sal:'EUR 20M/a',clause:'EUR 200M',ctr:'2027',
       vel:88,tec:82,fis:96,men:88,tat:80,cri:94,
       inj:[],bio:'Máquina de gols. Record de artilharia Premier League.',
       matches:[{d:'28/04',adv:'Arsenal',pl:'2-1',g:1,a:0,v:90,nota:9.0},{d:'24/04',adv:'Chelsea',pl:'3-0',g:2,a:0,v:92,nota:9.5}]},
      {n:'De Bruyne',pos:'MAE',vpi:88,pbi:18,kii:8,gols:8,ass:18,min:2600,nat:'Bélgica',age:33,
       sal:'EUR 20M/a',clause:'EUR 150M',ctr:'2025',
       vel:80,tec:94,fis:80,men:92,tat:94,cri:88,
       inj:[{d:'10/01',l:'Isquio',dur:'25d'}],bio:'Melhor meia criativo da Premier League.',
       matches:[{d:'28/04',adv:'Arsenal',pl:'2-1',g:0,a:1,v:88,nota:8.8}]},
      {n:'Rodri',pos:'MD',vpi:90,pbi:14,kii:7,gols:5,ass:8,min:3000,nat:'Espanha',age:28,
       sal:'EUR 15M/a',clause:'EUR 400M',ctr:'2027',
       vel:76,tec:88,fis:88,men:94,tat:96,cri:84,
       inj:[],bio:'Bola de Ouro 2024. Melhor volante do mundo.',
       matches:[{d:'28/04',adv:'Arsenal',pl:'2-1',g:0,a:1,v:90,nota:9.2},{d:'24/04',adv:'Chelsea',pl:'3-0',g:0,a:0,v:88,nota:8.8}]},
      {n:'Bernardo Silva',pos:'MD',vpi:82,pbi:17,kii:9,gols:7,ass:11,min:2800,nat:'Portugal',age:29,
       sal:'EUR 12M/a',clause:'EUR 200M',ctr:'2026',
       vel:82,tec:88,fis:82,men:86,tat:88,cri:82,
       inj:[],bio:'Completo. Pressing e qualidade técnica.',
       matches:[{d:'28/04',adv:'Arsenal',pl:'2-1',g:1,a:0,v:82,nota:8.0}]},
      {n:'Ederson',pos:'GOL',vpi:84,pbi:10,kii:6,gols:0,ass:0,min:3060,nat:'Brasil',age:30,
       sal:'EUR 12M/a',clause:'EUR 80M',ctr:'2026',
       vel:62,tec:84,fis:86,men:88,tat:86,cri:84,
       inj:[],bio:'Goleiro-líbero. Saída de bola diferenciada.',
       matches:[{d:'28/04',adv:'Arsenal',pl:'2-1',g:0,a:0,v:84,nota:8.2}]},
    ]
  },

  PSG:{
    n:'Paris Saint-Germain',tk:'PSG.FR',liga:'FRA',vpi:76,pbi:26,kii:15,tdm:'STABLE',
    rating:'HOLD',score:'A',chg:'+0.3%',chgN:0.3,val:'EUR 4.2B',
    founded:1970,stadium:'Parc des Princes',cap:47929,coach:'Luis Enrique',
    style:'Pós-Mbappé. Reconstrução com Dembélé como líder. Pressing alto mas inconsistente.',
    rev:'EUR 756M',ebitda:'EUR 240M',roe:'12.1%',
    sponsors:[{s:'Nike',v:'EUR 80M/a',vig:'2032',t:'Kit'},{s:'QTA',v:'EUR 55M/a',vig:'2027',t:'Qatar Tourism'}],
    hold:[{h:'QSI (Qatar)',pct:'100%',v:'EUR 4.2B'}],
    hp:[
      {d:'28/04',adv:'Marseille',pl:'2-1',vp:77.2,var:'+0.8%'},
      {d:'24/04',adv:'Lyon',pl:'3-1',vp:76.8,var:'+1.2%'},
      {d:'20/04',adv:'Monaco',pl:'0-1',vp:73.5,var:'-2.4%'},
      {d:'16/04',adv:'Lille',pl:'2-0',vp:76.0,var:'+1.5%'},
      {d:'12/04',adv:'Nice',pl:'1-1',vp:74.2,var:'-0.5%'},
    ],
    athletes:[
      {n:'Dembélé',pos:'PD',vpi:80,pbi:24,kii:14,gols:14,ass:12,min:2700,nat:'França',age:27,
       sal:'EUR 12M/a',clause:'EUR 150M',ctr:'2028',
       vel:92,tec:84,fis:78,men:74,tat:72,cri:80,
       inj:[{d:'05/03',l:'Muscular',dur:'7d'}],bio:'Novo líder após saída de Mbappé. Inconsistente mas decisivo.',
       matches:[{d:'28/04',adv:'Marseille',pl:'2-1',g:1,a:0,v:80,nota:8.0}]},
      {n:'Vitinha',pos:'MC',vpi:76,pbi:22,kii:12,gols:6,ass:10,min:2800,nat:'Portugal',age:24,
       sal:'EUR 8M/a',clause:'EUR 100M',ctr:'2027',
       vel:78,tec:86,fis:78,men:82,tat:84,cri:78,
       inj:[],bio:'Motor do meio-campo. Técnica refinada.',
       matches:[{d:'28/04',adv:'Marseille',pl:'2-1',g:0,a:1,v:76,nota:7.6}]},
      {n:'Marquinhos',pos:'ZAG',vpi:78,pbi:16,kii:8,gols:3,ass:2,min:2900,nat:'Brasil',age:30,
       sal:'EUR 10M/a',clause:'EUR 60M',ctr:'2027',
       vel:74,tec:80,fis:84,men:90,tat:88,cri:76,
       inj:[],bio:'Capitão. Liderança e experiência.',
       matches:[{d:'28/04',adv:'Marseille',pl:'2-1',g:0,a:0,v:78,nota:7.8}]},
      {n:'Donnarumma',pos:'GOL',vpi:82,pbi:10,kii:7,gols:0,ass:0,min:3060,nat:'Itália',age:26,
       sal:'EUR 12M/a',clause:'EUR 80M',ctr:'2026',
       vel:62,tec:86,fis:88,men:86,tat:84,cri:84,
       inj:[],bio:'Um dos melhores goleiros da Europa.',
       matches:[{d:'28/04',adv:'Marseille',pl:'2-1',g:0,a:0,v:82,nota:8.0}]},
    ]
  },

  BAY:{
    n:'Bayern München',tk:'BAY.DE',liga:'GER',vpi:82,pbi:20,kii:10,tdm:'ACTIVE',
    rating:'BUY',score:'AA+',chg:'+1.8%',chgN:1.8,val:'EUR 4.5B',
    founded:1900,stadium:'Allianz Arena',cap:75024,coach:'Vincent Kompany',
    style:'Pressing intenso e posse. Kane como finalizador. Transição para era pós-Lewandowski consolidada.',
    rev:'EUR 853M',ebitda:'EUR 290M',roe:'15.5%',
    sponsors:[{s:'Adidas',v:'EUR 60M/a',vig:'2027',t:'Kit'},{s:'Allianz',v:'EUR 60M/a',vig:'2027',t:'Naming'},{s:'Telekom',v:'EUR 35M/a',vig:'2026',t:'Master'}],
    hold:[{h:'FC Bayern e.V.',pct:'100%',v:'EUR 4.5B'}],
    hp:[
      {d:'28/04',adv:'Dortmund',pl:'3-0',vp:83.5,var:'+2.1%'},
      {d:'24/04',adv:'Leverkusen',pl:'2-1',vp:82.8,var:'+1.5%'},
      {d:'20/04',adv:'Leipzig',pl:'1-1',vp:80.2,var:'-0.4%'},
      {d:'16/04',adv:'Frankfurt',pl:'4-1',vp:83.0,var:'+3.0%'},
      {d:'12/04',adv:'Stuttgart',pl:'2-0',vp:81.5,var:'+1.2%'},
    ],
    athletes:[
      {n:'Kane',pos:'CA',vpi:88,pbi:18,kii:9,gols:28,ass:8,min:3050,nat:'Inglaterra',age:31,
       sal:'EUR 18M/a',clause:'EUR 100M',ctr:'2027',
       vel:78,tec:86,fis:86,men:90,tat:88,cri:92,
       inj:[],bio:'Artilheiro histórico. Líder ofensivo do Bayern.',
       matches:[{d:'28/04',adv:'Dortmund',pl:'3-0',g:2,a:1,v:88,nota:9.0}]},
      {n:'Musiala',pos:'CAM',vpi:86,pbi:16,kii:8,gols:18,ass:14,min:2850,nat:'Alemanha',age:21,
       sal:'EUR 15M/a',clause:'EUR 400M',ctr:'2026',
       vel:88,tec:90,fis:80,men:82,tat:82,cri:86,
       inj:[],bio:'Prodígio alemão. Técnica excepcional.',
       matches:[{d:'28/04',adv:'Dortmund',pl:'3-0',g:1,a:1,v:86,nota:8.8}]},
      {n:'Kimmich',pos:'MD',vpi:82,pbi:19,kii:8,gols:6,ass:12,min:2900,nat:'Alemanha',age:29,
       sal:'EUR 18M/a',clause:'EUR 200M',ctr:'2025',
       vel:78,tec:88,fis:86,men:90,tat:92,cri:82,
       inj:[],bio:'Liderança e organização. Pilar tático.',
       matches:[{d:'28/04',adv:'Dortmund',pl:'3-0',g:0,a:1,v:82,nota:8.0}]},
      {n:'Neuer',pos:'GOL',vpi:82,pbi:14,kii:6,gols:0,ass:0,min:2900,nat:'Alemanha',age:38,
       sal:'EUR 12M/a',clause:'EUR 20M',ctr:'2025',
       vel:58,tec:88,fis:80,men:90,tat:88,cri:86,
       inj:[],bio:'Lenda viva. Experiência ímpar apesar da idade.',
       matches:[{d:'28/04',adv:'Dortmund',pl:'3-0',g:0,a:0,v:82,nota:8.0}]},
    ]
  },

  ACM:{
    n:'AC Milan',tk:'ACM.IT',liga:'ITA',vpi:80,pbi:19,kii:11,tdm:'RISING',
    rating:'BUY',score:'A+',chg:'+3.2%',chgN:3.2,val:'EUR 1.2B',
    founded:1899,stadium:'San Siro',cap:75923,coach:'Paulo Fonseca',
    style:'Contragolpe eficiente. Leão como ativo ofensivo primário. Defesa sólida e transição veloz.',
    rev:'EUR 450M',ebitda:'EUR 120M',roe:'14.2%',
    sponsors:[{s:'Emirates',v:'EUR 30M/a',vig:'2027',t:'Master'},{s:'Puma',v:'EUR 28M/a',vig:'2026',t:'Kit'}],
    hold:[{h:'RedBird Capital Partners',pct:'99%',v:'EUR 1.2B'}],
    hp:[
      {d:'28/04',adv:'Napoli',pl:'3-1',vp:81.2,var:'+3.2%'},
      {d:'24/04',adv:'Roma',pl:'2-0',vp:79.5,var:'+2.1%'},
      {d:'20/04',adv:'Juventus',pl:'1-1',vp:78.8,var:'+0.3%'},
      {d:'16/04',adv:'Inter',pl:'2-3',vp:77.5,var:'-1.5%'},
      {d:'12/04',adv:'Lazio',pl:'4-0',vp:79.2,var:'+3.8%'},
    ],
    athletes:[
      {n:'Leão',pos:'PE',vpi:86,pbi:17,kii:9,gols:18,ass:13,min:2850,nat:'Portugal',age:25,
       sal:'EUR 8M/a',clause:'EUR 175M',ctr:'2027',
       vel:94,tec:84,fis:84,men:80,tat:76,cri:84,
       inj:[],bio:'Ponta explosivo. Velocidade e finalização. Principal ativo do Milan.',
       matches:[{d:'28/04',adv:'Napoli',pl:'3-1',g:2,a:1,v:86,nota:9.0}]},
      {n:'Pulisic',pos:'PD',vpi:78,pbi:20,kii:10,gols:12,ass:10,min:2700,nat:'EUA',age:26,
       sal:'EUR 6M/a',clause:'EUR 80M',ctr:'2027',
       vel:86,tec:80,fis:78,men:78,tat:76,cri:80,
       inj:[],bio:'Consistente e versátil. Um dos melhores americanos da história.',
       matches:[{d:'28/04',adv:'Napoli',pl:'3-1',g:1,a:0,v:78,nota:8.0}]},
      {n:'Theo Hernandez',pos:'LE',vpi:80,pbi:18,kii:8,gols:8,ass:10,min:2900,nat:'França',age:27,
       sal:'EUR 8M/a',clause:'EUR 100M',ctr:'2026',
       vel:90,tec:78,fis:88,men:78,tat:76,cri:78,
       inj:[],bio:'Lateral ofensivo. Presença constante no ataque.',
       matches:[{d:'28/04',adv:'Napoli',pl:'3-1',g:0,a:1,v:80,nota:8.0}]},
      {n:'Maignan',pos:'GOL',vpi:84,pbi:11,kii:6,gols:0,ass:0,min:3060,nat:'França',age:28,
       sal:'EUR 8M/a',clause:'EUR 80M',ctr:'2026',
       vel:64,tec:86,fis:86,men:88,tat:86,cri:84,
       inj:[],bio:'Um dos melhores goleiros da Europa. Reflexos e saída excepcionais.',
       matches:[{d:'28/04',adv:'Napoli',pl:'3-1',g:0,a:0,v:84,nota:8.5}]},
    ]
  },

  ALS:{
    n:'Al Nassr',tk:'ALS.SA',liga:'SAU',vpi:72,pbi:24,kii:18,tdm:'STABLE',
    rating:'HOLD',score:'A-',chg:'+0.8%',chgN:0.8,val:'USD 620M',
    founded:1955,stadium:'Al-Awwal Park',cap:25000,coach:'Stefano Pioli',
    style:'Dependência de Ronaldo e Mané. Qualidade técnica superior à liga. Investimento saudita em expansão.',
    rev:'USD 180M',ebitda:'USD 45M',roe:'10.2%',
    sponsors:[{s:'Noon',v:'USD 30M/a',vig:'2026',t:'Master'},{s:'Nike',v:'USD 25M/a',vig:'2027',t:'Kit'}],
    hold:[{h:'PIF (Fundo Soberano Saudita)',pct:'75%',v:'USD 465M'}],
    hp:[
      {d:'28/04',adv:'Al Hilal',pl:'2-1',vp:73.5,var:'+0.8%'},
      {d:'24/04',adv:'Al Ittihad',pl:'3-0',vp:72.8,var:'+1.5%'},
      {d:'20/04',adv:'Al Ahli',pl:'1-1',vp:70.2,var:'-0.5%'},
      {d:'16/04',adv:'Al Fateh',pl:'4-0',vp:73.0,var:'+2.8%'},
    ],
    athletes:[
      {n:'C. Ronaldo',pos:'CA',vpi:80,pbi:22,kii:15,gols:26,ass:6,min:2800,nat:'Portugal',age:40,
       sal:'EUR 200M/a',clause:'—',ctr:'2026',
       vel:74,tec:84,fis:82,men:96,tat:84,cri:92,
       inj:[],bio:'Ativo histórico. Impacto comercial sem precedentes. Declínio atlético parcial.',
       matches:[{d:'28/04',adv:'Al Hilal',pl:'2-1',g:1,a:0,v:80,nota:8.0}]},
      {n:'Mané',pos:'PE',vpi:74,pbi:22,kii:14,gols:14,ass:9,min:2600,nat:'Senegal',age:32,
       sal:'EUR 20M/a',clause:'EUR 60M',ctr:'2026',
       vel:88,tec:80,fis:80,men:78,tat:74,cri:80,
       inj:[{d:'10/02',l:'Joelho',dur:'15d'}],bio:'Velocidade e gol. Referência africana.',
       matches:[{d:'28/04',adv:'Al Hilal',pl:'2-1',g:1,a:0,v:74,nota:7.5}]},
      {n:'Brozović',pos:'MC',vpi:72,pbi:20,kii:12,gols:4,ass:10,min:2500,nat:'Croácia',age:32,
       sal:'EUR 12M/a',clause:'EUR 30M',ctr:'2026',
       vel:72,tec:84,fis:78,men:80,tat:84,cri:76,
       inj:[],bio:'Maestro do meio-campo. Distribuição e visão.',
       matches:[{d:'28/04',adv:'Al Hilal',pl:'2-1',g:0,a:1,v:72,nota:7.2}]},
    ]
  },
};

// ── COPA 2026 — Grupos ────────────────────────────────────
const COPA_GROUPS = {
  A:{nations:['Portugal','Croácia','Tanzânia','Indonésia']},
  B:{nations:['Argentina','Chile','Peru','Albânia']},
  C:{nations:['Brasil','Marrocos','Haiti','Escócia']},
  D:{nations:['França','Bélgica','México','Arábia Saudita']},
  E:{nations:['Espanha','Japão','Camarões','Equador']},
  F:{nations:['Alemanha','Austrália','Argélia','Turquia']},
  G:{nations:['Holanda','Irã','Senegal','Quirguistão']},
  H:{nations:['Inglaterra','Sérvia','Etiópia','Rep. Dominicana']},
  I:{nations:['Noruega','México','Panamá','Bolívia']},
  J:{nations:['Colômbia','EUA','Canadá','Nova Zelândia']},
  K:{nations:['Itália','Coreia do Sul','Costa Rica','Costa do Marfim']},
  L:{nations:['Suíça','Uruguai','Venezuela','Egito']},
}

// ── COPA 2026 — Seleções com elencos completos ────────────
const COPA_NATIONS = [
  // GRUPO D — BRASIL
  {
    name:'Brasil',code:'BRA',flag:'🇧🇷',grupo:'Grupo D',conf:'CONMEBOL',
    fifa:4,odds:'4.5',vpi:88,pbi:16,kii:10,
    coach:'Carlo Ancelotti',style:'Alta pressão, transição rápida, talento individual máximo.',
    prob:0,rating:'ELIMINADO',fase:'Oitavas (Noruega 2-1)',
    athletes:[
      {n:'Vinicius Jr', pos:'PE',  vpi:92,pbi:11,clube:'Real Madrid',    gols:8, nat:'Brasil'},
      {n:'Rodrygo',     pos:'PD',  vpi:83,pbi:17,clube:'Real Madrid',    gols:5, nat:'Brasil'},
      {n:'Endrick',     pos:'CA',  vpi:80,pbi:14,clube:'Real Madrid',    gols:6, nat:'Brasil'},
      {n:'L. Paquetá',  pos:'MC',  vpi:80,pbi:19,clube:'West Ham',       gols:4, nat:'Brasil'},
      {n:'Raphinha',    pos:'PE',  vpi:78,pbi:21,clube:'Barcelona',       gols:7, nat:'Brasil'},
      {n:'Gerson',      pos:'MC',  vpi:74,pbi:18,clube:'Flamengo',       gols:3, nat:'Brasil'},
      {n:'Bruno Guim.', pos:'CAM', vpi:76,pbi:22,clube:'Fulham',         gols:5, nat:'Brasil'},
      {n:'Militão',     pos:'ZAG', vpi:82,pbi:15,clube:'Real Madrid',    gols:2, nat:'Brasil'},
      {n:'Marquinhos',  pos:'ZAG', vpi:80,pbi:14,clube:'PSG',            gols:1, nat:'Brasil'},
      {n:'Danilo',      pos:'LD',  vpi:72,pbi:18,clube:'Flamengo',       gols:1, nat:'Brasil'},
      {n:'Alisson',     pos:'GOL', vpi:86,pbi:10,clube:'Liverpool',      gols:0, nat:'Brasil'},
      {n:'Ederson',     pos:'GOL', vpi:84,pbi:10,clube:'Man. City',      gols:0, nat:'Brasil'},
    ]
  },
  // GRUPO B — ARGENTINA
  {
    name:'Argentina',code:'ARG',flag:'🇦🇷',grupo:'Grupo B',conf:'CONMEBOL',
    fifa:1,odds:'5.0',vpi:86,pbi:18,kii:9,
    coach:'Lionel Scaloni',style:'Posse e contra-ataque. Campeã vigente. Defesa sólida.',
    prob:18,rating:'AAA',
    athletes:[
      {n:'L. Messi',     pos:'CAM',vpi:90,pbi:22,clube:'Inter Miami',       gols:12,nat:'Argentina'},
      {n:'J. Álvarez',   pos:'CA', vpi:84,pbi:17,clube:'Atlético de Madrid',gols:8, nat:'Argentina'},
      {n:'Di María',     pos:'PD', vpi:75,pbi:28,clube:'Benfica',           gols:3, nat:'Argentina'},
      {n:'Mac Allister', pos:'MC', vpi:82,pbi:18,clube:'Liverpool',         gols:5, nat:'Argentina'},
      {n:'De Paul',      pos:'MC', vpi:78,pbi:21,clube:'Atlético de Madrid',gols:3, nat:'Argentina'},
      {n:'L. Martínez',  pos:'CA', vpi:80,pbi:19,clube:'Inter',             gols:7, nat:'Argentina'},
      {n:'Lisandro M.',  pos:'ZAG',vpi:80,pbi:16,clube:'Man. United',       gols:2, nat:'Argentina'},
      {n:'Romero',       pos:'ZAG',vpi:78,pbi:20,clube:'Tottenham',         gols:1, nat:'Argentina'},
      {n:'Molina',       pos:'LD', vpi:74,pbi:18,clube:'Atlético de Madrid',gols:2, nat:'Argentina'},
      {n:'E. Martínez',  pos:'GOL',vpi:88,pbi:11,clube:'Aston Villa',       gols:0, nat:'Argentina'},
    ]
  },
  // GRUPO G — FRANÇA
  {
    name:'França',code:'FRA',flag:'🇫🇷',grupo:'Grupo G',conf:'UEFA',
    fifa:2,odds:'5.5',vpi:85,pbi:19,kii:14,
    coach:'Didier Deschamps',style:'Profundidade de elenco excepcional. Equilíbrio tático.',
    prob:16,rating:'AA+',
    athletes:[
      {n:'Mbappé',      pos:'CA', vpi:88,pbi:17,clube:'Real Madrid',       gols:10,nat:'França'},
      {n:'Griezmann',   pos:'CAM',vpi:80,pbi:24,clube:'Atletico Madrid',   gols:6, nat:'França'},
      {n:'Dembélé',     pos:'PD', vpi:80,pbi:23,clube:'PSG',               gols:5, nat:'França'},
      {n:'Tchouaméni',  pos:'MD', vpi:80,pbi:16,clube:'Real Madrid',       gols:2, nat:'França'},
      {n:'Camavinga',   pos:'MC', vpi:78,pbi:17,clube:'Real Madrid',       gols:2, nat:'França'},
      {n:'Saliba',      pos:'ZAG',vpi:82,pbi:13,clube:'Arsenal',           gols:1, nat:'França'},
      {n:'Pavard',      pos:'ZAG',vpi:76,pbi:17,clube:'Inter',             gols:1, nat:'França'},
      {n:'T. Hernandez',pos:'LE', vpi:80,pbi:17,clube:'AC Milan',          gols:3, nat:'França'},
      {n:'Maignan',     pos:'GOL',vpi:84,pbi:11,clube:'AC Milan',          gols:0, nat:'França'},
    ]
  },
  // GRUPO E — ESPANHA
  {
    name:'Espanha',code:'ESP',flag:'🇪🇸',grupo:'Grupo E',conf:'UEFA',
    fifa:8,odds:'6.0',vpi:84,pbi:19,kii:10,
    coach:'Luis de la Fuente',style:'Tiki-taka evoluído. Yamal e Pedri lideram geração dourada.',
    prob:14,rating:'AA+',
    athletes:[
      {n:'Lamine Yamal',pos:'PD', vpi:86,pbi:18,clube:'Barcelona',         gols:9, nat:'Espanha'},
      {n:'Pedri',       pos:'MC', vpi:76,pbi:30,clube:'Barcelona',         gols:5, nat:'Espanha'},
      {n:'Morata',      pos:'CA', vpi:76,pbi:24,clube:'Atletico Madrid',   gols:7, nat:'Espanha'},
      {n:'Rodri',       pos:'MD', vpi:90,pbi:14,clube:'Man. City',         gols:3, nat:'Espanha'},
      {n:'Williams',    pos:'PE', vpi:80,pbi:20,clube:'Athletic Bilbao',   gols:6, nat:'Espanha'},
      {n:'Pedri',       pos:'MC', vpi:76,pbi:30,clube:'Barcelona',         gols:5, nat:'Espanha'},
      {n:'Le Normand',  pos:'ZAG',vpi:76,pbi:14,clube:'Atletico Madrid',   gols:1, nat:'Espanha'},
      {n:'Unai Simón',  pos:'GOL',vpi:80,pbi:12,clube:'Athletic Bilbao',   gols:0, nat:'Espanha'},
    ]
  },
  // GRUPO I — INGLATERRA
  {
    name:'Inglaterra',code:'ENG',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',grupo:'Grupo I',conf:'UEFA',
    fifa:5,odds:'7.0',vpi:82,pbi:21,kii:12,
    coach:'Gareth Southgate',style:'Alta intensidade, força física. Elenco jovem e promissor.',
    prob:12,rating:'AA',
    athletes:[
      {n:'Bellingham',  pos:'MC', vpi:89,pbi:15,clube:'Real Madrid',       gols:7, nat:'Inglaterra'},
      {n:'Kane',        pos:'CA', vpi:88,pbi:21,clube:'Bayern München',    gols:9, nat:'Inglaterra'},
      {n:'Saka',        pos:'PD', vpi:83,pbi:18,clube:'Arsenal',           gols:6, nat:'Inglaterra'},
      {n:'Foden',       pos:'PE', vpi:82,pbi:20,clube:'Man. City',         gols:5, nat:'Inglaterra'},
      {n:'Trent AA',    pos:'LD', vpi:78,pbi:17,clube:'Real Madrid',       gols:3, nat:'Inglaterra'},
      {n:'Rice',        pos:'MD', vpi:82,pbi:16,clube:'Arsenal',           gols:4, nat:'Inglaterra'},
      {n:'Salah',       pos:'PD', vpi:86,pbi:19,clube:'Liverpool',         gols:8, nat:'Egito'},
      {n:'Pickford',    pos:'GOL',vpi:78,pbi:13,clube:'Everton',           gols:0, nat:'Inglaterra'},
    ]
  },
  // GRUPO F — PORTUGAL
  {
    name:'Portugal',code:'POR',flag:'🇵🇹',grupo:'Grupo F',conf:'UEFA',
    fifa:6,odds:'8.0',vpi:83,pbi:20,kii:13,
    coach:'Roberto Martínez',style:'Experiência e talento. Ronaldo como ativo histórico.',
    prob:11,rating:'AA',
    athletes:[
      {n:'C. Ronaldo',  pos:'CA', vpi:82,pbi:23,clube:'Al Nassr',         gols:11,nat:'Portugal'},
      {n:'B. Fernandes',pos:'CAM',vpi:82,pbi:19,clube:'Man. United',       gols:7, nat:'Portugal'},
      {n:'Leão',        pos:'PE', vpi:86,pbi:17,clube:'AC Milan',          gols:8, nat:'Portugal'},
      {n:'Vitinha',     pos:'MC', vpi:77,pbi:23,clube:'PSG',               gols:3, nat:'Portugal'},
      {n:'Gonçalo Ramos',pos:'CA',vpi:78,pbi:20,clube:'PSG',               gols:6, nat:'Portugal'},
      {n:'Rúben Dias',  pos:'ZAG',vpi:82,pbi:14,clube:'Man. City',         gols:1, nat:'Portugal'},
      {n:'D. Costa',    pos:'GOL',vpi:80,pbi:12,clube:'Porto',             gols:0, nat:'Portugal'},
    ]
  },
  // GRUPO H — ALEMANHA
  {
    name:'Alemanha',code:'GER',flag:'🇩🇪',grupo:'Grupo H',conf:'UEFA',
    fifa:12,odds:'9.0',vpi:80,pbi:22,kii:11,
    coach:'Julian Nagelsmann',style:'Organização tática, pressing sistemático. Geração renovada.',
    prob:10,rating:'AA',
    athletes:[
      {n:'Musiala',     pos:'CAM',vpi:87,pbi:16,clube:'Bayern München',   gols:8, nat:'Alemanha'},
      {n:'Wirtz',       pos:'CAM',vpi:85,pbi:17,clube:'Leverkusen',        gols:7, nat:'Alemanha'},
      {n:'Havertz',     pos:'CA', vpi:78,pbi:21,clube:'Arsenal',           gols:6, nat:'Alemanha'},
      {n:'Kimmich',     pos:'MD', vpi:82,pbi:19,clube:'Bayern München',   gols:4, nat:'Alemanha'},
      {n:'Gnabry',      pos:'PD', vpi:76,pbi:24,clube:'Bayern München',   gols:5, nat:'Alemanha'},
      {n:'Rüdiger',     pos:'ZAG',vpi:74,pbi:13,clube:'Real Madrid',       gols:1, nat:'Alemanha'},
      {n:'Neuer',       pos:'GOL',vpi:80,pbi:14,clube:'Bayern München',   gols:0, nat:'Alemanha'},
    ]
  },
  // GRUPO A — EUA (país sede)
  {
    name:'EUA',code:'USA',flag:'🇺🇸',grupo:'Grupo A',conf:'CONCACAF',
    fifa:11,odds:'18.0',vpi:72,pbi:23,kii:15,
    coach:'Mauricio Pochettino',style:'Atletismo e transição. País sede. Geração em crescimento.',
    prob:6,rating:'A',
    athletes:[
      {n:'Pulisic',     pos:'PD', vpi:80,pbi:19,clube:'AC Milan',          gols:6, nat:'EUA'},
      {n:'Reyna',       pos:'CAM',vpi:72,pbi:26,clube:'Dortmund',          gols:4, nat:'EUA'},
      {n:'Weah',        pos:'PD', vpi:70,pbi:22,clube:'Juventus',          gols:3, nat:'EUA'},
      {n:'McKennie',    pos:'MC', vpi:72,pbi:22,clube:'Juventus',          gols:3, nat:'EUA'},
      {n:'Turner',      pos:'GOL',vpi:72,pbi:14,clube:'Arsenal',           gols:0, nat:'EUA'},
    ]
  },
  // GRUPO C — MÉXICO (país sede)
  {
    name:'México',code:'MEX',flag:'🇲🇽',grupo:'Grupo C',conf:'CONCACAF',
    fifa:15,odds:'20.0',vpi:70,pbi:26,kii:16,
    coach:'Javier Aguirre',style:'País sede. Organização defensiva. Ataque variável.',
    prob:5,rating:'A',
    athletes:[
      {n:'Lozano',      pos:'PD', vpi:74,pbi:23,clube:'PSV',               gols:5, nat:'México'},
      {n:'Giménez',     pos:'CA', vpi:77,pbi:21,clube:'Feyenoord',         gols:8, nat:'México'},
      {n:'Herrera',     pos:'MC', vpi:70,pbi:27,clube:'Porto',             gols:2, nat:'México'},
      {n:'Álvarez GK',  pos:'GOL',vpi:75,pbi:13,clube:'Chivas',            gols:0, nat:'México'},
    ]
  },
  // GRUPO B — URUGUAI
  {
    name:'Uruguai',code:'URU',flag:'🇺🇾',grupo:'Grupo B',conf:'CONMEBOL',
    fifa:13,odds:'22.0',vpi:76,pbi:21,kii:14,
    coach:'Marcelo Bielsa',style:'Solidez defensiva. Arrascaeta e Valverde como alavancas.',
    prob:7,rating:'AA-',
    athletes:[
      {n:'Valverde',    pos:'MD', vpi:82,pbi:18,clube:'Real Madrid',       gols:6, nat:'Uruguai'},
      {n:'Núñez',       pos:'CA', vpi:80,pbi:20,clube:'Liverpool',         gols:9, nat:'Uruguai'},
      {n:'Arrascaeta',  pos:'MAE',vpi:79,pbi:15,clube:'Flamengo',          gols:5, nat:'Uruguai'},
      {n:'Bentancur',   pos:'MC', vpi:76,pbi:19,clube:'Tottenham',         gols:3, nat:'Uruguai'},
      {n:'Rochet',      pos:'GOL',vpi:76,pbi:12,clube:'Internacional',     gols:0, nat:'Uruguai'},
    ]
  },
  // GRUPO K — ITÁLIA
  {
    name:'Itália',code:'ITA',flag:'🇮🇹',grupo:'Grupo K',conf:'UEFA',
    fifa:9,odds:'16.0',vpi:78,pbi:22,kii:13,
    coach:'Luciano Spalletti',style:'Organização tática europeia. Chiesa e Barella como pivôs.',
    prob:8,rating:'AA-',
    athletes:[
      {n:'Chiesa',      pos:'PD', vpi:80,pbi:24,clube:'Liverpool',         gols:6, nat:'Itália'},
      {n:'Barella',     pos:'MC', vpi:82,pbi:19,clube:'Inter',             gols:5, nat:'Itália'},
      {n:'Pellegrini',  pos:'CAM',vpi:76,pbi:22,clube:'Roma',              gols:6, nat:'Itália'},
      {n:'Bastoni',     pos:'ZAG',vpi:80,pbi:14,clube:'Inter',             gols:2, nat:'Itália'},
      {n:'Donnarumma',  pos:'GOL',vpi:84,pbi:10,clube:'PSG',               gols:0, nat:'Itália'},
    ]
  },
  // GRUPO D — COLÔMBIA
  {
    name:'Colômbia',code:'COL',flag:'🇨🇴',grupo:'Grupo D',conf:'CONMEBOL',
    fifa:14,odds:'25.0',vpi:74,pbi:23,kii:15,
    coach:'Néstor Lorenzo',style:'Pressing alto. James Rodríguez como motor criativo.',
    prob:6,rating:'A+',
    athletes:[
      {n:'James Rodríguez',pos:'CAM',vpi:78,pbi:26,clube:'Rayo Vallecano', gols:7, nat:'Colômbia'},
      {n:'L. Díaz',    pos:'PE', vpi:82,pbi:20,clube:'Liverpool',           gols:8, nat:'Colômbia'},
      {n:'Arias',      pos:'LD', vpi:76,pbi:18,clube:'Atlético de Madrid',  gols:2, nat:'Colômbia'},
      {n:'Borré',      pos:'CA', vpi:74,pbi:21,clube:'Frankfurt',            gols:6, nat:'Colômbia'},
      {n:'Vargas',     pos:'GOL',vpi:76,pbi:12,clube:'Besiktas',            gols:0, nat:'Colômbia'},
    ]
  },
];

// ── COPA 2026 — Ranking VPI ───────────────────────────────
const COPA_RANK = COPA_NATIONS
  .sort((a,b) => b.vpi - a.vpi)
  .map(n => ({n:n.name, flag:n.flag, prob:n.prob, vpi:n.vpi, rating:n.rating, odds:n.odds}));

// ── NEWS ──────────────────────────────────────────────────
const NEWS = [
  {tag:'brk',txt:'Vinicius Jr eleito Bola de Ouro 2025 pela segunda vez consecutiva · Real Madrid',time:'08:42'},
  {tag:'ins',txt:'Pedro renova com Flamengo até 2028 · Cláusula rescisória sobe para €150M',time:'08:31'},
  {tag:'upd',txt:'SIT-QUANT: FLA atinge score AA+ · TDM GOLDEN confirmado após 3ª vitória seguida',time:'08:15'},
  {tag:'rpt',txt:'Copa 2026: Brasil lidera ranking SIT-QUANT com VPI 88 · Favorito absoluto',time:'07:58'},
  {tag:'brk',txt:'Haaland bate recorde histórico da Premier League · 32 gols em 28 jogos',time:'07:44'},
  {tag:'ins',txt:'Al Nassr confirma renovação de Ronaldo · Contrato até 2026 · USD 200M/a',time:'07:30'},
  {tag:'upd',txt:'PBI ALERT: Pedri FCB atinge 34% · SELL confirmado · Evitar exposição',time:'07:12'},
  {tag:'rpt',txt:'Direitos TV Copa 2026: FIFA fecha com Apple TV+ · USD 2.1B por edição',time:'06:58'},
  {tag:'ins',txt:'Endrick: 3 gols na Champions League · VPI sobe para 80% · BUY confirmado',time:'06:45'},
  {tag:'upd',txt:'Maestro Call: MCI mantém BUY · Rodri em alta após Bola de Ouro 2024',time:'06:30'},
  {tag:'brk',txt:'PSG anuncia saída de Mbappé em janeiro · Impacto no VPI estimado em -8%',time:'06:15'},
  {tag:'rpt',txt:'Brasileirão 2026: Flamengo lidera com 5 pontos de vantagem · VPI estável',time:'06:00'},
];

// ── MAESTRO CALLS ─────────────────────────────────────────
const MAESTRO = [
  {tk:'FLA.BZ',r:'BUY', s:'AA',  d:'TDM GOLDEN · VPI 78% · Pedro artilheiro',              date:'28/04'},
  {tk:'RM.ES', r:'BUY', s:'AAA', d:'Vinicius forma máxima · Bernabéu imbatível',            date:'28/04'},
  {tk:'FCB.ES',r:'SELL',s:'BB',  d:'PBI crítico 33% · Pedri e Gavi ausentes',              date:'27/04'},
  {tk:'MCI.UK',r:'BUY', s:'AAA', d:'Haaland 32 gols · Rodri Bola de Ouro',                 date:'27/04'},
  {tk:'PSG.FR',r:'HOLD',s:'A',   d:'Pós-Mbappé · Aguardar consolidação do sistema',        date:'26/04'},
  {tk:'BAY.DE',r:'BUY', s:'AA+', d:'Kane liderança · Musiala em crescimento exponencial',  date:'26/04'},
  {tk:'ACM.IT',r:'BUY', s:'A+',  d:'TDM RISING · Leão VPI 86% · Monitorar próximo ciclo', date:'25/04'},
  {tk:'ALS.SA',r:'HOLD',s:'A-',  d:'Dependência Ronaldo · Liga saudita em expansão',       date:'25/04'},
];

// ── ANR HISTORY ───────────────────────────────────────────
const ANR_HISTORY = {
  'FLA':{calls:[
    {date:'28/04',r:'BUY',s:'AA',target:'VPI 82',analyst:'Maestro',note:'TDM GOLDEN. Pedro em forma.'},
    {date:'14/04',r:'BUY',s:'AA',target:'VPI 80',analyst:'Maestro',note:'Sequência positiva. Arrascaeta decisivo.'},
    {date:'01/04',r:'BUY',s:'A+',target:'VPI 78',analyst:'Maestro',note:'Entrada confirmada. Elenco coeso.'},
  ],buy:3,hold:0,sell:0,pt_low:'VPI 75',pt_mid:'VPI 82',pt_high:'VPI 88',upside:'+5%',consensus:'BUY'},
  'RM':{calls:[
    {date:'28/04',r:'BUY',s:'AAA',target:'VPI 92',analyst:'Maestro',note:'Vinicius Bola de Ouro. Bernabéu factor.'},
    {date:'14/04',r:'BUY',s:'AAA',target:'VPI 90',analyst:'Maestro',note:'Mbappé integrado. Sistema funcionando.'},
  ],buy:2,hold:0,sell:0,pt_low:'VPI 85',pt_mid:'VPI 91',pt_high:'VPI 96',upside:'+3%',consensus:'BUY'},
  'FCB':{calls:[
    {date:'27/04',r:'SELL',s:'BB',target:'VPI 55',analyst:'Maestro',note:'PBI 33%. Pedri e Gavi ausentes. Evitar.'},
    {date:'14/04',r:'SELL',s:'BB',target:'VPI 58',analyst:'Maestro',note:'RSI 28 — sobrevendido sem catalisador.'},
    {date:'01/04',r:'HOLD',s:'BBB',target:'VPI 65',analyst:'Maestro',note:'Aguardar retorno de Pedri.'},
  ],buy:0,hold:1,sell:2,pt_low:'VPI 50',pt_mid:'VPI 60',pt_high:'VPI 68',upside:'-5%',consensus:'SELL'},
  'MCI':{calls:[
    {date:'27/04',r:'BUY',s:'AAA',target:'VPI 90',analyst:'Maestro',note:'Haaland 32 gols. Sistema Guardiola máximo.'},
    {date:'14/04',r:'BUY',s:'AAA',target:'VPI 88',analyst:'Maestro',note:'Rodri Bola de Ouro. TDM ACTIVE.'},
  ],buy:2,hold:0,sell:0,pt_low:'VPI 82',pt_mid:'VPI 89',pt_high:'VPI 94',upside:'+3%',consensus:'BUY'},
};

// ── ECO DATA ──────────────────────────────────────────────
const ECO_DATA = {
  macro:[
    {lbl:'SELIC',val:'13.75%',chg:'-0.25pp',chgN:-1,impact:'Alto',note:'Juros altos reduzem investimento em clubes'},
    {lbl:'IPCA (12m)',val:'4.83%',chg:'+0.12pp',chgN:1,impact:'Médio',note:'Inflação eleva custo de salários'},
    {lbl:'PIB (a/a)',val:'+2.4%',chg:'+0.3pp',chgN:1,impact:'Baixo',note:'Crescimento sustenta consumo de ingressos'},
    {lbl:'DESEMPREGO',val:'7.8%',chg:'-0.4pp',chgN:-1,impact:'Médio',note:'Queda aumenta renda disponível'},
    {lbl:'USD/BRL',val:'5.15',chg:'+0.08',chgN:1,impact:'Alto',note:'Dólar alto valoriza atletas exportáveis'},
    {lbl:'IBOVESPA',val:'128.4k',chg:'+1.2%',chgN:1,impact:'Baixo',note:'Bolsa aquecida favorece SAFs'},
    {lbl:'RISCO-PAÍS',val:'178bps',chg:'-4bps',chgN:-1,impact:'Médio',note:'Queda atrai capital estrangeiro'},
    {lbl:'BALANÇO COM.',val:'USD 6.2B',chg:'+0.4B',chgN:1,impact:'Baixo',note:'Superávit sustenta Real'},
  ],
  forecast:[
    {ind:'SELIC FIM 2026',cons:'12.25%',min:'11.50%',max:'13.00%',trend:'↓'},
    {ind:'IPCA FIM 2026',cons:'3.80%',min:'3.20%',max:'4.50%',trend:'↓'},
    {ind:'USD/BRL FIM 2026',cons:'5.30',min:'4.90',max:'5.70',trend:'↑'},
    {ind:'PIB 2026',cons:'+2.1%',min:'+1.6%',max:'+2.8%',trend:'→'},
  ],
  calendar:[
    {date:'16/04',event:'Reunião COPOM',prev:'13.75%',cons:'13.50%',impact:'alto'},
    {date:'24/04',event:'PNAD Contínua',prev:'7.8%',cons:'7.7%',impact:'médio'},
    {date:'30/04',event:'PIB Flash Q1',prev:'+2.1%',cons:'+2.3%',impact:'alto'},
    {date:'14/05',event:'FOMC Minutes',prev:'—',cons:'—',impact:'alto'},
  ],
  commod:[
    {nm:'DIREITOS TV GLOB.',val:'R$5.2B',chg:'+8%',chgN:1,note:'CBF · renovação 2026-2030'},
    {nm:'LICENÇ. FIFA WC 2026',val:'USD 48B',chg:'+22%',chgN:1,note:'Maior edição da história'},
    {nm:'DIREITOS STREAMING',val:'USD 2.1B',chg:'+34%',chgN:1,note:'Amazon/Apple · crescimento digital'},
    {nm:'VALOR JOGADOR BRA',val:'€42M',chg:'+15%',chgN:1,note:'Mediana top-10 Transfermarkt'},
    {nm:'COTA LIBERTADORES',val:'USD 23M',chg:'+5%',chgN:1,note:'Campeão · CONMEBOL 2026'},
  ]
};

// ── FX BASE ───────────────────────────────────────────────
const FX_BASE = {
  'USD/BRL':{rate:5.15,prev:5.07,lo:4.92,hi:5.28,flag:'🇺🇸🇧🇷'},
  'EUR/BRL':{rate:5.63,prev:5.58,lo:5.40,hi:5.80,flag:'🇪🇺🇧🇷'},
  'EUR/USD':{rate:1.093,prev:1.101,lo:1.072,hi:1.115,flag:'🇪🇺🇺🇸'},
  'GBP/BRL':{rate:6.51,prev:6.44,lo:6.20,hi:6.70,flag:'🇬🇧🇧🇷'},
  'GBP/USD':{rate:1.265,prev:1.271,lo:1.240,hi:1.290,flag:'🇬🇧🇺🇸'},
  'SAR/BRL':{rate:1.373,prev:1.360,lo:1.320,hi:1.410,flag:'🇸🇦🇧🇷'},
};

// ── EXPORT ────────────────────────────────────────────────

// ── QUARTAS DE FINAL — Copa 2026 ─────────────────────────
const COPA_QUARTAS = [
  {
    jogo:1, data:'2026-07-09', hora:'17:00', cidade:'Boston',
    home:{code:'MAR',name:'Marrocos',flag:'🇲🇦'},
    away:{code:'FRA',name:'França',  flag:'🇫🇷'},
    status:'AGENDADO', placar:null,
  },
  {
    jogo:2, data:'2026-07-10', hora:'16:00', cidade:'Miami',
    home:{code:'ESP',name:'Espanha', flag:'🇪🇸'},
    away:{code:'BEL',name:'Bélgica', flag:'🇧🇪'},
    status:'AGENDADO', placar:null,
  },
  {
    jogo:3, data:'2026-07-10', hora:'20:00', cidade:'Los Angeles',
    home:{code:'NOR',name:'Noruega',  flag:'🇳🇴'},
    away:{code:'ENG',name:'Inglaterra',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿'},
    status:'AGENDADO', placar:null,
  },
  {
    jogo:4, data:'2026-07-11', hora:'22:00', cidade:'Kansas City',
    home:{code:'ARG',name:'Argentina',flag:'🇦🇷'},
    away:{code:'EGY',name:'Egito',    flag:'🇪🇬'},
    status:'AGENDADO', placar:null,
  },
];

// ── SEMIFINAIS ────────────────────────────────────────────
const COPA_SEMIS = [
  {jogo:1, data:'2026-07-14', hora:'16:00', status:'AGUARDANDO'},
  {jogo:2, data:'2026-07-15', hora:'16:00', status:'AGUARDANDO'},
];

const COPA_FINAL = {data:'2026-07-19', hora:'16:00', cidade:'Nova York/MetLife', status:'AGUARDANDO'};

if (typeof window !== 'undefined') {
  window.SIT_DB = {
    DB, COPA_GROUPS, COPA_NATIONS, COPA_RANK,
    COPA_QUARTAS, COPA_SEMIS, COPA_FINAL,
    NEWS, MAESTRO, ANR_HISTORY, ECO_DATA, FX_BASE
  };
}
