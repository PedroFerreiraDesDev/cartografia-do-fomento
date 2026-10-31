# Identidade e coesão do Lab 05: tipografia em tensão, cores, leis de UX e gráficos novos

Data: 31/10/2026. Pedido do autor: trazer a identidade do Lab 01 (a tensão da cidade na tipografia) para o sistema, manter o Lab 04 como base, defender as três cores, registrar as leis de UX e psicologia aplicadas, propor outros gráficos para os Indicadores (no site e em wireframe) e referenciar tudo o que vem de outras pessoas. Este documento simplifica essas decisões para virar texto do TCC depois. O que está implementado está em `lab-05-sistema.html`; o wireframe é `wireframes-svg/12-identidade-e-novos-graficos.svg`.

## 1. De onde vem cada coisa

| Camada | Vem de | O que ficou |
|---|---|---|
| Campo (Descobrir) | Lab 04 | motor com nó-muro, linhas finas, nós espaçados, foco que aproxima, sem spray, margens medidas na interface, micélio Physarum (200 agentes, evaporação média), radar dos escondidos, cursor como alimento, camadas por permanência, "Meu micélio". O texto do Lab 04 voltou ao canto superior esquerdo, como lá. |
| Estrutura e fluxos | protótipo (`index.html`, `js/app.js`) | capa com portas, cinco seções, uma só ficha (`openPreview`) para campo, indicadores e editais, página de projeto com oito seções, indicadores com legenda por mecanismo, editais por mecanismo, busca como porta direta (tecla `/`), árvore/decalque (tecla A), cortar linha com rebrota (tecla C), trilha clicável. |
| Identidade | Lab 01 | tipografia em tensão nos títulos; a regra "títulos podem tensionar; dados e textos ficam estáveis"; papel e tinta; cor só onde carrega informação. |
| Nó como ícone | Lab 04 (`drawWall`) | o mesmo fragmento de muro, em SVG (`wallIcon`), na legenda, nos gráficos, na lista lateral, nos editais, na ficha e na página do projeto. |

## 2. Tipografia em tensão: a letra sofre a cidade

O Lab 01 (seção 03) propôs: base grotesca neutra, condensada quando possível; interferência generativa de deslocamento, pressão, recorte e micro-rotação; nunca uma "fonte grafite" pronta. O Lab 05 leva isso para o sistema:

- **Mecânica.** Cada letra de um título vira um elemento próprio, deslocado (até 9 px em 148 px de corpo), girado (até 3,2°) e comprimido/esticado (até 12 % na vertical, 6 % na horizontal) por uma função senoidal com semente, a mesma do Lab 01 (`updateType`). As medidas escalam com o corpo da letra, então a marca da barra (15 px) sofre a mesma pressão, só que em miniatura.
- **Onde vive.** Capa (marca grande, animada), barra (marca pequena, estática, amplitude 0,6), título do Descobrir e títulos das seções (estáticos, amplitude de repouso 0,42). Nunca em: fichas, valores, rótulos de gráfico, textos de leitura, nomes de projeto. É a regra do Lab 01 traduzida em CSS: a classe `tense` só entra em `h1`.
- **Animação da capa** *(primeira versão, substituída em 31/10 pela marca viva, abaixo)*. A palavra chega com amplitude 1,5 (mais tensionada que o máximo do Lab 01) e assenta em 1,4 s com ease-out cúbico até o repouso 0,42; depois respira ±0,1 num ciclo de ~11 s. "DO FOMENTO" sofre mais que "CARTOGRAFIA" (fator 1 contra 0,6), como no Lab 01, em que só FOMENTO era distorcido. Tocar no título sorteia outra semente e outra letra isolada. Com `prefers-reduced-motion`, a palavra nasce em repouso e não se mexe.
- **A única cor da capa.** Uma letra de "DO FOMENTO" recebe a cor de um dos três mecanismos, sorteado a cada visita e trocado a cada toque. É a mesma regra do campo (cor = mecanismo) e o item isolado que a memória guarda (Von Restorff).

Por que assim, pelas leis de UX (ver seção 4): Prägnanz (a palavra que assenta dá ao olho a forma estável que ele procura), Doherty (o primeiro quadro já está na tela, nada espera a animação), Von Restorff (a letra isolada), efeito estética–usabilidade (a tensão é identidade, mas não toca o que a pessoa precisa ler com precisão).

