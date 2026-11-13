# Lab 07 — Letra brasileira, cor com fundamento

Página: `lab-07-letra-brasileira.html`. Módulo novo: `js/letreiro.js`. Motor: `js/rizoma.js` ganhou `nodeStyle: "bolinha"`, `opts.mechColors` e `R.setMechColors()`.

Pedido do autor (12/11/2026): explorar o projeto inteiro e os gráficos antes de fechar as soluções visuais; manter a ideia do spray e a cartografia; ter uma tipografia brasileira **mutável**, com aleatoriedade controlada, a partir do Brasilêro (Crystian Cruz) e das fontes enviadas; explicar melhor os projetos; cor com propósito e sentido, não decoração; sair da iconografia de prédios empilhados (o nó-muro) e ficar com as bolinhas.

Este documento guarda as decisões, as alternativas que não entraram e as referências, para o texto do TCC.

---

## 1. Análise das formas: as seis fontes e o Brasilêro

### 1.1 De onde vêm

Os sete arquivos enviados (`.otf`/`.ttf`; o `DuchaCompleta` veio nos dois formatos, iguais) são do projeto **Tipografia Vernacular 0800**, de Giovanna (Gi) Favetta. Cada fonte parte da foto de um letreiro improvisado registrado numa cidade brasileira, e a autora desenha a partir dele o alfabeto completo, com números, sinais e acentos. A página do projeto declara licença Creative Commons com uso comercial, acadêmico e pessoal liberado e revenda proibida; a versão exata da licença vem no arquivo que acompanha o download e **não veio junto com as fontes**: antes da banca, baixar o pacote e guardar o arquivo de licença em `assets/fontes/vernacular-0800/`.

| Mão | Arquivo | Registro | Ferramenta aparente | Glifos | O que não desenha |
|---|---|---|---|---|---|
| Cachoeira Feiticeira | `CachoeiraFeiticeira-Regular.otf` | Ilha Grande/RJ | pincel redondo | 135 | travessão, ponto mediano, ª º |
| Ducha Completa | `DuchaCompleta-Regular.ttf` | Curitiba/PR | marcador | 81 | travessão, ponto mediano, ª º |
| Ofertas Hortifruti | `OfertasHortifruti.otf` | Bertioga/SP | pincel chato | 137 | travessão, ponto mediano, ª º, aspas curvas; acentos muito discretos |
| Vendo Gelinho Cheia | `VendoGelinho-Cheia.otf` | São Paulo/SP | pincel largo | 215 | travessão |
| Vendo Gelinho Vazada | `VendoGelinho-Vazada.otf` | São Paulo/SP | contorno | 105 | travessão, ponto mediano, ª º, õ |
| Te Amo Jéssica | `TeAmoJessica-Regular.otf` | Florianópolis/SC | spray (pixo) | 246 | travessão |

Nenhuma das seis tem tabela `GSUB`/`GPOS` (sem alternates, ligaduras ou kerning por recurso OpenType; a Cachoeira tem uma tabela `kern` antiga). Todas têm só caixa alta: as minúsculas repetem as maiúsculas. O que isso implica: qualquer variação (alternância de formas, compressão, balanço) precisa ser feita fora da fonte, em código.

**Brasilêro** (Crystian Cruz, desenhada em 1999, grátis desde 2003): nasceu da análise de centenas de letreiros pintados à mão em várias cidades. A versão Profiça (2010, não lançada) usa OpenType para "melhor emular a estética vernacular", incluindo um recurso que **comprime as letras no fim da linha**. O arquivo do Brasilêro não foi enviado e o link de download da página é um Dropbox; não entrou no repositório porque a licença de redistribuição não foi conferida. Entrou a ideia.

### 1.2 O que as formas têm em comum (e o que o código imita)

1. **Linha de base instável**: as letras sobem e descem; nenhuma das seis alinha. → regra "balanço" (`sway`).
2. **Largura irregular e aperto**: na Ofertas Hortifruti as letras estreitam para caber no cartaz; é o mesmo fenômeno que o Brasilêro Profiça formaliza. → regra "aperto no fim da linha" (`squeeze`).
3. **Mistura de formas na mesma palavra**: a Ducha usa M, N, O em forma de minúscula entre maiúsculas; a Gelinho usa B, G, H, Q minúsculos. A mão troca de forma sem avisar. → regra "mão por palavra / por letra".
4. **Cheio e vazado**: a Vendo Gelinho existe nas duas versões, que é como o pintor trabalha: primeiro o contorno, depois o enchimento. → regra "vazada → cheia".
5. **O pixo é outra coisa**: a Te Amo Jéssica é a mais próxima do tema do TCC e a menos legível. Entra, mas com limite. → regra "limite de leitura".

### 1.3 A gramática da mutação (o que está em `js/letreiro.js`)

| Regra | Como funciona | Por quê |
|---|---|---|
| Mão por palavra (padrão), por letra, ou uma mão só | sorteio com semente (`seed`): a mesma página abre igual; cada projeto usa o próprio `id` como semente | uma placa é escrita por uma pessoa de cada vez; aleatoriedade sem semente viraria ruído a cada carregamento |
| Balanço | cada letra recebe deslocamento vertical (±7% do corpo), rotação (±5,5°) e escala (±8%), proporcionais a `sway` | item 1.2.1 |
| Aperto no fim da linha | se a linha não cabe, as últimas 55% das letras recebem `scaleX` crescente até 42% da largura; se nem assim cabe, o corpo da linha inteira diminui | item 1.2.2; Brasilêro Profiça |
| Repintura | a cada `mutate` ms uma palavra troca de mão, letra por letra (70 ms entre letras), com névoa (`blur` que assenta em 0,55 s) | a camada nova sobre a antiga: o muro repintado. Desligada com `prefers-reduced-motion` |
| Vazada → cheia | `L.encher(true)` troca a Gelinho Vazada pela Cheia letra a letra | item 1.2.4; serve para foco e para "o que já foi pintado" |
| Limite de leitura | o pixo só em palavras de até 3 letras; uma mão que não desenha um sinal da palavra não é sorteada para ela (teste por pixel: o desenho de `Á` precisa ser diferente do de `A`) | legibilidade; a Hortifruti mapeia acentos para formas quase iguais à letra sem acento |
| Corpo igualado | cada mão recebe um fator de corpo para que a altura da versal (`H`) seja a mesma em todas | sem isso a troca de mão muda o tamanho da palavra |
| Só títulos | marca, chamada de cada tela, nome do projeto na ficha, título da estampa | regra do Lab 01: a letra sofre a cidade, o dado não; valor e ano ficam em Arial |

Onde entrou: marca no topo (muta a cada 6 s), chamada do campo (4,2 s), título da aba Cores (5,2 s), nome do projeto na ficha (sem mutação; semente = id do projeto), letreiro de teste na aba Letras (com todos os controles), título da estampa "Meu micélio" (Cachoeira).

### 1.4 Alternativas consideradas e não adotadas

- **Fonte variável própria (eixo de "desgaste")**: exigiria desenhar fonte; fora do escopo do protótipo. Fica como proposta de continuação.
- **Distorção por p5 (letra como malha deformada, como no Lab 01)**: o Lab 01 já tem a tensão; aqui a mutação é de mão, não de forma. As duas podem coexistir, mas juntas competem.
- **Sortear a cada carregamento, sem semente**: descartado; a marca precisa ser reconhecível.
- **Usar o pixo em tudo**: descartado pela legibilidade; entra por cota.
- **Brasilêro como arquivo no repositório**: adiado até conferir a licença.

---

## 2. Cor com fundamento

> Primeira versão (manhã de 12/11). A seção 3A, da segunda rodada, substitui as linhas pretas pelas linhas na tinta dos projetos e o amarelo pelo ocre, e liga a paleta ao muro de Belo Horizonte. O texto abaixo fica como registro do caminho.

### 2.1 A regra

A cor faz um trabalho só: **dizer por qual mecanismo o dinheiro chegou ao projeto**. O tamanho diz quanto. O contorno diz o circuito (grosso = monumental, fino = capilar). Todo o resto é preto (`#161616`) sobre papel (`#F7F6F1`). As seis linhas de fuga, que tinham seis cores, passam a preto: ligação é relação, não categoria.

Base: Bertin (1967) separa as variáveis visuais e dá ao matiz a função de distinguir categorias e ao tamanho a de ordenar quantidades; Tufte (1990) trata a cor como rótulo e pede que ela não compita com o dado. No método de visualização usado aqui, "cor segue a entidade, nunca o valor", "texto veste tinta, nunca a cor da série" e "cor nunca vai sozinha" (legenda sempre presente, mecanismo por extenso na ficha).

### 2.2 Por que estas três tintas

| Mecanismo | Tinta | Hex | OKLCH L / C | Contraste com o papel |
|---|---|---|---|---|
| Incentivo Fiscal | magenta | `#C9186A` | 0,548 / 0,211 | 5,08 |
| Fundo Municipal | azul | `#1273C9` | 0,551 / 0,156 | 4,49 |
| Descentra | amarelo | `#E0A500` | 0,757 / 0,156 | 2,03 (por isso leva contorno preto sempre) |

