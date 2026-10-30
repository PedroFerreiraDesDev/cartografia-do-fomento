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