**Ajuste de 31/10 (pedido do autor, com o pôster do Lab 01 como exemplo).** A marca passou a ser só `CARTOGRAFIA / FOMENTO`, como no pôster: entreletra fechada (−0,09 em), entrelinha 0,76, letras de FOMENTO coladas e sobrepostas (margem negativa), e a tensão corre pela palavra inteira (fator 2,6 contra 0,35 em CARTOGRAFIA); a letra colorida também desce um pouco, como o E rosa do pôster.

**Experimento tipográfico na capa** (painel no rodapé da capa; a escolha fica só no navegador, em `localStorage`, para comparar; a decisão é do autor):

| Fonte | Tipo | Por que entrou | Licença |
|---|---|---|---|
| Arial Narrow | grotesca condensada do sistema | é a base do Lab 01; fallbacks `Helvetica Neue Condensed`, `Roboto Condensed`, `Liberation Sans Narrow` | sistema |
| Anton | display condensada muito pesada (Vernon Adams) | o peso do pôster do Lab 01; sem eixo variável | SIL OFL |
| Oswald | grotesca condensada, peso variável 200–700 (Vernon Adams; releitura da Alternate Gothic) | permite "brincar com pesos" na mesma família | SIL OFL |
| Archivo | grotesca variável em peso 100–900 **e largura 62–125** (Omnibus-Type) | a única em que a tensão pode deformar a própria letra (largura e peso por letra), não só a posição | SIL OFL |
| Bebas Neue | caixa-alta condensada (Dharma Type) | a condensada mais usada em cartazes; referência de leitura rápida | SIL OFL |
| Big Shoulders Display | condensada, peso variável 100–900 (Patric King), desenhada a partir da sinalização industrial de Chicago | peso variável com desenho de rua, próximo do letreiro | SIL OFL |

Controles: peso (−/+ em passos de 100, dentro do eixo da fonte), **pesos por letra** (em fontes variáveis cada letra recebe um peso e, na Archivo, uma largura diferentes, derivados da mesma semente da tensão: `font-variation-settings`), **fundo papel / tinta** (para comparar com o pôster escuro do Lab 01; o resto do site segue em papel). Todas as fontes vêm do Google Fonts (uma só folha de estilo, `display=swap`); a marca da barra e os títulos de seção seguem a fonte escolhida, para avaliar o sistema inteiro, não só a capa.

**Segundo ajuste de 31/10 (pedido do autor: "deve ser uma animação corrente, sem precisar clicar"; "não tivemos outros testes").**

- **O pôster vira lambe.** A marca da capa deixa de ser texto solto sobre o papel e passa a ser o pôster do Lab 01 inteiro, colado na capa como um lambe-lambe: bloco de tinta, letras de papel, kicker "SISTEMA / 2017—2024" e a linha "TIPO RACIONAL + INTERFERÊNCIA GENERATIVA", com a sombra deslocada do cartaz colado. O lambe é a forma mais barata e mais presente de ocupação gráfica da rua em BH, ao lado do pixo; faz sentido que a identidade entre no sistema como um cartaz colado no muro de papel, e não como um logotipo. Com "fundo · tinta" o lambe inverte (papel sobre tinta).
- **A marca vive, sem clique** *(versão de ondas contínuas, substituída no mesmo dia pelos pulsos, abaixo)*. Em vez de assentar, a tensão agora é contínua: cada letra segue duas ondas lentas (períodos de 3,1 s e 5,3 s, incomensuráveis, logo o padrão nunca se repete) com fase própria, e uma onda de pressão gaussiana atravessa FOMENTO da esquerda para a direita a cada 7,3 s: a letra sob a onda desce, inclina (skew) e, em fonte variável, engorda. A letra colorida troca de mecanismo a cada 11 s. Amplitude entre 0,16 e 0,68 (× 1,9 em FOMENTO, × 0,35 em CARTOGRAFIA), tudo abaixo de 0,35 Hz: é **animação ambiente** (HEAD, 2016), lenta e de pouca amplitude, que não dispara alerta mas que o olho não consegue ignorar, porque movimento em comum agrupa e atrai (lei do destino comum, WERTHEIMER, 1923; YABLONSKI, 2020). Tocar na marca pausa e retoma, cumprindo o critério 2.2.2 da WCAG 2.2 (todo movimento com mais de 5 s precisa de pausa; W3C, 2023); com `prefers-reduced-motion` a marca nasce em repouso e não se mexe. Durações: Laubheimer (NNG, 2020) recomenda transições de interface entre 100 e 500 ms, mas distingue a **animação ambiente**, que pode ser contínua desde que não concorra com a tarefa; na capa não há tarefa além de ler e entrar.
- **Cabe em qualquer fonte.** O corpo da marca é calculado para que CARTOGRAFIA (sem tensão) ocupe a largura interna do lambe, em qualquer fonte e em qualquer tela (`fitMark`); a sobreposição das letras de FOMENTO depende das laterais de cada fonte (−0,03 em na Arial Narrow, −0,012 em na Anton, −0,02 em nas demais). Pela regra do Lab 01, o transbordo faz parte do desenho.
- **Testes automáticos.** Botão "testes automáticos" (ligado por padrão): a cada 6 s a capa troca de fonte na ordem Anton, Oswald, Archivo, Bebas Neue, Big Shoulders, Arial Narrow; nas variáveis alterna peso médio e peso máximo e liga "pesos por letra". O rótulo diz "teste n/6 · fonte peso". Escolher uma fonte à mão desliga o ciclo. É o que o autor pediu: ver as alternativas passando sem clicar, para decidir depois.

