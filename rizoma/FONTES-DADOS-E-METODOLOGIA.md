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

Levantamento feito por agente desta sessão em **31 out. 2026** (busca na web e leitura das páginas). Páginas renderizadas por JavaScript (DOM-web, Mapa Cultural BH) apareceram vazias para a ferramenta, mas os links subjacentes foram copiados literalmente das páginas da PBH. Nenhuma URL foi inventada; o que não pôde ser lido está marcado **não verificado**.

### 3.1 Relação de projetos aprovados, LMIC Incentivo Fiscal (2017–2024/25): a fonte que faltava

- **Nome oficial:** "Incentivo à Cultura – Renúncia Fiscal" (Secretaria Municipal de Cultura).
- **URL:** https://prefeitura.pbh.gov.br/cultura/renuncia-fiscal (página criada em 18/05/2026).
- **O que oferece:** uma planilha `.xlsx` por edital de Incentivo Fiscal (2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024/2025) e o link para a publicação no DOM. Prefixo comum `https://prefeitura.pbh.gov.br/sites/default/files/estrutura-de-governo/cultura/`: `relacao-de-projetos-aprovados-if-2017.xlsx` (DOM ed. 2395), `…-if-2018_1.xlsx` (ed. 2849), `…-if-2019_0.xlsx` (ed. 2550), `…-if-2020.xlsx` (ed. 2923), `…-if-2021.xlsx` (ato 12314), `…-if-2022.xlsx` (ato 391327), `…-if-2023.xlsx` (ato 454520), `…-if-2024-2025.xlsx` (ato 472284).
- **Campos (verificados, planilhas baixadas e abertas):** `NÚMERO DO PROJETO | ANO | EDITAL | NOME DO(A) PROPONENTE | TÍTULO | CPF/CNPJ (mascarado) | TIPO DE PROPONENTE | VALOR APROVADO`. **Não há** regional, endereço, setor nem valor captado.
- **Limitação:** "valor aprovado" é o teto autorizado a captar; a captação efetiva não é publicada. O cruzamento com o corpus do TCC está na seção 3.16.

### 3.2 Páginas de cada edital (Fundo, Descentra, Multilinguagens, BH nas Telas, IF)

- **Índice:** https://prefeitura.pbh.gov.br/cultura/editais/editais-anteriores (33 editais, 2017–2025).
- LMIC 2017–2018 Fundo e IF: https://prefeitura.pbh.gov.br/cultura/editais/lmic-2017-2018 (relação dos 275 contemplados em PDF; notas dos 1.480 habilitados; estudo `…/fundacao-municipal-de-cultura/2020/lmic-edital-2017-2018-estudo.pdf`).
- LMIC 2018–2019, 2020, 2021: páginas `…/editais/lmic-2018-2019-if`, `…-fundo`, `…/lmic-2020-fundo`, `…/lmic-2020-if`, `…/lmic-2021-fundo`, `…/lmic-2021-incentivo-fiscal` (**não abertas**; padrão idêntico presumido).
- LMIC 2022 Fundo (Multilinguagens): https://prefeitura.pbh.gov.br/cultura/editais/lmic-2022-fundo (R$ 8,2 mi; 607 inscritos; homologação DOM ato 26101, anexos em `api-dom.pbh.gov.br/api/v1/documentos/<hash>`). Colunas visíveis: Nº | Projeto | Empreendedor(a) | **Setor** | Valor aprovado | Pontuação (sem regional).
- LMIC 2023 IF: https://prefeitura.pbh.gov.br/cultura/lmic/if2023 (edital PDF; 487 inscritos; homologação DOM ato 449086, retificação ato 454520). Renúncia média de R$ 16 mi/ano (Lei 11.594/2023).
- LMIC 2024 Multilinguagens: https://prefeitura.pbh.gov.br/cultura/editais/lmic-multilinguagens-2024 (R$ 9.598.374; 661 inscritos; 124 aprovados; homologação DOM ato 451790).
- **Limitação:** não há planilha consolidada do Fundo; os anexos trazem nº, projeto, proponente, setor, valor e nota, **sem regional**.

### 3.3 Descentra BH