Magenta, azul-ciano e amarelo são as tintas com que se imprime cartaz e lambe (com o preto). São primárias da mistura de pigmento: nenhuma se obtém das outras duas, como cada mecanismo é uma porta diferente do dinheiro público. O rosa do IF e o azul do Fundo dos labs anteriores continuam, mais escuros para ler no papel; só o Descentra troca o verde pelo amarelo, e o verde passa a significar **encontro de Fundo com Descentra** (os dois mecanismos do circuito capilar). Esta ligação entre tinta de impressão e fomento é leitura de projeto, não dado; precisa de defesa no texto do TCC.

### 2.3 O teste (validador de paleta, OKLab/OKLCH, simulação de Machado, Oliveira e Fernandes 2009, papel `#F7F6F1`, todos os pares)

| Critério | Paleta anterior `#FF4F9A #31A8FF #65E77D` | Tintas `#C9186A #1273C9 #E0A500` |
|---|---|---|
| Claridade na faixa 0,43–0,77 | **falha** (verde 0,83) | passa (0,55 / 0,55 / 0,76) |
| Separação com daltonismo (alvo ≥ 8) | 15,1 (pior par verde–rosa, deutan) | 16,8 (pior par azul–magenta, protan) |
| Separação em visão normal (≥ 15) | 29,1 | 30,1 |
| Contraste com o papel (≥ 3:1) | rosa 2,84, azul 2,37, verde 1,46 | magenta 5,08, azul 4,49, amarelo 2,03 |

Outras candidatas testadas e descartadas: CMY de impressão puro (`#E5097F #009FE3 #FFD400`: amarelo com claridade 0,88, fora da faixa, contraste 1,32) e `#D6246E #1778C8 #C99700` (passa, mas o amarelo fica ocre). O botão "Cor · tintas / anterior" (tecla C) troca a paleta ao vivo para comparar.

### 2.4 Mistura como pigmento

No Lab 04 o rastro misturava as cores das linhas por média aritmética (luz): azul com amarelo dava cinza. No Lab 07 cada agente carrega a tinta do mecanismo do nó onde nasceu e a deposita por **média geométrica por canal** (mistura subtrativa aproximada): tinta sobre tinta escurece e muda de matiz. Resultado: IF + Fundo = violeta `#3C3592`; IF + Descentra = vermelho `#D43F0A`; Fundo + Descentra = verde `#3F8A0E`. Onde o rastro muda de cor, dois mecanismos se encontraram por uma linha ligada: a mistura é dado. O micélio livre (sem linha) continua cinza e quase não tinge (`mixFree` 0,06).

### 2.5 O nó: bolinha, não muro

A pedido do autor, sai o nó-muro (empena/fachadas) e volta a bolinha. `nodeStyle: "bolinha"` no motor: preenchimento na tinta do mecanismo, raio pelo valor (já era), contorno em tinta preta com peso pelo circuito, miolo preto quando aberto, anel quando em foco. O círculo é a forma com menos "iconografia": não afirma prédio, muro nem mapa. O muro continua disponível no Lab 04 e no motor.

---

## 3. Explicação do projeto (a ficha)

Antes: cinco pares "chave: valor" (ano, mecanismo, edital, valor, escala). Agora: seis blocos em frases, gerados só com o que há em `js/data.js` (nada inferido):

1. **O que é**: ano, edital, valor.
2. **De onde vem o dinheiro**: a frase do mecanismo (renúncia fiscal captada com empresas / Fundo direto / Descentra direto com pontuação territorial).
3. **Quanto é**: posição no corpus (nº maior entre 20), razão para a mediana do corpus (R$ 79,9 mil), participação no total do ano, mediana do próprio mecanismo; e uma **régua** em SVG com os 20 projetos em três faixas (uma por mecanismo), o aberto em destaque e os outros clicáveis. É um gráfico de pontos (dot strip) por categoria: um eixo, cor pela entidade, texto preto, tooltip nativo no `<title>`.
4. **Circuito**: a definição e o aviso de que monumental/capilar são categorias de análise do TCC, não classificação oficial (pedido do documento de fontes).
5. **Parentes documentados**: as relações de `CARTOGRAFIA_RELATIONS`, com o porquê e a fonte.
6. **O que ainda não se sabe**: regional, proponente, local, fotos; a observação de `issue`; a fonte do registro.

Os blocos "Linhas ligadas" e "Ligações possíveis" do Lab 04 continuam abaixo.

---

## 3A. Ajuste de 12/11/2026, segunda rodada: linhas na tinta e paleta do muro de BH

Pedido do autor depois de ver o Lab 07: gostou; quer **as linhas com cor**; quer que as cores tenham **relação com os muros e o grafite de Belo Horizonte**, com defesa; e que tenham **contraste entre si, como pede a regra de UX**. Esta seção substitui o que as seções 2.1 a 2.4 dizem sobre linhas pretas e sobre o amarelo `#E0A500`.

### 3A.1 A linha leva a tinta dos projetos que liga

`opts.edgeColor: "nos"` no motor (`R.setEdgeColor`; no Lab 07, botão "Linhas · tinta", tecla L). A linha não tem cor própria: entre dois projetos do mesmo mecanismo ela é da cor deles; entre mecanismos diferentes ela é desenhada trecho a trecho, saindo de uma tinta, passando pela mistura de pigmento (média geométrica) e chegando na outra. Assim a regra "cor só significa mecanismo" continua valendo com linhas coloridas, e a mistura que antes só aparecia no rastro agora aparece também na linha. O tipo da linha (ano, edital, escala) continua no rótulo ao passar a mão. Alternativa descartada: voltar às seis cores por natureza de linha (seriam nove cores no campo, sem defesa, e o validador não aprova nove matizes distinguíveis entre todos os pares).

### 3A.2 As camadas do muro de Belo Horizonte

A paleta inteira é lida como as camadas de um muro da cidade:

| Camada | No site | Cor | Fonte |
|---|---|---|---|
| O muro | papel, fundo de tudo | `#F7F6F1` | o cimento claro que recebe o traço (defesa já feita em `IDENTIDADE-COESAO-LAB05.md`, seção 3) |
| O pixo | texto, número, contorno | `#161616` | o pixo é inscrição monocromática, feita com spray ou rolo (Carvalho, 2013; Lassala, 2010) |
| O grapixo | a forma de cada bolinha: contorno preto, cor por dentro | — | técnica intermediária entre pixo e grafite, com cores, sombras e contornos, difundida em BH (Soares, 2013); o corpus tem dois projetos Real Grapixo (p12 e p14) |
| O grafite | as três tintas dos mecanismos | abaixo | o grafite é policromático e usa cor saturada contra o cinza do concreto (Gitahy, 1999) |

| Mecanismo | Tinta | Hex | De onde vem | Por que neste mecanismo |
|---|---|---|---|---|
| Incentivo Fiscal | magenta de spray | `#C9186A` | "Magenta" é nome de lata na linha Arte Urbana da Colorgin (a conferir e fotografar) | o mecanismo que depende de patrocínio e visibilidade fica com a cor que mais grita; é o que pinta as empenas do centro |
| Fundo Municipal | azul de azulejo | `#1273C9` | painel de azulejos azul e branco de Portinari na igreja de São Francisco de Assis, Pampulha (1944), dentro do conjunto encomendado pela Prefeitura de Juscelino Kubitschek | é a cor do muro que o poder público encomendou: dinheiro direto, sem patrocinador |
| Descentra | ocre de minério | `#B97F00` | o solo rico em ferro da Serra do Curral e do Quadrilátero Ferrífero, avermelhado e amarelado | o edital que pontua por território fica com a cor do chão da cidade |

**O que é fonte e o que é leitura.** São fatos com fonte: o pixo monocromático, a policromia do grafite, o grapixo em BH, o painel azul de Portinari, o ferro no solo da serra. É decisão de design, a defender no texto do TCC: associar cada uma dessas cores a um mecanismo. Os valores hexadecimais foram escolhidos para passar no teste de contraste, não medidos em fotos: **falta fotografar** os muros do corpus, o painel da Pampulha e as latas, e comparar.

Alternativas consideradas: amostrar as cores de fotos dos murais do CURA (seria a ligação mais direta, mas depende de fotos próprias e de autorização de uso; fica como próximo passo); verde para o Descentra, como nos labs anteriores (reprovado no teste, ver abaixo); amarelo vivo `#E0A500` (contraste de 2,03 com o papel).

### 3A.3 O contraste, pela regra

| Critério | Regra | Paleta anterior `#FF4F9A #31A8FF #65E77D` | Muro de BH `#C9186A #1273C9 #B97F00` |
|---|---|---|---|
| Cada cor contra o papel | WCAG 2.2, critério 1.4.11: mínimo 3:1 para elementos gráficos | 2,84 / 2,37 / 1,46: falha nas três | 5,08 / 4,49 / 3,18: passa nas três |
| Claridade (OKLCH L) | faixa 0,43–0,77 | verde 0,83: falha | 0,55 / 0,55 / 0,64 |
| Uma cor contra a outra, visão normal | distância OKLab ≥ 15 | 29,1 | 23,8 (pior par: ocre–magenta) |
| Uma cor contra a outra, daltonismo simulado | ≥ 8 | 11,1 (tritan) | 13,7 (tritan); 14,2 (deutan) |
| Contorno preto contra o papel | 3:1 | — | 16,7 |

