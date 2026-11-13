# Mural de fotos dos projetos

Esta pasta guarda as fotos que aparecem no mural da página de cada projeto, no Lab 08 (`lab-08-site.html`).

## Como uma foto chega até aqui

1. O visitante abre a página de um projeto e preenche o formulário "Conte o que você sabe".
2. O formulário segue por e-mail para o autor da pesquisa, com as respostas e as fotos em anexo.
3. O autor confere: a foto é mesmo daquele projeto, tem crédito, quem enviou marcou a autorização para o mural e, se aparecem pessoas, marcou que elas concordam.
4. Só então a foto entra no mural.

Nada é publicado sozinho. O que o visitante envia aparece só no aparelho dele, com a marca "aguarda conferência".

## Como publicar uma foto conferida

1. Crie uma pasta com o id do projeto, por exemplo `assets/mural/cura-2017/`. O id é o mesmo usado em `js/data.js` e vem no e-mail, no campo `projeto_id`.
2. Salve a foto lá dentro. Use um nome simples, sem acento e sem espaço: `foto1.jpg`.
3. Abra `dados/mural.js` e acrescente a foto na lista do projeto, com legenda, crédito e ano.
4. No `lab-08-site.html`, aumente o número depois de `dados/mural.js?v=` para o navegador buscar a lista nova.

## O que guardar junto

Guarde o e-mail recebido. Ele é a prova da autorização de uso e do crédito. Se a pessoa pedir a retirada, apague a foto desta pasta, a linha em `dados/mural.js` e o e-mail.

## Base legal

- Lei 13.709/2018 (LGPD): consentimento e finalidade declarada (art. 7º, I, e art. 8º), coleta só do necessário (art. 6º, III), retirada a pedido (art. 18).
- Lei 9.610/1998 (Direitos Autorais): o nome do autor acompanha a fotografia (art. 24, II, e art. 79, § 1º).
- Código Civil, Lei 10.406/2002, art. 20: uso da imagem de pessoas depende de autorização.
