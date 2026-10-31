# Propostas · Lab 06 — Experimentos (outra pegada)

Data: 30/10/2026 (noite). Arquivo: `lab-06-experimentos.html`. Dados: os mesmos vinte projetos de `js/data.js` (ano, mecanismo, edital, valor, circuito; regional e proponente ainda nulos, nunca inferidos).

O Lab 04 foi escolhido como direção (rizoma 3D + micélio, nó como fragmento de muro, poucos elementos) e o Lab 05 leva essa linguagem a todas as páginas. O Lab 06 não disputa com eles: ele testa, de propósito, **outros algoritmos** para duas frentes que ainda estão abertas, a **capa** (primeira página) e os **gráficos dos Indicadores** (ano × mecanismo, valores, região quando houver). Tudo em implementação própria, sem código de terceiros; créditos aos algoritmos no cabeçalho do script e na seção 7 de `README-RIZOMA.md`.

---

## 1. Pesquisa das referências (navegador do app, 30/10/2026)

| Referência | O que é | O que sugere para a capa | O que sugere para os gráficos |
|---|---|---|---|
| **Negro Muro** (negromuro.com.br) | Projeto carioca de murais com retratos e biografias de personagens negros; o site abre num globo 3D escuro que gira até o Rio e lista os muros. Fundo preto, tipografia branca, vídeo. | A capa como **chegada**: o globo "pousa" na cidade antes de mostrar os muros. Fundo escuro faz a cor dos murais virar luz. | Nada de gráficos: o dado é o muro e a biografia. Mostra o quanto a **página de projeto** pesa mais que o indicador. |
| **Arte Fora do Museu** (arteforadomuseu.com.br) | Mapa Leaflet escuro com clusters numerados de obras (murais, esculturas, arquitetura), filtros por categoria, roteiros e perfis de mais de 400 artistas. | A capa já é o mapa, sem porta: **o objeto é a entrada**. Contraponto ao nosso protótipo, que recusa o mapa obrigatório. | Clusters por quantidade são o oposto do que queremos: somam sem dizer quanto (valor) nem por quem (mecanismo). Reforça a cor por mecanismo e a área por valor. |
| **Information is Beautiful** (informationisbeautiful.net) | Coletivo de David McCandless; a capa abre escura e vira um grid de cards (dinastias, processos de IA, "beautiful news"), com visualizações de constelação/rede em cores saturadas sobre fundo escuro ou branco. | A **metáfora de constelação** em modo escuro: pontos de luz e fios finos. Testada aqui como modo "asfalto" dos experimentos 01 e 02. | Cada gráfico tem uma **pergunta no título** e uma única leitura; legendas curtas; cor como categoria. Vale para os Indicadores: uma pergunta por gráfico. |
| **Prosas** (prosas.com.br) | Plataforma comercial de gestão de editais e seleção de projetos sociais (R$ 4 bi, 3 mil editais, 300 mil usuários). Capa com foto, vermelho corporativo e cifras grandes. | Contraponto: capa de **produto**, não de pesquisa; cifras grandes sem corpo. Serve para o que não fazer. | A cifra isolada ("+4 bilhões") esconde quem recebe. Nosso gráfico deve sempre voltar aos projetos (como já faz o clique nas barras). |
| **Mapa Cultural BH** (mapaculturalbh.pbh.gov.br) | Plataforma livre da Fundação Municipal de Cultura (Mapas Culturais/SNIIC): agentes, espaços, eventos, oportunidades (o Descentra 2026 está com inscrições de 05/11 a 15/12/2026). Texto denso, foto de capa, listas. | Contraponto: o **banco de dados como capa**. É a fonte institucional de onde o fomento sai; o nosso protótipo é a leitura crítica dessa fonte. | Lista de editais por área, sem valor nem série histórica. Confirma a lacuna que o TCC ocupa: ano × mecanismo × valor em uma só figura. |
| **OpenProcessing** (openprocessing.org) | Comunidade de creative coding com p5.js; na capa, "Coding is Beautiful"; coleções de Generative Art, Particles, Dataviz; em alta hoje: "Mechanical Escapement" e "Masonry Tunnel" (Ivan Rudnicki), "Leaves" (Rubén Medellín e Matthias Hurrle), "Divide" (Naoki Tsutae), "Network" (Roni Kaufman), "10 PRINT" (humanbydefinition), "Particle Plotter" (Vamoss). | Sistemas de partículas e campos de ruído são a gramática dominante: a capa pode **se desenhar sozinha** a cada visita. Nenhum sketch foi copiado; serviram para ver o que a comunidade considera vivo. | "Network" e "Divide" mostram subdivisão do plano e redes como gráfico; daí os experimentos de Voronoi e cordas. |
| **p5.js Examples** (p5js.org/examples) | Catálogo oficial: Noise, Flocking, Connected Particles, Forces, Smoke Particles, Game of Life, Recursive Tree, Create Graphics, Multiple Canvases (modo instância), Words (textToPoints). | "Noise" e "Smoke Particles" são o ponto de partida do campo de fluxo; "Words" sugere o título em pontos (aqui amostrado por pixels, para não depender de arquivo de fonte). | "Create Graphics" (buffer fora da tela) é o que permite o Voronoi em grade e o DLA sem travar; "Multiple Canvases" confirma o modo instância usado em todos os labs. |