Entre si as três tintas se separam pelo **matiz**, não pelo claro e escuro (a razão de luminância entre elas fica entre 1,1 e 1,6). Isso é o esperado para uma paleta categórica (Ware, 2012; Munzner, 2014) e é por isso que a medida usada é a distância de cor, não a razão de contraste. O contorno preto resolve o caso de duas bolinhas que se tocam.

Outras regras aplicadas: **uso de cor** (WCAG 1.4.1: a cor nunca é o único sinal; legenda sempre visível, mecanismo escrito na ficha); **semelhança** (Wertheimer, 1923: mesma cor, mesmo grupo; por isso a cor vale o mesmo em bolinha, linha, rastro, legenda e régua); **memória** (Miller, 1956: três cores e um preto, cada uma com um nome de rua: lata, azulejo, terra).

Misturas com a paleta nova: IF + Fundo = violeta `#3C3592`; IF + Descentra = tijolo `#C1370A`; Fundo + Descentra = verde `#3A790E`.

Referências desta rodada (conferir autores e edições na biblioteca antes de citar):

- CARVALHO, Rodrigo Amaro de. **Entre prezas e rolês**: pixadores e pixações de/em Belo Horizonte. 2013. Citado em artigo da revista Caminhos de Geografia (UFU) sobre a seletividade espacial da pichação em BH: https://seer.ufu.br/index.php/caminhosdegeografia/article/download/56721/33106/278838. Dados completos a conferir.
- SOARES (prenome a conferir). Pixação em Belo Horizonte: identidade e transgressão como apropriação do espaço urbano. **Ponto Urbe**, 2013. Disponível em: https://journals.openedition.org/pontourbe/565.
- GITAHY, Celso. **O que é graffiti**. São Paulo: Brasiliense, 1999.
- LASSALA, Gustavo. **Pichação não é pixação**. São Paulo: Altamira, 2010.
- PROJETO PORTINARI. **Igreja de São Francisco de Assis (Pampulha)**: altar e azulejos internos e externos. Disponível em: https://www.portinari.org.br/en/archive/artwork/20480/igreja-de-sao-francisco-de-assis-pampulha-altar-e-azulejos-internos-e-externos.
- Sobre o solo da Serra do Curral: trabalho disponível em https://bdjur.stj.jus.br/jspui/bitstream/2011/161784/serra_curral_significado_custodio.pdf (autor e título a conferir).
- COLORGIN. **Arte Urbana**. Disponível em: https://www.colorgin.com.br/produto/arte-urbana/.
- W3C. **Web Content Accessibility Guidelines (WCAG) 2.2**: critérios 1.4.1 (uso de cor) e 1.4.11 (contraste não textual). 2023. Disponível em: https://www.w3.org/TR/WCAG22/.
- WERTHEIMER (1923), MILLER (1956), WARE (2012), MUNZNER (2014): referências completas em `IDENTIDADE-COESAO-LAB05.md`, seção 8.

---

## 3B. Ajuste de 13/11/2026: correção do 3D e paleta ampliada

Pedido do autor: corrigir o 3D ("quando começo a mexer no 3D os pontos vão indo para a lateral e somem da tela") e ampliar as cores, que ele achou "muito limitadas", olhando as regras de design de cor e o artigo de Calvo Ivanovic (2025).

### 3B.1 O defeito do 3D: duas causas, as duas no motor (`js/rizoma.js`)

1. **Empurrão no eixo errado.** As margens do campo são medidas na tela, mas a correção era somada direto às coordenadas do campo (`pos.x`, `pos.y`). Com o campo girado além de 90°, o eixo x do campo aponta para o lado contrário da tela: o empurrão que devia trazer o nó para dentro o levava para fora, cada vez mais. Correção: o empurrão nasce em eixos de tela e é convertido para o campo pela transposta da rotação usada em `project()`. Medido no navegador, com os 20 nós revelados e dois arrastos de giro: antes, 6 nós fora da tela; depois, nenhum.
2. **Nós encostados nas margens.** Sem linhas ligadas, os nós terminavam em duas fileiras, em cima e embaixo. É física: pontos que se repelem com força 1/d² dentro de uma caixa 3D vão para as faces, como carga elétrica num condutor, e as faces aqui eram as margens. Correção: quando há 3D e margens definidas, quem segura o campo é uma força de centro linear, calibrada pela área útil (equilíbrio de um elipsoide uniforme de semieixos a, b, c: k_i = 3·N·q·L_i/(a·b·c), com fatores 0,28 / 0,65 / 0,6 ajustados no navegador). Os nós se distribuem pelo volume em vez de ir para a borda. Vale para os labs que passam `opts.margin` (04, 05 e 07); o site principal não muda.

### 3B.2 Paleta ampliada: de 3 cores para 23, todas com função

O matiz continua dizendo o mecanismo. O que cresce é o **tom**: cada tinta abre numa família de cinco, e cada tom tem um trabalho. A referência é a anatomia da letra de grafite e do grapixo: preenchimento, contorno, sombra ("3D") e brilho, quase sempre em tons da mesma cor.

| Tom | Como é feito | Incentivo Fiscal | Fundo | Descentra | Trabalho |
|---|---|---|---|---|---|
| funda | tinta × 0,5 | `#640C35` | `#093A64` | `#5C4000` | texto e rótulo do mecanismo (contraste 8,9 a 11,8 com o papel) |
| sombra | tinta × 0,72 | `#91114C` | `#0D5391` | `#855B00` | sombra da bolinha |
| base | a tinta | `#C9186A` | `#1273C9` | `#B97F00` | preenchimento, linha, legenda: é a cor que identifica |
| clara | 55% tinta + 45% papel | `#DE7CA7` | `#79AEDB` | `#D5B56C` | brilho da bolinha, rastro |
| luz | 20% tinta + 80% papel | `#EECAD6` | `#C9DCE9` | `#EBDEC1` | fundo de etiqueta; nunca identifica sozinha |

Mais as três misturas (violeta `#3C3592`, tijolo `#C1370A`, verde `#3A790E`) e cinco neutros do muro (cal `#FFFFFF`, cimento `#F7F6F1`, reboco `#D4D1C8`, concreto `#747474`, pixo `#161616`).

Separação entre as três tintas em cada tom (distância OKLab; mínimo 15 em visão normal e 8 com daltonismo): funda 14,9 / 9,1; sombra 18,8 / 11,0; base 23,8 / 13,7; clara 17,9 / 7,9; luz 6,2 / 2,6. Por isso: base e sombra identificam; funda identifica com apoio do texto; clara só aparece dentro da bolinha, que já tem a base; luz é só superfície.

No campo: `nodeStyle: "grapixo"` (botão "Bolinha · grafite", tecla B, compara com a lisa). Na ficha: a etiqueta do mecanismo usa fundo luz e texto fundo.

### 3B.3 Regras de design de cor aplicadas

- **Os sete contrastes de Itten (1961).** Usados: matiz (três tintas), claro e escuro (pixo sobre muro; cinco degraus por tinta), quente e frio (magenta e ocre quentes, azul frio), saturação (tinta viva só nos dados, interface em neutros), quantidade (muito muro, pouco pixo, pouquíssima tinta; a proporção 60–30–10 é regra prática de mercado, sem autor único). Não usados: complementares e simultâneo.
- **Interação das cores (Albers, 1963).** Uma cor muda conforme a vizinha; o contorno preto isola cada bolinha.
- **Harmonia.** Tríade de matizes + escala monocromática por matiz + escala de neutros.

### 3B.4 O artigo de Calvo Ivanovic (2025) como lente

O artigo propõe o quadro Sustainable Colour Design Strategies, com oito estratégias (A a H) para design de cor em produtos. Não trata de interfaces; aqui ele serve de lente, sem afirmar que o site é "sustentável".

| Estratégia do artigo | O que diz | No Lab 07 |
|---|---|---|
| C. Identidade por cores locais (C2, C3, C4) | cada lugar tem cores que vêm dos seus materiais e da sua história; coletar o significado local da cor | paleta do muro de BH: cimento, azulejo, terra de minério, pixo |
| C1. Envolver comunidades | planos de cor feitos com quem vive o lugar | **não feito**: ouvir artistas do corpus sobre as cores é o próximo passo |
| B. Refletir sobre tendências (B3, B5) | cores atemporais (terras, neutros) e icônicas; marca com cor consistente | mesma cor = mesmo mecanismo em todas as telas; base em terras e neutros |
| D. Relatividade e ciclo de vida da cor (D1) | a cor desbota e muda, e isso pode ser valor; a cor depende da luz, do material, do observador e das cores vizinhas | o rastro evapora; as linhas misturam tintas; contorno isola a vizinhança |
| F. Imperfeição (F2, F4) | cor chapada e padronizada é rara; justaposição e mistura óptica | sombra, brilho e mistura visível |
| G3. A cor preexistente participa | aceitar a cor que já está no material | o muro (papel) é a maior área de cor |
| A, E, H | formação, biotecnologia, gestão industrial da cor | fora do alcance de um site |

