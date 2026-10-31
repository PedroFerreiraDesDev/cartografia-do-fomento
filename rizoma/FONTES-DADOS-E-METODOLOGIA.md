# Fontes de dados e metodologia: o que alimenta a Cartografia do Fomento

Documento de trabalho (31/10/2026) para o TCC *Cartografia do Fomento: Mapeamento de Projetos de Grafite e Muralismo em Belo Horizonte (2017–2024)* (Pedro Henrique Ferreira Moreira, Design, Escola de Arquitetura UFMG, orientação Maria Luiza Viana). Responde ao pedido do autor de "buscar mais informações relevantes para o projeto, dentro do TCC ou que possam gerar valor, com as fontes de onde saem os dados, seguindo uma metodologia de pesquisa". Tudo que vem de terceiros está com fonte; o que não foi possível confirmar está marcado como **não verificado**.

Organização:

1. O que o TCC já diz sobre os dados (lido no PDF de 02/10/2026)
2. O que o protótipo tem hoje e o que falta (campos nulos, lacunas, inconsistências a checar)
3. Fontes públicas levantadas (pesquisa na web em 31/10/2026, com URL, formato e limitações)
4. Metodologia: como coletar, verificar, tabular e defender
5. Referências para os gráficos generativos (Lab 06) como design da informação
6. Plano: Tipografia viva e os gráficos do Lab 06 dentro do protótipo
7. Referências (ABNT)

---

## 1. O que o TCC já diz sobre os dados

Lido no PDF `20261002_TCC.pdf` (35 páginas), seções 1, 5.1 e 6 (p. 8, 17–22):

- **Fonte primária declarada.** "Diários Oficiais do Município (DOM) e Listas de Homologação (2017–2024). Elaborado pelo autor, 2025" é a fonte das Tabelas 1, 2 e 3. O texto cita "(PBH, 2018)" para o LMIC 2017 e "(PBH, 2021)" para o LMIC 2021: são as listas oficiais de projetos homologados/aprovados publicadas pela Prefeitura.
- **Método declarado.** "Análise documental quantitativa e qualitativa dos resultados da Lei Municipal de Incentivo à Cultura (LMIC)", constituída pelas listas oficiais de aprovados, 2017–2024 (p. 17). Para o Descentra: "levantamento nos editais Descentra (2019–2024)" (p. 19).
- **Categorias analíticas.** "Monumental" (Incentivo Fiscal) e "capilar" (Fundo e Descentra) "são construções analíticas derivadas das características observadas no conjunto de projetos analisados. Não correspondem a classificações oficiais" (p. 17). Isso precisa aparecer no protótipo como nota de rodapé da legenda (hoje a legenda diz "empena = monumental, fachadas = capilar" sem avisar que é construção do autor).
- **Plataformas citadas como "burocráticas".** Mapa Cultural BH e Prosas (p. 8): o TCC as trata como lugares onde os dados existem mas não se leem. São, portanto, fontes a consultar para preencher campos, não concorrentes.
- **Outros mecanismos citados.** Lei Paulo Gustavo (LPG) como repasse federal recente (p. 8). Não há projeto da LPG nas tabelas: é uma lacuna declarada do recorte, que vale registrar no protótipo ("o que ficou fora e por quê").
- **Teoria da espacialização.** Canclini (1990, "escrita territorial"), Sperling (2016; 2024) e Kiminami & Sperling (2020) sobre cartografias críticas e visibilidade/invisibilidade, Tufte (1983). Ver a memória do projeto: Sperling e Kiminami & Sperling ainda faltam na lista de referências do PDF.
- **Dado territorial.** O texto afirma "hipercentro e Centro-Sul" para o IF e "regionais periféricas (Venda Nova, Norte)" para o capilar (Tabela 3, p. 21–22), mas as tabelas 1 e 2 não trazem coluna de regional nem endereço. O protótipo herda isso: `region` e `proponent` são nulos nos 20 projetos (`js/data.js`, campo `verification: "Presente na Tabela 1/2 do TCC"`). A afirmação territorial do TCC está, por enquanto, sem a evidência tabulada que a sustenta.

