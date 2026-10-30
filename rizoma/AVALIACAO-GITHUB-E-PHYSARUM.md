# Avaliação: repositório GitHub e proposta Physarum (30/10/2026, noite)

Repositório avaliado: https://github.com/PedroFerreiraDesDev/cartografia-do-fomento (94 commits, todos de 30/10, site publicado em GitHub Pages e respondendo; último E2E verde).

## 1. Situação: duas versões que se separaram

| | Pasta do Drive (esta) | Repositório GitHub |
|---|---|---|
| Base comum | Rodada 8 (leque na árvore, trava de câmera, textos com fundo) | Mesma rodada 8, importada às 17:59 ("Restore Rizoma interaction engine from current Drive version") |
| Só aqui | Rodada 9: `touch-action:none` no canvas, 5 nós ao entrar em tela de toque, `revealAt`, `ghosts()`, `transparent`, `info().x/y`, **`lab-03-mescla.html`**, seções 9.3/9.4 dos documentos | — |
| Só lá | ~60 commits: onboarding em três passos (coachmark não bloqueante, v5), **busca de projetos**, toque em dois tempos (1º toque seleciona e mostra relações, 2º abre), barra de ferramentas achatada no celular (sem menu "Mais"), fallback de CDN do p5 e mensagem quando o motor falha, `?v=` contra cache, unidades `dvh`/safe-area, **`lab-outras-cartografias.html` (Lab 02)**, workflow Playwright que testa o site publicado, `.nojekyll` | — |
| Igual | `js/data.js` (só muda o fim de linha CRLF/LF) | |

Consequência: nenhum dos dois lados tem tudo. O repositório é o lugar certo para ser a verdade (tem histórico, publicação e teste); a pasta do Drive deveria virar um clone dele, e a rodada 9 + Lab 03 deveriam ser portadas para lá (é pouco: dois trechos em `rizoma.js`, dois em `app.js`, uma linha de CSS, um arquivo novo e os documentos).

## 2. O que ficou bom no repositório

- **Toque em dois tempos** (`touchGesture`/`touchInspect` em `rizoma.js`): o primeiro toque seleciona o nó e mostra as ligações possíveis; o segundo abre a prévia. Resolve de verdade o "clico e nada acontece" do celular, melhor que a minha solução da rodada 9 (toque revela três nós). Vale manter a deles e só acrescentar o `revealAt` para o toque no vazio.
- **Busca de projetos** (`#projectSearch`): porta direta para quem já sabe o que procura; abre a mesma prévia. Coerente com "uma só organização".
- **Resiliência**: fallback do p5 para jsdelivr, tentativa de montar o motor de novo no `load`, mensagem clara se o motor não carregar. Bom para um site público.
- **Teste E2E no site publicado** (`.github/workflows/e2e-live.yml`): cobre entrada, navegação, busca → prévia → página → voltar, árvore, chips, zoom, pausa, modo escuro, reduzir movimento, recomeçar, indicadores, em desktop e celular. É um nível de verificação que o projeto não tinha.
- **Lab 02** (`lab-outras-cartografias.html`): quatro sistemas num só arquivo, com uma pergunta de pesquisa por modo (bom para o TCC): Campo de pressão (o valor deforma uma superfície), Palimpsesto (anos em camadas, arrastar desgasta), Mirante (lente que decide o que ganha nitidez) e Trama (coordenadas paralelas Mecanismo → Ano → Escala). O Trama é o mais informativo; o Campo é o mais bonito.

## 3. O que precisa de atenção