- **URL mãe:** https://prefeitura.pbh.gov.br/cultura/descentra. Edições: 2018, 2019, 2021, 2022, 2023, 2024, 2025, 2026. **Não há Descentra 2020** (ano da pandemia e da Lei Aldir Blanc): isso explica em parte o vazio de 2020 no corpus.
- 2018: https://prefeitura.pbh.gov.br/cultura/descentra-2018 (R$ 1 mi, teto R$ 20 mil, 51 projetos; Anexo I contemplados `…/cultura/DESCENTRA%20-%20ANEXO%20I_0.pdf`; a página afirma: 39 % dos recursos para Barreiro, Venda Nova e Norte; 76,5 % proponentes estreantes; 82 % negros).
- 2019: https://prefeitura.pbh.gov.br/cultura/descentra-2019. 2021: `…/editais/lmic-2021-descentra`. 2022: `…/editais/descentra-2022` (R$ 1,56 mi, 41 projetos). 2023: `…/edital-descentra-2023-fundo`. (**não abertas**)
- 2024: https://prefeitura.pbh.gov.br/cultura/descentra-2024 (R$ 1,8 mi, teto R$ 40 mil, 450 inscritos, 46 selecionados; 83 % proponentes pretos/pardos). **Anexo II: relação de bairros × regional × Territórios de Gestão Compartilhada** `…/cultura/edital-descentra-2024-anexo-ii.pdf` (a chave de georreferenciamento que a própria SMC usa). Homologação DOM ato 454840, retificada ato 455171. Inscrição via Mapa Cultural BH, oportunidade 742.
- 2025: https://prefeitura.pbh.gov.br/cultura/descentra-2025.
- **Limitação:** os critérios territoriais estão só nos PDFs dos editais; não há tabela pública de regional por projeto.

### 3.4 Observatório da Cultura de BH (eixo Fomento, painéis interativos)

- https://prefeitura.pbh.gov.br/cultura/observatorio-da-cultura · https://prefeitura.pbh.gov.br/cultura/observatorio-da-cultura/eixo-fomento · https://prefeitura.pbh.gov.br/cultura/observatorio-da-cultura/paineis-interativos.
- Cinco painéis: Fundo/LMIC **2020–2024** (perfil de proponentes e projetos), Incentivo Fiscal por edital (captação), execução da renúncia por ano, Lei Paulo Gustavo, PNAB. Filtros: gênero, raça/cor, setor, público. Painel de atividades georreferenciado por 9 regionais e 41 TGC. **Sem exportação declarada** (não verificado).
- E-book do Observatório (PDF, 27/01/2026): `…/cultura/e-book_observatorio-bh-27.01.26.pdf` (**não aberto**, > 10 MB).
- **Estudo JLeiva 2018–2025** (apresentado em 07/10/2026): R$ 278 mi, 3.391 projetos, 2.044 proponentes; LMIC R$ 238 mi (Fundo R$ 121 mi; IF R$ 117,3 mi); Centro-Sul = 12 % da população, 26 % dos proponentes e 31 % dos recursos; Norte com a menor fatia. Relatório prometido para o fim de 2026. https://prefeitura.pbh.gov.br/noticias/estudo-apresenta-panorama-do-fomento-cultura-em-bh-e-aponta-desafios-para-o-setor. **É a evidência agregada da tese "monumental no Centro-Sul" que o TCC afirma.**
- Contato SMIIC: monitoramento.cultura@pbh.gov.br.

### 3.5 Relatórios de gestão SMC/FMC (2017–2021)

https://prefeitura.pbh.gov.br/cultura/relatorio-balanco-de-gestao (PDFs por ano; conteúdo por regional **não verificado**; não há 2022–2024).

### 3.6 Programa Gentileza / Concurso de Murais de Arte Urbana (SMC 001/2017)

https://prefeitura.pbh.gov.br/cultura/gentileza: R$ 300 mil, 40 propostas × R$ 7,5 mil, 198 inscritos; técnicas: 15 grafites, 8 lambes, 8 muralismos, 5 estênceis, 3 pinturas livres; **distribuição por regional publicada** (Centro-Sul 10, Leste 8, Noroeste 5, Oeste 4, Venda Nova 4, Pampulha 3, Barreiro 2, Nordeste 2, Norte 2). Resultados no DOM ed. 2361. Fomento direto por concurso, fora da LMIC: camada comparativa valiosa e **a única fonte com murais por regional**.