**Alternativa testada e descartada: desbotar a bolinha pelo ano** (estratégia D1 levada ao dado: 2017 gasto, 2024 novo). Com 55% de desbotamento em 2017, o pior par entre mecanismos cai para 4,1 de distância com daltonismo simulado (mínimo 8), o contraste com o papel fica entre 1,6 e 2,2 (mínimo 3) e o passo entre anos vizinhos é de 2 a 4, quase imperceptível. O ano continua na linha "Ano" e na ficha.

Referências desta rodada:

- ALBERS, Josef. **Interaction of color**. New Haven: Yale University Press, 1963.
- CALVO IVANOVIC, Ingrid. Sustainable colour design strategies: a framework for action. **Coloration Technology**, v. 141, n. 6, p. 776-800, 2025. DOI: 10.1111/cote.70018. (O sobrenome da autora é composto, "Calvo Ivanovic", como aparece no cabeçalho do artigo.)
- ITTEN, Johannes. **The art of color**: the subjective experience and objective rationale of color. New York: Reinhold, 1961.

---

## 3C. Ajuste de 13/11/2026, segunda rodada: rastro de spray, só três tintas, o artigo como base

Pedido do autor: "ainda não está legal"; quer a ideia do **rastro de spray**; as cores ficam **só as três**, mudando os tons; e o artigo de Calvo Ivanovic (2025) deve ser a **base** das decisões de cor. Esta seção substitui, na 3A e na 3B, tudo o que fala de mistura de pigmento (violeta, tijolo, verde).

### 3C.1 O rastro de spray

No lugar da mancha borrada, o que se vê agora é uma camada de grão (`spray`, em `lab-07-letra-brasileira.html`). O mapa de baixa resolução do Physarum continua existindo, mas só para os agentes sentirem o caminho.

- Cada agente ligado solta três grãos por passo, espalhados em volta dele (distribuição normal, desvio de 2,6 px). O agente que segue a mão solta quatro, com desvio de 4 px: o rastro acompanha o gesto.
- **Os tons variam dentro da mesma tinta**: metade do grão na tinta base, um quarto no tom claro, um quinto na sombra, um vigésimo no tom fundo. Seis por cento dos grãos são gotas maiores.
- O agente sem linha ligada solta só uma névoa clara, de vez em quando.
- Quando um projeto é revelado, ele aparece com um jato de 80 grãos da tinta dele.
- **O spray seca**: a cada 20 quadros todo grão perde um pouco de tinta e some em cerca de 6 s, 3 s ou 1,5 s, conforme o botão de evaporação. Ele seca rápido de propósito, para o grão não ficar para trás quando o campo gira.
- O botão "Rastro · spray" (tecla G) compara com a mancha anterior. Em telas muito grandes a camada tem menos pixels, para o custo ficar limitado. Medido: 60 quadros por segundo, 2 ms por quadro com 200 agentes.

### 3C.2 Só três tintas

- **Sem cor nova no encontro.** A mistura de pigmento saiu. Onde dois mecanismos se encontram, os grãos das duas tintas ficam lado a lado e o olho faz a passagem (justaposição, ação F4 do artigo).
- **Linhas.** `opts.edgeMix: "optica"` no motor: a linha entre tintas diferentes é feita de trechos de uma e de outra; perto de cada ponta predomina a tinta daquele projeto.
- A paleta fica em 15 tons de tinta e 5 neutros do muro. A tecla da comparação de paleta passou de C para V, porque C já era o corte de linhas no motor.

### 3C.3 O artigo como base

A aba Cores agora abre com o quadro do artigo, e cada estratégia que cabe num site vira uma decisão:

| Estratégia (Calvo Ivanovic, 2025) | Decisão |
|---|---|
| C. Identidade por cores locais | as três tintas saem do muro de BH; fundo de cimento, texto de pixo |
| B. Cores que duram, marca consistente | só três tintas, sempre as mesmas, mesmo sentido em todas as telas |
| F. Imperfeição e justaposição | rastro em grão de vários tons; duas tintas lado a lado, sem quarta cor |
| D. A cor tem ciclo de vida | o spray seca e some |
| G. A cor que já existe participa | o muro é a maior área de cor |
| C1. Envolver a comunidade | **não feito**: mostrar a paleta a artistas do corpus |

Limite a registrar no TCC: o artigo trata de cor sustentável em produtos físicos. Aqui ele é usado como método para decidir cor, não como prova de sustentabilidade do site. As estratégias A, E e H não se aplicam.

---

## 3D. Ajuste de 13/11/2026, terceira rodada: entrada, explicações e interface mais simples

Pedido do autor: gostou do spray; quer implementar as outras telas; no Lab 07, tirar a alternância de agentes (fica 200) e de evaporação (fica média); uma entrada com um "videozinho" explicando o site; fechar a ficha e baixar o mapa mais intuitivos; spray de fundo mais fraco; avisos fáceis de entender; explicação de cada mecanismo, de cada filtro e de cada edital, antes de entrar e depois.

### 3D.1 Tela de entrada

Abre antes do campo, que só acorda quando a pessoa entra. Tem o nome do site em letreiro, uma frase que diz o que é, o botão "Entrar na experiência", um atalho para as explicações e a animação. `#direto` no endereço pula a entrada (para testes).

**A animação é um "vídeo" desenhado em código**, não um arquivo de vídeo: cinco cenas de 4,8 s em canvas, na mesma linguagem do campo (bolinhas, spray, cursor que clica). Motivo: pesa poucos kilobytes, usa as cores reais da paleta em uso, tem pausa e barra de passos, e respeita "menos movimento" (vira cinco quadros parados). As cinco cenas e as cinco legendas são a mesma lista da aba "Como funciona":

1. Os pontos que piscam são projetos escondidos; toque para revelar.
2. A cor diz de onde veio o dinheiro; o tamanho diz quanto.
3. Ligue os projetos por ano, mecanismo ou edital; o spray corre entre os que têm aquilo em comum.
4. Toque numa bolinha para abrir o projeto.
5. No fim, baixe o mapa da visita.

Leis aplicadas: divulgação progressiva (a explicação vem antes e pode ser revista, não fica na tela), Hick (um botão principal), Miller (cinco passos), reconhecimento em vez de memória (a animação mostra os mesmos elementos que a pessoa vai encontrar).

### 3D.2 Aba "Como funciona": mecanismos, ligações e editais

Uma aba nova, acessível pela entrada, pelo botão "? Como funciona", pelo "?" ao lado de "Ligar os projetos por" e por dois atalhos dentro da ficha ("Como funciona este edital", "Entender este mecanismo"), que abrem a aba já no cartão certo.

- **Mecanismos**: o que é cada um e quantos projetos e que valores tem no corpus. Texto a partir do TCC (fundamentação: Incentivo Fiscal por renúncia fiscal com captação em empresas; Fundo com recurso direto do orçamento; Descentra com valores entre R$ 20 mil e R$ 40 mil e pontuação fora do eixo da Avenida do Contorno).
- **Ligações** (os antigos "filtros" ou "linhas de fuga"): o que cada uma liga e quantas ligações cria no corpus (Ano 29, Mecanismo 58, Edital 12, Escala 63, Curadoria 5; Regional 0, com o aviso de que o dado não foi verificado).
- **Editais**: os 12 editais do corpus, cada um com o mecanismo, como funciona, o teto quando o TCC informa, os números da página oficial quando o documento de fontes registra a página como aberta (LMIC 2022 Fundo, LMIC 2023 IF, LMIC 2024 Fundo, Descentra 2024), os projetos do corpus (clicáveis) e o link da Prefeitura. Onde a página do edital não foi aberta, o link vai para o índice de editais anteriores.
- Limite declarado na própria aba: no Incentivo Fiscal o valor aprovado é o máximo que o projeto pode captar; a captação efetiva não é publicada.

### 3D.3 Interface mais simples

- **Ferramentas.** Saíram os controles de agentes e de evaporação (200 e média, fixos). Ficam: as ligações, "? Como funciona", 3D, Recomeçar e "↓ Baixar meu mapa". Os botões de comparação do lab (cor, linhas, bolinha, rastro, limpar) foram para um menu "Ajustes do lab", que não aparece no celular.
- **Fechar a ficha.** O botão "Fechar" virou "← Voltar ao mapa", preto, no topo da ficha.
- **Baixar o mapa.** "Fechar meu mapa" virou "↓ Baixar meu mapa". O painel diz "Meu mapa · a imagem desta visita" e os botões são "↓ Baixar a imagem (PNG)", "← Voltar ao mapa" e "Começar de novo".
- **Vocabulário.** Saíram "nó", "linha de fuga", "micélio", "estampa" e "agentes" dos textos para o visitante. Entram "projeto", "ligação", "spray", "mapa".
- **Avisos.** Um passo de cada vez, cada um aparece uma vez: revelar, ligar, abrir, e depois silêncio. Ao ligar uma ligação, uma frase diz o que ela faz e quantas ligações criou. O contador virou "15 de 20 projetos · 16 ligações".
- **Spray de fundo.** Metade da tinta de antes e mais tom claro, para as bolinhas e as linhas ficarem na frente.

### 3D.4 O que não foi feito nesta rodada

**As outras telas** (Indicadores, Editais como página própria, Pesquisa, Sobre, página do projeto) na linguagem do Lab 07. A entrada e as explicações foram feitas primeiro porque o autor quer testá-las no Lab 07; o padrão delas (letreiro, três tintas, vocabulário simples, ajuda sempre à mão) é o que as outras telas vão herdar.