O que saiu nesta passagem: a animação de chegada (1,5 → 0,42 em 1,4 s, Prägnanz) e o "toque = outra semente"; a Prägnanz segue valendo para os títulos de seção, que ficam em repouso.

**Terceiro ajuste de 31/10 (autor: "não quero que fique se movimentando; ao trocar de cor as letras mudam de posição e cor, com o tensionamento diferente numa região só; o efeito deve aparecer também no cabeçalho; clicar na marca do cabeçalho volta a onde o site começa").**

- **Pulsos, não ondas.** A animação contínua saiu. A cada 4,6 s acontece um evento: a cor passa ao mecanismo seguinte (rosa → azul → verde), outra letra de FOMENTO recebe a cor e a região em volta dela cede: deslocamento, giro, inclinação e, em fonte variável, peso e largura, com uma gaussiana de σ = 1,6 letras (a letra colorida sofre 1,6 vezes a pressão base; a vizinha 1,2; a seguinte 0,5; o resto 0,25, quase repouso). As letras vão até o novo lugar em 0,55 s (curva ease-out) e ficam paradas até o próximo pulso. Por que assim: a mudança abrupta de posição e cor captura a atenção de forma involuntária (YANTIS; JONIDES, 1984) e, por ser rara, não compete com a leitura do texto da capa, ao contrário do movimento contínuo, que o olho não consegue deixar de acompanhar (HEAD, 2016). A região única mantém a regra do pôster do Lab 01: a cidade pressiona um ponto do muro, não o muro inteiro.
- **O cabeçalho pulsa junto.** A marca pequena "CARTOGRAFIA / DO FOMENTO" da barra recebe o mesmo pulso, no mesmo instante e na mesma cor, com a região caindo numa das duas palavras (amplitude 2,2 para compensar o corpo de 15 px). Assim a identidade continua viva depois que a capa sai, em miniatura e com a mesma lógica (consistência: lei de Jakob; o mesmo gesto significa a mesma coisa em qualquer lugar).
- **Voltar ao início.** Clicar na marca do cabeçalho reabre a capa, onde o site começa (o campo volta ao estado de intro, a ficha fecha). É a convenção da web desde os anos 1990 de que o logotipo no canto superior esquerdo leva à página inicial (NIELSEN, 2000; YABLONSKI, 2020, lei de Jakob), aqui estendida à capa, que é a "casa" do protótipo.
- **Segunda leva de fontes** nos testes automáticos (agora 14, todas do Google Fonts, SIL OFL): Antonio (condensada variável 100–700, da mesma família da Anton), Teko (variável 300–700, desenho quadrado), Sofia Sans Extra Condensed (variável 1–1000, a mais estreita das variáveis), League Gothic (releitura da Alternate Gothic nº 1), Six Caps (ultracondensada, só caixa-alta), Fjalla One (condensada média, de leitura), Barlow Condensed (pesos fixos 400–900, sem eixo variável) e Bungee (desenhada por David Jonathan Ross para letreiros verticais de rua: a mais "sinalização urbana" de todas, embora larga). A ordem do ciclo percorre todas e termina na Arial Narrow, a base do Lab 01.