## 2. O que o protótipo tem hoje e o que falta

Hoje, em `js/data.js`: 20 projetos, campos `id, title, year, mechanism, edital, value, circuit, region (null), proponent (null), verification, issue`, mais `CARTOGRAFIA_RELATIONS` (relações curatoriais escritas pelo autor).

O que falta e **de onde pode vir** (detalhado na seção 3):

| Campo / lacuna | Para quê no protótipo | Fonte provável |
|---|---|---|
| `region` (regional administrativa) e endereço do mural ou da ação | Linha de fuga "Território" com dado, não com nulo; Descentra por regional; cruzamento com população/IVS | Lista de aprovados do Descentra (o edital é por regional), projeto inscrito no Mapa Cultural BH, release do proponente, DOM |
| `proponent` (pessoa física, MEI, coletivo, empresa) e perfil | Filtro "perfil do proponente" previsto no TCC; nunca inferir gênero/raça | Lista de homologação (traz o proponente), Mapa Cultural BH (agente) |
| Valor **aprovado** × valor **captado** × valor **pago** (IF) | O IF aprova um teto, mas o proponente precisa captar; o gráfico de régua hoje usa o aprovado como se fosse executado | Relatórios de captação da LMIC/FMC, Portal da Transparência, e-SIC |
| Status (realizado, parcialmente, não executado) | Nó "escondido" poderia ser "não realizado" | Prestação de contas (e-SIC), imprensa, Instagram do projeto (fonte secundária) |
| Anos 2018 e 2020 sem projeto | O "Rio" do Lab 06 seca nesses anos: é falta de edital, falta de projeto de grafite aprovado, ou falta de busca? | DOM: houve edital LMIC 2018? Houve Descentra 2020 (pandemia, Lei Aldir Blanc)? |
| Projetos de grafite fora do recorte (Lei Aldir Blanc 2020–21, Lei Paulo Gustavo 2023–24, Rouanet, editais do Estado/FEC) | Camada "fora do recorte" para honestidade do mapa | Transparência LAB/LPG da PBH, Salic/Versalic, FEC-MG |
| Teto de cada edital por ano (R$ 110 mil 2017; 150 mil 2021; 165 mil 2023; Descentra 20 mil → 38,4 mil → 40 mil) | A régua de valores já usa o teto; precisa da fonte por ano | Editais (PDF) no site da PBH |
| Datas (publicação do edital, homologação, execução) | Linha do tempo real, não só o ano | DOM |
| Fotos / localização dos murais | Fragmento de muro com foto (pendência do Lab 04) | Proponentes, Arte Fora do Museu, Instagram (com autorização) |

Inconsistências a conferir antes de qualquer gráfico novo: o valor de "Viva a Praça Sete" (R$ 164.888,89) e de "Nuhi" (R$ 89.870,00) sugerem valores **captados/ajustados**, enquanto os demais parecem **tetos aprovados**: misturar os dois na mesma coluna distorce o Gini (hoje 0,35) e a régua.

## 3. Fontes públicas levantadas (31/10/2026)

*(preenchido com o relatório da pesquisa na web; ver abaixo)*

## 4. Metodologia

Relatório de verificação bibliográfica (pesquisa na web em 31 out. 2026, por agente desta sessão). Cada item foi conferido em página de editora, repositório institucional, registro Crossref ou catálogo de biblioteca; onde algum dado não pôde ser lido numa página, está marcado **não confirmado**. Nenhum ISBN foi inferido. Referências já no padrão ABNT NBR 6023:2018; a frase em itálico após cada uma diz onde ela entra no TCC.

### 4.1 Pesquisa documental