Síntese: as referências de arte urbana (Negro Muro, Arte Fora do Museu) pedem fundo escuro e **a obra como entrada**; as de dados (Information is Beautiful) pedem **uma pergunta por figura** e cor como categoria; as institucionais (Prosas, Mapa Cultural BH) mostram o que o TCC critica: cifras sem corpo e listas sem série. As de código (OpenProcessing, p5.js) dão a gramática: partículas, campos, buffers.

---

## 2. Os seis experimentos

Todos num só arquivo, em abas, um canvas por vez (mais leve no celular). Cada um tem nome, pergunta de pesquisa, controles mínimos e crédito.

| # | Experimento | Frente | Algoritmo (referência) | Pergunta | Controles |
|---|---|---|---|---|---|
| 01 | **Campo de fluxo** | Capa | Ruído de Perlin como campo vetorial (PERLIN, 1985; SHIFFMAN, 2012; HOBBS, 2020) | A capa pode ser feita pelos próprios projetos, diferente a cada visita, sem virar decalque? | turbulência, rastro, recomeçar, papel/asfalto |
| 02 | **Tipografia viva** | Capa | Título amostrado em pixels + comportamento "arrive" (REYNOLDS, 1999) | O título da capa pode ser, ele mesmo, o primeiro gráfico do TCC? | dispersão, fatias por ano/mecanismo/valor, papel/asfalto |
| 03 | **Células de valor** | Indicadores (valores × mecanismo × ano) | Voronoi (1908), diagrama de potência (AURENHAMMER, 1987), ajuste de área como nos Voronoi treemaps (BALZER; DEUSSEN, 2005; NOCAJ; BRANDES, 2012) | Se a área é o valor, o que o mapa do dinheiro mostra que a barra não mostra? | vizinhança / peso = valor / área = valor; pintura cheia ou só linha |
| 04 | **Mancha que cresce** | Indicadores (ano) | DLA, agregação limitada por difusão (WITTEN; SANDER, 1981) | Como o fomento se acumula: mancha que cresce ou pontos que se somam? | até o ano, velocidade, recomeçar |
| 05 | **Cordas** | Indicadores (ano × mecanismo; escala; circuito) | Diagrama de cordas à maneira do Circos (KRZYWINSKI et al., 2009; HOLTEN, 2006) | Ano × mecanismo como fluxo, e não como barras empilhadas: o que muda na leitura? | cruzar com ano/escala/circuito; valor ou contagem |
| 06 | **Rio** | Indicadores (ano × mecanismo) | Streamgraph com base em silhueta (HAVRE et al., 2000; BYRON; WATTENBERG, 2008) | O que a forma de rio diz sobre 2018 e 2020, que a barra vazia não diz? | valor ou contagem; suave ou reta |

Detalhes técnicos que importam:

- **01** — ~1.500 partículas no desktop, ~650 no celular (um terço com `prefers-reduced-motion`); cada projeto recebe partículas em proporção ao valor e as solta perto de uma "casa" cuja coluna é o ano. Rastro num `p5.Graphics` com fade por retângulo semitransparente; o dedo cria um vórtice local. O título fica fixo no meio do movimento.
- **02** — o título é desenhado num buffer e amostrado a cada 4 px; as fatias de pontos são contíguas da esquerda para a direita e proporcionais ao valor (ordem por ano = linha do tempo). Toque num trecho mostra o projeto e a fatia (por exemplo, MAMU = 9,7% do título).
- **03** — grade de 4 px (5 no celular), dono de cada célula por força bruta (20 sementes); pesos iniciais proporcionais ao valor; em "área = valor" os pesos são corrigidos por 90 iterações até a área de cada célula se aproximar da fatia do valor total. Arrastar uma semente mostra que a posição é cenográfica (coluna = ano, faixa = mecanismo).
- **04** — grade de 2 px (3 no celular); orçamento de células de cada ano proporcional ao valor somado; caminhantes nascem num anel em volta da mancha, andam ao acaso e grudam ao tocar; cada fração tem a cor do mecanismo sorteado pelo valor dentro do ano. 2018 e 2020 ficam só o traço. No celular a linha do tempo é vertical.
- **05** — arcos proporcionais ao total; fitas por curvas quadráticas pelo centro; toque num arco atenua as outras fitas.
- **06** — três faixas (IF, Fundo, Descentra) sobre base centrada; onde não há projeto o rio seca; toque num ano lista quem o compõe.