### 3.7 Lei Aldir Blanc 2020 em BH

https://prefeitura.pbh.gov.br/cultura/lei-de-emergencia-cultural-aldir-blanc: listas no DOM ed. 2884, 2888 (subsídio a espaços), 2902 e 2912 (premiação, R$ 15,89 mi). Premiação por trajetória, não por projeto/endereço.

### 3.8 Lei Paulo Gustavo em BH (2023–2024)

https://prefeitura.pbh.gov.br/cultura/lei-paulo-gustavo (≈ R$ 19 mi). Premiação 01/2023 "Culturas Populares e Tradicionais, Culturas Urbanas e Pontos de Cultura" (R$ 2,2 mi; homologação DOM ato 435667; **Anexo X bairros × regional × TGC**). BH Múltiplas Artes e Culturas (02/2023; homologação DOM ato 440185). BH nas Telas – Paulo Gustavo (R$ 12,6 mi, audiovisual).

### 3.9 PNAB em BH (2024–2025)

https://prefeitura.pbh.gov.br/cultura/politica-nacional-aldir-blanc: BH Fomento (R$ 5,9 mi), Premiação Agentes Culturais (R$ 5,5 mi; categoria "culturas urbanas"), Cultura Viva.

### 3.10 Portal de Dados Abertos PBH (CKAN, CC-BY)

- https://dados.pbh.gov.br/. **Não existe** dataset de projetos LMIC/Descentra/IF. Único dataset de fomento: "Atendimentos em editais públicos", só **2020** (https://dados.pbh.gov.br/dataset/atendimentos-em-editais-publicos, CSV + dicionário).
- Territorial (Prodabel/SMPOG, EPSG:31983, CSV com geometria): Região Administrativa https://dados.pbh.gov.br/dataset/regiao-administrativa (9 regionais até jan/2025; 10 a partir de 03/02/2025, com Hipercentro); Território de Gestão Compartilhada https://dados.pbh.gov.br/dataset/territorio-de-gestao-compartilhada; População e Domicílio por Regional 2010 https://dados.pbh.gov.br/dataset/populacao-regionais-2010; IVS (Saúde) https://dados.pbh.gov.br/dataset/indice-de-vulnerabilidade-de-saude.

### 3.11 BHMap / IDE-BHGeo (WFS)

https://bhmap.pbh.gov.br/v2/api/idebhgeo/wfs (GetCapabilities 2.0.0 respondeu): camadas `ide_bhgeo:BAIRRO_OFICIAL`, `BAIRRO_POPULAR`, `DENSIDADE_POPULACIONAL_REGIONAL_2010/2022`, `DENSIDADE_POPULACIONAL_BAIRRO_2010/2022`; saídas GeoJSON, SHAPE-ZIP, CSV, KML, GeoPackage. Página: https://prefeitura.pbh.gov.br/bhgeo/acesso-aos-dados. É daqui que sairia o mapa de regionais do protótipo, se o campo `region` for preenchido.

### 3.12 Mapa Cultural BH (API Mapas Culturais, JSON sem autenticação)

- https://mapaculturalbh.pbh.gov.br/. API verificada: `/api/project/find?@select=id,name,type&@limit=5`, `/api/opportunity/find?…` (Descentra 2024 = oportunidade 742; Multilinguagens 2022 = 643; LPG Premiação = 699), `/api/space/find?@select=id,name,location,endereco` (lat/long), `/api/agent/find?…`. Documentação: https://github.com/hacklabr/mapasculturais/blob/develop/documentation/docs/mc_config_api.md.
- **Limitação:** inscrições e resultados dos editais **não** são expostos pela API; o endereço do agente depende de o proponente preencher.

### 3.13 Diário Oficial do Município (DOM-BH)