O que saiu: as duas ondas senoidais e a onda de pressão que atravessava a palavra; a letra colorida que trocava a cada 11 s (agora a troca é o próprio pulso).

## 3. Defesa das cores

**Papel e tinta.** O papel `#f7f6f1` não é branco: é o cimento claro do muro, a superfície que recebe o traço. A tinta `#161616` é o traço. A dupla vem do pixo, que é monocromático por natureza (Lassala, 2010; Pereira, 2005): a escrita da cidade antes da cor. Tudo o que é texto, linha, estrutura, é tinta sobre papel.

**As três cores são do spray.** O grafite, ao contrário do pixo, é policromático e usa cores de alta saturação para vencer o cinza do concreto (Gitahy, 1999; Brighenti, 2010). Rosa, azul e verde saturados são das cores que mais aparecem nos catálogos de spray usados no grafite brasileiro (observação de campo e de catálogos, por exemplo a linha Colorgin Arte Urbana; a conferir e fotografar para o TCC). No sistema cada uma recebe um sentido ligado ao mecanismo que representa:

| Cor | Mecanismo | Por quê |
|---|---|---|
| Rosa `#ff4f9a` | Incentivo Fiscal | é o fomento que depende de patrocínio e visibilidade: a cor mais "publicitária", a que mais chama; os projetos monumentais, de grande valor, são os que aparecem na cidade |
| Azul `#31a8ff` | Fundo Municipal | é o dinheiro direto da Prefeitura: azul é a cor convencional do institucional e do público (bandeiras, repartições, formulários), sem patrocinador |
| Verde `#65e77d` | Descentra | é o edital territorial, de valores menores e pontuação por região: verde é o que cresce de baixo, o capilar, a periferia que brota |

Elas também funcionam como paleta categórica: três matizes afastados no círculo cromático (magenta ≈ 335°, azul ≈ 205°, verde ≈ 130°), com luminosidades diferentes (o verde é o mais claro, o rosa o mais escuro), o que ajuda a distinguir mesmo em cinza (Ware, 2012; Munzner, 2014). Para daltonismo: rosa e verde podem se aproximar na deuteranopia, então a cor nunca é o único código. O nó carrega forma (empena = monumental, fachadas = capilar) e os gráficos carregam posição e rótulo; a cor reforça, não decide (Okabe e Ito, 2008).

**As seis cores das linhas de fuga** (`Rizoma.LINES`: ano amarelo, mecanismo azul-claro, edital rosa-escuro, escala verde-claro, regional lilás, curadoria laranja) são a segunda família, e só aparecem onde a relação aparece: linhas no campo, chips, ligações possíveis, acento dos gráficos correspondentes (Regional, Ano, Escala, Edital), células da matriz. Elas nunca pintam fundo nem título.

**O que não se faz.** Cor decorativa (gradientes, fundos coloridos), cor em texto corrido, a mesma cor para duas coisas diferentes, mais de uma cor por elemento fora dos dois sistemas acima. Toda cor da interface pode ser nomeada: "isto é rosa porque é Incentivo Fiscal", "isto é amarelo porque é a linha Ano".

## 4. Leis de UX e psicologia aplicadas (e onde)

Sínteses a partir de Yablonski (2020) e dos trabalhos originais citados. Cada linha diz onde a lei está no Lab 05, para que a defesa no TCC aponte para algo concreto na tela.

