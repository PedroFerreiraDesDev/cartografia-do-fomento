# Cartografia do Fomento — camada RIZOMA

Avaliação do que já existe, conceito (Deleuze & Guattari), user flow, wireframes e protótipo p5.js.
Data: 30/10/2026. Autor do TCC: Pedro Henrique Ferreira Moreira (Design, Escola de Arquitetura UFMG; orientação Maria Luiza Viana).

Conteúdo desta pasta:

| Arquivo | O que é |
|---|---|
| `README-RIZOMA.md` | este documento: avaliação, conceito, fluxo, referências e ferramentas p5.js |
| `PROPOSTAS-INTERACAO-3D.md` | exploração (30/10/2026): 3D desde a abertura, relações na árvore, hover, pré-visualização, botões, transições; alternativas com prós, contras, esforço e referências; nada implementado |
| `wireframes/R00-user-flow-rizomatico.svg` | user flow sem raiz: qualquer nó é entrada e saída |
| `wireframes/R01 … R06` | wireframes das telas rizomáticas (desktop 1440×1024 e mobile 430×932), editáveis no Illustrator |
| `wireframes/index.html` | visualizador rápido dos SVGs |
| `prototipo-p5/index.html` + `sketch.js` | protótipo funcional em p5.js (abrir no navegador) |

---

## 1. Avaliação: continuar ou não?

**Continuar, mas nomear e estruturar o que já está acontecendo.** O material tem duas camadas que ainda não conversam:

1. **O TCC escrito (versão 05/12/2025)** promete um *mapa georreferenciado mobile-first*, fundo escuro, metáfora de constelação (Incentivo Fiscal = estrelas grandes; Fundo/Descentra = pontos pequenos e numerosos), cinco eixos de filtro (origem do recurso, valor, regional, ano, perfil do proponente) e tradução semântica do "editalês". Base teórica: Canclini (escrita territorial / culturas híbridas), Tufte e Cairo.
2. **O protótipo atual (out/2026)** já abandonou o mapa obrigatório: "uma cartografia sem mapa obrigatório", muros que surgem pelo gesto do mouse, deriva, página dedicada por projeto, indicadores que devolvem aos projetos, editais como porta de entrada. Estética monocromática de tinta/spray sobre branco.

O que está bom e deve ficar:

- **Honestidade dos dados.** Campos `null` viram "A verificar"; nada é inferido (classe, raça, gênero, local). Isso é raro e é a maior força acadêmica do protótipo. Mantém.
- **Três portas para a mesma unidade de informação** (muro, gráfico, edital → página do projeto). O user flow atual já documenta isso bem.
- **Retorno preservado** (voltar do projeto mantém muros revelados e filtro fixado).
- **Controles de movimento** (pausar, reduzir movimento).

O que está frágil:

- **A "deriva" dos muros não tem justificativa conceitual escrita.** Hoje ela parece efeito de site experimental. O rizoma dá a razão: o campo não tem centro nem raiz; a pessoa cria o mapa ao percorrer.
- **Os projetos não se conectam entre si.** Cada muro é uma ilha; os gráficos agregam, mas não traçam linhas de um projeto a outro. Um rizoma é feito de conexões heterogêneas; sem elas, o conceito fica só no discurso.
- **O fluxo ainda tem tronco** (intro → descobrir → projeto → voltar). Há um "home" implícito. Rizoma não tem home.
- **O TCC diz "georreferenciado" e o protótipo diz "posições cenográficas".** Isso precisa ser assumido no texto: a regional entra como *atributo de conexão* (quando verificada), não como coordenada. É coerente com Deleuze & Guattari: o mapa rizomático é conectável em todas as suas dimensões, não uma reprodução do território.
- **A própria dissertação já usa a palavra.** No texto de 17/11/2025 (p. 86 do PDF): a cena opera "de forma rizomática", buscando financiamento em múltiplas direções. O termo está lá sem referência; esta camada resolve isso.

**Recomendação prática (feita em 30/10/2026):** não refazer o site. `index.html` + `app.js` seguem como camada de leitura (fichas, indicadores, editais, pesquisa, sobre) e a camada rizomática entrou como o modo "Descobrir", substituindo a deriva de muros. O motor fica em `js/rizoma.js` (p5.js em modo instância) e é compartilhado pelo site e pelo protótipo standalone em `prototipo-p5/`. Na página do projeto, a nova seção "Linhas" lista as conexões com o motivo de cada uma e a trilha do visitante; o botão de retorno vira "Fechar nó · a trilha fica" quando se vem do campo. A versão anterior está em `_backup/`.

