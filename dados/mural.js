/* Mural de fotos dos projetos (Lab 08).
   Só entra aqui foto conferida: recebida pelo formulário "Conte o que você sabe", com autorização para o mural
   marcada por quem enviou. O passo a passo está em assets/mural/LEIA-ME.md.

   Formato: a chave é o id do projeto (o mesmo de js/data.js). Cada foto tem:
     src      caminho do arquivo, dentro de assets/mural/<id-do-projeto>/
     legenda  o que aparece na foto
     credito  quem fotografou
     ano      ano da foto (opcional)

   Exemplo:
   window.CARTOGRAFIA_MURAL = {
     "id-do-projeto": [
       { src: "assets/mural/id-do-projeto/foto1.jpg", legenda: "Empena vista da rua", credito: "Nome de quem fez", ano: 2023 }
     ]
   };
*/
window.CARTOGRAFIA_MURAL = {};