| Lei / efeito | Fonte original | Onde está no Lab 05 |
|---|---|---|
| Lei de Jakob (as pessoas esperam que o site funcione como os outros) | Nielsen (2000) | barra fixa com marca à esquerda e cinco seções à direita; ficha que desliza da direita; folha inferior no celular |
| Lei de Fitts (alvo maior e perto = mais rápido) | Fitts (1954) | botões com 32–40 px de altura; no celular as ferramentas ficam no pé, sob o polegar; o nó em foco cresce 30 % |
| Lei de Hick (mais opções = mais tempo de decisão) | Hick (1952) | seis linhas de fuga, não mais; ferramentas secundárias (agentes, evaporação) depois das primárias; a capa tem um botão principal e três portas |
| Lei de Miller (cerca de sete itens) | Miller (1956) | seis chips; cinco seções na barra; cinco nós na trilha; oito abas no projeto (o limite do aceitável) |
| Prägnanz (o olho busca a forma mais simples) | Wertheimer (1923); Koffka (1935) | a palavra tensionada que assenta; o nó-muro como forma mínima legível |
| Proximidade e região comum | Wertheimer (1923) | ferramentas agrupadas em fitas; legenda em cartões; fatos da ficha em pares rótulo–valor |
| Semelhança | Wertheimer (1923) | cor = mecanismo em todo lugar; forma = circuito em todo lugar; o mesmo ícone do campo nos gráficos |
| Efeito Von Restorff (o diferente é lembrado) | Von Restorff (1933) | a única letra colorida da capa; o nó aberto em tinta cheia; o chip ativo em branco |
| Limiar de Doherty (resposta em menos de 400 ms) | Doherty e Thadani (1982) | hover e ficha respondem no mesmo quadro; a estampa final é gerada em um passo; a animação da capa não bloqueia nada |
| Efeito estética–usabilidade | Kurosu e Kashimura (1995) | a tensão e o micélio dão prazer, mas nunca tocam o que precisa ser lido com precisão (dados estáveis) |
| Efeito Zeigarnik e gradiente de meta (tarefas incompletas puxam) | Zeigarnik (1927); Hull (1932) | contador "7 / 20 nós"; radar dos escondidos; "ainda escondido" na ficha com os nomes |
| Regra do pico–fim (lembramos o pico e o fim) | Fredrickson e Kahneman (1993) | "Meu micélio": a visita termina numa estampa própria, para baixar |
| Posição serial (primeiro e último ficam) | Ebbinghaus (1885); Murdock (1962) | Descobrir é a primeira seção e Sobre a última; na ficha, o título primeiro e a trilha por último |
| Lei de Tesler (a complexidade não some, muda de lugar) | Saffer (2010), entrevista com Larry Tesler | as margens do campo são medidas pela interface, não ajustadas pela pessoa; a busca tolera acentos e maiúsculas |
| Efeito de posição do polegar / mobile-first | Hoober (2013) | faixa curta no topo, ferramentas no pé, ficha como folha |

## 5. Gráficos novos nos Indicadores

Os quatro gráficos abaixo entraram no Lab 05 (seção Indicadores, depois do gráfico de escala) e no wireframe 12. Todos usam a mesma medida (quantidade ou valor) dos gráficos antigos, o mesmo hover (pré-visualiza na lista lateral) e o mesmo clique (fixa o recorte ou abre a ficha). Os dados são os de `js/data.js`; nenhum valor foi inventado.

| Gráfico | Pergunta que responde | Codificação | Interação | Por que este e não outro | Fonte |
|---|---|---|---|---|---|
| **Régua de valores** | Quem chega ao teto? Onde cada mecanismo se concentra na escala? | posição do nó-muro ao longo de uma régua comum, uma linha por mecanismo; linhas de referência em R$ 30 mil, R$ 100 mil e R$ 165 mil (teto IF 2023, TCC 5.1) | pairar = projeto na lista lateral; clicar = ficha | posição numa escala comum é a codificação que o olho lê com mais precisão; o treemap antigo codificava por área, a menos precisa; as linhas de referência vêm do bullet graph | Cleveland e McGill (1984); Few (2006) |
| **Curva de Lorenz** | Quão concentrado é o fomento? | projetos em ordem de valor no eixo x, valor acumulado no y; diagonal de igualdade; índice de Gini e duas frases ("os 5 maiores somam x %") | pontos = projetos (cor = mecanismo), hover e clique como acima | mostra o que as Tabelas 1 e 2 dizem juntas: o circuito monumental concentra quase metade do valor; um número (Gini) resume para o texto | Lorenz (1905); Gini (1912) |
| **Matriz de relações** | Quem se liga a quem, e por quais naturezas? | 20 × 20; célula com 1 natureza = cor daquela linha; com várias = tinta mais escura; ordem reordenável (mecanismo, ano, valor) | pairar = o par e as naturezas na lista lateral; clicar = fixa o par; botões reordenam | é o campo visto de cima: as seis linhas de fuga como matriz; a ordem revela blocos (edital, ano) que o campo mostra só por hover | Bertin (1967) |
| **Declive** | O que cresceu e o que secou entre 2017–2021 e 2022–2024? | uma linha por mecanismo entre dois períodos; rótulos nas pontas, afastados quando coincidem | pairar = mecanismo; clicar = fixa | compara dois momentos sem eixo decorativo; os períodos separam o antes e o depois do teto de 2023 ficar documentado | Tufte (2001) |

