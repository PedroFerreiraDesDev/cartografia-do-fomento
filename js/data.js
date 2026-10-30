window.CARTOGRAFIA_DATA = [
{id:"p01",title:"CURA – Circuito Urbano de Arte",year:2017,mechanism:"Incentivo Fiscal",edital:"LMIC 2017 - IF",value:110000,circuit:"Monumental",region:null,proponent:null,verification:"Presente na Tabela 1 do TCC",issue:null},
{id:"p02",title:"TAU – Território Arte Urbana",year:2017,mechanism:"Incentivo Fiscal",edital:"LMIC 2017 - IF",value:110000,circuit:"Monumental",region:null,proponent:null,verification:"Presente na Tabela 1 do TCC",issue:null},
{id:"p03",title:"Graffitinerante",year:2017,mechanism:"Incentivo Fiscal",edital:"LMIC 2017 - IF",value:95000,circuit:"Monumental",region:null,proponent:null,verification:"Presente na Tabela 1 do TCC",issue:null},
{id:"p04",title:"CURA – Circuito Urbano de Arte",year:2021,mechanism:"Incentivo Fiscal",edital:"LMIC 2021 - IF",value:150000,circuit:"Monumental",region:null,proponent:null,verification:"Presente na Tabela 1 do TCC",issue:null},
{id:"p05",title:"MAMU – Morro Arte Mural – 4ª Edição",year:2023,mechanism:"Incentivo Fiscal",edital:"LMIC 2023 - IF",value:165000,circuit:"Monumental",region:null,proponent:null,verification:"Presente na Tabela 1 do TCC",issue:null},
{id:"p06",title:"Festival Cena Graffiti no Morro",year:2023,mechanism:"Incentivo Fiscal",edital:"LMIC 2023 - IF",value:165000,circuit:"Monumental",region:null,proponent:null,verification:"Presente na Tabela 1 do TCC",issue:null},
{id:"p07",title:"Viva a Praça Sete – Festival de Arte Urbana",year:2023,mechanism:"Incentivo Fiscal",edital:"LMIC 2023 - IF",value:164888.89,circuit:"Monumental",region:null,proponent:null,verification:"Presente na Tabela 1 do TCC",issue:null},
{id:"p08",title:"Exposição Bolinho 15 Anos",year:2023,mechanism:"Incentivo Fiscal",edital:"LMIC 2023 - IF",value:160000,circuit:"Monumental",region:null,proponent:null,verification:"Presente na Tabela 1 do TCC",issue:null},
{id:"p09",title:"ALA – Arte Livre Ambulante",year:2017,mechanism:"Fundo Municipal",edital:"LMIC 2017 - Fundo",value:60000,circuit:"Capilar",region:null,proponent:null,verification:"Presente na Tabela 2 do TCC",issue:null},
{id:"p10",title:"Traço – Escola de Graffiti",year:2019,mechanism:"Descentra",edital:"Descentra 2019",value:20000,circuit:"Capilar",region:null,proponent:null,verification:"Presente na Tabela 2 do TCC",issue:null},
{id:"p11",title:"Delas – Mulheres no Graffiti",year:2019,mechanism:"Descentra",edital:"Descentra 2019",value:19740,circuit:"Capilar",region:null,proponent:null,verification:"Presente na Tabela 2 do TCC",issue:"Situação final precisa ser revalidada documentalmente antes de publicação."},
{id:"p12",title:"Festival Real Grapixo",year:2021,mechanism:"Fundo Municipal",edital:"LMIC 2021 - Fundo",value:90000,circuit:"Capilar",region:null,proponent:null,verification:"Presente na Tabela 2 do TCC",issue:null},
{id:"p13",title:"Poucos Recursos: Graffiti no Concórdia",year:2021,mechanism:"Descentra",edital:"Descentra 2021",value:20000,circuit:"Capilar",region:null,proponent:null,verification:"Presente na Tabela 2 do TCC",issue:null},
{id:"p14",title:"Real Grapixo na Quebrada",year:2022,mechanism:"Fundo Municipal",edital:"LMIC 2022 - Fundo",value:30000,circuit:"Capilar",region:null,proponent:null,verification:"Presente na Tabela 2 do TCC",issue:null},
{id:"p15",title:"Mostra de Arte Urbana: Edição Pop Rua",year:2022,mechanism:"Descentra",edital:"Descentra 2022",value:38398,circuit:"Capilar",region:null,proponent:null,verification:"Presente na Tabela 2 do TCC",issue:null},
{id:"p16",title:"Painéis de Grafite em Venda Nova",year:2023,mechanism:"Fundo Municipal",edital:"LMIC 2023 - Fundo",value:55000,circuit:"Capilar",region:null,proponent:null,verification:"Presente na Tabela 2 do TCC",issue:null},
{id:"p17",title:"Nuhi – Festival de Arte Gráfica",year:2023,mechanism:"Fundo Municipal",edital:"LMIC 2023 - Fundo",value:89870,circuit:"Capilar",region:null,proponent:null,verification:"Presente na Tabela 2 do TCC",issue:null},
{id:"p18",title:"Criarte Urbana (Grafite em Venda Nova)",year:2024,mechanism:"Fundo Municipal",edital:"LMIC 2024 - Fundo",value:70000,circuit:"Capilar",region:null,proponent:null,verification:"Presente na Tabela 2 do TCC",issue:null},
{id:"p19",title:"Viva Rima Viva: Graffiti de BH",year:2024,mechanism:"Descentra",edital:"Descentra 2024",value:40000,circuit:"Capilar",region:null,proponent:null,verification:"Presente na Tabela 2 do TCC",issue:null},
{id:"p20",title:"Memórias da Oeste Hip Hop",year:2024,mechanism:"Descentra",edital:"Descentra 2024",value:40000,circuit:"Capilar",region:null,proponent:null,verification:"Presente na Tabela 2 do TCC",issue:null}
];

/*
Campos intencionalmente em branco até verificação:
- region
- proponent
- fotos reais
- endereço/local de execução
- perfil socioeconômico

Use null em vez de inventar dados.
*/
/* Relações curatoriais: ligações documentadas entre projetos, além dos atributos
   das tabelas. Cada uma precisa de fonte. Sem fonte, não entra. */
window.CARTOGRAFIA_RELATIONS = [
  { a: "p01", b: "p04", why: "edições do mesmo projeto (CURA 2017 e 2021)", source: "Tabela 1 do TCC; títulos idênticos nos anexos LMIC 2017 e 2021" },
  { a: "p12", b: "p14", why: "continuidade do Real Grapixo (festival 2021; 'na Quebrada' 2022)", source: "Tabela 2 do TCC; títulos nos anexos LMIC 2021 e 2022 (Fundo)" },
  { a: "p16", b: "p18", why: "ambos nomeiam Venda Nova no título", source: "Tabela 2 do TCC (títulos); regional de execução ainda a verificar" },
  { a: "p05", b: "p06", why: "ambos nomeiam o morro no título e atingem o teto do IF 2023", source: "Tabela 1 do TCC; seção 5.1 (teto de R$ 165 mil)" },
  { a: "p10", b: "p11", why: "mesmo edital e mesma vocação formativa (escola / mulheres no graffiti)", source: "Tabela 2 do TCC; seção 5.1 (Descentra 2019)" }
];
