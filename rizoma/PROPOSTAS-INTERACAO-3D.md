# Cartografia do Fomento — propostas de interação, 3D e relações entre projetos

Documento de exploração, 30/10/2026. Nada aqui foi implementado: o objetivo é comparar alternativas, com vantagens, limitações e referências, para então decidir o que entra, preservando o que já funciona. O brief recebido usa a palavra "portfólio"; aqui tudo é lido para a Cartografia do Fomento (site em `index.html` + `js/rizoma.js` e protótipo standalone em `rizoma/prototipo-p5/`).

Legenda de esforço: **P** pequeno (horas), **M** médio (um ou dois dias), **G** grande (semana ou mais, envolve nova biblioteca ou renderizador).

---

## 0. O que existe hoje (diagnóstico ponto a ponto)

Testado no servidor local em 30/10/2026, desktop e viewport de celular.

| Ponto do brief | Estado atual na Cartografia | Evidência observada |
|---|---|---|
| 1. 3D desde o início | O 3D é um botão (tecla D), desligado por padrão. A tela de entrada ("Entrar na experiência") é HTML puro, sem campo atrás. A projeção é feita no próprio sketch (sem WEBGL) e funciona; só não está na abertura | Ao entrar, o campo aparece em 2D; o 3D exige clique |
| 2. Relações entre projetos (rizoma) | As relações existem e não se perderam: cinco naturezas de linha (ano, mecanismo, edital, escala, regional). Pela decisão da rodada anterior, **nenhuma vem ligada**; os projetos nascem soltos até a pessoa ligar um chip. No modo Árvore, as relações transversais **não aparecem**: só a hierarquia Mecanismo → Ano → Projeto | Contador "10/20 nós · 0 linhas" até ligar um chip; em Árvore, 0 linhas de fuga visíveis |
| 3. Hover | Hover em nó: anel, rótulo, linhas acesas, outras esmaecidas, card no rodapé. Hover em linha: engrossa e mostra a relação. O problema de "projetar" não ocorre (o nó não cresce), mas o **campo continua derivando** enquanto se mira: o alvo pode escapar; em 3D o giro automático agrava | Nós movem até 3,5 px/quadro; giro de 0,0012 rad/quadro em 3D |
| 4. Clique abre a página completa | No site, clicar no nó troca de tela (página do projeto, com "Fechar nó · a trilha fica"). No standalone, abre painel lateral sem sair do campo. **Não há pré-visualização** no site: o primeiro clique já é a página inteira | `openProject()` em `js/app.js` |
| 5. Botões | A faixa de ferramentas é HTML sobre o canvas (chips de linhas, Árvore, 3D, Cortar, Pausar, Reduzir movimento, Modo escuro, Salvar, Recomeçar): nove controles de mesmo peso, sem relação com o que acontece na cena. No celular viraram uma faixa rolável | Captura em 375 px: a faixa cobre um quarto da tela |
| 6. Navegação fluida | Telas trocam por `display:none`; o campo continua vivo e retoma a posição ao fechar o nó (trilha e nós preservados). Há animação de entrada (`viewIn`) nas páginas de texto. Não há transição entre nó e página: o corte é seco | `showPage()` e `R.setVisible()` |
| 7. Referências | README-RIZOMA cita Negro Muro, Arte Fora do Museu, Information is Beautiful, Prosas, Mapa Cultural BH, OpenProcessing | Falta uma leitura de experiências espaciais e de redes (feita abaixo) |
| 8. Direção visual | Modo papel (branco, spray cinza, tinta) e modo escuro (constelação do TCC). Rizoma como fundamento; dados não verificados visíveis e sem linha | Seção "Sobre" do site |

O que já funciona bem e deve ser preservado: a revelação pelo gesto; as linhas que crescem com ruído; o hover em linha com o nome da relação; o corte com rebrota; a trilha do visitante; a honestidade dos dados ("A verificar" não conecta); modo papel × escuro; "Reduzir movimento".

---

## 1. 3D desde a abertura

**Pergunta de projeto:** o 3D é a cena principal ou um modo de exploração? O brief pede que faça parte de toda a navegação, com continuidade visual e boa performance.