**GIL, Antonio Carlos. Como elaborar projetos de pesquisa. 6. ed. São Paulo: Atlas, 2017. ISBN 978-85-97-01292-7.** Edição mais recente: 7. ed. São Paulo: Atlas, 2022. 186 p. ISBN 978-65-5977-163-9 (registro de biblioteca IFAP e acervo IFSertãoPE).
*Gil distingue pesquisa bibliográfica (fontes já tratadas) de pesquisa documental (fontes primárias sem tratamento analítico): editais, atas de comissão, extratos de publicação no DOM-BH e planilhas de prestação de contas são documentos de "primeira mão", e o TCC os converte em dataset, exatamente o caso que Gil descreve.*

**MARCONI, Marina de Andrade; LAKATOS, Eva Maria. Fundamentos de metodologia científica. 8. ed. São Paulo: Atlas, 2017. ISBN 978-85-970-1076-3** (ficha CIP do próprio livro). Há 9. ed. (Atlas, 2021/2022, ISBN 978-85-970-2656-6; **ano não confirmado**).
*Útil pela tipologia de fontes primárias (arquivos públicos, publicações oficiais) e pela separação entre documentação direta e indireta; o Diário Oficial do Município é "arquivo público oficial" na classificação delas.*

**CELLARD, André. A análise documental. In: POUPART, Jean et al. A pesquisa qualitativa: enfoques epistemológicos e metodológicos. Tradução Ana Cristina Nasser. Petrópolis: Vozes, 2008. p. 295-316.** 464 p. (Coleção Sociologia). O texto original é de 1997; a 1. ed. brasileira é Vozes 2008 (resenha UFRGS, 464 p.); a 4. ed. (2014) tem ISBN 978-85-326-3681-2. **ISBN da tiragem de 2008 e intervalo de páginas não confirmados em página da editora.**
*Cellard propõe a "análise preliminar" em cinco dimensões (contexto, autor(es), autenticidade e confiabilidade, natureza do texto, conceitos-chave e lógica interna) que serve literalmente como checklist de crítica de cada edital e de cada ato de publicação de resultado antes de tabular o valor.*

### 4.2 Análise de conteúdo

**BARDIN, Laurence. Análise de conteúdo. Tradução Luís Antero Reto e Augusto Pinheiro. São Paulo: Edições 70, 2016. 279 p. ISBN 978-85-62938-04-7** (catálogo de biblioteca; há impressão de 2015 com 288 p. e ISBN 978-972-44-1506-2: conferir na ficha do exemplar usado). O rótulo "edição revista e ampliada, 2011" é **não confirmado**.
*As três fases (pré-análise, exploração do material, tratamento/inferência) organizam a leitura de 20 projetos: pré-análise = corpus de editais e resultados; exploração = codificação de categorias (mecanismo, ano, território, valor, linguagem: grafite/muralismo); inferência = padrões de distribuição que as visualizações tornam visíveis.*

### 4.3 Estudo de caso

**YIN, Robert K. Estudo de caso: planejamento e métodos. Tradução Cristhian Matheus Herrera. 5. ed. Porto Alegre: Bookman, 2015. 290 p. ISBN 978-85-8260-232-4** (impresso; e-book 978-85-8260-231-7, catálogo Minha Biblioteca).
*Belo Horizonte 2017–2024 é um caso único com unidades incorporadas (os três mecanismos); Yin dá o vocabulário de "fontes múltiplas de evidência", "cadeia de evidências" e "banco de dados do estudo de caso": este último é o `data.js` com coluna de proveniência por linha.*

### 4.4 Triangulação

**DENZIN, Norman K. The research act: a theoretical introduction to sociological methods. 2. ed. New York: McGraw-Hill, 1978. ISBN 0-07-016361-8** (registro NYPL; outra base lista 0-07-016360-X para tiragem de 1977: **edição exata não confirmada**).
*Origem da tipologia de triangulação (de dados, de investigador, de teoria, metodológica); no TCC, a triangulação de dados cruza edital × DOM-BH × portal da transparência × site do proponente para cada projeto.*

