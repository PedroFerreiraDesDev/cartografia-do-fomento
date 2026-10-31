# Cartografia do Fomento — Protótipo Interativo

Esta pasta guarda uma versão editável do protótipo do TCC **Cartografia do Fomento**.

## Arquivos

- `index.html` — estrutura principal da interface.
- `css/style.css` — direção visual, responsividade e animações.
- `js/data.js` — base dos projetos usada pelo protótipo.
- `js/rizoma.js` — motor do campo rizomático em p5.js (modo instância), compartilhado com `rizoma/prototipo-p5/`.
- `js/app.js` — navegação, ligação com o rizoma, páginas de projeto, comentários e indicadores.
- `assets/README.txt` — orientação para inserir fotografias e outros arquivos reais.

## Como testar

Mantenha a mesma estrutura de pastas e abra `index.html` em um navegador.

Como o site carrega scripts, alguns navegadores bloqueiam a abertura direta do arquivo. Para servir a pasta localmente sem instalar nada (Windows):

```
powershell -NoProfile -ExecutionPolicy Bypass -File _dev/serve.ps1 -Port 8765
```

Depois abra http://localhost:8765/ . A biblioteca p5.js vem de CDN (cdnjs), então é preciso conexão com a internet na primeira carga.

A versão anterior à camada rizoma (muros em deriva) está guardada em `_backup/` e em `cartografia-fomento-standalone.html`.

Fluxos disponíveis:
- tela inicial do TCC;
- campo rizomático: nós revelados pelo gesto, linhas de fuga por atributo, corte com rebrota, modo árvore/decalque, exportação do mapa;
- página dedicada de projeto, com a seção "Linhas" (seguir uma linha para outro projeto, trilha do visitante);
- galeria em placeholder;
- fomento, território, comunidade, questionário e fontes;
- indicadores interativos por região, ano, mecanismo e valor;
- clique nos gráficos para voltar aos projetos.

## Onde editar os dados

Edite `js/data.js`.

Campos ainda não verificados devem continuar como `null`. O protótipo mostra esses campos como “A verificar” ou “Não verificada”.

## Fotografias

A versão atual gera placeholders gráficos por código. Quando houver fotografias reais, organize-as em `assets/fotos/` por projeto e acrescente os caminhos ao objeto correspondente em `js/data.js`.

## Atenção acadêmica

Não inferir:
- classe social pela localização;
- raça ou gênero pelo nome/aparência;
- execução apenas porque um projeto foi aprovado;
- local da obra pelo endereço do proponente;
- valores que não estejam documentados.

## Google Drive

O Drive mantém os arquivos acessíveis e editáveis, mas não funciona como hospedagem web do protótipo. Para visualizar o site rodando de forma pública, será preciso publicar a mesma pasta em um serviço como GitHub Pages, Netlify ou Vercel.

## Camada RIZOMA (out/2026)

A pasta `rizoma/` acrescenta a fundamentação em Deleuze & Guattari (rizoma) e um segundo protótipo:

- `rizoma/README-RIZOMA.md` — avaliação do estado atual, princípios do rizoma traduzidos em regras de interface, user flow, referências (ABNT) e funções p5.js usadas.
- `rizoma/wireframes/` — user flow R00 e telas R01–R06 em SVG (abrir `index.html` para ver todas).
- `rizoma/prototipo-p5/index.html` — protótipo em p5.js que lê o mesmo `js/data.js`: nós revelados pelo gesto, linhas de fuga por atributo, corte com rebrota, modo árvore/decalque × rizoma, exportação do mapa do visitante.

Para abrir o protótipo p5 fora do Drive, mantenha a estrutura de pastas (ele busca `../../js/data.js`).


## Laboratório de identidade visual