| Alternativa | Como seria | Vantagens | Limitações | Esforço |
|---|---|---|---|---|
| **1A. Campo vivo atrás da capa, em 3D, desde o primeiro quadro** | O canvas já nasce sob a tela de entrada: 20 nós escuros girando devagar em perspectiva, ainda não revelados (só o spray e pontos apagados). "Entrar" não troca de tela: o título sobe, a câmera aproxima e o campo fica interativo. A mesma instância continua até o fim | Continuidade total; a entrada já ensina a profundidade; usa o motor que existe (`setDepth(true)` no mount) | Primeira pintura mais pesada (p5 + canvas antes do texto); exige "entrar" com `prefers-reduced-motion` em versão estática; a capa precisa de contraste sobre um fundo em movimento | **M** |
| **1B. 3D sempre ligado, 2D como opção** | Igual a hoje, mas com `depth:true` por padrão e o botão invertido ("Ver plano") | Trivial de fazer; não muda a capa | Não resolve a "integração à apresentação inicial"; o giro contínuo atrapalha o hover (ver §3) | **P** |
| **1C. WEBGL de verdade (p5 `WEBGL` ou three.js)** | Nós como esferas com luz, linhas como tubos ou shader de tinta, `orbitControl`, névoa de profundidade | Profundidade real (oclusão, luz), muito mais vocabulário visual; em p5 2.x, `strokeShader`/`p5.strands` dariam textura de spray nas linhas | Em p5 1.x o texto em WEBGL exige `loadFont` e perde o `blendMode(ADD)` barato; `orbitControl` tem relatos de rigidez e de só funcionar após toque no iOS; três.js é outra biblioteca para manter; performance em celular intermediário cai (raycasting sem índice espacial testa todos os triângulos: precisa de BVH ou picking por plano) | **G** |
| **1D. Profundidade "falsa" reforçada no motor atual** | Manter a projeção manual e acrescentar o que falta para ler profundidade: névoa (alpha por z), tamanho por z (já existe), paralaxe do spray em camadas, sombra projetada no "chão" | Custo baixo; continua compatível com 1.x e 2.x; nenhuma dependência nova | Não há oclusão real nem luz; linhas longas em 3D cruzam de forma confusa (visto no teste: dobram sobre si) | **P/M** |

**Leitura:** 1A + 1D entregam o que o brief pede com o motor que existe; 1C fica como etapa futura se a orientação quiser o 3D como peça central da defesa. Referência de prudência: avaliações de sites premiados insistem que uma cena 3D a 18 fps num Android médio perde a avaliação, e que o 3D deve ser camada sobre conteúdo que já funciona sem ele.

---

## 2. Relações entre projetos: recuperar a presença do rizoma sem perder os filtros

Há uma tensão entre a rodada anterior ("projetos soltos, linhas só com filtro") e o brief ("não devem parecer isolados"). As alternativas conciliam as duas.

| Alternativa | Como seria | Vantagens | Limitações | Esforço |
|---|---|---|---|---|
| **2A. Linhas latentes** | Todas as relações existem sempre, desenhadas a 6–8% de opacidade (um "sub-solo"); ligar um chip traz aquela natureza a 100% e com rótulos | O campo nunca parece isolado; a pessoa vê que há relações antes de escolher qual ler; é literalmente o rizoma subterrâneo | 92 a 133 linhas fracas podem virar "cabelo" (crítica recorrente ao graph view do Obsidian); exige calibrar opacidade por modo papel/escuro | **P** |
| **2B. Uma linha ligada por padrão** | Entrar com "Ano" (ou "Mecanismo") ligado; as outras naturezas continuam opcionais | Simples; todo nó tem pelo menos uma relação visível | Escolhe por quem visita; perde o efeito "as relações nascem com o filtro" | **P** |
| **2C. Sugestão contextual** | Campo começa solto; quando a pessoa revela o 4º nó, uma linha "pulsa" de amostra entre dois deles e aparece um convite "ligar Ano?"; no hover de um nó solto, linhas fantasmas mostram para onde ele se ligaria | Mantém a descoberta progressiva e ainda assim nunca deixa o nó parecer ilha | Mais lógica de estado; precisa de testes com pessoas para calibrar o momento | **M** |
| **2D. Relações na Árvore** | No decalque, ao pairar/abrir um nó, desenhar arcos pontilhados até os nós ligados em outras colunas (ano ↔ ano, escala ↔ escala) e um botão "mostrar todas as transversais" | Responde diretamente ao brief ("na visualização em árvore, essas relações precisam ficar evidentes"); reforça a tese mapa × decalque: a árvore esconde o que o rizoma mostra | Arcos entre colunas cruzam os conectores retos; precisa de curvas por cima (desenho em ordem) e rótulo só no hover | **M** |
| **2E. Relações conceituais além dos dados** | Hoje as linhas vêm de atributos do corpus. Acrescentar uma natureza editorial, "relação curatorial" (ex.: "mesmo coletivo", "mesma empena", "continuidade de edição: CURA 2017 → CURA 2021"), cadastrada em `js/data.js` com fonte documental | É o que torna as relações "conceituais, criativas e processuais", como pede o brief; dá conteúdo para o TCC (relações verificadas, não inferidas) | Exige pesquisa documental por relação; sem fonte, não entra (regra do projeto) | **M** (código P, pesquisa G) |

**Leitura:** 2A (latentes) + 2D (árvore) + 2E (relações curatoriais, quando houver fonte). 2C é a mais elegante, mas só vale depois de testar 2A.

Referências: a documentação da sigma.js para realçar a vizinhança no hover e esmaecer o resto (padrão já adotado aqui); a defesa e a crítica do graph view do Obsidian (bonito, mas inútil quando vira novelo: escala e filtros importam); 3d-force-graph de Vasturiano como referência de grafo de forças em 3D com modo DAG (árvore) e destaque de vizinhos.