---

## 3E. Lab 08 (13/11/2026): as outras telas na linguagem do Lab 07

Página: `lab-08-site.html`. Pedido do autor: implementar as outras telas. O Lab 07 fica como está; o Lab 08 é o site inteiro.

**Como foi feito.** O Lab 08 parte do Lab 05, que já tinha todas as telas, os gráficos aprovados pelo autor, a seleção compartilhada entre gráficos, a ficha única e a página de projeto. Em cima dele entrou a linguagem do Lab 07. O gerador está descrito abaixo para que a decisão possa ser refeita ou revertida.

| O que | Antes (Lab 05) | Agora (Lab 08) |
|---|---|---|
| Títulos | tipografia em tensão, marca viva de pontos, painel de fontes | letreiros vernaculares mutáveis (`js/letreiro.js`) na marca, na entrada, no título de cada tela, na ficha e na página do projeto |
| Cor | rosa, azul, verde; seis cores de linha | três tintas do muro de BH (`#C9186A`, `#1273C9`, `#B97F00`); ligações em preto ou na tinta dos projetos; a mancha por ano e as cordas usam as mesmas tintas |
| Projeto | nó-muro (empena, fachadas) no mapa e como ícone | bolinha de grapixo no mapa e como ícone em SVG (cor = mecanismo, tamanho = valor, contorno grosso = monumental, sombra) |
| Rastro | mancha borrada do micélio | spray em grão, que seca; duas tintas lado a lado |
| Capa | marca viva sobre o campo | entrada do Lab 07, com a animação de cinco passos e portas para Indicadores, Editais e Sobre |
| Editais | três linhas de mecanismo com botões | mecanismos, ligações e os 12 editais explicados, cada cartão com porta para os Indicadores e para os projetos |
| Ficha | pares rótulo e valor | explicação em frases com régua de valores, e atalhos "Como funciona este edital" e "Entender este mecanismo" |
| Ferramentas | agentes, evaporação, forma do nó | 200 agentes e evaporação média fixos; "? Como funciona", 3D, Recomeçar, "↓ Baixar meu mapa"; árvore, corte e limpar no menu "Mais" |
| Vocabulário | nó, linha de fuga, micélio, estampa | projeto, ligação, spray, mapa |

**O que ficou do Lab 05 sem mudança de lógica:** os nove gráficos dos Indicadores (regional, ano × mecanismo com a mancha, cordas, escala em blocos ou células, régua de valores, Lorenz, matriz, declive, dados sociais), a seleção compartilhada, os "?" de cada gráfico, a busca, a trilha, a árvore, o corte de ligações, as telas Pesquisa e Sobre e a página do projeto com galeria, ligações, território, fomento, relatos, questionário e fontes.

**O que saiu:** a tipografia em tensão, a marca viva e o painel de experimento de fontes do Lab 05 (cerca de 370 linhas), e o carregamento de 20 famílias de fonte do Google Fonts.

**Limites conhecidos.** A matriz de relações perdeu a cor por tipo de ligação: agora a célula só escurece com a quantidade de ligações em comum. A tela Pesquisa continua com o texto do protótipo. A página do projeto continua sem fotos reais.

Conferido no navegador em 1280 px e 375 px: entrada, mapa com spray, ligações, ficha, busca, árvore, Indicadores com seleção, Editais com destaque de cartão, Sobre e página do projeto, sem erros no console.

---

## 3F. Lab 08, rodada de 13/11/2026: gráficos por pergunta, formulário com fotos e mural

Pedido do autor: não criar um Lab 09, alterar o Lab 08. Duas frentes. Primeira: os gráficos pareciam repetitivos e não ficava claro se traziam informações diferentes. Segunda: na página do projeto, quem deixa comentário também pode mandar imagens, que vão para um e-mail e podem aparecer no mural de fotos do projeto; para mandar, a pessoa preenche um formulário que ajuda a construir o conhecimento sobre o projeto.

### 3F.1 Auditoria dos gráficos: o autor tinha razão

Os nove gráficos respondiam a poucas perguntas, com formas diferentes.

| Pergunta de fundo | Gráficos que a respondiam no Lab 05 e no Lab 08 anterior |
|---|---|
| Em que ano, por qual mecanismo? | colunas por ano, mancha, cordas × ano, células de valor, declive (cinco formas) |
| Quanto vale cada projeto? | blocos, células de valor, régua de valores, e Lorenz como soma (quatro formas) |
| Que tipo de projeto cada mecanismo paga? | cordas × escala (a régua já mostra, com as linhas de R$ 30 mil e R$ 100 mil) e cordas × circuito |
| O que os projetos têm em comum? | matriz |
| Onde? Quem? | barras de regional (uma barra só, "não verificada") e bloco de dados sociais (vazio) |

Um achado da auditoria: cordas × circuito não mostrava um dado, mostrava uma definição. No corpus, todo projeto de Incentivo Fiscal é monumental e todo projeto de Fundo Municipal e de Descentra é capilar. Isso cabe numa frase, e virou uma frase calculada na nota abaixo da legenda.

### 3F.2 O que mudou nos Indicadores

- **Quatro perguntas, um gráfico por pergunta.** 1. Em que ano e por qual caminho? 2. Quanto foi aprovado para cada projeto? 3. O dinheiro é bem repartido? 4. O que os projetos têm em comum? Um índice no alto leva a cada uma. A ideia de mostrar primeiro o geral e deixar o detalhe para quando a pessoa pede é de Shneiderman (1996).
- **A resposta vem escrita antes do gráfico.** Cada pergunta tem uma frase em destaque com os números, por exemplo "Os 5 maiores projetos somam 48% de todo o valor aprovado. Os 10 menores, juntos, somam 23%". O título que afirma o achado, em vez de só nomear o gráfico, é recomendação de Knaflic (2015). As frases são calculadas dos dados em `renderAnswers()`, não escritas à mão, então mudam se o corpus mudar e acompanham a medida escolhida.
- **"Como ler" em palavras simples**, logo acima de cada gráfico, dizendo o que é cada marca. Troca de texto junto com a forma do gráfico.
- **As outras formas viraram "ver como"**, dentro da mesma pergunta, e o texto avisa que é o mesmo dado. Pergunta 1: colunas (padrão), antes e depois de 2022 (declive), mancha, cordas. Pergunta 2: régua (padrão), blocos, células. Pergunta 3: fita do dinheiro (padrão), curva de Lorenz. Nenhuma proposta foi apagada: todas continuam acessíveis aqui e inteiras nos Labs 05 e 06.
- **Gráfico novo: fita do dinheiro.** Uma barra única é todo o valor aprovado; cada pedaço é um projeto, do maior para o menor, com chaves marcando os maiores e os menores. Mostra a mesma concentração da curva de Lorenz sem pedir que a pessoa saiba ler uma curva acumulada. Comprimento numa escala comum é das codificações que o olho compara melhor (Cleveland; McGill, 1984). A curva de Lorenz e o Gini ficam em "ver como", para quem conhece.
- **Matriz corrigida.** Desde o Lab 08 a célula com uma só coisa em comum saía preta e a de duas ou mais saía cinza, o contrário do que o texto dizia. Agora o cinza escurece com a quantidade, de 1 a 5, e há legenda. Com isso os blocos por mecanismo aparecem.
- **"O que ainda falta saber"** junta regional e perfil dos proponentes num bloco de texto, sem gráfico vazio, e convida a pessoa a contar o que sabe na página do projeto.
- **Régua e fita se redesenham no celular** com largura própria, para o texto não encolher.

Limite: as frases de resposta descrevem o corpus de vinte projetos do TCC. Não são conclusões sobre todo o fomento de Belo Horizonte.

### 3F.3 Formulário "Conte o que você sabe"

Fica na página de cada projeto, no lugar do campo de relato de teste. A ficha, no item "O que ainda não se sabe", ganhou o atalho "Você sabe? Conte e mande fotos".

As perguntas saem das lacunas do registro, que o próprio protótipo já mostrava como "A verificar". Por isso o formulário abre com a lista "Falta nesta ficha".

| Passo | Pergunta | Lacuna que ajuda a fechar |
|---|---|---|
| 1 | Qual é a sua relação com este projeto? (obrigatória) | peso e origem do relato: equipe, artista, vizinho, passante, participante, pesquisador |
| 2 | Onde fica; qual regional; em que ano viu ou participou; a obra ainda existe; quem fez | regional, local de execução, permanência da obra, proponente e artistas |
| 3 | Relato livre | relação das pessoas com a obra |
| 4 | Até três fotos, cada uma com legenda e crédito | fotografias, que o protótipo não tem |
| 5 | Nome para o crédito e e-mail (opcionais) | contato para tirar dúvida |

Regras: só a relação e a concordância são obrigatórias; a pessoa precisa contar pelo menos uma coisa; com foto, precisa confirmar a autoria ou a autorização. Os erros aparecem em frases, dizendo o passo.

**Fotos.** Cada foto é redesenhada no aparelho da pessoa antes de sair, com lado maior de 1600 px em JPEG. Isso reduz o arquivo e apaga os metadados da câmera, inclusive a localização do GPS. A localização que interessa à pesquisa é a que a pessoa escreve, não a que o celular grava sem ela saber. Três caixas separadas: autoria ou autorização (obrigatória com foto), autorização para o mural (opcional; sem ela a foto fica só no arquivo da pesquisa) e concordância das pessoas que aparecem.