Rupturas declaradas no próprio painel ("rompe com a linguagem onde o experimento pede"):

1. **Modo asfalto** (01, 02, disponível em todos): fundo `#161616` e tinta `#f7f6f1`, como Negro Muro e Information is Beautiful, para testar a capa como constelação de luz, não como tinta sobre papel.
2. **Célula cheia** (03): pinta área, não linha; a opção "só linha" devolve a página aos poucos elementos do Lab 04.

Verificado em 30/10/2026 no navegador do app: sem erros no console no desktop (1024 px) e no preset mobile (375 × 812), toque e arrasto respondendo em todos os experimentos (os handlers do p5 devolvem `false` só dentro do canvas; a fita de abas e os controles param a propagação). Os avisos de `willReadFrequently` do Canvas2D vêm de `loadPixels` do p5 e não afetam o funcionamento.

---

## 3. O que cada experimento sugere para o protótipo

| Experimento | Sugestão | Risco |
|---|---|---|
| 01 Campo de fluxo | Capa viva por trás do título e do botão "Entrar", como já existe a frase "o campo atrás desta capa já está vivo". As partículas podem ser as mesmas cores por mecanismo, com rastro curto. | Decoração: se nada ali é clicável nem legível, vira papel de parede. Mitigação: as "casas" das partículas são os nós, e entrar na experiência as transforma em nós do rizoma. |
| 02 Tipografia viva | O título da capa como primeiro gráfico: a fatia de cada projeto no título, lida como linha do tempo; tocar numa letra já abre um projeto. É a ideia mais **própria** do lab: o nome do TCC feito do corpus. | Legibilidade do título em telas pequenas (no celular a fonte cai para ~50 px e os pontos ficam grossos). Mitigação: só desktop/tablet, ou pontos maiores com fonte menor. |
| 03 Células de valor | Substituto do treemap atual nos Indicadores: mesma leitura (área = valor), mas com ano na horizontal e mecanismo na vertical, e fronteiras que mostram vizinhança. Toque numa célula abre a prévia do projeto, como hoje. | Custo de cálculo no celular (grade de 5 px, 90 iterações) e a tentação de ler a posição como geografia. Mitigação: calcular uma vez, legenda "posições cenográficas". |
| 04 Mancha que cresce | Gráfico de ano "que se desenha" ao abrir a aba: uma mancha por ano, proporcional ao valor, colorida pelos mecanismos. Útil para apresentar a série 2017–2024 sem barras. | Não é preciso (a forma varia a cada vez) e não serve para comparar valores próximos. Mitigação: usar como abertura dos Indicadores, não como o gráfico de comparação. |
| 05 Cordas | O gráfico ano × mecanismo dos Indicadores, com a alternativa escala e circuito. É o que melhor responde "de onde vem, para onde vai" e já funciona no toque. | Com apenas três mecanismos e seis anos com projeto, o diagrama é simples; se o corpus crescer, as fitas cruzam demais. |
| 06 Rio | Série temporal honesta: os anos vazios aparecem como "seca", não como barra ausente. Cabe no lugar do gráfico de colunas por ano. | A suavização inventa valores entre os anos (a curva sobe antes de 2021). Mitigação: oferecer "reta" ou marcar os anos com pontos. |

---

## 4. Recomendação

1. **Capa**: levar para o Lab 05 o **experimento 02 (Tipografia viva)** como título da capa no desktop, com o **experimento 01 (Campo de fluxo)** como fundo discreto (rastro curto, sem título duplicado); no celular, só o campo de fluxo com o título em HTML. É a única proposta em que a capa já é um dado do TCC e não um decalque.
2. **Indicadores**: **Cordas (05)** para ano × mecanismo (com escala e circuito como alternativas) e **Células de valor (03)** no lugar do treemap, ambos com o clique voltando à prévia do projeto. O **Rio (06)** entra como segunda leitura da série (botão "rio / colunas"), e a **Mancha (04)** fica como abertura animada da aba, opcional.
3. **Manter a linguagem**: papel, tinta, cor por mecanismo, títulos condensados. O modo asfalto fica como opção (o protótipo já tem "modo escuro"), não como padrão.
4. **Pendências antes de integrar**: testar em aparelho real; medir o custo do Voronoi no celular; decidir se a regional entra como terceira dimensão (hoje nula, nunca inferida); registrar no TCC, em uma linha por gráfico, a pergunta que ele responde (como nas figuras de Information is Beautiful).

Arquivos tocados: `lab-06-experimentos.html` (novo), `rizoma/PROPOSTAS-LAB06.md` (este), `rizoma/README-RIZOMA.md` (seção 7), `README.md`, menus dos Labs 01, 02 e 03. Os menus dos Labs 04 e 05 não foram alterados porque outras sessões editam esses arquivos ao mesmo tempo; falta acrescentar neles o link `lab-06-experimentos.html`.