---

## 3. Hover: expressivo sem atrapalhar

| Alternativa | Como seria | Vantagens | Limitações | Esforço |
|---|---|---|---|---|
| **3A. Congelar a vizinhança** | Ao pairar, o nó e seus vizinhos de 1º grau param de derivar; o resto continua lento. Em 3D, o giro automático pausa enquanto o mouse estiver sobre o canvas | Alvo estável para clicar; preserva a vida do campo fora da área de atenção | Em 3D, parar o giro ao entrar com o mouse faz o campo "travar" sempre que a mão passa; melhor pausar só com nó/linha sob o cursor | **P** |
| **3B. Histerese e zona de captura** | Raio de captura maior para sair do hover do que para entrar; "ímã" suave que aproxima o nó do cursor em 2–4 px quando pairado | Menos pisca-pisca; sensação de aderência sem o nó "saltar" | O ímã pode ser lido como projeção se exagerar; manter abaixo de 4 px | **P** |
| **3C. Realce por luz, não por escala** | Confirmar a regra atual: no hover o nó não cresce; ganha anel, brilho (modo escuro) ou tinta (papel) e as linhas acendem. O card no rodapé faz a leitura | Coerente com "as animações devem valorizar, não atrapalhar" | Nenhuma | já existe |
| **3D. Hover em linha com arrasto** | Pairar numa linha mostra a relação (existe); arrastar ao longo dela leva o cursor até o outro nó com o rótulo seguindo ("seguir a linha" com a mão) | Transforma a linha em caminho, não só em rótulo | Conflita com o arrasto que gira o 3D e com o modo cortar; precisa de gesto distinto (clique na linha = seguir) | **M** |

**Leitura:** 3A + 3B agora; 3D como experimento no standalone.

---

## 4. Clique: pré-visualização antes da página

| Alternativa | Como seria | Vantagens | Limitações | Esforço |
|---|---|---|---|---|
| **4A. Painel lateral integrado (igual ao standalone)** | O primeiro clique abre, no próprio site, o painel que já existe no standalone: tradução do editalês, fatos, "seguir uma linha", trilha, e o botão **"Explorar projeto"** (página completa) | Já está escrito (`#panel` do standalone); mantém o campo visível com as linhas do nó acesas; em 3D a árvore já cede espaço ao painel (`panelWidth`) | Em telas estreitas o painel vira folha inferior (bottom sheet); a página do projeto precisa de um caminho de volta ao mesmo estado | **P/M** |
| **4B. Card que expande a partir do nó (FLIP)** | O card do rodapé "voa" do nó para uma janela sobreposta (técnica FLIP: medir, trocar o DOM, animar a diferença), com as linhas continuando visíveis por trás, esmaecidas | Continuidade visual forte (o mesmo objeto cresce); a rede fica no contexto | Mais código de animação (GSAP Flip ou FLIP manual); sobreposição cobre parte da rede; acessibilidade de foco e Esc precisa cuidado | **M** |
| **4C. Folha inferior em todas as larguras** | Em vez de lateral, uma folha que sobe do rodapé (onde já fica o card de hover), com 40% da altura, arrastável | Um só padrão para desktop e celular; perto de onde o olho já está | Cobre a parte de baixo do campo, onde nós costumam estar; menos espaço para "seguir linhas" | **P/M** |
| **4D. Seleção que reorganiza o campo** | Ao selecionar, o nó vai ao centro, vizinhos formam um anel, o resto recua em profundidade (em 3D, para trás) | Mostra "a posição dentro da rede" literalmente, como o brief pede | Reorganizar a cada clique perde o mapa mental; precisa de retorno suave ao fechar | **M** |

Regras independentes da alternativa: o botão da página completa se chama "Explorar projeto"; a pré-visualização mantém as linhas do nó acesas e as outras esmaecidas (já ocorre com `focus`); fechar devolve ao mesmo ponto (já ocorre). Guia de padrões de interface: painéis laterais para quando a pessoa precisa continuar vendo a lista ou cena atrás; modais só para tarefas curtas e obrigatórias; páginas próprias para leitura longa. A pré-visualização é o primeiro caso.

**Leitura:** 4A como base (menor custo, código existente), com 4D opcional como "modo foco" dentro do painel.

---

## 5. Botões como parte do universo

| Alternativa | Como seria | Vantagens | Limitações | Esforço |
|---|---|---|---|---|
| **5A. Hierarquia em três níveis** | Primário: chips de linhas de fuga (são a ação central). Secundário: Rizoma/Árvore, 3D. Terciário, num menu "⋯": Cortar, Pausar, Reduzir movimento, Modo escuro, Salvar, Recomeçar | Nove controles viram três grupos legíveis; a faixa do celular encolhe | Esconde "Reduzir movimento" num menu: manter atalho visível (ícone) por acessibilidade | **P** |
| **5B. Controles que reagem à cena** | O chip de uma linha pulsa quando a linha cresce; o chip ganha a cor só quando há pelo menos uma relação visível; "Cortar" só aparece quando existem linhas; contador vira texto vivo ("20 nós · 3 linhas de ano crescendo") | A interface "sabe" o que está acontecendo | Mais estados para manter sincronizados | **P/M** |
| **5C. Controles desenhados no canvas** | Chips e botões desenhados pelo p5 dentro da cena, com profundidade e movimento | Unidade estética total | Perde acessibilidade nativa (foco, leitor de tela, toque); o projeto tem compromisso com acessibilidade, então não recomendado | **M** |
| **5D. Menu radial no nó** | Ao selecionar um nó, ações contextuais aparecem ao redor dele (abrir, seguir linha, cortar ligações, fixar) | Ações onde a atenção está | Dificulta no toque; aprendizado | **M** |

