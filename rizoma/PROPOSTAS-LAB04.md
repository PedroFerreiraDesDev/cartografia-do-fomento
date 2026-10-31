# Lab 04 (Physarum): ajustes feitos e três perguntas abertas

Data: 31/10/2026. O autor escolheu o Lab 04 como direção principal ("ficou muito bom"). Este documento registra o ajuste do rastro já feito e propõe alternativas para as três perguntas que ele colocou: interação final, forma do nó e o que mantém a pessoa explorando.

## 1. Ajuste feito: o rastro segue a bolinha com que o nó se liga

Pedido: "o rastro deve representar alguma forma no fundo, seguindo a bolinha que está ligada e fazendo as ligações, e ser algo mais fluido; as cores se misturando ficou ótimo".

O que mudou em `lab-04-physarum.html` (parâmetros `PH`):

| Antes | Depois | Efeito |
|---|---|---|
| sensores a 8 px, giro de 0,3 rad, tremor 0,12 | sensores a 12 px, giro de 0,2 rad, tremor 0,06 | curvas longas: o rastro vira veia, não ruído |
| puxão rumo ao irmão ligado 0,035 | 0,09, e 0,5 quando está a menos de 6 px | o agente de fato chega ao nó ligado |
| agente que chega continua | ao chegar, troca origem e destino e volta pelo mesmo caminho | a veia entre dois nós ligados engrossa com o tempo |
| agente livre vaga | depois de 90 quadros, deriva de leve para o nó de origem (0,02) | a mancha cinza fica em volta dos nós: a "forma no fundo" |
| cor do depósito substitui 60% | 35% | as cores se fundem devagar onde duas redes se cruzam (azul + amarelo → verde) |
| rastro ampliado 3× sem filtro | ampliado com `blur` de 2,4 px (1,6 no celular) na GPU | leitura contínua, sem pontinhos; custo zero na CPU |
| agente ligado deposita 1 px | deposita 2 px (o segundo com metade da força) | veia ligada visivelmente mais grossa que o fundo |

Medido no navegador do app: 60 fps com 700 agentes, 1,1 ms por quadro do micélio (a largura do painel ativou o modo "pequeno"; no desktop largo são 2.500 agentes, dentro do governador).

## 2. Interação final: o que fecha a visita?

Hoje a experiência não termina: a pessoa revela, liga linhas, abre nós e sai. Quatro formas de dar um "fim" que ainda seja rizomático (sem concluir por ela):

| | Proposta | Como funciona | Por que serve ao TCC | Custo |
|---|---|---|---|---|
| A | **Meu micélio** (recomendada) | Quando a pessoa já revelou N nós (ou clica em "Fechar meu mapa"), o campo congela, o rastro deixa de evaporar e vira uma estampa: PNG com o micélio, a trilha de nós abertos e as linhas escolhidas, com título gerado ("12 projetos · Mecanismo e Ano · 31/10"). Botões: baixar, recomeçar, "deixar no muro". | É o "mapa, não decalque" materializado: cada visita produz um mapa diferente, que serve de registro para a pesquisa com artistas. | Baixo: o motor já exporta PNG (`R.save`); falta compor as camadas. |
| B | **Muro coletivo** | O mapa final de cada visita fica guardado (localStorage agora; backend simples depois) e a próxima visita começa vendo, bem apagado, o micélio de quem passou antes: um palimpsesto de visitas. | Liga o Lab 03 (palimpsesto) ao Lab 04 e dá ao protótipo uma dimensão de "escrita territorial" (Canclini) feita pelos visitantes. | Médio: precisa de armazenamento e de uma regra de esmaecimento. |
| C | **Corte e rebrota como desfecho** | O fim é um gesto: a pessoa corta a rede (já existe no motor) e assiste ao micélio refazer outro caminho entre os mesmos nós, antes de sair. | Encena a ruptura a-significante: o rizoma recomeça por outra linha. | Baixo: só a coreografia (câmera, tempo). |
| D | **Entrega no projeto** | O último nó aberto vira a página inteira do projeto, com o micélio da visita como fundo da capa. | Transforma a exploração em leitura aprofundada: o fim é entrar no projeto. | Médio: a página do projeto precisa receber a imagem. |

Recomendação: A primeiro (fecha a experiência e produz material de pesquisa), com D como saída alternativa no mesmo painel final ("abrir o último projeto").

## 3. O que representa o projeto? (a bolinha)

Hoje: círculo cujo raio cresce com o valor, traço mais grosso para o circuito monumental. É neutro demais para carregar o que o TCC diferencia (monumental × capilar; IF × Fundo × Descentra).