---

## 2. Conceito: do rizoma às decisões de interface

Fonte primária: DELEUZE, Gilles; GUATTARI, Félix. *Mil platôs: capitalismo e esquizofrenia*, vol. 1, "Introdução: Rizoma". Os autores opõem o **rizoma** (caule subterrâneo que cresce lateralmente, sem raiz principal) à **árvore** (hierarquia, tronco, raiz, ramos) e listam princípios. A tabela traduz cada princípio em uma regra de interface e em um gesto concreto do protótipo.

| Princípio (D&G) | Regra de interface | Gesto no protótipo p5.js |
|---|---|---|
| **1–2. Conexão e heterogeneidade**: qualquer ponto pode e deve conectar-se a qualquer outro; as conexões são de naturezas diferentes | Projetos ligam-se por atributos compartilhados de tipos distintos (ano, mecanismo, edital, escala de valor, regional). Várias naturezas de linha coexistem na mesma tela | "Linhas de fuga": botões ligam/desligam cada tipo de conexão; cada tipo tem cor própria; as linhas crescem organicamente (`noise`) |
| **3. Multiplicidade**: não há unidade que sirva de pivô; o rizoma não tem centro nem sujeito | Não há home, não há "voltar". O nó aberto vira centro provisório; fechar o nó devolve ao campo com o percurso preservado | Ficha lateral abre como *nó aberto*; botões "seguir linha →" levam a outro nó; a trilha do visitante fica desenhada |
| **4. Ruptura a-significante**: o rizoma pode ser rompido em qualquer lugar e retoma por outra linha | Cortar uma conexão não destrói nada; o sistema rebrota por outro atributo | Modo "cortar" (tecla C ou botão): arrastar sobre uma linha a rompe; uma linha nova, pontilhada, brota entre um dos nós e outro projeto que compartilha outro atributo |
| **5–6. Cartografia e decalcomania**: o mapa é aberto, experimentável, com múltiplas entradas; o decalque reproduz a árvore | Oferecer os dois e deixar visível a diferença | Botão "Árvore/Decalque": os nós se alinham na hierarquia oficial (Mecanismo → Ano → Projeto, como os anexos do Diário Oficial listam). Botão "Rizoma": voltam ao campo de forças. "Salvar meu mapa" exporta o percurso do visitante (`saveCanvas`) |
| **Platô**: região contínua de intensidades, sem clímax nem ponto final | Nenhuma tela é "fim". A ficha é um platô: tem tudo o que precisa e abre lateralmente | Sem botão "concluir"; contador de nós revelados e linhas ativas em vez de progresso |
| **Entrada múltipla** | A tela inicial é um campo vazio; o primeiro gesto (mover o mouse/dedo) cria a primeira entrada | O spray revela nós onde a mão passa; a ordem é diferente a cada visita (`randomSeed` com a hora) |

### Ponte com a versão atual do TCC (PDF de 02/10/2026)

A versão nova do texto já abriu a porta teórica para o rizoma sem nomeá-lo. As seções 2.2 ("Cartografia e espacialização da informação") e 2.3 ("Contracartografia") trazem Sperling (2016; 2024) e Kiminami e Sperling (2020): mapas como artefatos construídos e não neutros; "regimes de visibilidade"; cartografia pós-representacional (Dodge, Kitchin e Perkins), em que o mapa é uma configuração "produzida por processos continuamente articulados"; omissões e silêncios do mapa (Harley). Cada um desses pontos tem correspondência direta no protótipo:

| Já está no TCC (02/10/2026) | O que o rizoma acrescenta | Onde aparece no protótipo |
|---|---|---|
| Mapa é construído, não neutro (Sperling, 2016) | O visitante constrói o próprio mapa ao percorrer; o decalque oficial fica visível como contraponto | modo Árvore/decalque × modo Rizoma; "Salvar meu mapa" |
| Cartografia pós-representacional: mapa como processo (Kiminami; Sperling, 2020) | O mapa nunca está pronto: linhas crescem, derivam, rompem e rebrotam | layout por forças + `noise`; cortar/rebrotar |
| Regimes de visibilidade (Sperling, 2024) | Cada "linha de fuga" torna visível uma relação e invisível outra; a escolha é explícita e reversível | botões Ano / Mecanismo / Edital / Escala / Regional |
| Silêncios do mapa (Harley, via Kiminami; Sperling) | O silêncio é mostrado, não preenchido: "A verificar" não conecta | regional `null` não gera linha; selo "dado em revisão" |
| Território como relações, não coordenadas (Milton Santos, via Sperling, 2016) | Posição cenográfica assumida; território entra como atributo de conexão | aviso permanente no rodapé; linha "Regional" |