**Leitura:** 5A + 5B. Evitar 5C.

---

## 6. Navegação fluida entre campo, prévia e página

| Alternativa | Como seria | Vantagens | Limitações | Esforço |
|---|---|---|---|---|
| **6A. Página do projeto como camada sobre o campo** | A página abre como folha que sobe sobre o canvas (o campo fica visível, escurecido, com as linhas do nó acesas no topo); fechar desce a folha. Indicadores e Editais continuam telas próprias | Nunca se perde a referência de onde se estava; o campo não para | A página é longa; a folha precisa rolar internamente (já é `overflow:auto`) | **P/M** |
| **6B. View Transitions API (mesmo documento)** | `document.startViewTransition()` ao trocar de tela: o card de hover ou o título do nó viram elemento compartilhado com o título da página | Transição nativa, sem biblioteca; Chrome/Edge 111+, Safari 18+; Firefox parcial | Degrada para corte seco onde não há suporte (aceitável); exige `view-transition-name` nos pares | **P** |
| **6C. Trilha como navegação** | A trilha (já desenhada) vira barra clicável: "CURA → MAMU → Nuhi"; clicar volta àquele nó com a câmera | Responde a "retornar sem perder a referência"; dá nome à multiplicidade | Barra ocupa espaço; limitar aos últimos 5 | **P** |
| **6D. Câmera que acompanha** | Em 3D, abrir um nó aproxima a câmera dele; fechar recua | Continuidade espacial | Precisa de easing e limite para não enjoar; respeitar movimento reduzido | **M** |

**Leitura:** 6A + 6B + 6C. 6D junto com 1A.

---

## 7. Referências (o que extrair e o que não copiar)

| Referência | O que mostra | O que serve à Cartografia | O que não copiar |
|---|---|---|---|
| 3d-force-graph (Vasturiano) — https://github.com/vasturiano/3d-force-graph | Grafo de forças em 3D com three.js, modo DAG (árvore), destaque de vizinhos, imagens como nós | Modelo mental de "mesmo grafo, layout de força ou de árvore" (nosso rizoma × decalque); exemplos de destaque | A biblioteca em si (dependência pesada); nós como esferas genéricas |
| sigma.js, guia "hover and search" — https://www.sigmajs.org/ | Realce da vizinhança no hover, esmaecer o resto, busca que leva a câmera ao nó | Padrão de hover já adotado; a busca por nome de projeto ou coletivo é uma lacuna nossa | Estética neutra de dashboard |
| Obsidian graph view (defesa e crítica) — https://www.eleanorkonik.com/its-not-just-a-pretty-gimmick-in-defense-of-obsidians-graph-view e https://codeculture.store/blogs/developer-culture/obsidian-graph-view-useful | Grafo bonito que vira novelo sem filtros; útil para ver aglomerados e nós isolados | Argumento para linhas latentes fracas + filtros fortes; mostrar nós isolados como informação (projeto sem relações verificadas) | Deixar todas as relações a 100% |
| Kumu — https://kumu.io | Mapas de sistemas com codificação por espessura, cor, proximidade | Vocabulário de codificação: espessura da linha por força da relação (ex.: mesmo edital > mesmo ano) | Interface de ferramenta |
| Negro Muro e Arte Fora do Museu (já no TCC) | Mapa como memória; ficha de obra | Capa da prévia com a obra, quando houver foto autorizada | Georreferenciamento como obrigação |
| Bruno Simon — https://bruno-simon.com | Portfólio-jogo em 3D, Site of the Year 2020 | Prova de que o 3D pode ser a própria navegação; e de que o custo é a pessoa que só quer achar uma informação | A lógica de jogo; aqui o público (artistas, gestores) precisa chegar ao dado |
| Roteiros Awwwards/FWA 2026 — https://www.hontran.dev/blog/best-award-winning-websites-2026 | Júri testa em aparelho real; 3D a 18 fps perde | Orçamento de performance antes de WEBGL; medir em Android médio | Efeitos de agência sem conteúdo |
| 3D como aprimoramento progressivo — https://studiomeyer.io/en/blog/3d-webdesign-webgl e https://sahad.is-a.dev/blog/fast-3d-hero-on-mobile | Base acessível primeiro; 3D só em aparelho capaz; fallback estático no celular; profundidade com CSS quando basta | Nossa projeção manual é exatamente o "3D barato"; manter o fallback de movimento reduzido | Carregar bundle 3D antes do conteúdo |
| GSAP Flip e o efeito "App Store card" — https://gsap.com/docs/v3/Plugins/Flip | Elemento que cresce do card para o detalhe | Alternativa 4B | Dependência se a 4A bastar |
| View Transitions API — https://developer.chrome.com/docs/web-platform/view-transitions/same-document | Transições nativas entre estados; elemento compartilhado | Alternativa 6B | Depender dela como única transição (Firefox parcial) |
| three.js, custo de raycasting e hover — https://discourse.threejs.org/t/significant-performance-drop-with-raycaster/53622 | Raycaster sem índice espacial testa tudo; BVH ou plano de acerto; sem hover no toque | Se um dia houver WEBGL: picking por plano, tap-para-destacar | Raycast por quadro no mousemove |
| prefers-reduced-motion e WCAG 2.3.3 — https://www.ui-skills.com/skills/iart-ai/accessible-animation/ | CSS não governa animação em canvas; ler `matchMedia` e reagir ao vivo; movimento >5 s precisa de pausa | O motor já respeita "Reduzir movimento" por botão; falta ouvir a preferência do sistema automaticamente | Tratar como interruptor que apaga tudo: degradar, não desligar |
| Padrões painel × modal × página — https://www.onething.design/post/modal-vs-drawer | Painel quando se precisa ver o que está atrás; modal para tarefa curta; página para leitura longa | Alternativa 4A/4C | Modal bloqueante para prévia |
| OpenProcessing — https://openprocessing.org/ | Comunidade p5.js com código aberto | Publicar o sketch; estudar correlatos de grafos e partículas, citando autor | Copiar sketches |