https://dom-web.pbh.gov.br/ (app JS). Endereços: `/visualizacao/edicao/<nº>` e `/visualizacao/ato/<id>`; anexos em `https://api-dom.pbh.gov.br/api/v1/documentos/<hash>?prefix=AAAAMMDD`; acervo antigo em `portal6.pbh.gov.br/dom/`. Busca avançada ("lupa com +") com correspondência exata, intervalo de datas, número da edição e categoria (FAQ: https://prefeitura.pbh.gov.br/secretaria-geral/perguntas-frequentes). Termos úteis: "homologação do resultado", "Edital LMIC", "Descentra", "Incentivo Fiscal", nome do projeto.

### 3.14 Transparência e Lei de Acesso à Informação (e-SIC PBH)

- Portal da Transparência https://prefeitura.pbh.gov.br/transparencia: **nenhum módulo de fomento cultural**; renúncia fiscal consta na LOA.
- **Pedido LAI:** https://servicos.pbh.gov.br/servicos/i/5eb30ad2282e7567ed76dc28/servicos+lei-de-acesso-a-informacao (acompanhar em https://servicos.pbh.gov.br/servicos/my-requests); legado https://ouvidoriageral.pbh.gov.br/lai/NovaManif.html. Prazo 20 dias + 10; recurso em 10 dias. Base: Lei 12.527/2011 e Decreto Municipal 14.906/2012 (https://ouvidoriageral.pbh.gov.br/lai/files/dec14906-atual.pdf).

### 3.15 Legislação e fontes nacionais