Deixados de fora, e por quê: gráfico de pizza (ângulo é codificação imprecisa, Cleveland e McGill, 1984); mapa de BH (as regionais ainda não estão verificadas: mostrar um mapa inferiria localização, o que o TCC proíbe); rede de força nos Indicadores (já é o campo). Os experimentos do Lab 06 (campo de fluxo, tipografia viva, células de Voronoi, DLA, cordas, rio) são outra família e seguem lá até o autor escolher.

## 6. O que saiu do Lab 05 e o que voltou

Na primeira versão do Lab 05 (31/10, manhã) saíram, para "poucos elementos": busca, menu "Mais", árvore/decalque, corte com botão, modo escuro, card de hover do rodapé, tooltip flutuante dos gráficos. O autor pediu fidelidade ao Lab 04 e ao que o protótipo já definiu; então **voltaram**: busca (porta direta, tecla `/`), árvore/decalque (tecla A), cortar linha (tecla C), trilha clicável no rodapé, o botão "Nó · muro / círculo" do Lab 04 e o texto do Lab 04 no canto do campo. **Continuam fora**: modo escuro (as camadas do micélio não têm versão escura; a tecla T devolve ao papel), card de hover do rodapé (o Lab 04 tem a pista por permanência, melhor), tooltip flutuante dos gráficos (a lista lateral já pré-visualiza; um balão a mais seria elemento a mais), menu "Mais" (as ações cabem na fita).

## 7. Para decidir com o autor

1. A fonte condensada definitiva (seção 2).
2. Se a tensão entra também nos títulos das seções do projeto (hoje só capa, barra, Descobrir e heróis das páginas).
3. Qual dos quatro gráficos novos vai para o protótipo principal, e se algum antigo (treemap de escala) sai para dar lugar.
4. Fotografar catálogos de spray e muros de BH para a defesa das cores (seção 3) virar evidência, não só argumento.

## 8. Referências (ABNT; conferir edições na biblioteca)

BERTIN, Jacques. **Sémiologie graphique**: les diagrammes, les réseaux, les cartes. Paris: Mouton; Gauthier-Villars, 1967.

BRIGHENTI, Andrea Mubi. At the wall: graffiti writers, urban territoriality, and the public domain. **Space and Culture**, v. 13, n. 3, p. 315-332, 2010.

CLEVELAND, William S.; McGILL, Robert. Graphical perception: theory, experimentation, and application to the development of graphical methods. **Journal of the American Statistical Association**, v. 79, n. 387, p. 531-554, 1984.

DOHERTY, Walter J.; THADANI, Ahrvind J. **The economic value of rapid response time**. Armonk: IBM, 1982. (Technical Report GE20-0752-0.)

EBBINGHAUS, Hermann. **Über das Gedächtnis**: Untersuchungen zur experimentellen Psychologie. Leipzig: Duncker & Humblot, 1885.

FEW, Stephen. **Information dashboard design**: the effective visual communication of data. Sebastopol: O'Reilly, 2006.

FITTS, Paul M. The information capacity of the human motor system in controlling the amplitude of movement. **Journal of Experimental Psychology**, v. 47, n. 6, p. 381-391, 1954.

FREDRICKSON, Barbara L.; KAHNEMAN, Daniel. Duration neglect in retrospective evaluations of affective episodes. **Journal of Personality and Social Psychology**, v. 65, n. 1, p. 45-55, 1993.

GINI, Corrado. **Variabilità e mutabilità**: contributo allo studio delle distribuzioni e delle relazioni statistiche. Bologna: Cuppini, 1912.

GITAHY, Celso. **O que é graffiti**. São Paulo: Brasiliense, 1999. (Coleção Primeiros Passos.)

HICK, William E. On the rate of gain of information. **Quarterly Journal of Experimental Psychology**, v. 4, n. 1, p. 11-26, 1952.

HOOBER, Steven. How do users really hold mobile devices? **UXmatters**, 18 fev. 2013. Disponível em: https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php. Acesso em: 31 out. 2026.

HULL, Clark L. The goal-gradient hypothesis and maze learning. **Psychological Review**, v. 39, n. 1, p. 25-43, 1932.

KOFFKA, Kurt. **Principles of Gestalt psychology**. London: Kegan Paul, Trench, Trubner, 1935.