Nenhuma referência é reproduzida; as adaptações estão descritas acima. As técnicas de base (forças, ruído, projeção em perspectiva) já estão citadas em README-RIZOMA.md.

---

## 8. Direção visual e conceitual

O conceito que orienta tudo aqui é o rizoma (Deleuze e Guattari) aplicado à "escrita territorial" de Canclini e às cartografias críticas de Sperling, já no texto do TCC. Em termos de interface:

- O movimento existe para **revelar relações, processos e caminhos** (linhas que crescem, rebrotam e se rompem), não como ornamento. Qualquer animação nova precisa responder "que relação isto revela?".
- Duas atmosferas coexistem: **papel** (spray cinza, tinta, branco) e **constelação** (escuro, brilho). O 3D deve funcionar nas duas; na constelação ele é mais natural (profundidade = distância das estrelas), no papel vira camadas de folhas (sombra projetada e névoa).
- **Honestidade** como identidade: dados não verificados nunca ganham linha; relações curatoriais (2E) só com fonte.
- O card de hover e a prévia usam a mesma tipografia e os mesmos "kickers" do site, para que a interface pareça o mesmo universo.

---

## 9. Pacotes possíveis (para decidir)

| Pacote | Conteúdo | Esforço total | O que resolve do brief |
|---|---|---|---|
| **Pacote 1 — Prévia e hover** | 4A (painel/folha de prévia com "Explorar projeto") + 3A/3B (vizinhança estável, histerese) + 5A/5B (hierarquia e controles reativos) + 6C (trilha clicável) | **M** | Pontos 3, 4, 5, 6 |
| **Pacote 2 — 3D desde a abertura** | 1A (campo vivo sob a capa, câmera que entra) + 1D (névoa, sombra, paralaxe) + 6D (câmera acompanha) + ouvir `prefers-reduced-motion` do sistema | **M** | Pontos 1 e 6 |
| **Pacote 3 — Rizoma mais presente** | 2A (linhas latentes) + 2D (relações na Árvore) + 2E (relações curatoriais com fonte, começando pelas óbvias: edições do CURA, do Real Grapixo, projetos em Venda Nova) | **M** (+ pesquisa) | Ponto 2 |
| **Pacote 4 — WEBGL** | 1C com p5 `WEBGL` ou three.js, só depois de medir performance em celular médio | **G** | Ponto 1 em profundidade |

Ordem sugerida: 1 → 3 → 2 → (4 só se a defesa pedir). O Pacote 1 é o que mais muda a experiência por hora investida e não altera o que já funciona; o 3 dá o conteúdo conceitual; o 2 dá a abertura.

---

## 9.1 Registro: Pacote 1 implementado em 30/10/2026