- Lei 11.010/2016 (LMIC; texto **não verificado**); Lei 10.901/2016 (Sistema Municipal de Cultura e SMIIC): https://leismunicipais.com.br/a/mg/b/belo-horizonte/lei-ordinaria/2016/1090/10901/lei-ordinaria-n-10901-2016-dispoe-sobre-o-sistema-municipal-de-cultura-e-da-outras-providencias; Plano Municipal de Cultura (Lei 10.854/2015).
- **Salic / Lei Rouanet:** dataset https://dados.cultura.gov.br/dataset/incentivos-da-lei-rouanet (JSON/XML, CC-BY, atualizado 08/09/2026); API `api.salic.cultura.gov.br/api/v1/` **em manutenção em 31/10/2026**. O CURA declara usar Rouanet, LEIC-MG e LMIC (https://www.cura.art/faq): o mesmo projeto aparece em três mecanismos, o que o protótipo hoje não mostra.
- IBGE, *Perfil dos Municípios: Cultura 2014* https://biblioteca.ibge.gov.br/visualizacao/livros/liv95013.pdf (**não aberto**). Atlas do Desenvolvimento Humano http://www.atlasbrasil.org.br/ (IDHM por UDH; sem recorte por regional). Atlas IVS/Ipea https://ivs.ipea.gov.br/.
- Secult-MG / LEIC: sem dataset aberto localizado; relevante porque murais em BH também usam a lei estadual (Arte em Cores BH, 27 artistas, 3 por regional, 2023: https://prefeitura.pbh.gov.br/noticias/pbh-e-projeto-arte-em-cores-selecionam-artistas-para-criacao-de-murais-na-cidade).
- **Correções de referência:** "Negro Muro" é projeto do Rio de Janeiro, não de BH; "Arte Fora do Museu" é plataforma paulistana (2011). Ambos seguem válidos como **referências de artefato**, não como fontes de dados de BH. Catálogo "BH Graffiti": não localizado. Nenhum dataset público de murais georreferenciados de BH foi encontrado.
- Acadêmicos sobre grafite em BH: Revista PÓS/UFMG 2023 (duas obras do CURA judicializadas) https://periodicos.ufmg.br/index.php/revistapos/article/view/45484; repositório UFMG https://repositorio.ufmg.br/items/c4f896b6-95f5-4260-869c-e9c2a0eee5b4, https://repositorio.ufmg.br/items/11a0cb16-e95a-4d88-9983-654cfe8d36c9/full, https://repositorio.ufmg.br/items/d2f4d54f-8d46-423e-bd5a-6a3cd044853c (Alto Vera Cruz); Caminhos de Geografia/UFU https://seer.ufu.br/index.php/caminhosdegeografia/article/view/45174; Projeto Guernica (PUC Minas) http://www.biblioteca.pucminas.br/teses/CiencSociais_LodiMI_1.pdf.

### 3.16 Conferência do corpus nas planilhas oficiais do Incentivo Fiscal (feita nesta sessão, 31/10/2026)

As oito planilhas da seção 3.1 foram abertas e filtradas por palavras-chave (grafite/graffiti, mural, arte urbana, lambe, CURA, TAU, MAMU, tapume, Rima Viva). Resultado, comparado com a Tabela 1 do TCC:

| Ano | Na Tabela 1 do TCC | Nas planilhas oficiais do IF e **fora** da Tabela 1 (título oficial, proponente, tipo, valor aprovado) |
|---|---|---|
| 2017 | CURA (110 mil), TAU (110 mil), Graffitinerante (95 mil) | nenhum a mais (confere; CURA aparece como "Programação Mirante", proponente pessoa física) |
| 2018 | **nenhum** ("ano sem projeto") | **TAU – Território Arte Urbana** (Gisele C. da Silva, PF, R$ 130.000); **2º Festival de Arte Urbana BH** (Frederico E. Maciel, PF, R$ 115.900); **CURA – Programação Mirante** (Pública Agência de Arte, PJ, R$ 125.200); **Arte Lambe-lambe, uma caixinha de surpresas** (Rosceli V. Silveira, PF, R$ 59.000) |
| 2019 | nenhum | nenhum (confere) |
| 2020 | nenhum | nenhum (confere; e não houve Descentra 2020) |
| 2021 | CURA (150 mil) | **#UmLambePorDia – 2ª edição do livro "Poemas de muro e amor"** (Leonardo V. C. Beltrão, PF, R$ 80.000), se lambe contar como arte urbana |
| 2022 | **nenhum** | **TAU 4ª edição** (Mercê Soluções Culturais, PJ, R$ 165.000); **MAMU – Morro Arte Mural 3ª edição** (Pública Agência de Arte, PJ, R$ 165.000); **Circuito Tapume – Mostra de lambe-lambes de Beagá** (Júlia O. Ho, PF, R$ 165.000); **Festival Cena Graffiti no Morro 2ª edição** (Luan L. O. Pinto, PF, R$ 165.000); **CURA – Programação** (Agência CURA, PJ, R$ 165.000) |
| 2023 | MAMU 4ª (165 mil), Cena Graffiti (165 mil), Viva a Praça Sete (164.888,89), Bolinho 15 Anos (160 mil) | **R.U.A – Rotas Urbanas de Artes Visuais** (Luiza P. Amorim, PF, R$ 165.000); **Circuito Tapume II** (Lívia F. M. Viana, PF, R$ 165.000); **CURA – Programação** (Agência Urbana de Arte, PJ, R$ 165.000); **Paciência Gera Gentileza – mosaico como arte urbana** (Eliete C. Boggione, PF, R$ 100.000). ("Exposição Bolinho 15 Anos" confere na planilha 2023: proponente Maria Raquel Alves Couto Ramiro 06084991610, mei - microempreendedor individual, R$ 160000.0.) |
| 2024/25 | **nenhum** | **Circuito Tapume 2026** (R$ 165.000); **Festival Cena Graffiti no Morro 4ª edição** (R$ 165.000); **TAU 6ª edição** (Mercê, PJ, R$ 165.000); **MAMU 5ª edição** (Pública, PJ, R$ 165.000); **CURA – Programação** (AGUA – Agência Urbana de Arte, PJ, R$ 165.000); **Formação Graffiti Rima Viva** (Flavio D. S. Alves, PF, R$ 100.000) |

O que isso muda, para o autor decidir:

1. **2018 não é um ano vazio no Incentivo Fiscal.** A afirmação do TCC e do protótipo ("2018 e 2020 sem projeto") vale para 2020 (sem Descentra e sem IF de arte urbana), mas em 2018 houve ao menos quatro projetos de arte urbana aprovados no IF, incluindo TAU e CURA. O "Rio" do Lab 06 que seca em 2018 está secando por falta de levantamento, não por falta de fomento.
2. **A série do IF é contínua para CURA, TAU, MAMU e Cena Graffiti** (2017 → 2024/25), com teto crescente 110 → 130 → 150 → 165 mil. É exatamente a tese do "circuito monumental que atinge o teto", agora com evidência ano a ano e com o nome do proponente (pessoa jurídica com fins lucrativos nas edições recentes do CURA, MAMU e TAU; pessoa física nas primeiras). O campo `proponent` do protótipo pode ser preenchido para todo o IF sem inferir nada: o tipo de proponente é coluna oficial.
3. **Os valores da Tabela 1 são tetos aprovados**, como nas planilhas (Viva a Praça Sete R$ 164.888,89 confere). A coluna "valor" do protótipo é homogênea: bom para a régua e para o Gini, mas precisa da legenda "valor aprovado, não captado".
4. **Lambe-lambe** (Arte Lambe-lambe 2018, #UmLambePorDia 2021, Circuito Tapume 2022–2024) é uma linguagem de arte urbana com três ou quatro projetos no IF que o recorte "grafite e muralismo" deixa de fora. Decisão de recorte do autor: incluir como "lambe" (e o lambe da capa do Lab 05 ganha mais um sentido) ou declarar a exclusão.
5. Para o Fundo e o Descentra a mesma conferência ainda **não foi feita** (não há planilha consolidada; os aprovados estão em PDFs de anexo e no DOM, seção 3.2 e 3.3). É o próximo passo natural e é onde a Tabela 2 pode ter lacunas parecidas.

As planilhas (fonte: PBH, acesso em 31/10/2026) foram copiadas para `dados/fontes/pbh-incentivo-fiscal/` no repositório.

### 3.17 Tabela-síntese: fonte, o que dá, formato, como citar

| Fonte | O que dá | Formato | Como citar (ABNT, acesso em 31 out. 2026) |
|---|---|---|---|
| Renúncia Fiscal: relação de projetos aprovados IF 2017–2024/25 | nº, ano, edital, proponente, tipo de proponente, título, valor aprovado | XLSX (1 por ano) + DOM | BELO HORIZONTE. Secretaria Municipal de Cultura. **Incentivo à Cultura – Renúncia Fiscal: relação de projetos aprovados (2017-2024/2025)**. Belo Horizonte: PBH, 2026. Disponível em: https://prefeitura.pbh.gov.br/cultura/renuncia-fiscal. Acesso em: 31 out. 2026. |
| Páginas dos editais (Fundo, Descentra, Multilinguagens, IF) | edital, anexos (bairros × regional × TGC), listas de aprovados/suplentes, nº do DOM | HTML → PDF / api-dom | BELO HORIZONTE. Secretaria Municipal de Cultura. **Edital Descentra 2024 – Fundo Municipal de Cultura: homologação do resultado**. Diário Oficial do Município, Belo Horizonte, ato 454840, 2024. Disponível em: https://prefeitura.pbh.gov.br/cultura/descentra-2024. Acesso em: 31 out. 2026. (adaptar por edital) |
| DOM-BH | atos oficiais; busca avançada | HTML (JS) + PDF | BELO HORIZONTE. **Diário Oficial do Município**. Belo Horizonte: PBH, [2017-2026]. Disponível em: https://dom-web.pbh.gov.br/. Acesso em: 31 out. 2026. |
| Observatório da Cultura, eixo Fomento | perfil de proponentes e projetos 2020–2024, renúncia por ano, LPG, PNAB | painéis (sem download) | BELO HORIZONTE. Secretaria Municipal de Cultura. **Observatório da Cultura: eixo Fomento à Cultura**. Belo Horizonte: PBH, 2026. Disponível em: https://prefeitura.pbh.gov.br/cultura/observatorio-da-cultura/eixo-fomento. Acesso em: 31 out. 2026. |
| Estudo JLeiva 2018–2025 (via notícia PBH) | totais por mecanismo, distribuição por regional, raça, gênero | notícia HTML | BELO HORIZONTE. **Estudo apresenta panorama do fomento à cultura em BH e aponta desafios para o setor**. Belo Horizonte: PBH, 7 out. 2026. Disponível em: https://prefeitura.pbh.gov.br/noticias/estudo-apresenta-panorama-do-fomento-cultura-em-bh-e-aponta-desafios-para-o-setor. Acesso em: 31 out. 2026. |
| Dados Abertos PBH: Região Administrativa | limites das 9/10 regionais | CSV (geometria) + PDF, CC-BY | PRODABEL. **Região Administrativa (Regional)** [dataset]. Belo Horizonte: Portal de Dados Abertos PBH, 2026. Disponível em: https://dados.pbh.gov.br/dataset/regiao-administrativa. Acesso em: 31 out. 2026. |
| Dados Abertos PBH: População por Regional 2010 | habitantes, domicílios | CSV + PDF | PRODABEL. **População e Domicílio por Regional 2010** [dataset]. Belo Horizonte: Portal de Dados Abertos PBH, 2024. Disponível em: https://dados.pbh.gov.br/dataset/populacao-regionais-2010. Acesso em: 31 out. 2026. |
| BHMap / IDE-BHGeo | bairros, densidade por regional e bairro | WFS 2.0 (GeoJSON etc.) | PRODABEL. **IDE-BHGeo: serviço WFS** [base cartográfica]. Belo Horizonte: PBH, 2026. Disponível em: https://bhmap.pbh.gov.br/v2/api/idebhgeo/wfs. Acesso em: 31 out. 2026. |
| Mapa Cultural BH (API) | agentes, espaços (lat/long), projetos, editais | JSON | FUNDAÇÃO MUNICIPAL DE CULTURA. **Mapa Cultural BH**. Belo Horizonte: FMC, 2026. Disponível em: https://mapaculturalbh.pbh.gov.br/. Acesso em: 31 out. 2026. |
| Gentileza: concurso de murais 2017/18 | 40 murais, técnicas, distribuição por regional | HTML + PDF + DOM ed. 2361 | BELO HORIZONTE. Secretaria Municipal de Cultura. **Gentileza: Edital de Arte Urbana**. Belo Horizonte: PBH, 2018. Disponível em: https://prefeitura.pbh.gov.br/cultura/gentileza. Acesso em: 31 out. 2026. |
| Lei Paulo Gustavo BH | três editais; anexos de aprovados | HTML + api-dom | BELO HORIZONTE. Secretaria Municipal de Cultura. **Lei Paulo Gustavo**. Belo Horizonte: PBH, 2023-2025. Disponível em: https://prefeitura.pbh.gov.br/cultura/lei-paulo-gustavo. Acesso em: 31 out. 2026. |
| Salic (Lei Rouanet) | projetos, proponentes, valores, município | JSON/XML/API (em manutenção) | BRASIL. Ministério da Cultura. **Projetos do Programa Nacional de Apoio à Cultura – Lei Rouanet – SALIC** [dataset]. Brasília: MinC, 2026. Disponível em: https://dados.cultura.gov.br/dataset/incentivos-da-lei-rouanet. Acesso em: 31 out. 2026. |
| LAI / e-SIC PBH | pedidos de informação | formulário web | BELO HORIZONTE. Controladoria-Geral do Município. **Lei de Acesso à Informação**. Disponível em: https://prefeitura.pbh.gov.br/lei-de-acesso-a-informacao. Acesso em: 31 out. 2026. |

### 3.18 O que não está público e deve ser pedido via LAI

Pedido em https://servicos.pbh.gov.br/servicos/i/5eb30ad2282e7567ed76dc28/servicos+lei-de-acesso-a-informacao, destinatário Secretaria Municipal de Cultura / Fundação Municipal de Cultura (Diretoria de Fomento; fomentocultura@pbh.gov.br; Observatório: monitoramento.cultura@pbh.gov.br). Registrar protocolo e resposta como fonte documental (seção 4).

1. **Regional e bairro de cada projeto aprovado** (Fundo, IF e Descentra, 2017–2024): a SMC coleta (Anexo II dos editais, painéis georreferenciados), mas não publica por projeto. Pedir tabela: nº, edital, ano, título, proponente, setor, regional, bairro/TGC, valor aprovado.
2. **Valor efetivamente captado por projeto de IF** e data de captação.
3. **Setor/linguagem dos projetos de IF** (as planilhas do IF não têm a coluna; as do Fundo têm).
4. **Microdados do painel LMIC 2020–2024** e do estudo JLeiva.
5. **Local de execução** (muro, empena, praça) declarado na inscrição ou na prestação de contas.
6. **Descentra:** pontuação por critério territorial e lista por regional em cada edição.
7. **Fundo 2018–2021 em formato tabular.**
8. **Gentileza 2018:** nomes dos 40 artistas e endereços (DOM ed. 2361, não tabulado).
9. **Grafite/muralismo em LPG, PNAB e Aldir Blanc** ("culturas urbanas"), com regional.
10. **Rouanet:** projetos com município Belo Horizonte quando a API Salic voltar (o CURA declara usá-la).

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
| **02 Tipografia viva** (`expTipo`, p5: título amostrado em pontos, partículas "arrive" de Reynolds 1999) | **Feito (31/10, Lab 05, capa):** a tipografia viva **é a própria marca** CARTOGRAFIA / DO FOMENTO, com a fonte e o peso do painel, os pulsos de tensão a cada 4,6 s (mesma matemática das letras em HTML) e uma só região colorida: a fatia do projeto da vez, por mecanismo. Fatias na ordem do ano (ou mecanismo, ou valor); passar a mão mostra o projeto, tocar abre a ficha. Também exposta como abertura dos títulos de seção (`window.Lab5Living.play`). Registro em `IDENTIDADE-COESAO-LAB05.md`, seção 2, quinto ajuste | `value`, `year`, `mechanism` | Com valor **captado** real, a fatia de cada projeto no título passa a ser o dinheiro que de fato circulou | Medido a 375 px: corpo ~126 px, passo 5, ~1,4 mil pontos, legível; a marca viva vale também no celular (o Lab 06 propunha HTML no celular). Pendente: ligar `play` nos gráficos dos Indicadores |
| **03 Células de valor** (`expVoronoi`, Voronoi/potência, área = valor) | Indicadores: substitui o "muros" (treemap) da escala, ou fica como alternativa "células / muros" | `value`, `year`, `mechanism` | Com `region`, as sementes podem ser posicionadas por regional (hoje a posição é cenográfica: coluna = ano, faixa = mecanismo) | Custo no celular (grade 5 px, 90 iterações): calcular uma vez e guardar |
| **04 Mancha que cresce** (`expMancha`, DLA de Witten & Sander 1981) | Indicadores: abertura animada da linha do tempo (ano a ano), antes do gráfico de comparação | `value` somado por ano, `mechanism` | Com as datas do DOM, a mancha pode crescer na ordem real de homologação dentro do ano | Não é gráfico de comparação (a forma muda a cada vez): entra como "o fomento se acumulando", com o gráfico de barras ao lado |
| **05 Cordas** (`expCordas`, à maneira do Circos) | Indicadores: ano × mecanismo (hoje a matriz "ano × mecanismo" é de células); alternativas escala e circuito | `year`, `mechanism`, `value`, `circuit` | Com `region`: regional × mecanismo é o cruzamento que o TCC afirma e não mostra | Com três mecanismos e seis anos o diagrama é simples; fica legível |

Regras para a integração (mesmas do Lab 05): papel e tinta, cor só por mecanismo e natureza de linha, clique leva à mesma ficha (`openPreview`), nada escondido atrás de outro elemento, mobile-first, código copiado do Lab 06 com crédito ao algoritmo original e ao arquivo de origem (`lab-06-experimentos.html`, funções `expTipo`, `expVoronoi`, `expMancha`, `expCordas`), sem tocar no arquivo do Lab 06. Cada gráfico leva uma linha de pergunta ("o que este gráfico responde") e uma linha de fonte ("DOM 2017–2024; valores aprovados"), como o TCC pede para as figuras.

## 7. Referências (ABNT)

As referências bibliográficas já estão em formato ABNT nas seções 4 e 5 (metodologia e visualização) e na tabela 3.17 (fontes de dados). As referências de identidade visual, leis de UX e cores estão em `IDENTIDADE-COESAO-LAB05.md`, seção 8; as dos algoritmos do Lab 06, em `README-RIZOMA.md`, seção 7. Antes de levar ao TCC, conferir na biblioteca os itens marcados **não confirmado**.

Cópias das planilhas oficiais do Incentivo Fiscal (fonte: PBH, acesso em 31 out. 2026) estão em `dados/fontes/pbh-incentivo-fiscal/`.