Isso resolve a tensão entre "georreferenciado" (texto) e "cenográfico" (protótipo): com Sperling, o mapa relacional é defensável como cartografia crítica, e o rizoma é a fonte dessa linhagem (a "cartografia" de Deleuze e Guattari é citada pela própria cartografia pós-representacional). Atenção: Sperling (2016; 2024) e Kiminami e Sperling (2020) são citados no corpo do PDF novo, mas **não constam na lista de referências** ao final; incluir.

Aviso metodológico para o texto do TCC: Deleuze e Guattari não escreveram sobre interfaces. Use o rizoma como **modelo conceitual** que orienta decisões de design (e que dialoga com Canclini: a "escrita territorial" é feita de conexões impuras, não de categorias oficiais), não como prova empírica. A validação segue sendo o teste com artistas (questionário já previsto no protótipo). No Brasil, a "cartografia como método" (Passos, Kastrup e Escóssia; Rolnik) deriva exatamente desse texto e serve de ponte entre filosofia e pesquisa em design.

---

### Interação revista (30/10/2026, segunda rodada)

| Pedido | Como ficou | Onde |
|---|---|---|
| Projetos aparecem soltos; as ligações surgem à medida que os filtros são aplicados | Nenhuma linha de fuga vem ligada por padrão. O gesto revela nós isolados; cada chip (Ano, Mecanismo, Edital, Escala, Regional) faz crescer as linhas daquela natureza. Uma dica aparece enquanto nenhuma linha está ligada | `js/rizoma.js` (`DEFAULT_ACTIVE`), `#lineHint` no site |
| Explorar o 3D | Botão "3D" (tecla D): o campo ganha profundidade e gira devagar; arrastar o fundo gira à mão. A projeção em perspectiva é feita no próprio sketch (rotação em Y e X, divisão pela profundidade), sem `WEBGL`, para manter texto, `blendMode(ADD)` e o spray iguais nas versões 1.x e 2.x do p5. Nós distantes ficam menores e são desenhados primeiro | `project()`, `unproject()`, `setDepth()` |
| Ao passar o mouse nas linhas, destacar e mostrar a relação construída | Hover numa linha: ela engrossa, os dois nós ganham anel e o rótulo da relação aparece no meio ("MESMO ANO 2023"). Hover num nó: as linhas dele acendem com rótulos (até 6), as demais esmaecem | `updateHover()`, `edgeLabel()` |
| Em vez do tooltip curto, um popup mais visual, como a lateral dos Indicadores, às vezes no rodapé | O motor emite `onHover(info)` e a página desenha um card no canto inferior esquerdo: miniatura da obra (placeholder), ano · mecanismo · circuito, título, valor, escala, nº de linhas ativas e a chamada "clique para abrir o nó". Para linhas, o card mostra os dois projetos e o motivo | `showHoverCard()` em `js/app.js`; `.hover-card` no CSS; `#hcard` no standalone |
| Integração mais fluida | Transição de entrada em cada tela (`viewIn`), botões e chips com transição, nós nascem com easing cúbico, linhas crescem em vez de aparecer, card com fade | `css/style.css`, `drawNode()` |

**Terceira rodada (Pacote 1, 30/10/2026):** o clique passou a abrir uma prévia (painel lateral; folha inferior no celular) com "Explorar projeto"; hover com vizinhança congelada, histerese e ímã sutil; controles em três níveis com menu "Mais"; chips que mostram quantas linhas estão visíveis; trilha clicável no rodapé. Detalhes e o que ficou de fora em `PROPOSTAS-INTERACAO-3D.md`, seção 9.1.