- **4A prévia**: clicar num nó abre `#preview` (painel lateral no desktop, folha inferior de 62 vh no celular) com tradução, fatos, "seguir uma linha", trilha e o botão **Explorar projeto**; só ele abre a página completa. Voltar da página reabre a prévia do mesmo nó (`closeProject` → `R.refresh()`).
- **3A/3B hover**: em `js/rizoma.js`, o nó pairado (ou aberto) e seus vizinhos param de derivar (`frozen`), a saída do hover usa raio 1,7× maior (histerese), um ímã de até 0,6 px/quadro aproxima o nó do cursor só no plano, e o giro automático do 3D pausa enquanto houver nó, linha ou prévia em foco.
- **5A/5B controles**: chips de linhas de fuga como ação primária (com contagem de linhas visíveis e pulso ao ligar); Árvore, 3D e "Menos movimento" como secundários; Cortar, Pausar, Modo escuro, Salvar e Recomeçar no menu "Mais ⋯". "Cortar" fica desativado sem linhas. A preferência `prefers-reduced-motion` do sistema liga "Menos movimento" ao abrir.
- **6C trilha**: barra "Sua trilha" no rodapé com os últimos cinco nós; clicar reabre a prévia daquele nó (oculta no celular, onde a prévia já mostra a trilha).
- Não implementado deste pacote: 3D (arrastar ao longo da linha), 4B (card que expande), 4D (modo foco que reorganiza o campo).

## 9.2 Registro: Pacotes 2 e 3 implementados em 30/10/2026 (mesmo dia, segunda sessão)

- **1A capa sobre o campo**: `#intro` virou uma camada fixa translúcida; o site e o campo são montados já no carregamento, em 3D (`depth:true`, `intro:true`), com os 20 nós como fantasmas e uma teia tênue de relações (ano e curadoria) girando devagar. "Entrar" desfaz a capa e a câmera aproxima (`view.zoom` 0,72 → 1). Com movimento reduzido a aproximação é imediata.
- **1D profundidade**: névoa por profundidade (nós distantes mais apagados, rótulos idem) e tamanho por z; giro automático só quando não há nó, linha ou prévia em foco.
- **2A/2C ligações possíveis**: ao pairar num nó, linhas pontilhadas mostram com quais nós revelados ele poderia se ligar, por natureza, com o nome das naturezas junto ao outro nó; a prévia lista "Ligações possíveis" com botões "Ligar Ano (3 nós)…" que ativam o chip. Ao ligar, a mola nasce mais forte e curta por 1,4 s: os nós **se puxam** enquanto a linha se forma, depois relaxam.
- **2D relações na árvore**: no decalque, pairar ou abrir um nó desenha arcos pontilhados até os nós ligados por qualquer natureza, com o motivo escrito sobre o arco.
- **2E curadoria**: nova natureza de linha "Curadoria", alimentada por `window.CARTOGRAFIA_RELATIONS` em `js/data.js` (cinco relações, cada uma com `why` e `source`); a rebrota após corte também pode usar essas relações.
- **Painel que sumia com os filtros**: a causa provável era a sobreposição: o painel cobria os chips e "Fechar nó" ficava exatamente onde se clicava. Agora, com a prévia aberta, as ferramentas se deslocam para a esquerda do painel (`.preview-open`), o texto de abertura esmaece e o card de hover some. O menu "Mais" também tinha `display:flex` vencendo o atributo `hidden`; corrigido.
- Fora deste registro: 6D (câmera que acompanha o nó aberto) e 2E ampliada (mais relações exigem pesquisa documental).

## 9.3 Registro: uma só organização, Gestalt e tempo ocioso (30/10/2026, terceira sessão)

Pedido: a aba Indicadores e a abertura de projetos deviam "seguir a mesma linha de organização" do campo; mobile-first; e, no Descobrir, os pontos e as ligações deviam surgir sozinhos quando a pessoa não se move, ou algo deveria indicar a ação.

**Uma só porta para o projeto (lei da continuidade e da experiência passada).** A prévia (`#preview`) saiu de dentro do `#discover` e virou uma camada fixa do site: lista lateral dos Indicadores, treemap e campo chamam a mesma `openPreview(id, origem)`. A prévia tem sempre a mesma ordem (kicker com a origem — "VIA INDICADORES" —, título, tradução, fatos, "Explorar projeto", linhas, ligações possíveis, trilha). "Explorar projeto" abre a página inteira e o botão de voltar diz de onde se veio ("← Voltar aos indicadores"); ao voltar, a prévia reabre no mesmo nó. Páginas de leitura (Pesquisa, Sobre) fecham a prévia, mas a trilha fica.

**Indicadores com Gestalt.**
- *Semelhança*: cor por mecanismo é a mesma em todo lugar — pilhas do gráfico de anos, legenda nova (`#mechLegend`, clicável, fixa o recorte), ponto antes de cada item da lista lateral e filete à esquerda de cada peça do treemap.
- *Região comum / proximidade*: um resumo fixo no topo (`#filterSummary`) diz o recorte atual e quantos projetos entram, com "Limpar recorte" e, no celular, "Ver os projetos ↓" (a lista fica abaixo dos gráficos numa coluna só).
- *Figura e fundo*: com a prévia aberta, a lista lateral baixa a opacidade e só o projeto aberto (`.side-project.current`) permanece em destaque; em telas largas (≥1100px) a grade cede 400px à prévia em vez de ser coberta.
- *Fechamento*: o item da lista termina em "PRÉVIA ↗", e o resumo fixo repete o número do recorte, para a pessoa saber onde está sem rolar.