- `lab-identidade.html` — laboratório generativo separado do protótipo principal.
- usa a mesma base `js/data.js` e p5.js;
- testa grade urbana, horizonte, manchas-nó, linhas de fuga, escala financeira, famílias cromáticas e tipografia em tensão;
- possui controles de ruído, densidade, peso das linhas e escala dos nós;
- permite alternar entre modo papel/asfalto, pausar, gerar nova composição e exportar PNG.

O laboratório é exploratório: suas decisões visuais não devem ser tratadas como identidade final até serem validadas no projeto.


## Lab 02 — Outras Cartografias

- `lab-outras-cartografias.html` — explora quatro sistemas para além de pontos e linhas:
  - Campo de pressão — valor e intensidade deformam uma superfície contínua;
  - Palimpsesto — anos e projetos aparecem como camadas que podem ser desgastadas;
  - Mirante — uma lente móvel evidencia a disputa entre visibilidade e invisibilidade;
  - Trama — projetos tornam-se fios que atravessam mecanismo, tempo e escala.
- usa a mesma base `js/data.js`;
- foi pensado para toque e uso em celular;
- não substitui o Rizoma atual: serve para comparar linguagens cartográficas antes da decisão final.

## Lab 03 — Mescla

- `lab-03-mescla.html` — o rizoma 3D do protótipo (mesmo `js/rizoma.js`) sobre a cidade desfocada do Lab 01, com três camadas do Lab 02 recombinadas: mancha (tinta que segue o gesto e toma a cor do mecanismo do nó mais próximo), palimpsesto (cada nó aberto é carimbado; carimbos novos apagam um pouco os antigos) e mirante (lupa que mostra os nós ainda escondidos e os revela ao clique/toque; tecla L).
- O motor ganhou `transparent`, `ghosts()` e `revealAt()` para isso; nada muda no protótipo principal.
- Avaliação do repositório e da proposta Physarum: `rizoma/AVALIACAO-GITHUB-E-PHYSARUM.md`.

## Lab 04 — Physarum

- `lab-04-physarum.html` — o mesmo rizoma (mesmo `js/data.js` e `js/rizoma.js`, montado com `transparent:true`) sobre um micélio: implementação própria do modelo de agentes de Jeff Jones (2010) para as redes do *Physarum polycephalum*, a terceira forma de ligação do campo, ao lado das linhas de fuga e dos arcos da árvore.
- Os nós revelados são fontes de agentes. Com uma linha de fuga ligada, os nós que compartilham o atributo recebem mais agentes, que depositam mais forte na cor da linha: a rede cresce entre eles. Desligar a linha deixa a rede evaporar.
- Mapa de rastro num `p5.Graphics` a 1/3 da resolução, lido uma vez por quadro; evaporação por retângulo semitransparente; ~2500 agentes no desktop e ~700 no celular, com governador; pausa com a aba oculta; desligado com `prefers-reduced-motion`.
- Ferramentas: chips das seis linhas, 3D, agentes −/+, evaporação (lenta/média/rápida, tecla E), limpar rastro (tecla X), recomeçar. Referências (ABNT) em `rizoma/README-RIZOMA.md`, seção 7; registro da adaptação em `rizoma/PROPOSTAS-INTERACAO-3D.md`, seção 9.5.
- Propostas para o Lab 04 (interação final, forma do nó, descoberta): `rizoma/PROPOSTAS-LAB04.md`.

## Lab 05 — Sistema