1. **3D desligado no celular**: `app.js` monta o campo com `depth: !matchMedia("(pointer: coarse)")`. Você pediu para manter a interação 3D; no celular ela passou a nascer desligada (o botão ainda liga). Decidir: ligar por padrão de novo, ou manter desligada e explicar no botão.
2. **CSS em camadas de `!important`**: 103 ocorrências de `!important` (aqui eram 6). O onboarding v3, v4 e v5 e três passadas de "mobile" foram escritos um por cima do outro em vez de substituir. Funciona, mas qualquer ajuste futuro vai brigar com isso. Recomendo uma consolidação, como fiz com a responsividade na rodada 6 (um bloco final que vale, apagando os anteriores).
3. **`onclick` embutido no botão Entrar** (`index.html`): o botão esconde a capa sem a transição de saída e marca `window.__cartografiaEntered`, duplicando o que `app.js` faz. Foi um remendo para "Make Enter immediate". Melhor manter uma só lógica em `app.js` (a transição de 750 ms pode continuar, só o `pointer-events:none` precisa entrar na mesma hora).
4. **Canvas do campo sem `touch-action: none`** no CSS principal (o Lab 02 tem). Num celular real, o dedo ainda pode rolar/ampliar a página em cima do campo. Uma linha resolve (já está na rodada 9 daqui).
5. **E2E depende de `sleep 35`** para esperar o deploy do Pages: por isso dois runs falharam antes do que passou. Rodar os mesmos testes contra um servidor local no próprio runner (`python -m http.server`) antes do deploy tira a sorte da equação.
6. **Histórico**: muitos commits "Bump assets…" e versões v3/v4/v5 em sequência. Para o TCC não importa, mas se o repositório for citado como artefato, um `git rebase -i` para agrupar por rodada ajuda a leitura.
7. **Palimpsesto do Lab 02**: o "desgaste" pinta círculos na cor do papel por cima das camadas, ou seja, apaga em vez de revelar o que está embaixo. Para a metáfora funcionar, o arrasto precisa mostrar a camada anterior (desenhar as camadas de baixo dentro da máscara do risco). O Lab 03 daqui faz o contrário do Lab 02 nesse ponto: acumula carimbos e esmaece os antigos; as duas leituras podem conviver.
8. **Erro `index.js:102 … reading 'map'`**: não existe `index.js` nem na pasta nem no repositório; o site usa `app.js`, `rizoma.js`, `data.js`. Junto com `Unchecked runtime.lastError`, é assinatura de extensão do navegador (ou da ferramenta que editou o repositório). Teste em janela anônima sem extensões para confirmar.

## 4. Physarum (Jones, 2010; tutorial de Patt Vira): faz sentido? Sim, com adaptação

**Por que faz sentido para o TCC**: o rizoma de Deleuze & Guattari é descrito por tocas, tubérculos e redes sem centro; o Physarum polycephalum é o exemplo biológico mais citado de rede que se forma sem planejador, só por depósito e sensibilidade a rastros. O algoritmo de Jeff Jones (agentes que sentem o rastro à frente, à esquerda e à direita, viram para o mais forte e depositam ao passar) produz "linhas de fuga" que nascem do processo, não de um desenho prévio: mapa, não decalque. Encaixa como uma **terceira forma de ligação** no campo, ao lado das linhas retas/curvas (rizoma) e dos arcos (árvore).

**Como usar, sem copiar o tutorial**:
- Os nós revelados viram *fontes* (alimento): emitem agentes; os nós que compartilham o atributo da linha ligada (mesmo ano, mesmo mecanismo…) depositam rastro mais forte, então a rede cresce preferencialmente entre eles. Desligar a linha deixa a rede evaporar (decaimento), que é a "ruptura a-significante" sem corte manual.
- O rastro vive num `p5.Graphics` de baixa resolução (um terço do canvas), lido com `loadPixels()` **uma vez por quadro**, não uma vez por agente; evaporação com um retângulo semitransparente; difusão opcional com `filter(BLUR)` a cada poucos quadros.
- Quantidade adaptativa: ~2.500 agentes no desktop, ~700 no celular; pausa quando a aba está escondida; `reduce-motion` desliga.
- Cor do depósito pela natureza da linha (mesma paleta dos chips), para o rastro ser legível como relação e não como textura.
- Modo instância (`new p5(...)`), como o resto do motor; sem `describe(..., LABEL)` global.

**Sobre o código colado**: é o sketch do tutorial em modo global, com duas falhas de cópia (o Markdown comeu os asteriscos): `this.r2` deve ser `this.r*2` e `this.sensorDistcos(angle)` / `sensorDistsin` devem ser `this.sensorDist*cos(angle)` / `*sin(angle)`. Como está, não roda. Mesmo corrigido, 4.000 agentes lendo `pixels[]` do canvas inteiro a cada quadro travam no celular; daí a adaptação acima.

**Atribuição (para o texto e para o código)**:
- JONES, Jeff. Characteristics of pattern formation and evolution in approximations of Physarum transport networks. *Artificial Life*, v. 16, n. 2, p. 127–153, 2010.
- VIRA, Patt. *Slime Molds (Physarum)*: coding tutorial. 2023. Disponível em: https://youtu.be/VyXxSNcgDtg e https://www.pattvira.com/. Acesso em: 30 out. 2026.
- O módulo a escrever deve citar os dois no cabeçalho e no `README-RIZOMA.md`; o algoritmo é de Jones, a implementação é nossa.

## 5. Decisões pendentes

1. Unificar: transformar a pasta do Drive em clone do repositório e portar a rodada 9 + Lab 03 (recomendado; sem isso cada lado continua perdendo o outro).
2. Reativar o 3D por padrão no celular, ou manter desligado.
3. Physarum: criar como modo "Micélio" dentro do campo (chip ou botão) ou como Lab 04 separado para testar primeiro (recomendado: Lab 04 primeiro, com os mesmos dados; se agradar, vira modo).