**FLICK, Uwe. Introdução à pesquisa qualitativa. Tradução Joice Elias Costa. 3. ed. Porto Alegre: Artmed, 2009. 405 p. ISBN 978-85-363-1711-3.**
*Flick atualiza Denzin e trata a triangulação não como "prova" mas como ampliação de perspectivas: justifica por que divergências entre valor aprovado e valor empenhado são registradas, não eliminadas.*

### 4.5 Métodos mistos (quali-quanti)

**CRESWELL, John W.; PLANO CLARK, Vicki L. Pesquisa de métodos mistos. Tradução Magda França Lopes. 2. ed. Porto Alegre: Penso, 2013. 288 p. ISBN 978-85-65848-47-3.** (Livraria lista 2012; **ano da tiragem não confirmado**; original: Designing and conducting mixed methods research, 2. ed., SAGE, 2011, ISBN 978-1-4129-7517-9.)
*O TCC é um desenho convergente: a quantificação (valores, contagens, séries por ano) e a leitura qualitativa (linguagem artística, territórios, discurso dos editais) são coletadas em paralelo e integradas nas visualizações.*

### 4.6 Cartografia como método

**PASSOS, Eduardo; KASTRUP, Virgínia; ESCÓSSIA, Liliana da (org.). Pistas do método da cartografia: pesquisa-intervenção e produção de subjetividade. Porto Alegre: Sulina, 2009. 207 p.** ISBN 978-85-205-0530-4 aparece na 4ª reimpressão (2015); **ISBN da 1. ed. 2009 não confirmado**.
*Liga o título do trabalho ao rizoma de Deleuze & Guattari já citado: a cartografia aqui não "representa" o fomento, acompanha processos; a pista da "atenção flutuante" justifica incluir no corpus o que escapa da planilha (editais sem resultado publicado, projetos recategorizados), e a "dissolução do ponto de vista do observador" justifica o protótipo como dispositivo de intervenção e não só de exibição.*

### 4.7 Design research / research through design

**FRAYLING, Christopher. Research in art and design. Royal College of Art Research Papers, London, v. 1, n. 1, p. 1-5, 1993/4.** Disponível em: https://researchonline.rca.ac.uk/384/. Acesso em: 31 out. 2026.
*Fonte da tríade "research into / through / for art and design"; o TCC é research through design: o conhecimento sobre o fomento é produzido ao construir o artefato.*