**Mobile-first.** Seletor de medida em duas metades de toque, legenda em uma coluna, barras mais altas, treemap com linhas menores, prévia como folha inferior (62vh), página do projeto com herói mais curto. O resumo do recorte gruda abaixo da barra superior ao rolar.

**Capa e tempo ocioso.** A capa ganhou "outras portas" (Indicadores, Editais, Sobre) e um ponto pulsante que avisa que o campo já está vivo atrás dela. No campo, um relógio de ociosidade (`setInterval` de 1 s em `app.js`, zerado por qualquer gesto): após 6 s sem movimento, `R.revealOne()` revela um nó a cada 3 s, perto de um nó já visível, até 6 nós, com um aviso discreto (`#guide`); com dois ou mais nós e nenhuma linha, os chips pulsam (`#lineChips.nudge`) e o aviso pede uma linha de fuga; aos 14 s sem linha, liga-se sozinha a natureza que mais relaciona os nós já revelados (`bestLine()` conta as ligações possíveis por tipo), com aviso de como desligar. Cada aviso aparece uma só vez; `reduce-motion` desliga os pulsos.

Verificado no navegador do app: sequência ociosa (ritmo calmo, escolhido pelo autor: 6 s, 3 s, até 6 nós, chips aos 4 s, linha Ano aos 14 s), prévia a partir da lista lateral com kicker de origem, "Explorar projeto" → "Voltar aos indicadores" → prévia reaberta, legenda fixando "Descentra · 6 projeto(s)", prévia fechando ao ir para Sobre, layout de celular (375px) com folha inferior e resumo grudado. Não testado: toque em aparelho real.

**Zoom (pedido do autor na mesma tarde).** A câmera do motor ganhou deslocamento além do zoom (`view.px/py`, com alvo suavizado) e a função `zoomAt(fator, x, y)`, que muda o zoom mantendo parado o ponto sob o cursor. Entradas: roda do mouse (zoom no ponto), pinça com dois dedos (zoom no meio dos dedos; os dois dedos juntos deslocam), shift + arrastar ou botão do meio (deslocar), teclas `+`, `−` e `0`, e o grupo de botões "− 1:1 +" nas ferramentas (o do meio mostra o fator atual, por exemplo "1.6×", e devolve a 1:1). Limites 0,5× a 3,2×. API: `R.zoomBy(f)`, `R.zoomReset()`, `R.zoom()`; `state().zoom`. A névoa por profundidade continua calculada sobre o zoom, então aproximar não "apaga" os nós distantes.

**Responsividade consolidada (segunda passagem).** Os blocos `@media` anteriores se contradiziam (a cópia cobria o campo, os chips ficavam cortados, o contador e o aviso se sobrepunham). Um bloco final em `css/style.css` passa por cima de todos para ≤780px: capa com botão cheio e portas em três colunas; barra superior com navegação rolável sem barra de rolagem; no Descobrir, uma faixa curta no topo (kicker, título, duas linhas de texto) com o contador à direita, o campo ocupando o resto, e no pé uma barra fixa com a fita de chips rolável (com encaixe) e, abaixo, as ferramentas roláveis (árvore, 3D, zoom, menos movimento, mais); o menu "Mais" abre para cima; a prévia é uma folha inferior de 72vh com alça; aviso e card de hover ficam acima da barra. Um bloco para 781–1024px (tablet em paisagem) encolhe a cópia e aperta a grade dos Indicadores. Verificado a 375px (capa, Descobrir com zoom 1.6×, prévia, página do projeto, Sobre, Editais), a 768px (Descobrir, Indicadores) e no desktop (roda do mouse 1 → 1,25 → 1:1).

**Árvore / decalque refeita (mesmo dia, depois do zoom).** O decalque antigo desenhava tronco, anos e ligações direto em pixels de tela, enquanto os nós passavam pela projeção: com zoom ou deslocamento os dois se separavam, e em três colunas de 125px (celular) os títulos se sobrepunham. Agora tudo passa pela mesma projeção (`P(x, y)` = `project`), os textos escalam com o zoom e o layout virou um sumário indentado: mecanismo → ano → projeto, uma linha por nó (lei da proximidade e do alinhamento: cada nível tem o seu recuo; nada se sobrepõe). Em telas largas são três colunas lado a lado; abaixo de 640px, uma coluna só, rolável. Arrastar na árvore desloca a página (não há spray nem giro ali) e o nó abre ao soltar, só se o dedo não arrastou mais que 6px. Ao entrar na árvore a câmera volta a 1:1 e ao topo. As margens vêm do app como funções (`treeTop`, `treeBottom`), medidas na faixa de texto e na barra de ferramentas do celular. Verificado a 375px (uma coluna, 20 nós legíveis), 768px e desktop (três colunas; zoom 1,5× com prévia aberta mantém tronco e nós juntos).

