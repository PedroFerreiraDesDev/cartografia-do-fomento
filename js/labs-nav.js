/* Seletor de labs — uma aba fixa na borda esquerda, igual em todas as páginas, para passar de um modelo a outro
   sem voltar ao README. Autocontido: injeta o próprio CSS e resolve os links a partir do caminho deste script,
   então funciona na raiz e em wireframes-svg/. Teclas: [ anterior, ] próximo (fora de campos de texto). */
(function () {
  const here = document.currentScript && document.currentScript.src ? new URL(".", document.currentScript.src) : new URL("js/", location.href);
  const root = new URL("..", here); // raiz do projeto
  const LABS = [
    ["index.html", "Protótipo", "o site em uso"],
    ["lab-identidade.html", "Lab 01", "identidade · tipografia em tensão"],
    ["lab-outras-cartografias.html", "Lab 02", "outras cartografias"],
    ["lab-03-mescla.html", "Lab 03", "mescla"],
    ["lab-04-physarum.html", "Lab 04", "physarum · nó-muro"],
    ["lab-05-sistema.html", "Lab 05", "o sistema inteiro"],
    ["lab-06-experimentos.html", "Lab 06", "experimentos fora do campo"],
    ["wireframes-svg/index.html", "Wireframes", "telas em SVG"]
  ];
  const norm = u => u.replace(/index\.html$/, ""); // "pasta/" e "pasta/index.html" são a mesma página
  const cur = LABS.findIndex(([f]) => norm(new URL(f, root).pathname) === norm(decodeURIComponent(location.pathname)));
  const css = `
.labsnav{position:fixed;z-index:4000;left:0;top:50%;transform:translateY(-50%);font:900 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#161616}
.labsnav button,.labsnav a{font:inherit;color:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer}
.labsnav .tab{writing-mode:vertical-rl;transform:rotate(180deg);background:#161616;color:#f7f6f1;border:0;padding:12px 7px;display:block;opacity:.82}
.labsnav .tab:hover,.labsnav.open .tab{opacity:1}
.labsnav .menu{position:absolute;left:100%;top:50%;transform:translate(-8px,-50%);background:#f7f6f1;color:#161616;border:1px solid #161616;box-shadow:10px 12px 0 rgba(22,22,22,.08);min-width:250px;padding:6px 0;opacity:0;visibility:hidden;transition:opacity .2s,transform .2s,visibility .2s}
.labsnav.open .menu{opacity:1;visibility:visible;transform:translate(0,-50%)}
.labsnav .menu a{display:flex;gap:10px;align-items:baseline;padding:9px 14px;text-decoration:none;border-left:3px solid transparent}
.labsnav .menu a:hover{background:#edebe4}.labsnav .menu a.cur{border-left-color:#ff4f9a}
.labsnav .menu a b{min-width:68px}.labsnav .menu a span{font-weight:400;letter-spacing:0;text-transform:none;color:#747474;font-size:10px}
.labsnav .arrows{display:flex;border-top:1px solid #d4d1c8;margin-top:6px}
.labsnav .arrows a{flex:1;justify-content:center;border-left:0}.labsnav .arrows a+a{border-left:1px solid #d4d1c8}
.labsnav .hint{padding:6px 14px 4px;font-weight:400;letter-spacing:0;text-transform:none;color:#999;font-size:9px}
@media(max-width:780px){.labsnav .menu{min-width:220px}}
@media print{.labsnav{display:none}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  const prev = LABS[(cur - 1 + LABS.length) % LABS.length], next = LABS[(cur + 1) % LABS.length];
  const nav = document.createElement("nav"); nav.className = "labsnav"; nav.setAttribute("aria-label", "Passar entre os labs");
  nav.innerHTML = `<button type="button" class="tab" aria-expanded="false">${cur >= 0 ? LABS[cur][1] : "Labs"}</button>
<div class="menu">${LABS.map(([f, b, d], i) => `<a href="${new URL(f, root).href}" class="${i === cur ? "cur" : ""}"><b>${b}</b><span>${d}</span></a>`).join("")}
<div class="arrows"><a href="${new URL(prev[0], root).href}" title="${prev[1]}">‹ anterior</a><a href="${new URL(next[0], root).href}" title="${next[1]}">próximo ›</a></div>
<div class="hint">teclas [ e ] trocam de lab</div></div>`;
  document.body.appendChild(nav);
  const tab = nav.querySelector(".tab");
  const set = o => { nav.classList.toggle("open", o); tab.setAttribute("aria-expanded", String(o)); };
  tab.addEventListener("click", e => { e.stopPropagation(); set(!nav.classList.contains("open")); });
  document.addEventListener("click", e => { if (!nav.contains(e.target)) set(false); });
  document.addEventListener("keydown", e => {
    if (e.target.closest("input,textarea,select,[contenteditable]") || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Escape") set(false);
    if (e.key === "]") location.href = new URL(next[0], root).href;
    if (e.key === "[") location.href = new URL(prev[0], root).href;
  });
})();