- `lab-05-sistema.html` — o site completo (capa, Descobrir, Indicadores, Editais, Pesquisa, Sobre e página de projeto) redesenhado na linguagem do Lab 04, que o autor escolheu como direção. Arquivo separado, com CSS e script próprios; carrega `js/data.js` e `js/rizoma.js` com `?v=` e não altera `index.html`, `css/style.css` nem `js/app.js`.
- O Descobrir é o campo do Lab 04: motor montado com nó "muro", linhas finas (`lineWeight 0.55`), nós espaçados (`spread 1.45`), foco que aproxima, sem spray, margens medidas nos elementos da interface, mais o micélio Physarum (200 agentes e evaporação média por padrão), radar dos escondidos, cursor como alimento, camadas por permanência e "Meu micélio" (tecla M).
- Linguagem estendida às outras páginas: papel `#f7f6f1`, tinta `#161616`, cor por mecanismo (rosa Incentivo Fiscal, azul Fundo Municipal, verde Descentra), cor por natureza de linha (`Rizoma.LINES`) nos acentos dos gráficos e dos editais, títulos condensados (Arial Narrow), linhas finas, poucos elementos. O nó-muro (empena = monumental, fachadas = capilar, área = valor) vira ícone SVG na legenda, no gráfico de escala, na lista lateral, nos editais, na ficha e na página de projeto.
- Uma só ficha (`openPreview`) para campo, indicadores e editais; "Explorar projeto" abre a página inteira; voltar reabre a ficha onde se estava. Mobile-first: faixa curta no topo, ferramentas no pé, ficha como folha inferior.
- Identidade do Lab 01 no sistema: títulos em tipografia em tensão (capa animada, barra, títulos de seção; dados e textos ficam estáveis). A marca da capa é CARTOGRAFIA / DO FOMENTO em tinta sobre o papel (Teko por padrão, uma letra de FOMENTO na cor de um mecanismo) e pulsa sem clique: a cada 4,6 s a cor troca de mecanismo, outra letra de FOMENTO recebe a cor e só a região em volta dela cede; entre pulsos nada se move; toque pausa (WCAG 2.2.2), `prefers-reduced-motion` desliga. A marca do cabeçalho pulsa junto, em miniatura, e clicar nela volta à capa. Painel de experimento tipográfico com testes automáticos opcionais (troca de fonte e peso a cada 6 s), 20 fontes: Arial Narrow, Anton, Oswald, Archivo (variável em peso e largura), Bebas Neue, Big Shoulders, Antonio, Teko, Sofia Sans Extra Condensed, League Gothic, Six Caps, Fjalla One, Barlow Condensed, Bungee, Khand, Rajdhani, Saira Extra Condensed, Staatliches, Squada One, Chakra Petch; peso, pesos por letra e fundo papel/tinta. Busca, árvore/decalque, cortar linha e trilha voltaram do protótipo. Quatro gráficos novos nos Indicadores: régua de valores com o teto do edital, curva de Lorenz com Gini, matriz reordenável das seis linhas de fuga e declive entre períodos; wireframe em `wireframes-svg/12-identidade-e-novos-graficos.svg`. Três gráficos trazidos do Lab 06 para os Indicadores (31/10, noite): **Cordas** (mecanismo × ano, escala ou circuito, SVG com fitas e arcos clicáveis), **Células de valor** (alternativa "muros / células" do gráfico de escala: Voronoi treemap por níveis, coluna = ano, faixa = mecanismo, área = valor, calculado uma vez) e **Mancha que cresce** (abertura animada da seção ano × mecanismo, DLA por ano ao lado das colunas, repetível, estado final com `prefers-reduced-motion`). **Seleção compartilhada** (brushing and linking): passar ou clicar em projeto, ano, mecanismo, escala, circuito ou fita em qualquer gráfico acende o mesmo conjunto em todos os outros, na lista lateral e na ficha, com "limpar seleção"; os chips de linha de fuga da ficha também criam a seleção. **Pop-over de explicação** em cada gráfico ("?", clique ou toque longo no título): o que mostra, por que importa para a tese monumental × capilar, fonte dos dados e crédito do algoritmo; `role="dialog"`, Esc, clique fora, foco de volta; folha inferior no celular. Nota na legenda: monumental e capilar são construções analíticas do autor; valores são tetos aprovados, não captados. Wireframe em `wireframes-svg/13-graficos-lab06-e-popover.svg`; registro em `rizoma/IDENTIDADE-COESAO-LAB05.md`, seções 4 e 5.
- Marca viva (31/10, a partir do experimento 02 do Lab 06): a marca da capa é feita de ~5 mil pontos (≈1,4 mil no celular), cada um uma fração do valor de um dos 20 projetos, em fatias contíguas na ordem do ano (ou mecanismo, ou valor); as partículas chegam com o "arrive" de Reynolds (1999; Shiffman, 2012), os pulsos de tensão continuam (mesma matemática das letras em HTML) e a região colorida é a fatia do projeto da vez; passar a mão mostra o projeto, tocar abre a ficha; botão "marca viva / marca tipográfica" no painel; `window.Lab5Living.play(el)` anima um título de seção do mesmo modo: nos Indicadores, o título da página chega em partículas por mecanismo ao abrir e cada título de gráfico forma-se em tinta uma vez, ao entrar na tela. Registro em `rizoma/IDENTIDADE-COESAO-LAB05.md`, seção 2, quinto ajuste.
- `js/labs-nav.js` — seletor de labs comum a todas as páginas (aba "LABS" na borda esquerda: Protótipo, Labs 01–06, Wireframes, setas anterior/próximo, teclas `[` e `]`). Autocontido: injeta o próprio CSS e resolve os links a partir do caminho do script; basta `<script src="js/labs-nav.js"></script>` antes de `</body>`.
- `rizoma/FONTES-DADOS-E-METODOLOGIA.md` — fontes públicas de dados sobre o fomento em BH (planilhas oficiais do IF 2017–2024/25, editais, DOM, Observatório da Cultura, dados abertos, Mapa Cultural BH, LAI), metodologia (pesquisa documental, análise de conteúdo, estudo de caso, triangulação, RtD) e referências dos gráficos generativos, com a conferência do corpus nas planilhas oficiais (seção 3.16) e o plano para a Tipografia viva e os gráficos do Lab 06. Cópias das planilhas em `dados/fontes/pbh-incentivo-fiscal/`.
- Decisões de coesão em `rizoma/PROPOSTAS-LAB04.md`, seção 12; identidade, defesa das cores, leis de UX aplicadas, gráficos e referências em `rizoma/IDENTIDADE-COESAO-LAB05.md`.