**Árvore, terceira passagem (pedido: voltar ao leque, não sumir ao arrastar, ligações fora do texto).** O desktop voltou ao desenho em leque (mecanismo no alto, anos abrindo, projetos pendurados), que o autor achou mais bonito; o sumário indentado ficou só abaixo de 640px, onde o leque não cabe. Para o leque não cruzar títulos, colunas de ano vizinhas alternam a altura dos projetos (escalonamento de meia linha) e o corte do título é calculado pela distância entre colunas; o título inteiro aparece ao pairar ou abrir. A câmera ganhou trava (`clampPan`): o conteúdo nunca sai da tela; se a árvore cabe, o arrasto não a move; se não cabe (zoom ou celular), corre só até encostar na borda. No rizoma a trava é mais folgada (45% da tela). As relações transversais da árvore são desenhadas por baixo de tudo, mais claras, sem rótulos sobre os arcos; todo texto da árvore (mecanismo, ano, título, resumo "N nós ligados") tem fundo opaco (`labelBox`), então nenhuma linha passa por cima de letra. Verificado: desktop a 1:1 (arrasto de 750px não move a árvore), a 2× (arrasto para fora para na borda), celular (lista rola até o fim e para acima da barra).

Nota de processo: uma substituição automática mal escrita duplicou todas as linhas de `js/app.js`; o arquivo foi reconstruído a partir das linhas pares e conferido no navegador (sem erros no console).

## 9.4 Laboratórios (30/10/2026, noite): Lab 01 recebido, Lab 03 criado

- **Lab 01 · Identidade generativa** (`lab-identidade.html`): chegou pronto na pasta, feito fora desta sessão (grade institucional, horizonte, nós orgânicos por mecanismo, tipografia em tensão, paleta por natureza de relação). Foi mantido como está, só ganhou o link para o Lab 03 no menu.
- **Lab 02** (Campo / Palimpsesto / Mirante): o autor descreve três campos — fundo desfocado com mancha que reage ao que é colocado; rastro e clique que se acumulam como palimpsesto; descoberta pela lupa (mirante). Estava no repositório GitHub (`lab-outras-cartografias.html`, quatro modos: Campo, Palimpsesto, Mirante e Trama) e passou a existir aqui quando a pasta virou clone do repositório (ver `AVALIACAO-GITHUB-E-PHYSARUM.md`). O erro citado pelo autor (`index.js:102 … reading 'map'`) não vem de nenhum arquivo do projeto; junto com `Unchecked runtime.lastError…`, é assinatura de extensão do navegador.
- **Lab 03 · Mescla** (`lab-03-mescla.html`): mantém o rizoma como principal (mesmo motor `js/rizoma.js`: nós, linhas de fuga, puxão, 3D, prévia) e mescla, em camadas sobrepostas no mesmo palco:
  1. *Cidade desfocada* por baixo (grade, horizonte e massa construída do Lab 01, com `filter: blur`);
  2. *Mancha*: cada gesto deixa manchas de tinta que tomam a cor do mecanismo do nó mais próximo (rosa IF, azul Fundo, verde Descentra); abrir um nó deixa uma mancha grande; a camada esmaece devagar (tinta sobre tinta);
  3. *Rizoma* transparente por cima (opção nova `transparent:true` do motor);
  4. *Palimpsesto*: cada nó aberto é carimbado em tipografia condensada na cor do mecanismo; cada carimbo novo apaga um pouco os anteriores (opacidade ×0,72, mínimo 0,12, até 12 camadas); tocar num carimbo reabre o nó;
  5. *Mirante*: uma lupa que mostra os nós ainda escondidos (círculos e nomes) dentro do seu raio; clicar (ou tocar na lupa, no celular, onde ela é arrastável) revela o que ela mostra (`R.revealAt`, novo no motor, junto com `R.ghosts()`).
  Ferramentas: chips das seis linhas, 3D, Mirante, Mancha, Palimpsesto, Limpar camadas, Recomeçar; ficha lateral (folha inferior no celular) com linhas ligadas e ligações possíveis; tecla L liga a lupa. Verificado no navegador do app em desktop e 375px, sem erros no console.
- **Toque (pedido "quando reduzo a tela não dá para clicar")**: no app o canvas do campo tinha `touch-action: auto`, então num celular real o dedo rolava a página em vez de revelar; agora `touch-action: none`. Em tela de toque não existe "mover a mão": ao entrar, cinco nós já aparecem; um toque no vazio revela até três nós perto do dedo (`revealAt`); a mensagem do campo vazio passou a "toque ou arraste para revelar". No emulador do app os toques nos chips, no campo e nos botões respondem; em aparelho real ainda não foi testado.

## 10. O que precisa ser decidido antes de implementar

1. A prévia é painel lateral (desktop) + folha inferior (celular), ou folha inferior sempre?
2. As linhas latentes ficam sempre visíveis (2A) ou entra uma linha ligada por padrão (2B)?
3. O 3D passa a ser o padrão da abertura (1A) ou continua opcional?
4. Quais relações curatoriais têm fonte documental para entrar (2E)?
5. Há um aparelho Android intermediário disponível para medir fps antes de qualquer WEBGL?