**Privacidade e direitos, na leitura do design.** Consentimento explícito e finalidade declarada antes do envio (BRASIL, 2018, art. 7º, I, e art. 8º); só o necessário, com nome e e-mail opcionais (art. 6º, III); retirada a pedido (art. 18). Crédito ao autor da fotografia (BRASIL, 1998, art. 24, II, e art. 79, § 1º). Uso da imagem de pessoas com autorização (BRASIL, 2002, art. 20). Esta é uma leitura de design, não um parecer jurídico. **A conferir com a orientação:** se a coleta de relatos de pessoas neste TCC precisa passar por comitê de ética em pesquisa (Resolução CNS nº 510/2016).

### 3F.4 Para onde vai: e-mail

O site é estático, hospedado no GitHub Pages: não guarda nada. Para o formulário chegar a um e-mail com anexos é preciso um serviço de formulário no meio.

- **Estado atual: modo de teste.** `ENVIO.url` está vazio em `lab-08-site.html`. O formulário confere tudo, mostra o que seria enviado e avisa, em três lugares, que nada saiu do aparelho. Motivo: o endereço de e-mail e a escolha do serviço são decisão do autor, e o endereço não deve ficar exposto no código de um site público.
- **Caminho preparado: FormSubmit.** O envio é um formulário comum com `enctype="multipart/form-data"`, que é o que a documentação do serviço descreve para anexos; o limite é de 10 MB somando os arquivos, e três fotos reduzidas ficam bem abaixo disso. O serviço oferece um código aleatório para pôr no lugar do e-mail, de modo que o endereço não aparece na página (FORMSUBMIT, 2026). Depois do envio, o serviço devolve a pessoa à página do projeto (`?enviado=<id>`), que agradece. A documentação não diz se anexos funcionam por AJAX, então o envio não usa AJAX. Os campos chegam com nomes legíveis: `projeto`, `projeto_id`, `relacao`, `onde`, `regional`, `ano_visto`, `situacao_da_obra`, `quem_realizou`, `relato`, `foto1_legenda`, `foto1_credito`, `autoria_ok`, `mural_ok`, `pessoas_ok`, `nome`, `email`, `consentimento`.
- **Alternativa não implementada:** um script no Google Apps Script do próprio autor, que mandaria o e-mail e guardaria as fotos numa pasta do Drive. Vantagem: nenhum terceiro recebe os dados dos visitantes. Custo: cerca de dez minutos de configuração e um adaptador de envio diferente.
- **Não verificado:** o envio de verdade. Só foi testado o modo de teste. O FormSubmit guarda os envios por 30 dias segundo a documentação; onde ficam os servidores e o que diz a política de privacidade do serviço não foi lido.

### 3F.5 Mural de fotos

A seção "Galeria" da página do projeto virou "Mural de fotos".

- **Nada é publicado sozinho.** O que o visitante manda aparece só no aparelho dele, com borda tracejada e a marca "Só você vê · aguarda conferência", e some ao fechar o navegador (`sessionStorage`).
- **O que foi conferido entra por `dados/mural.js`**, com legenda, crédito e ano, e o arquivo da foto em `assets/mural/<id-do-projeto>/`. O passo a passo está em `assets/mural/LEIA-ME.md`.
- **Mural vazio** mostra a bolinha do projeto e o convite "A primeira pode ser a sua".

Motivo da conferência manual: o TCC separa o que tem fonte do que é suposição, e uma foto publicada sem conferência quebraria essa regra. Também evita publicar imagem de pessoas ou de obras de terceiros sem autorização.

Conferido no navegador em 1280 px e 375 px: as quatro perguntas com todas as formas de gráfico, troca de medida, matriz, abertura da ficha, atalho para o formulário, erros de preenchimento, foto de teste de 3000 × 2000 px reduzida para 1600 × 1067 px, arquivo que não é imagem recusado, envio em modo de teste, foto no mural como pendente e lista do que foi contado, sem erros no console.

---

## 3G. Lab 08, segunda rodada de 13/11/2026: recomeçar, letra por letra, um título só e os editais em números

Pedidos do autor: ao limpar ou recomeçar, as ligações e os filtros continuavam; a troca de letra é boa, mas deve ser letra por letra; havia vários nomes pelo site com cara de título, e ele quer um só; mais um ou dois gráficos sobre o valor total disponibilizado em cada edital, com os valores tirados dos PDFs oficiais.

### 3G.1 Recomeçar zera tudo

- **Recomeçar** (botão e tecla R) agora esconde os projetos, desliga todas as ligações, apaga os cortes, volta o zoom e o giro ao começo, limpa o spray, esvazia a busca e desfaz a seleção dos Indicadores. Antes, o motor só escondia os projetos; as ligações ligadas continuavam e o spray voltava sozinho.
- **"Limpar o spray" virou "Desligar ligações e limpar"** (menu Mais e tecla X). Mantém os projetos revelados. Limpar só o spray não fazia efeito visível, porque as ligações ligadas repintavam o rastro em seguida.
- Cada um dos dois avisa em uma frase o que fez.
- Feito na página, sem mexer no motor `js/rizoma.js`: o `R.reset()` do Lab 08 passa a chamar `setLine(t, false)` para cada ligação, `zoomReset()` e `setDepth(true)`. Os outros labs não mudam.

### 3G.2 A letra troca letra por letra

- Na marca e na tela de entrada, cada letra tem a sua mão (`mode: "letra"` em `js/letreiro.js`) e a repintura troca letras soltas, duas ou três por vez, uma depois da outra (`mutateN`, opção nova). Antes, a palavra inteira trocava de mão de uma vez.
- O limite de leitura passou a valer também nesse modo: o pixo (Te Amo Jéssica) só entra em letras de palavras de até três letras. Antes, no modo por letra, ele podia cair em qualquer palavra.
- O nome dos projetos, na ficha e na página do projeto, continua com uma mão por palavra e sem troca, para a leitura do nome não oscilar.
- A ideia de variar a letra dentro da mesma palavra, como no letreiro pintado à mão, continua vindo do Brasilêro (CRUZ, 1999).

### 3G.3 Um título só

O site tinha cinco frases em letreiro, cada uma com cara de título: "A rua escreve o mapa", "O fomento em movimento", "De onde vem o dinheiro", "Quem acessa o fomento?" e "Uma cartografia sem mapa obrigatório". Agora o título é um só, **Cartografia do Fomento**, na marca e na entrada. Cada tela leva só o nome da seção, igual ao do menu, em Arial: Descobrir, Indicadores, Editais, Pesquisa, Sobre. O letreiro fica no título do site e no nome dos projetos.

### 3G.4 Os editais em números: de onde vem cada valor

Cada valor foi lido no texto do próprio edital, em PDF, no site da Prefeitura de Belo Horizonte, em 13/11/2026. Inscritos e aprovados vêm das páginas dos editais e das notícias da Prefeitura. Nada foi estimado.

| Edital | Valor total | O que o número é | Inscritos | Aprovados |
|---|---|---|---|---|
| LMIC 2017 - IF | R$ 12.050.000,00 | renúncia fiscal prevista na Lei 11.070/2017 | 1.663 (Fundo e IF juntos) | 275 (juntos) |
| LMIC 2017 - Fundo | R$ 8.000.000,00 | dotação do Fundo | (ver acima) | (ver acima) |
| LMIC 2021 - IF | R$ 14.000.000,00 | montante máximo de renúncia fiscal | 420 | 128 |
| LMIC 2021 - Fundo | R$ 8.200.000,00 | recursos do Fundo | 1.189 | 136 |
| LMIC 2022 - Fundo | R$ 8.200.000,00 | recursos do Fundo | 607 | 131 |
| LMIC 2023 - IF | não fixado no edital | o edital remete à Lei 11.594/2023; a página informa só estimativa média de R$ 16 milhões de renúncia por ano | 487 | não informado na página |
| LMIC 2023 - Fundo | R$ 11.250.000,00 | recursos do Fundo após suplementação; o edital saiu com R$ 9.000.000,00 | 991 | 148 |
| LMIC 2024 - Fundo | R$ 9.598.374,00 | recursos do Fundo | 661 | 124 |
| Descentra 2019 | R$ 1.060.000,00 | recursos do Fundo | não informado | 54 (13,10% dos inscritos, segundo a página) |
| Descentra 2021 | R$ 1.560.000,00 | recursos do Fundo | 488 | 79 |
| Descentra 2022 | R$ 1.560.000,00 | recursos do Fundo | 324 | 41 |
| Descentra 2024 | R$ 1.800.000,00 | recursos do Fundo | 450 | 46 |

O endereço de cada PDF e de cada página está em `EDITAL_VALOR`, em `lab-08-site.html`, e aparece para o visitante em "Ver a fonte de cada valor", abaixo do gráfico, e em cada cartão da tela Editais.

**Escolhas e divergências, declaradas.**