**ZIMMERMAN, John; FORLIZZI, Jodi; EVENSON, Shelley. Research through design as a method for interaction design research in HCI. In: SIGCHI CONFERENCE ON HUMAN FACTORS IN COMPUTING SYSTEMS (CHI '07), 2007, San Jose. Proceedings [...]. New York: ACM, 2007. p. 493-502. DOI 10.1145/1240624.1240704.**
*Dá critérios de avaliação para um RtD acadêmico (processo, invenção, relevância, extensibilidade) que podem estruturar o capítulo de avaliação do protótipo.*

### 4.8 Jornalismo de dados e verificação de dados abertos

**GRAY, Jonathan; BOUNEGRU, Liliana; CHAMBERS, Lucy (ed.). The data journalism handbook: how journalists can use data to improve the news. Sebastopol: O'Reilly, 2012. ISBN 978-1-449-33006-4.** (Licença CC BY-SA; versão on-line gratuita.)
*Capítulos "Getting data" e "Understanding data" descrevem pedidos via leis de acesso, extração de PDFs oficiais e registro de proveniência: rotina idêntica à extração de resultados do DOM-BH.*

**CAIRO, Alberto. How charts lie: getting smarter about visual information. New York: W. W. Norton, 2019. 256 p. ISBN 978-1-324-00156-0** (brochura 2020: 978-0-393-35842-1).
*A verificação não acaba na tabela: Cairo lista como escalas, agregações e escolhas de codificação distorcem; usar como critério de autocrítica das visualizações generativas (seção 5).*

### 4.9 Normas e base legal

**ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. ABNT NBR 6023: informação e documentação: referências: elaboração. 2. ed. Rio de Janeiro: ABNT, 2018.** (Erratas de 2020 e 2023; bibliotecas universitárias já mencionam uma NBR 6023:2025: **confirmar na biblioteca da UFMG qual versão a Escola de Arquitetura exige**.)

**ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. ABNT NBR 10520: informação e documentação: citações em documentos: apresentação. Rio de Janeiro: ABNT, 2023.** (Publicada em 19 jul. 2023; cancela a NBR 10520:2002.)

**ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. ABNT NBR 14724: informação e documentação: trabalhos acadêmicos: apresentação. 3. ed. Rio de Janeiro: ABNT, 2011.** (Um guia cita edição 2024: **não confirmado**.)

**BRASIL. Lei nº 12.527, de 18 de novembro de 2011. Regula o acesso a informações [...]. Diário Oficial da União: seção 1, Brasília, DF, 18 nov. 2011, edição extra. Disponível em: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/Lei/L12527.htm. Acesso em: 31 out. 2026.**
*Base legal para (a) a transparência ativa, que obriga a PBH a publicar resultados de editais e repasses (art. 8º), e (b) os pedidos de acesso que preenchem lacunas (art. 10–11), com prazo de 20 dias prorrogáveis por 10; registrar número de protocolo e resposta como fonte documental. Para o nível municipal, citar também o decreto regulamentador da LAI em BH (**não verificado neste levantamento**).*

### 4.10 Como usar no capítulo de metodologia

- **Nomear o desenho antes das técnicas.** Uma frase de abertura: "estudo de caso único (Yin) de desenho misto convergente (Creswell & Plano Clark), com pesquisa documental (Gil; Cellard) e tratamento por análise de conteúdo (Bardin), conduzido como research through design (Frayling; Zimmerman et al.) e orientado pelo método cartográfico (Passos, Kastrup & Escóssia)". Depois, cada etapa do pipeline cita só o autor que a sustenta.
- **Coleta → documental + LAI.** Descrever o corpus (editais, resultados no DOM-BH, portal da transparência, pedidos LAI com protocolo) e aplicar a análise preliminar de Cellard a cada tipo de fonte; registrar no dataset uma coluna de proveniência (URL / edição do DOM / número de protocolo): é a "cadeia de evidências" de Yin e a prática do Data Journalism Handbook.
- **Verificação → triangulação.** Para cada projeto, mostrar quais fontes convergiram e quais divergiram (valor aprovado × empenhado × pago); Denzin/Flick justificam que a divergência é dado, não erro; Cairo evita que a visualização "minta" ao escolher um só valor sem dizer qual.
- **Tabulação → análise de conteúdo.** Apresentar o livro de códigos (mecanismo, ano, regional, linguagem, valor, status) como resultado da fase de exploração de Bardin; a unidade de registro é o projeto e a unidade de contexto é o edital.
- **Visualização e validação → RtD + crítica.** Tratar cada algoritmo (Physarum, DLA, diagrama de potência, cordas, streamgraph, tipografia de partículas) como hipótese de leitura dos dados, citar o artigo de origem (seção 5) e o critério de legibilidade do artigo de InfoVis correspondente; avaliar com usuários pelos eixos de Kosara (pragmático/artístico) e pelos critérios de Zimmerman et al., posicionando o protótipo entre a visualização analítica e a artística (Viégas & Wattenberg) e no humanismo de dados (Lupi).

Pendências para o autor conferir no exemplar físico ou na biblioteca: ISBN/ano exatos de Bardin, Creswell & Plano Clark, Passos et al. (1. ed. 2009) e Poupart et al. (2008); versão das normas ABNT exigida pela Escola de Arquitetura; decreto municipal de BH que regulamenta a LAI.

## 5. Visualização generativa como design da informação

Referências conferidas em Crossref, repositórios e páginas de editora (31 out. 2026). Cada uma com uma frase sobre onde entra no TCC.

### 5.1 Physarum (redes adaptativas; Lab 04 e Lab 05)

**JONES, Jeff. Characteristics of pattern formation and evolution in approximations of Physarum transport networks. Artificial Life, Cambridge, MA, v. 16, n. 2, p. 127-153, 2010. DOI 10.1162/artl.2010.16.2.16202.**
*É o algoritmo de agentes (sentir, girar, mover, depositar, difundir, decair) que o protótipo implementa; citar como fonte do modelo e usar a seção sobre "quasi-physical properties" para argumentar que a rede resultante é uma leitura, não uma decoração, dos pontos de fomento no território.*

**TERO, Atsushi et al. Rules for biologically inspired adaptive network design. Science, Washington, v. 327, n. 5964, p. 439-442, 2010. DOI 10.1126/science.1177894.**
*Mostra que o Physarum reproduz a malha ferroviária de Tóquio com custo e eficiência comparáveis: precedente para ler uma rede emergente entre projetos como hipótese de infraestrutura, não como metáfora solta.*

### 5.2 Agregação limitada por difusão (Lab 06, Mancha que cresce)

**WITTEN, T. A.; SANDER, L. M. Diffusion-limited aggregation, a kinetic critical phenomenon. Physical Review Letters, v. 47, n. 19, p. 1400-1403, 1981. DOI 10.1103/PhysRevLett.47.1400.**
*Origem do DLA; no TCC, o crescimento a partir de sementes (projetos) codifica acúmulo temporal de recursos; citar para afirmar que a forma segue uma regra pública e reprodutível.*

### 5.3 Voronoi e diagramas de potência (Lab 06, Células de valor)

**AURENHAMMER, Franz. Power diagrams: properties, algorithms and applications. SIAM Journal on Computing, Philadelphia, v. 16, n. 1, p. 78-96, 1987. DOI 10.1137/0216006.**
*Fundamento matemático do diagrama ponderado: cada célula tem área proporcional ao valor (peso) do projeto.*

**BALZER, Michael; DEUSSEN, Oliver. Voronoi treemaps. In: IEEE SYMPOSIUM ON INFORMATION VISUALIZATION (INFOVIS 2005), 2005, Minneapolis. Proceedings [...]. Los Alamitos: IEEE, 2005. p. 49-56. DOI 10.1109/INFVIS.2005.1532128.** (Repositório KOPS Konstanz; ISBN dos anais 0-7803-9464-X.)
*Traz o diagrama de potência para InfoVis como treemap de hierarquia (mecanismo → edital → projeto) e discute legibilidade e estabilidade: a ponte entre a geometria de Aurenhammer e a leitura por usuários.*

### 5.4 Diagramas de corda (Lab 06, Cordas)

**HOLTEN, Danny. Hierarchical edge bundles: visualization of adjacency relations in hierarchical data. IEEE Transactions on Visualization and Computer Graphics, v. 12, n. 5, p. 741-748, 2006. DOI 10.1109/TVCG.2006.147.**
*Justifica agrupar arestas (mecanismo ↔ território ↔ ano) em feixes para reduzir ruído visual.*

**KRZYWINSKI, Martin et al. Circos: an information aesthetic for comparative genomics. Genome Research, Cold Spring Harbor, v. 19, n. 9, p. 1639-1645, 2009. DOI 10.1101/gr.092759.109.**
*Popularizou o layout circular com fitas e, no título, defende uma "information aesthetic": estética e precisão não se excluem.*

### 5.5 Streamgraph (Lab 06, Rio)

**HAVRE, Susan; HETZLER, Beth; NOWELL, Lucy. ThemeRiver: visualizing theme changes over time. In: IEEE SYMPOSIUM ON INFORMATION VISUALIZATION (INFOVIS 2000), 2000, Salt Lake City. Proceedings [...]. Los Alamitos: IEEE Computer Society, 2000. p. 115-123. DOI 10.1109/INFVIS.2000.885098.** Versão de periódico: HAVRE, S.; HETZLER, E.; WHITNEY, P.; NOWELL, L. ThemeRiver: visualizing thematic changes in large document collections. IEEE TVCG, v. 8, n. 1, p. 9-20, 2002. DOI 10.1109/2945.981848.

**BYRON, Lee; WATTENBERG, Martin. Stacked graphs – geometry & aesthetics. IEEE Transactions on Visualization and Computer Graphics, v. 14, n. 6, p. 1245-1252, 2008. DOI 10.1109/TVCG.2008.166.**
*Define o streamgraph (linha de base "wiggle", ordenação e cor por camada) e argumenta que decisões estéticas são decisões de legibilidade: a referência central para defender o estilo orgânico das séries temporais.*

### 5.6 Ferramentas e cultura do código criativo

**REAS, Casey; FRY, Ben. Processing: a programming handbook for visual designers and artists. 2. ed. Cambridge, MA: MIT Press, 2014. ISBN 978-0-262-02828-8.** (1. ed. 2007: ISBN 978-0-262-18262-1.)

**McCARTHY, Lauren; REAS, Casey; FRY, Ben. Getting started with p5.js: making interactive graphics in JavaScript and Processing. San Francisco: Maker Media, 2015. ISBN 978-1-4571-8677-6.**
*Referência da biblioteca usada; McCarthy é a criadora do p5.js, com ênfase em acessibilidade e inclusão.*

**MANOVICH, Lev. Cultural analytics. Cambridge, MA: MIT Press, 2020. ISBN 978-0-262-03710-5.** (Contagem de páginas diverge entre 296 e 336: **não confirmada**.)
*Enquadramento de "analisar cultura com dados sem reduzi-la a números".*

### 5.7 Humanismo de dados, arte e crítica

**LUPI, Giorgia. Data humanism: the revolutionary future of data visualization. Print Magazine, 30 jan. 2017. Disponível em: https://www.printmag.com/article/data-humanism-future-of-data-visualization/. Acesso em: 31 out. 2026.**
Atenção: o manifesto é de autoria de Lupi apenas (Accurat); Manovich e Stefaner **não** são coautores. A posição afim de Stefaner é o post "Worlds, not stories" (well-formed-data.net, 2014), não acessado nesta pesquisa; a resposta de Kosara ("Stories are gateways into worlds", eagereyes.org, mar. 2014) está acessível.
*Lupi defende imperfeição, contexto e "small data" sobre o infográfico genérico: base direta para a tipografia de partículas e para o traço orgânico do protótipo.*

**VIÉGAS, Fernanda B.; WATTENBERG, Martin. Artistic data visualization: beyond visual analytics. In: SCHULER, Douglas (ed.). Online communities and social computing (OCSC 2007). Berlin: Springer, 2007. p. 182-191. (Lecture Notes in Computer Science, v. 4564). DOI 10.1007/978-3-540-73257-0_21.**
*Distingue visualização artística de analítica pelo objetivo (ponto de vista explícito vs. neutralidade) e afirma que ambas são legítimas como design: o argumento para colocar o protótipo entre as duas, com posição declarada (contracartografia, Sperling).*

**KOSARA, Robert. Visualization criticism: the missing link between information visualization and art. In: INTERNATIONAL CONFERENCE INFORMATION VISUALIZATION (IV '07), 11., 2007, Zurich. Proceedings [...]. Los Alamitos: IEEE, 2007. p. 631-636. DOI 10.1109/IV.2007.130.**
*Propõe o eixo pragmático ↔ artístico e a "crítica de visualização" como método de avaliação: roteiro da validação com usuários.*

### 5.8 Tipografia expressiva vs. tipografia invisível (Lab 01 e Lab 05)

**LUPTON, Ellen; PHILLIPS, Jennifer Cole. Graphic design: the new basics. 2. ed. rev. e ampl. New York: Princeton Architectural Press, 2015. 264 p. ISBN 978-1-61689-332-3.**
*Capítulos sobre escala, textura, camadas, transparência e "rules and randomness" fundamentam a deformação tipográfica como procedimento de design, não como efeito.*

**WARDE, Beatrice. The crystal goblet, or printing should be invisible. In: WARDE, Beatrice. The crystal goblet: sixteen essays on typography. Ed. Henry Jacob. London: Sylvan Press, 1955.** (Palestra de 1930; impressão de 1932 sob o pseudônimo Paul Beaujon **não confirmada**.)
*Polo da "tipografia invisível", contra o qual a marca em tensão se posiciona.*

**LUPTON, Ellen. Thinking with type: a critical guide for designers, writers, editors, and students. 3. ed. rev. e ampl. New York: Princeton Architectural Press, 2024. 256 p. ISBN 978-1-79722-682-8.** (2. ed. 2010: ISBN 978-1-56898-969-3.)
*Tipografia como interface: vocabulário para defender a letra que pulsa, deforma e retorna como portadora de dados, não só de palavras.*

## 6. Plano: Tipografia viva e os gráficos do Lab 06 no protótipo

O autor aprovou (31/10) a **Tipografia viva** (Lab 06, experimento 02) e quer "projetar em cima dela", e quer **Mancha que cresce**, **Cordas** e **Células de valor** como gráficos do projeto. O que cada um precisa, em dados e em decisão, antes de entrar no Lab 05:

| Experimento (Lab 06) | Onde entra no Lab 05 | Dados que usa hoje | O que ganharia com as fontes da seção 3 | Decisão pendente |
|---|---|---|---|---|
| **02 Tipografia viva** (`expTipo`, p5: título amostrado em pontos, partículas "arrive" de Reynolds 1999) | Capa: o lambe continua como marca; a tipografia viva vira a **segunda camada da capa** (desktop/tablet), em que as letras do pôster são preenchidas por partículas proporcionais ao valor de cada projeto, na ordem do ano; tocar numa fatia abre a ficha | `value`, `year`, `mechanism` | Com valor **captado** real, a fatia de cada projeto no título passa a ser o dinheiro que de fato circulou | Capa só desktop? No celular (~50 px) os pontos ficam grossos: a proposta do Lab 06 é manter o título em HTML no celular |
| **03 Células de valor** (`expVoronoi`, Voronoi/potência, área = valor) | Indicadores: substitui o "muros" (treemap) da escala, ou fica como alternativa "células / muros" | `value`, `year`, `mechanism` | Com `region`, as sementes podem ser posicionadas por regional (hoje a posição é cenográfica: coluna = ano, faixa = mecanismo) | Custo no celular (grade 5 px, 90 iterações): calcular uma vez e guardar |
| **04 Mancha que cresce** (`expMancha`, DLA de Witten & Sander 1981) | Indicadores: abertura animada da linha do tempo (ano a ano), antes do gráfico de comparação | `value` somado por ano, `mechanism` | Com as datas do DOM, a mancha pode crescer na ordem real de homologação dentro do ano | Não é gráfico de comparação (a forma muda a cada vez): entra como "o fomento se acumulando", com o gráfico de barras ao lado |
| **05 Cordas** (`expCordas`, à maneira do Circos) | Indicadores: ano × mecanismo (hoje a matriz "ano × mecanismo" é de células); alternativas escala e circuito | `year`, `mechanism`, `value`, `circuit` | Com `region`: regional × mecanismo é o cruzamento que o TCC afirma e não mostra | Com três mecanismos e seis anos o diagrama é simples; fica legível |

Regras para a integração (mesmas do Lab 05): papel e tinta, cor só por mecanismo e natureza de linha, clique leva à mesma ficha (`openPreview`), nada escondido atrás de outro elemento, mobile-first, código copiado do Lab 06 com crédito ao algoritmo original e ao arquivo de origem (`lab-06-experimentos.html`, funções `expTipo`, `expVoronoi`, `expMancha`, `expCordas`), sem tocar no arquivo do Lab 06. Cada gráfico leva uma linha de pergunta ("o que este gráfico responde") e uma linha de fonte ("DOM 2017–2024; valores aprovados"), como o TCC pede para as figuras.

## 7. Referências (ABNT)

*(consolidado ao fim; as referências já usadas no Lab 05 estão em `IDENTIDADE-COESAO-LAB05.md`, seção 8)*