| | Forma | Codifica | Prós | Contras |
|---|---|---|---|---|
| 1 | Círculo (atual) | valor no raio, circuito no traço | lê bem no 3D e na névoa | não diz mecanismo nem circuito à primeira vista |
| 2 | **Fragmento de muro** | proporção pelo circuito (monumental = retângulo alto, uma empena; capilar = conjunto de 3–5 retângulos pequenos), área pelo valor, cor pelo mecanismo | é a tese visual do TCC (empena × fachadas), já testada no Lab 01 ("Superfícies") | mais pesado para desenhar em 3D; precisa de versão mínima para nós pequenos |
| 3 | Glifo por mecanismo | IF = marca de patrocínio (retângulo com barra), Fundo = quadrado cheio, Descentra = aglomerado de pontos; valor no tamanho | distingue as três origens do recurso sem legenda | glifo é convenção: exige aprendizado |
| 4 | Mancha de tinta viva | o nó é uma mancha orgânica (como no Lab 01) cuja pulsação é o número de agentes que ele solta | o nó e o micélio viram uma coisa só; "vitalidade" do projeto | valor e mecanismo ficam menos legíveis |
| 5 | Fotografia quando houver | círculo com a foto da obra recortada; sem foto, cai para a forma 2 | é o que o público reconhece | depende do acervo de fotos (ainda placeholder) |

Recomendação: **2 como base, 5 por cima quando houver foto**: proporção = circuito, área = valor, cor = mecanismo, foto = obra. O micélio continua nascendo do centro da forma. Primeiro teste barato: implementar a forma 2 só no Lab 04, com um botão "Forma do nó: círculo / muro" para comparar lado a lado.

## 4. Descoberta: o que faz a pessoa continuar passando o mouse?

Hoje o convite é a mensagem de guia e a revelação ociosa. Mecanismos de "puxar" a exploração, do mais barato ao mais ambicioso:

1. **O cursor é alimento** (recomendada): enquanto a mão está sobre um nó, os agentes dele são atraídos para o cursor e, ao mover devagar, puxam o micélio junto, como quem estica uma veia; se a veia chega perto de um nó escondido, ele se revela. A pessoa descobre arrastando o micélio, não varrendo a tela. Custo baixo: é um `target` móvel para os agentes do nó em foco.
2. **Camadas por permanência**: passar o mouse revela em camadas, conforme o tempo parado: 0,3 s título; 1 s ano e mecanismo; 2 s valor e "3 ligações possíveis"; 3 s os irmãos escondidos começam a pulsar. Parar vale a pena. Custo baixo (um relógio no hover do motor).
3. **Pista de direção**: o nó em foco mostra, no anel, pequenos traços apontando para onde há nós escondidos ligados a ele (sem dizer quais). Custo baixo: o motor já tem `ghosts()`.
4. **Contador de escondidos** na ficha: "este projeto tem 4 ligações possíveis, 2 com nós que você ainda não revelou". Custo mínimo.
5. **Sementes**: nós escondidos emitem um pulso fraco de rastro a cada poucos segundos, só no micélio (não no rizoma): a pessoa vê que "há algo ali" antes de revelar. Custo baixo.
6. **Meu mapa como progresso**: o contador "7/20" vira uma barra com os nós como marcas; o fechamento (seção 2) só fica disponível a partir de certo ponto. Custo baixo.

Recomendação: 1 + 2 + 4 juntos. O 1 muda o gesto (arrastar o micélio), o 2 recompensa parar, o 4 nomeia o que falta. 3 e 5 ficam para a rodada seguinte se a leitura ficar confusa.

## 5. Para decidir

- Interação final: A (Meu micélio) com D como saída? ou outra?
- Nó: testar a forma "fragmento de muro" no Lab 04 com botão de comparação?
- Descoberta: implementar 1 + 2 + 4?

## 6. Implementado em 31/10 (segunda passagem), a pedido do autor

- **Rastro**: os nós deixaram de ter halo ("o ano ficar centralizado no nó"); os agentes livres rumam a outro nó revelado qualquer, então os traços se formam entre todos os nós, como na primeira versão do Lab 04, e os ligados continuam mais fortes e coloridos; as cores seguem se fundindo. Os nós vagam mais (`drift: 2.4`, opção nova do motor).
- **Descoberta** (seção 4, itens 1 + 2 + 4): o cursor é alimento (os agentes do nó em foco seguem a mão por até 2,5 s depois do último movimento e, se a mão chega a 34 px de um nó escondido, ele se revela "pelo micélio"); parar sobre um nó revela em camadas (0,25 s título; 0,7 s ano, mecanismo, circuito; 1,5 s valor, ligações possíveis e quantas escondidas; 2,6 s os escondidos ligados pulsam no micélio); a ficha ganhou "Ainda escondido", com os nomes.
- **Interação final** (seção 2, proposta A): botão "Fechar meu mapa" (tecla M) congela o campo e o micélio, compõe rastro + rizoma num PNG com título gerado ("12 projetos · Mecanismo · data" e a trilha) e abre o painel "Meu micélio" com baixar, abrir o último projeto, continuar ou recomeçar; ao revelar os 20, o guia sugere fechar.
- Ainda não feitos: forma do nó (seção 3), muro coletivo (2B), pistas de direção (4.3) e sementes (4.5). As propostas ficam registradas para a próxima rodada.