**Quarta rodada (Pacotes 2 e 3, 30/10/2026):** o campo nasce em 3D atrás da capa e a câmera aproxima ao entrar; ao pairar num nó aparecem as ligações possíveis (pontilhadas) e, ao ligar a natureza, os nós se puxam enquanto a linha se forma; a árvore mostra arcos com as relações transversais do nó pairado; entrou a natureza "Curadoria" com relações documentadas em `js/data.js`. Registro em `PROPOSTAS-INTERACAO-3D.md`, seção 9.2.

Caminho futuro para o 3D "de verdade": `createCanvas(w, h, WEBGL)` com `orbitControl()`, `sphere()` para os nós e `strokeShader()`/`p5.strands` (2.x) para linhas com textura de tinta; `worldToScreen()` (2.x) resolve os rótulos. Ficou de fora agora porque em 1.x o texto em WEBGL exige `loadFont` assíncrono e porque a projeção manual já dá a leitura de profundidade com código único para as duas versões.

**OpenProcessing** (https://openprocessing.org/): comunidade onde sketches p5.js são publicados com código aberto. Serve para (a) estudar correlatos de grafos de força, partículas e cartografias generativas, citando cada autor pelo link do sketch, e (b) publicar o Rizoma do Fomento como registro do TCC. Para publicar: colar `js/rizoma.js` + um `sketch.js` em modo global com os dados de `js/data.js` embutidos (o OpenProcessing não lê arquivos relativos por padrão) e marcar a licença (CC BY-NC-SA é a opção comum lá). Nada do código aqui foi copiado de sketches de terceiros; as técnicas de base (forças, ruído de Perlin, projeção em perspectiva) estão citadas na seção 7.

## 3. User flow rizomático (resumo do `R00`)

Não há seta de volta e não há raiz. Todo nó é entrada e saída.

```
[Qualquer entrada]  - gesto ->  (Platô 0: campo vazio + spray)
        |                               |
        |                     nós revelados onde a mão passa
        |                               |
   Indicadores <------> (Campo rizomático: nós + linhas de fuga) <------> Editais
        |                     |        ^         |
        |                 clicar nó   |     cortar linha --> rebrota por outra linha
        |                     v        |
        |              (Nó aberto: ficha traduzida + "seguir linha ->")
        |                     |
        |              fechar nó (trilha fica desenhada)
        |                               |
   Modo Árvore/Decalque <--------------> Modo Rizoma
                                        |
                             Salvar meu mapa (PNG)
```

Regras globais: menu lateral sempre disponível (Indicadores, Editais, Pesquisa, Sobre são platôs ligados lateralmente, não páginas "acima"); controles "pausar" e "reduzir movimento" sempre visíveis; posições são cenográficas (aviso permanente no rodapé); dados não verificados aparecem como "A verificar" e **não geram linhas** (regional `null` não conecta ninguém).

---

## 4. Wireframes (pasta `wireframes/`)

| Arquivo | Tela | Ponto rizomático |
|---|---|---|
| R00 | User flow | sem raiz; nós ligados lateralmente |
| R01 | Entrada / Platô 0 | campo vazio; o gesto cria a entrada |
| R02 | Campo rizomático | nós, linhas de fuga por atributo, legenda monumental/capilar |
| R03 | Nó aberto | ficha traduzida + conexões com o motivo ("mesmo edital"), sem "voltar" |
| R04 | Ruptura e rebrota | antes/depois do corte |
| R05 | Árvore vs Rizoma | decalque oficial lado a lado com o mapa |
| R06 | Mobile + Meu mapa | toque revela; exportar percurso |

Medidas iguais ao kit anterior (1440×1024; mobile 430×932). Grupos com `id` para o painel Camadas do Illustrator. Texto permanece texto.

---

## 5. Ferramentas p5.js usadas (verificadas na referência)

Referência consultada em 30/10/2026: https://p5js.org/reference/ (2.x) e https://v1.p5js.org/reference/ (1.x). Padrão de URL por função: `https://p5js.org/reference/p5/<nome>/` e `https://v1.p5js.org/reference/p5/<nome>/`.

| Para quê | Funções / classes |
|---|---|
| Campo e tela | `createCanvas`, `resizeCanvas`, `windowResized`, `windowWidth/Height`, `pixelDensity`, `background`, `frameRate`, `deltaTime`, `frameCount` |
| Nós e forças (layout dirigido por forças) | `createVector`, `p5.Vector` (`add`, `sub`, `mult`, `mag`, `setMag`, `normalize`, `limit`, `dist`, `lerp`, `fromAngle`, `random2D`), `constrain`, `map`, `lerp`, `dist` |
| Linhas orgânicas | `noise`, `noiseDetail`, `noiseSeed`, `beginShape`, `vertex`, `endShape`, `noFill`, `stroke`, `strokeWeight`, `strokeCap` |
| Spray / tinta persistente | `createGraphics`, `image`, `random`, `randomGaussian`, `randomSeed`, `circle`, `blendMode` (`ADD` no modo escuro) |
| Nós, texto e legenda | `circle`, `fill`, `noStroke`, `text`, `textSize`, `textAlign`, `textFont`, `push`, `pop`, `translate` |
| Gesto (mouse e toque) | `mouseX/Y`, `pmouseX/Y`, `mouseMoved`, `mouseDragged`, `mousePressed`, `touchMoved`, `touchStarted` (1.x), `keyPressed`, `cursor` |
| Interface HTML | `select`, `createButton`, `createDiv`, `p5.Element` (`html`, `style`, `mousePressed`, `addClass`, `removeClass`, `show`, `hide`) |
| Exportar o mapa do visitante | `saveCanvas` (e, opcional, `saveFrames` / `saveGif` para registrar a deriva) |
| Acessibilidade | `describe`, `describeElement` |

Diferenças 1.x → 2.x que importam aqui: `curve()`/`curveVertex()` passaram a `spline()`/`splineVertex()` (por isso o protótipo usa `vertex()` com pontos calculados, que existe nas duas); em 2.x `loadFont`/`loadImage` são assíncronos (`await` dentro de `setup`); em 2.x os eventos `touchStarted/touchMoved` saíram da referência e o toque dispara `mousePressed/mouseDragged` (o sketch define os dois, então funciona nas duas versões). O que é novo em 2.x e pode virar iteração: `textToContours`/`textToPoints` (títulos dos projetos virando partículas de spray), `p5.strands` e `strokeShader` (linhas com textura de tinta na GPU), `paletteLerp`.

Licença: p5.js é software livre sob LGPL 2.1 (Processing Foundation). Créditos a manter no rodapé: "Feito com p5.js".

---

## 6. O que é novo aqui e o que vem de referências (para não plagiar)

O que vem de referências já citadas no TCC e deve continuar citado:

- Metáfora de constelação em fundo escuro: *Information is Beautiful* (McCandless).
- Mapa como repositório de memória, foto da obra como capa: *Negro Muro* e *Arte Fora do Museu*.
- Filtros robustos simplificados: *Prosas* e *Mapa Cultural BH* (como contraponto).

O que esta camada acrescenta e não copia de nenhum desses:

- Conexões por atributo heterogêneo, ligáveis e desligáveis (linhas de fuga).
- Ruptura com rebrota por outro atributo.
- Alternância árvore/decalque ↔ rizoma com os mesmos dados.
- Trilha do visitante como mapa exportável.
- Revelação pelo gesto sem ponto de partida fixo (já existia no protótipo; aqui ganha fundamento).

Técnicas de domínio público/acadêmico (citar a origem, não "inventar"): layout dirigido por forças (Fruchterman & Reingold, 1991); ruído de Perlin (`noise`, Perlin 1985); visualização de redes (Manuel Lima, *Visual Complexity*).

---

## 7. Referências para o TCC (formato ABNT, conferir edições na biblioteca)

DELEUZE, Gilles; GUATTARI, Félix. **Mil platôs**: capitalismo e esquizofrenia, vol. 1. Tradução de Ana Lúcia de Oliveira, Aurélio Guerra Neto e Célia Pinto Costa. São Paulo: Editora 34, 1995. (Capítulo "Introdução: Rizoma".)

PASSOS, Eduardo; KASTRUP, Virgínia; ESCÓSSIA, Liliana da (org.). **Pistas do método da cartografia**: pesquisa-intervenção e produção de subjetividade. Porto Alegre: Sulina, 2009.

ROLNIK, Suely. **Cartografia sentimental**: transformações contemporâneas do desejo. 2. ed. Porto Alegre: Sulina; Editora da UFRGS, 2016.

CANCLINI, Néstor García. **Culturas híbridas**: estratégias para entrar e sair da modernidade. 4. ed. São Paulo: EDUSP, 2006. (já no TCC)

CAIRO, Alberto. **The functional art**: an introduction to information graphics and visualization. Berkeley: New Riders, 2012. (já no TCC)

TUFTE, Edward R. **The visual display of quantitative information**. 2. ed. Cheshire: Graphics Press, 2001. (já no TCC)

LIMA, Manuel. **Visual complexity**: mapping patterns of information. New York: Princeton Architectural Press, 2011.

FRUCHTERMAN, Thomas M. J.; REINGOLD, Edward M. Graph drawing by force-directed placement. **Software: Practice and Experience**, v. 21, n. 11, p. 1129-1164, 1991.

JONES, Jeff. Characteristics of pattern formation and evolution in approximations of Physarum transport networks. **Artificial Life**, v. 16, n. 2, p. 127-153, 2010. (algoritmo de agentes do Lab 04; a implementação em `lab-04-physarum.html` é própria)

PERLIN, Ken. An image synthesizer. **ACM SIGGRAPH Computer Graphics**, v. 19, n. 3, p. 287-296, 1985.

McCARTHY, Lauren; REAS, Casey; FRY, Ben. **Getting started with p5.js**. San Francisco: Maker Media, 2015.

PROCESSING FOUNDATION. **p5.js Reference**. Disponível em: https://p5js.org/reference/. Acesso em: 30 out. 2026.

PROCESSING FOUNDATION. **p5.js 1.x Reference**. Disponível em: https://v1.p5js.org/reference/. Acesso em: 30 out. 2026.

OPENPROCESSING. **OpenProcessing**: creative coding community. Disponível em: https://openprocessing.org/. Acesso em: 30 out. 2026.

VIRA, Patt. **Slime Molds (Physarum)**: coding tutorial. [S. l.]: Patt Vira, 2023. 1 vídeo. Disponível em: https://youtu.be/VyXxSNcgDtg e https://www.pattvira.com/. Acesso em: 30 out. 2026. (referência didática do Lab 04; nenhum código do tutorial foi copiado)

---

## 8. Próximos passos sugeridos

1. Testar o protótipo p5 com 3 a 5 artistas usando o questionário já existente (duas perguntas) e anotar por onde entram e quantas linhas seguem.
2. Verificar regionais no corpus: cada regional confirmada passa a gerar linhas de "território" (hoje `null` não conecta).
3. Decidir no texto do TCC: "posição cenográfica + regional como atributo" em vez de georreferenciamento, citando o rizoma como fundamento.
4. ~~Integrar o sketch ao `index.html` principal como modo "Descobrir"~~ — feito em 30/10/2026 (`js/rizoma.js` + `js/app.js`). Falta validar com a orientadora e testar em celular real.
5. Para testar localmente sem instalar nada: `powershell -NoProfile -ExecutionPolicy Bypass -File _dev/serve.ps1` e abrir http://localhost:8765/ (o p5.js vem de CDN).
6. Rodada 5 (30/10/2026): prévia única para campo, indicadores e treemap; Indicadores reorganizados por Gestalt (cor por mecanismo em todo lugar, resumo fixo do recorte, figura/fundo com a prévia aberta) e mobile-first; capa com outras portas; revelação e sugestão de linha por tempo ocioso. Registro em `PROPOSTAS-INTERACAO-3D.md`, seção 9.3.
7. Rodada 6 (30/10/2026): zoom no campo (roda, pinça, shift+arrastar, teclas e botões) e responsividade consolidada num bloco final de CSS (celular ≤780px e tablet 781–1024px). Ver seção 9.3 de `PROPOSTAS-INTERACAO-3D.md`.
8. Rodada 7 (30/10/2026): árvore/decalque como sumário indentado (3 colunas no desktop, 1 no celular), desenhada na mesma projeção dos nós, com zoom, deslocamento por arrasto e abertura ao soltar.
9. Rodada 8 (30/10/2026): árvore volta ao leque no desktop (escalonada para não cruzar títulos), sumário só no celular; câmera travada para o campo nunca sumir; arcos por baixo e textos com fundo.
10. Rodada 9 (30/10/2026, noite): Lab 03 (`lab-03-mescla.html`) mescla rizoma 3D com cidade desfocada, mancha, palimpsesto e mirante; motor ganhou `transparent`, `ghosts()` e `revealAt()`; toque corrigido no app (`touch-action:none`, revelação ao entrar e por toque). Ver seção 9.4 de `PROPOSTAS-INTERACAO-3D.md`.