- **LMIC 2023 - Fundo:** o gráfico usa o valor final, R$ 11,25 milhões, e o cartão informa o valor de lançamento.
- **LMIC 2023 - IF:** não entra na soma. A barra aparece tracejada, no tamanho da estimativa anual, com o aviso de que o edital não fixa valor.
- **LMIC 2021 - IF:** a página do edital diz 32,47% dos inscritos; 128 sobre 420 dá 30%. O gráfico usa as duas contagens e o cartão registra a diferença.
- **Descentra 2024:** o documento Perguntas e Respostas diz R$ 1,7 milhão; o edital, a página e a notícia dizem R$ 1,8 milhão. Vale o edital.
- **Descentra 2019:** a página dá os aprovados e a porcentagem, sem o número de inscritos. O gráfico usa a porcentagem publicada e não calcula os inscritos.
- **Incentivo Fiscal:** o valor do edital é renúncia fiscal prevista, e o valor de cada projeto é o teto que ele pode captar. São grandezas diferentes das do Fundo, e o "como ler" do gráfico avisa.
- **Planilhas oficiais do IF** (`dados/fontes/pbh-incentivo-fiscal/`): a soma da coluna "valor aprovado" dá R$ 12.325.000,00 em 2017 (141 projetos), R$ 15.684.974,00 em 2021 (144) e R$ 40.089.472,93 em 2023 (299). Não coincide com o montante dos editais e a causa não foi investigada. Essas somas não foram usadas.

**Correção de tetos.** Os cartões da tela Editais mostravam tetos anotados a partir do TCC. Agora mostram o que está em cada edital: Incentivo Fiscal com limites por categoria, até R$ 160 mil em 2017, R$ 150 mil em 2021 e R$ 165 mil em 2023; Fundo até R$ 90 mil em 2021 e 2022 e até R$ 100 mil em 2023 e 2024; Descentra R$ 20 mil em 2019 e 2021 e R$ 40 mil em 2022 e 2024. O "teto de R$ 110 mil" de 2017 não aparece no edital como teto único, e "R$ 38,4 mil" não aparece como teto em nenhum edital lido. **A conferir pelo autor no texto do TCC.**

### 3G.5 Os dois gráficos novos

A tela Indicadores passa a ter seis perguntas: quatro sobre os vinte projetos e duas sobre os editais.

- **Pergunta 5: quanto cada edital ofereceu?** Uma linha por edital. A barra clara é o valor total do edital; o pedaço escuro é a soma dos projetos do corpus naquele edital. Todas as barras na mesma escala, para o Descentra aparecer do tamanho que tem (CLEVELAND; McGILL, 1984). Resposta escrita calculada: os onze editais com valor publicado somam R$ 77,28 milhões; os projetos do corpus somam R$ 1,04 milhão, 1,3% disso.
- **Pergunta 6: de quem se inscreve, quantos passam?** Uma linha por edital, de 0 a 100% dos inscritos, com a parte aprovada pintada. O mais disputado é o Descentra 2024, com 46 aprovados entre 450 inscritos (10%). Os inscritos são de todas as áreas da cultura, não só de arte urbana, e o gráfico diz isso.

Por que estes dois e não mais formas do mesmo dado: a pergunta 5 dá a medida do corpus dentro do edital, que nenhum gráfico anterior dava; a pergunta 6 traz um dado novo, a disputa. As duas respondem ao pedido sem repetir as perguntas 1 a 4.

Limite: a pergunta 5 compara o valor do edital com os vinte projetos do corpus do TCC, não com todos os projetos de arte urbana aprovados. As planilhas oficiais mostram projetos de arte urbana fora do corpus (ver `rizoma/FONTES-DADOS-E-METODOLOGIA.md`).

### 3G.6 A pergunta 5 ficou interativa (terceira rodada de 13/11/2026)

O autor gostou do gráfico do valor dos editais e pediu que fosse mais interativo, como os outros, com mais de uma forma de pensar o dado.

- **Três formas em "ver como", todas com o mesmo dado.**
  - *Barras* (padrão): comparar o tamanho dos editais numa escala comum.
  - *Quadradinhos*: cada quadradinho vale R$ 100 mil; os claros são o edital e os escuros são os projetos do corpus. Serve para contar em vez de medir, e deixa visível quão pequena é a parte do corpus.
  - *Média por projeto*: o traço é o valor do edital dividido pelo número de aprovados; cada bolinha é um projeto do corpus no valor dele, na mesma régua. Mostra se o projeto ficou acima ou abaixo da média do edital. Hoje, dos 12 projetos com média calculada, 9 estão acima.
- **"Arrumar por":** mecanismo, ano, valor do edital ou fatia destes projetos. A ordem muda o que salta aos olhos, como na matriz (BERTIN, 1967).
- **Leitura ao passar a mão:** uma caixa acima do gráfico escreve em frase os números do edital apontado: valor, projetos do corpus, fatia, aprovados e inscritos, média. No celular, vale o toque.
- **Lupa:** clicar num edital, na forma de barras, fixa a seleção e abre uma segunda barra que amplia o pedaço escuro e mostra cada projeto com nome e valor. Tocar num projeto abre a ficha. O pedaço do corpus é de 0,4% a 4,4% do edital, pequeno demais para ler sem ampliar. É a ideia de foco e contexto: ampliar o detalhe sem tirar o todo de vista (CARD; MACKINLAY; SHNEIDERMAN, 1999).
- A seleção continua compartilhada: o edital escolhido acende os mesmos projetos nos outros gráficos e na lista ao lado.

**Avisos que o gráfico dá.** A média é uma conta feita no protótipo com dois números oficiais, não um número publicado. No Incentivo Fiscal ela é só referência, porque o edital limita a renúncia total e cada projeto pode captar até o próprio teto. Em 2017 o traço é tracejado, porque os aprovados foram publicados somando Fundo e Incentivo Fiscal. O LMIC 2023 - IF não tem média.

**Forma descartada:** valor dos editais ao longo do tempo. O corpus não tem todos os editais de cada ano, então a linha mostraria quedas que não existem.

Conferido no navegador em 1280 px e 375 px: as três formas, as quatro ordens, a leitura ao passar a mão, a lupa e a abertura da ficha pelo projeto da lupa, sem erros no console.

Conferido no navegador em 1280 px e 375 px: Recomeçar e Desligar ligações, marca trocando letra por letra, os cinco nomes de seção, os dois gráficos novos com seleção e ajuda, e os cartões da tela Editais com valor, disputa e link do PDF, sem erros no console.

---

## 3H. Lab 08, quarta rodada de 13/11/2026: cor e traço por tipo de ligação; os editais na tela Editais

Pedidos do autor: as linhas das ligações, que funcionam como filtros, precisam de cores diferentes para ele saber qual ligação é qual, porque estava se confundindo; e ele não encontrou os gráficos de inscritos e aprovados.

### 3H.1 O problema

Desde a rodada do spray, toda ligação levava a tinta dos dois projetos que ligava. Com duas ou mais ligações ligadas ao mesmo tempo, uma linha de "ano" e uma de "edital" entre os mesmos dois projetos saíam idênticas. A cor da linha repetia o mecanismo, que a bolinha já mostra, e não dizia o tipo da ligação.

### 3H.2 A solução: uma cor e um traço para cada ligação

| Ligação | Cor | Traço | De onde vem a cor |
|---|---|---|---|
| Ano | verde `#2F6B1E` | contínuo | mistura de azul e ocre |
| Edital | violeta `#692278` | tracejado | mistura de magenta e azul |
| Escala | ferrugem `#760A03` | pontilhado | mistura de magenta e ocre |
| Mecanismo | a tinta do próprio mecanismo | contínuo | magenta, azul ou ocre, conforme os projetos ligados |
| Curadoria | preto `#161616` | contínuo e mais grosso | o pixo: é a ligação documentada, escrita |
| Regional | cinza claro `#9A978F` | pontilhado | não liga nada hoje |

**Fundamento.** As ligações usam as misturas das três tintas, duas a duas, que é o que o pintor obtém no muro quando duas tintas se encontram. A ligação une dois projetos; não pertence a um mecanismo, então não usa tinta pura. As três misturas tinham sido testadas na segunda rodada do Lab 07 e abandonadas na rodada do spray, quando o autor pediu só as três tintas. Voltam agora em outra função: não são mais o trecho entre duas tintas, são a identidade de um tipo de ligação. As misturas calculadas (`#3C3592`, `#C13700`, `#3A7900`) reprovaram no validador: o tijolo ficava a 12,4 do magenta em visão comum e a 4,3 do verde simulando daltonismo. Foram escurecidas até passar. O que tem fonte: a prática da mistura subtrativa de tintas e os contrastes de matiz e de claro-escuro (ITTEN, 1961). O que é leitura de design: associar cada mistura a um tipo de ligação.

**A exceção do mecanismo.** A ligação por mecanismo une projetos do mesmo mecanismo. Ela continua na tinta dele, porque aí a cor da linha e a cor da bolinha dizem a mesma coisa.

**Teste** (validador de paleta, OKLab, simulação de Machado, Oliveira e Fernandes, 2009, papel `#F7F6F1`, todos os pares entre as três tintas e as três cores de ligação):