## Lab 06 — Experimentos

- `lab-06-experimentos.html` — laboratório com outra pegada: seis experimentos sobre os mesmos dados (`js/data.js`), com outros algoritmos além do rizoma de força e do Physarum, em abas, um canvas p5.js (modo instância) por vez:
  - para a capa: **Campo de fluxo** (ruído de Perlin como campo vetorial; os projetos soltam partículas proporcionais ao valor e a capa se desenha sozinha) e **Tipografia viva** (o título amostrado em pontos e ocupado por partículas, cada uma uma fração do valor de um projeto; o dedo dispersa, as letras voltam);
  - para os Indicadores: **Células de valor** (Voronoi, diagrama de potência e ajuste iterativo de pesos até a área ser o valor), **Mancha que cresce** (DLA por ano na linha do tempo), **Cordas** (mecanismo × ano, escala ou circuito) e **Rio** (streamgraph ano × mecanismo, onde 2018 e 2020 secam).
- Cada experimento tem nome, pergunta de pesquisa em uma linha, controles mínimos e crédito ao algoritmo de referência (lista ABNT em `rizoma/README-RIZOMA.md`, seção 7). Implementação própria, sem código de terceiros.
- Pesquisa das referências (Negro Muro, Arte Fora do Museu, Information is Beautiful, Prosas, Mapa Cultural BH, OpenProcessing, exemplos do p5.js), o que cada experimento sugere para o protótipo e uma recomendação: `rizoma/PROPOSTAS-LAB06.md`.
- Mobile-first: os handlers de toque do p5 só devolvem `false` quando o evento nasce no canvas; abaixo de 780px o texto vira uma faixa no topo e os controles vão para o rodapé.