## 7. Forma do nó implementada (31/10, terceira passagem)

Seção 3, proposta 2, agora no motor (`js/rizoma.js`, opção `nodeStyle: "muro"`, API `R.setNodeStyle`) e no Lab 04 com o botão "Nó · muro / círculo" (tecla N) para comparar:
- **Monumental** = uma empena: retângulo alto, com platibanda e duas linhas de pavimento; a área cresce com o valor.
- **Capilar** = conjunto de fachadas: 3, 4 ou 5 blocos pequenos de alturas desiguais (micro, médio, macro) sobre um chão comum; a unidade nasce do conjunto.
- **Cor = mecanismo** (rosa Incentivo Fiscal, azul Fundo Municipal, verde Descentra), a mesma paleta dos Labs 01–03; nó aberto fica em tinta cheia; foco e hover ganham um quadro.
- O micélio continua nascendo do centro da forma; o protótipo principal segue com círculos até o autor decidir.
- Fica para depois: fotografia por cima da forma (proposta 5) quando houver acervo.

## 8. Linhas finas, mais espaço, foco que aproxima (31/10, quarta passagem)

Pedido: "linhas mais finas, estou achando muitos elementos; os muros podem ficar mais espaçados, brincar mais com o espaço da tela; ao selecionar um projeto, um zoom sutil ou ele vir para a frente, ou uma leve aumentada".
Três opções novas de montagem no motor, usadas só pelo Lab 04 por enquanto (o protótipo principal segue igual):
- `lineWeight: 0.55`: todas as linhas de fuga com pouco mais da metade da espessura;
- `spread: 1.45`: repulsão entre nós ×2,1, molas 45% mais longas, atração ao centro 30% menor, então o campo ocupa a tela em vez de se aglomerar no meio;
- `focusZoom: true`: abrir um nó aproxima a câmera 18% em torno dele (sem acumular ao trocar de nó), traz o nó para a frente no 3D e o desenha 30% maior; os nós ligados a ele crescem 10%; fechar devolve a câmera de onde estava.
Medido no navegador do app: zoom 1 → 1,18 ao abrir → 1 ao fechar; nós espalhados por ~500 px numa janela de 724 px.

## 9. Menos elementos (31/10, quinta passagem)

"Ainda acho muito elemento; as bolinhas no fundo não estão legais." As bolinhas eram o spray do gesto (a textura cinza que o motor deixa onde a mão passa). O motor ganhou `spray: false` e o Lab 04 usa; o micélio livre (sem linha) ficou quase da cor do papel e deposita menos (3 em vez de 5). Sobram só muros, linhas finas e o micélio colorido das linhas ligadas. O protótipo principal mantém o spray, que ali é a metáfora de revelar.

## 10. Radar, bordas e movimento (31/10, sexta passagem)

- **Radar dos escondidos** (o autor gostou do ponto que pisca): todo projeto ainda não revelado pisca de leve no lugar onde está; os ligados ao nó sob a mão piscam mais forte. Clicar (ou tocar) num ponto que pisca revela aquele projeto. Os já revelados funcionam como radar: ao pairar neles, os escondidos ligados acendem.
- **Bordas**: o motor ganhou `margin` (topo, direita, base, esquerda, em px, fixo ou função). A margem vale na tela: a posição projetada do último quadro (com perspectiva, giro e zoom) corrige a posição do mundo, então nem o nó que vem para a frente passa da faixa. No Lab 04: longe do texto, das ferramentas e, com a ficha aberta, da ficha.
- **Movimento mais sutil**: deriva 0,9 (era 2,4), para facilitar o clique; o nó sob a mão já ficava parado.
- **Spray ainda visível no site publicado**: os labs carregavam `js/rizoma.js` sem versão, então o navegador servia o motor antigo. Agora os labs também levam `?v=` nos scripts; a cada mudança no motor, subir o número em `index.html` e nos labs.

## 11. Padrões fixados e ciclo das linhas (31/10, sétima passagem)