- separação simulando daltonismo: pior par ferrugem e verde, 9,7 (mínimo 8). Passa.
- separação em visão comum: pior par ferrugem e violeta, 17,1 (mínimo 15). Passa.
- contraste com o papel: verde 6,0; violeta 9,2; ferrugem 10,7 (mínimo 3). Passa.
- faixa de claridade do validador: violeta e ferrugem ficam abaixo dela. É de propósito: a faixa serve a áreas preenchidas, e aqui são linhas finas, que precisam ser mais escuras que as bolinhas para aparecer.

**Tons mais claros.** O autor sugeriu tons mais claros. Foram testados e reprovaram: um verde médio fica a 6,1 do magenta simulando daltonismo, um violeta claro fica a 6,4 do azul, e os cinzas médios ficam a menos de 1 do magenta. A linha já aparece mais leve que a bolinha por ser fina e translúcida quando não está em foco.

**Traço.** Cada ligação tem também um traço: contínuo, tracejado, pontilhado ou grosso. Assim o tipo não depende só da cor, como pede a WCAG 2.2, critério 1.4.1. Preto de curadoria e tinta de mecanismo se separam pela espessura.

**Onde aparece.** Nos botões "Ligar os projetos por", que agora mostram um pedaço da linha no lugar do ponto; no aviso ao ligar ("Edital: linha violeta, tracejada..."); nas ligações da ficha e da página do projeto; nos textos da tela Editais e do Sobre.

**No motor** (`js/rizoma.js`), quatro opções novas, desligadas por padrão, que não mudam os outros labs: `lineExact` (usa a cor do tipo sem escurecer), `lineInk` (tipos que levam a tinta dos projetos), `lineDash` (um trecho vazio a cada n) e `lineWeights` (espessura por tipo).

### 3H.3 Inscritos e aprovados: onde estão

O gráfico "De quem se inscreve, quantos passam?" está publicado desde a segunda rodada, como pergunta 6 da tela Indicadores. Como o autor não o encontrou, a tela Editais ganhou duas portas:

- um botão no alto da lista de editais, "Ver os gráficos dos editais: valor total e quantos passam", que abre os Indicadores já na pergunta 5;
- em cada cartão de edital, duas barras pequenas: o valor do edital comparado ao maior edital, e a parte dos inscritos que foi aprovada.

Conferido no navegador em 1280 px e 375 px: as cinco ligações ligadas juntas e em pares, os botões com o traço de cada uma, a ficha, as barras nos doze cartões, o botão para os gráficos, e o protótipo principal e o Lab 07 abrindo sem erro com o motor alterado.

---

## 3I. Propostas em análise (13/11/2026): outra forma para os gráficos dos editais

O autor não gostou dos dois gráficos de barras dos editais (valor total e disputa). Pediu formas diferentes, com referência em trabalhos como os do Information is Beautiful, feitas em p5.js, leves, dentro do conceito do site e bem explicadas. Antes de trocar, três propostas foram desenhadas com os dados reais para ele escolher.

Página: `rizoma/prototipo-p5/propostas-editais.html`.

| Proposta | Forma | Referência e ideia emprestada | Responde | Limite |
|---|---|---|---|---|
| A. Muro de blocos | faixa por mecanismo, bloco por edital, área = valor; quadrados escuros = projetos do corpus | McCANDLESS, The Billion Dollar Gram: valores como retângulos encaixados | quanto cada edital ofereceu e a parte do corpus | não mostra a disputa; o LMIC 2023 - IF fica de fora |
| B. Bolinhas | uma bolinha por edital: tamanho = valor, altura = parte dos inscritos aprovada, posição horizontal = ano; bolinhas escuras dentro = projetos do corpus | McCANDLESS, Snake Oil Supplements e World's Biggest Data Breaches & Hacks: bolhas em que o tamanho é uma medida e a posição é outra | as duas perguntas num desenho só | círculo se compara pior que barra; dois eixos pedem mais explicação |
| C. Peneira | um grão por projeto inscrito; os aprovados passam a linha e ganham a tinta do mecanismo | NEURATH, Isotype: quantidade pela repetição de uma marca | de quem se inscreve, quantos passam | não compara o valor dos editais; ocupa mais espaço |

**Recomendação feita ao autor:** a proposta B no lugar dos dois gráficos, porque usa a bolinha do mapa e responde às duas perguntas, com a peneira como detalhe ao tocar numa bolinha. **Decisão pendente do autor.**

As referências foram conferidas no site em 13/11/2026 só quanto ao título e ao endereço; a descrição da forma de cada uma é conhecimento geral sobre esses trabalhos, porque os gráficos não carregaram no navegador de teste. Nenhum código nem desenho foi copiado.

---

## 4. O que fica para depois

- Conferir e guardar a licença CC do pacote TV0800; decidir sobre o Brasilêro.
- Levar letreiro e tintas para o Lab 05 (o sistema inteiro) e para o protótipo principal, se o autor aprovar.
- Régua de valores também nos Indicadores.
- Fonte variável própria com eixo de desgaste (proposta).
- Testar no Android real (o emulador não reproduz toque).
- Ligar o envio do formulário: escolher o serviço e o e-mail e preencher `ENVIO.url` (seção 3F.4). Depois, testar um envio de verdade com foto.
- Conferir com a orientação se a coleta de relatos precisa de comitê de ética (seção 3F.3).

---

## Referências

BELO HORIZONTE. Secretaria Municipal de Cultura. Fundação Municipal de Cultura. **Editais da Lei Municipal de Incentivo à Cultura (Fundo e Incentivo Fiscal) e do Descentra, 2017 a 2024**: textos dos editais, páginas de resultado e notícias. Belo Horizonte: PBH, 2017-2025. Disponível em: https://prefeitura.pbh.gov.br/cultura/editais/editais-anteriores. Acesso em: 13 nov. 2026.

BERTIN, Jacques. **Sémiologie graphique**: les diagrammes, les réseaux, les cartes. Paris: Mouton; Gauthier-Villars, 1967.

BRASIL. **Lei nº 9.610, de 19 de fevereiro de 1998**. Altera, atualiza e consolida a legislação sobre direitos autorais. Brasília, DF: Presidência da República, 1998.

BRASIL. **Lei nº 10.406, de 10 de janeiro de 2002**. Institui o Código Civil. Brasília, DF: Presidência da República, 2002.

BRASIL. **Lei nº 13.709, de 14 de agosto de 2018**. Lei Geral de Proteção de Dados Pessoais (LGPD). Brasília, DF: Presidência da República, 2018.

CARD, Stuart K.; MACKINLAY, Jock D.; SHNEIDERMAN, Ben (ed.). **Readings in information visualization**: using vision to think. San Francisco: Morgan Kaufmann, 1999.

CLEVELAND, William S.; McGILL, Robert. Graphical perception: theory, experimentation, and application to the development of graphical methods. **Journal of the American Statistical Association**, v. 79, n. 387, p. 531-554, 1984.

CRUZ, Crystian. **Brasilêro**: vernacular typeface. 1999. Disponível em: https://crystiancruz.myportfolio.com/brasilero. Acesso em: 12 nov. 2026.

FAVETTA, Giovanna. **Tipografia Vernacular 0800**. Disponível em: https://www.gifavetta.art/tipografia-0800. Acesso em: 12 nov. 2026.

FORMSUBMIT. **Documentation**. 2026. Disponível em: https://formsubmit.co/documentation. Acesso em: 13 nov. 2026.

JONES, Jeff. Characteristics of pattern formation and evolution in approximations of Physarum transport networks. **Artificial Life**, v. 16, n. 2, p. 127-153, 2010.

KNAFLIC, Cole Nussbaumer. **Storytelling with data**: a data visualization guide for business professionals. Hoboken: Wiley, 2015.

McCANDLESS, David. **The Billion Dollar Gram**. Information is Beautiful. Disponível em: https://informationisbeautiful.net/visualizations/the-billion-dollar-gram/. Acesso em: 13 nov. 2026.

McCANDLESS, David. **Snake Oil Supplements**. Information is Beautiful. Disponível em: https://informationisbeautiful.net/visualizations/snake-oil-scientific-evidence-for-nutritional-supplements-vizsweet/. Acesso em: 13 nov. 2026.

McCANDLESS, David. **World's Biggest Data Breaches & Hacks**. Information is Beautiful. Disponível em: https://informationisbeautiful.net/visualizations/worlds-biggest-data-breaches-hacks/. Acesso em: 13 nov. 2026.

MACHADO, Gustavo M.; OLIVEIRA, Manuel M.; FERNANDES, Leandro A. F. A physiologically-based model for simulation of color vision deficiency. **IEEE Transactions on Visualization and Computer Graphics**, v. 15, n. 6, p. 1291-1298, 2009.

NEURATH, Otto. **International picture language**: the first rules of Isotype. London: Kegan Paul, Trench, Trubner & Co., 1936.

OTTOSSON, Björn. **A perceptual color space for image processing** (OKLab). 2020. Disponível em: https://bottosson.github.io/posts/oklab/. Acesso em: 12 nov. 2026.

SHNEIDERMAN, Ben. The eyes have it: a task by data type taxonomy for information visualizations. In: IEEE SYMPOSIUM ON VISUAL LANGUAGES, 1996, Boulder. **Proceedings** [...]. Los Alamitos: IEEE, 1996. p. 336-343.

TUFTE, Edward R. **Envisioning information**. Cheshire: Graphics Press, 1990.