KUROSU, Masaaki; KASHIMURA, Kaori. Apparent usability vs. inherent usability: experimental analysis on the determinants of the apparent usability. In: CONFERENCE COMPANION ON HUMAN FACTORS IN COMPUTING SYSTEMS (CHI '95), 1995, Denver. **Proceedings** [...]. New York: ACM, 1995. p. 292-293.

LASSALA, Gustavo. **Pichação não é pixação**: uma introdução à análise de expressões gráficas urbanas. São Paulo: Altamira, 2010.

LORENZ, Max O. Methods of measuring the concentration of wealth. **Publications of the American Statistical Association**, v. 9, n. 70, p. 209-219, 1905.

MILLER, George A. The magical number seven, plus or minus two: some limits on our capacity for processing information. **Psychological Review**, v. 63, n. 2, p. 81-97, 1956.

MUNZNER, Tamara. **Visualization analysis and design**. Boca Raton: CRC Press, 2014.

MURDOCK, Bennet B. The serial position effect of free recall. **Journal of Experimental Psychology**, v. 64, n. 5, p. 482-488, 1962.

HEAD, Val. **Designing interface animation**: meaningful motion for user experience. Brooklyn: Rosenfeld Media, 2016.

LAUBHEIMER, Page. Animation duration and motion characteristics in user interface design. **Nielsen Norman Group**, 2 fev. 2020. Disponível em: https://www.nngroup.com/articles/animation-duration/. Acesso em: 31 out. 2026.

NIELSEN, Jakob. End of web design. **Nielsen Norman Group**, 23 jul. 2000. Disponível em: https://www.nngroup.com/articles/end-of-web-design/. Acesso em: 31 out. 2026.

OKABE, Masataka; ITO, Kei. **Color universal design (CUD)**: how to make figures and presentations that are friendly to colorblind people. 2008. Disponível em: https://jfly.uni-koeln.de/color/. Acesso em: 31 out. 2026.

PEREIRA, Alexandre Barbosa. **De "rolê" pela cidade**: os "pixadores" em São Paulo. 2005. Dissertação (Mestrado em Antropologia Social) – Faculdade de Filosofia, Letras e Ciências Humanas, Universidade de São Paulo, São Paulo, 2005.

SAFFER, Dan. **Designing for interaction**: creating innovative applications and devices. 2. ed. Berkeley: New Riders, 2010. (Entrevista com Larry Tesler sobre a conservação da complexidade.)

TUFTE, Edward R. **The visual display of quantitative information**. 2. ed. Cheshire: Graphics Press, 2001. (gráfico de declive: capítulo sobre tabelas-gráficos.)

VON RESTORFF, Hedwig. Über die Wirkung von Bereichsbildungen im Spurenfeld. **Psychologische Forschung**, v. 18, p. 299-342, 1933.

WARE, Colin. **Information visualization**: perception for design. 3. ed. Waltham: Morgan Kaufmann, 2012.

W3C. **Web Content Accessibility Guidelines (WCAG) 2.2**: success criterion 2.2.2, pause, stop, hide. W3C Recommendation, 5 out. 2023. Disponível em: https://www.w3.org/TR/WCAG22/. Acesso em: 31 out. 2026.

WERTHEIMER, Max. Untersuchungen zur Lehre von der Gestalt II. **Psychologische Forschung**, v. 4, p. 301-350, 1923.

YANTIS, Steven; JONIDES, John. Abrupt visual onsets and selective attention: evidence from visual search. **Journal of Experimental Psychology: Human Perception and Performance**, v. 10, n. 5, p. 601-621, 1984.

YABLONSKI, Jon. **Laws of UX**: using psychology to design better products & services. Sebastopol: O'Reilly, 2020. Site: https://lawsofux.com/. Acesso em: 31 out. 2026.

ZEIGARNIK, Bluma. Das Behalten erledigter und unerledigter Handlungen. **Psychologische Forschung**, v. 9, p. 1-85, 1927.

Referências já listadas em `rizoma/README-RIZOMA.md`, seção 7, e usadas aqui: Deleuze e Guattari (1995), Jones (2010), Canclini (2006), Cairo (2012). Nenhum código de terceiros foi copiado: a tensão tipográfica é a função do Lab 01 (própria); os gráficos são SVG gerado à mão no script do Lab 05.