- **200 agentes e evaporação média** como padrão (o autor aprovou o estado atual); os botões continuam permitindo mudar, com passo de 100.
- **Nada preso na parede nem atrás de elementos**: as margens do campo passaram a ser medidas nos elementos reais da interface (texto, ferramentas, contador e, no desktop, a ficha aberta), com 26 px de folga, e a faixa de retorno ficou mais larga e mais forte (110 px, força ×1,7), para o nó voltar ao campo em vez de ficar encostado. No celular a ficha é uma folha temporária e não espreme os nós. Verificado: 20 nós entre o fim do texto e o início das ferramentas, nenhum por baixo.
- **Ciclo mais longo das linhas**: opção `lineCycle` no motor (Lab 04 usa 2,2): o puxão entre nós ligados dura 3 s em vez de 1,4 s e a linha cresce 2,2× mais devagar; os agentes do micélio vivem 2,3× mais (600–1600 quadros), então as veias se formam e se desfazem em ciclos longos, sem o "pisca" de antes.
- O Lab 05 (todas as páginas na linguagem do Lab 04) foi aberto em sessão própria; registro em seção 12 quando chegar.

## 12. Lab 05: o sistema inteiro na linguagem do Lab 04 (31/10, sessão própria)

`lab-05-sistema.html` leva a direção escolhida (Lab 04) para todas as páginas do site. É um arquivo separado, com CSS e script próprios, que reaproveita a lógica de `js/app.js` sem alterá-lo; `index.html`, `css/style.css` e `js/app.js` seguem como estão até o autor decidir trocar.

Decisões de coesão:

- **Uma só superfície**: papel `#f7f6f1` e tinta `#161616` em todas as páginas, inclusive capa, ficha e página de projeto. O branco puro só aparece em botões e cartões sobre o papel. Não há modo escuro: o campo é transparente sobre o rastro, e as camadas de baixo não têm versão escura (o motor é devolvido a "papel" se a tecla T for apertada).
- **A cor carrega informação, nunca decoração**: rosa, azul e verde só para mecanismo (como no nó-muro); as seis cores de `Rizoma.LINES` só para a natureza de uma relação. Nos Indicadores, cada gráfico recebe como acento a cor da linha de fuga a que corresponde (Regional, Ano, Escala); nos Editais, o acento é a cor da linha "Edital" e cada edital é um chip com essa cor, porque é isso que ele é no campo: uma ligação possível entre projetos. As peças do gráfico ano × mecanismo têm a cor do mecanismo, com contorno de tinta, como o nó.
- **O nó vira ícone**: a mesma construção do `drawWall` do motor (empena alta para o monumental, 3–5 fachadas sobre um chão comum para o capilar, área pelo valor, cor pelo mecanismo) é redesenhada em SVG por `wallIcon()` e usada na legenda de mecanismos, no gráfico de escala (os "muros" substituem o treemap cinza), na lista lateral, nos editais (um ícone-tipo por mecanismo), na ficha e na página de projeto, onde ocupa o lugar da imagem placeholder. Quem aprende a ler o campo lê os gráficos, e vice-versa.
- **Tipografia**: títulos em condensada (Arial Narrow, com fallbacks e `font-stretch`), caixa alta, entrelinha fechada; o resto em Arial pequena, como no Lab 04. Os títulos grandes são o único elemento "alto" de cada página; o resto são linhas finas de 1 px (`--line #d4d1c8`) e texto cinza.
- **Poucos elementos**: saíram a busca, o menu "Mais", o modo árvore, o modo escuro, o card de hover do rodapé e o tooltip flutuante dos gráficos. O hover nos gráficos atualiza a lista lateral (que já existia) em vez de abrir um balão. As ferramentas do campo são as do Lab 04 menos o botão de forma do nó (decisão já tomada: muro).
- **Nada atrás de nada**: as margens do campo são medidas nos elementos reais (texto, ferramentas, contador, rodapé e, no desktop, a ficha aberta), com 26 px de folga, como no Lab 04; o texto longo do Descobrir foi para o rodapé, então a faixa superior que os nós respeitam é só título + legenda. O guia (faixa preta) fica acima do rodapé e some sozinho. Na capa o campo vive atrás, em modo `intro` (sem interação, zoom 0,72), e só revela nós ao entrar.
- **Uma só ficha**: `openPreview(id, origem)` é a única porta para abrir um projeto, do campo, dos indicadores ou dos editais (a ficha diz "VIA INDICADORES"/"VIA EDITAIS"). A ficha é fixa à direita no desktop e folha inferior no celular, com ícone, fatos, "ainda escondido", linhas ligadas, ligações possíveis e trilha. "Explorar projeto" abre a página inteira; voltar devolve à página de origem e reabre a ficha do mesmo nó.
- **Mobile-first**: ≤780 px, faixa curta no topo (kicker, título, legenda), contador no canto, ferramentas em fita rolável no pé, ficha como folha de 72 vh que esconde as ferramentas enquanto está aberta. Indicadores empilhados, editais em duas colunas, página de projeto em uma coluna. Os handlers de toque fora do canvas nunca devolvem `false` (os botões continuam clicáveis no Android).

Fora deste lab, por decisão de escopo: busca, árvore/decalque e corte com botão. Ficam disponíveis no protótipo principal.
