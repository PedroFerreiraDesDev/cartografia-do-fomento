/* Letreiro — a letra brasileira mutável da Cartografia do Fomento (Lab 07).
   TCC Pedro H. F. Moreira (Design UFMG).

   O que é: um título escrito com fontes vernaculares brasileiras em que cada palavra (ou letra) tem uma "mão",
   e as mãos trocam com o tempo, como um muro repintado. Só para títulos: dado continua em Arial.

   Fontes (arquivos em assets/fontes/vernacular-0800/, sem alteração):
     FAVETTA, Giovanna. Tipografia Vernacular 0800. Disponível em: https://www.gifavetta.art/tipografia-0800.
     Licença Creative Commons declarada pela autora: uso comercial, acadêmico e pessoal liberado; revenda proibida.
   Ideias emprestadas (sem código copiado):
     CRUZ, Crystian. Brasilêro: vernacular typeface. 1999/2003. https://crystiancruz.myportfolio.com/brasilero.
       - o método: partir da análise de letreiros feitos à mão;
       - o "aperto no fim da linha" da versão Brasilêro Profiça (as letras se comprimem quando o espaço acaba),
         refeito aqui em JavaScript/CSS porque as fontes usadas não têm recursos OpenType.

   Regras (a gramática da mutação):
     1. mão: por palavra (padrão), por letra ou uma mão só; a escolha é sorteada com semente, então repete;
     2. balanço: cada letra sai um pouco da linha de base, gira e muda de corpo (opts.sway 0..1);
     3. aperto: se a linha não cabe, as últimas letras se comprimem aos poucos (opts.squeeze);
     4. repintura: de tempos em tempos uma palavra troca de mão, letra por letra, com névoa de spray (opts.mutate em ms);
        no modo "letra" a troca é de letras soltas: opts.mutateN letras por vez (padrão 1);
     5. vazada → cheia: a letra de contorno se enche quando ganha foco (L.encher(true));
     6. limite de leitura: o pixo (Te Amo Jéssica) só entra em palavras curtas, também no modo "letra"; fonte sem o acento da palavra não entra.

   Uso:  const L = Letreiro.mount(el, { text: "CARTOGRAFIA\nDO FOMENTO", seed: "capa", mode: "palavra", mutate: 4200 });
         L.set(texto)  L.opts({...})  L.sortear()  L.mutar()  L.encher(bool)  L.state()  L.destroy()
         Letreiro.MAOS (as mãos), Letreiro.ready (Promise: fontes carregadas e medidas) */
(function () {
  const here = document.currentScript && document.currentScript.src ? new URL(".", document.currentScript.src) : new URL("js/", location.href);
  const DIR = new URL("../assets/fontes/vernacular-0800/", here).href;
  const MAOS = [
    { id: "cachoeira", fam: "TV0800 Cachoeira", file: "CachoeiraFeiticeira-Regular.otf", nome: "Cachoeira Feiticeira", local: "Ilha Grande/RJ", ferramenta: "pincel redondo", peso: 3 },
    { id: "ducha", fam: "TV0800 Ducha", file: "DuchaCompleta-Regular.ttf", nome: "Ducha Completa", local: "Curitiba/PR", ferramenta: "marcador", peso: 3 },
    { id: "hortifruti", fam: "TV0800 Hortifruti", file: "OfertasHortifruti.otf", nome: "Ofertas Hortifruti", local: "Bertioga/SP", ferramenta: "pincel chato", peso: 3 },
    { id: "gelinho", fam: "TV0800 Gelinho Cheia", file: "VendoGelinho-Cheia.otf", nome: "Vendo Gelinho Cheia", local: "São Paulo/SP", ferramenta: "pincel largo", peso: 3 },
    { id: "jessica", fam: "TV0800 Jessica", file: "TeAmoJessica-Regular.otf", nome: "Te Amo Jéssica", local: "Florianópolis/SC", ferramenta: "spray (pixo)", peso: 1, curta: 3 }, // legibilidade baixa: só palavras curtas
    { id: "gelinhoV", fam: "TV0800 Gelinho Vazada", file: "VendoGelinho-Vazada.otf", nome: "Vendo Gelinho Vazada", local: "São Paulo/SP", ferramenta: "contorno", peso: 0 }  // só entra no modo vazada
  ];
  const BY = {}; MAOS.forEach(m => BY[m.id] = m);
  const css = MAOS.map(m => `@font-face{font-family:"${m.fam}";src:url("${DIR}${m.file}");font-display:swap}`).join("") + `
.lt{display:block;line-height:1.04;font-kerning:none;font-weight:400;letter-spacing:0;text-transform:none}
.lt .lt-line{display:block;white-space:nowrap}
.lt.lt-wrap .lt-line{white-space:normal}
.lt .lt-w{display:inline-block;white-space:nowrap;margin-right:.24em}.lt .lt-w:last-child{margin-right:0}
.lt .lt-l,.lt .lt-q,.lt .lt-g{display:inline-block}
.lt .lt-q{transform-origin:0 50%}
.lt .lt-g{transform-origin:50% 72%}
.lt .lt-l.lt-new .lt-g{animation:lt-spray .55s ease-out both}
@keyframes lt-spray{0%{opacity:0;filter:blur(.2em)}55%{opacity:1;filter:blur(.05em)}100%{opacity:1;filter:blur(0)}}
@media(prefers-reduced-motion:reduce){.lt .lt-l.lt-new .lt-g{animation:none}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* medidas: altura de versal (para igualar o corpo das mãos) e presença real de cada sinal (acento desenhado, não só mapeado) */
  const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const M = (fam, ch, fb) => { cv.font = `100px "${fam}", ${fb || "monospace"}`; return cv.measureText(ch); };
  const has = {};
  function tem(m, ch) {
    if (ch === " ") return true;
    const k = m.id + ch; if (k in has) return has[k];
    let ok = Math.abs(M(m.fam, ch, "monospace").width - M(m.fam, ch, "serif").width) < 0.01; // larguras iguais com reservas diferentes: o sinal é da fonte
    const nf = ch.normalize("NFD");
    if (ok && nf.length > 1) ok = tinta(m.fam, ch) !== tinta(m.fam, nf[0]); // letra acentuada: o acento precisa estar desenhado, não só mapeado para a letra sem acento
    return has[k] = ok;
  }
  function tinta(fam, ch) { // assinatura dos pixels de um sinal: duas letras com o mesmo desenho dão o mesmo número
    cv.clearRect(0, 0, 300, 150); cv.font = `70px "${fam}", monospace`; cv.textBaseline = "alphabetic"; cv.fillText(ch, 30, 118);
    const d = cv.getImageData(0, 0, 300, 150).data; let h = 0; for (let i = 3; i < d.length; i += 4) h = (h * 31 + d[i]) | 0; return h;
  }
  let medido = false;
  const ready = (document.fonts ? Promise.all(MAOS.map(m => document.fonts.load(`100px "${m.fam}"`, "HÁ"))) : Promise.resolve()).catch(() => { }).then(() => {
    for (const k in has) delete has[k]; // o que foi medido antes de a fonte chegar não vale
    for (const m of MAOS) { const a = M(m.fam, "H").actualBoundingBoxAscent || 70; m.corpo = Math.max(0.6, Math.min(1.6, 70 / a)); } // todas as mãos com a mesma altura de versal
    medido = true;
  });

  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = seed => { let a = hash(String(seed)); return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  const TROCA = { "–": "-", "—": "-", "·": "-", "“": "\"", "”": "\"", "‘": "'", "’": "'" }; // sinais que quase nenhuma mão tem

  function mount(el, o) {
    if (typeof el === "string") el = document.querySelector(el);
    const opt = Object.assign({ text: el.textContent.trim(), seed: "cartografia", mode: "palavra", pool: null, sway: 0.6, squeeze: true, wrap: false, mutate: 0, mutateN: 1, vazada: false }, o || {});
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let R = rng(opt.seed), units = [], timer = 0, alive = true, cheia = false, round = 0;
    el.classList.add("lt");
    const pool = () => (opt.pool || MAOS.filter(m => m.peso > 0).map(m => m.id)).map(id => BY[id]).filter(Boolean);
    const escreve = (m, ch) => tem(m, ch) || (TROCA[ch] && tem(m, TROCA[ch]));
    const serve = (m, word, len) => (!m.curta || (len || word.length) <= m.curta) && [...word].every(ch => escreve(m, ch)); // len: tamanho da palavra a que a letra pertence (modo letra)
    function pick(word, avoid, len) { // sorteia uma mão que consiga escrever a palavra inteira, de preferência diferente da vizinha
      if (opt.vazada) return cheia ? BY.gelinho : BY.gelinhoV;
      const P = pool(); if (P.length === 1) return P[0]; // uma mão escolhida à mão: sem sorteio nem limite de leitura
      let c = P.filter(m => serve(m, word, len)); if (!c.length) c = pool().filter(m => !m.curta); if (!c.length) c = [BY.cachoeira];
      const d = c.filter(m => m !== avoid); if (d.length) c = d;
      const bag = []; c.forEach(m => { for (let i = 0; i < Math.max(1, m.peso); i++) bag.push(m); });
      return bag[(R() * bag.length) | 0];
    }
    function dress(u, m) { // veste uma letra com uma mão e um balanço
      let ch = u.ch;
      if (medido && !tem(m, ch)) { if (TROCA[ch] && tem(m, TROCA[ch])) ch = TROCA[ch]; else { const alt = MAOS.find(x => x.peso > 0 && !x.curta && tem(x, u.ch)); if (alt) m = alt; } }
      u.m = m; u.g.textContent = ch; u.g.style.fontFamily = `"${m.fam}", Arial, sans-serif`; u.g.style.fontSize = (m.corpo || 1).toFixed(3) + "em";
      const s = opt.sway; u.g.style.transform = s ? `translateY(${((R() - .5) * .14 * s).toFixed(3)}em) rotate(${((R() - .5) * 11 * s).toFixed(2)}deg) scale(${(1 + (R() - .5) * .16 * s).toFixed(3)})` : "none";
    }
    function build() {
      R = rng(opt.seed + "#" + round); units = []; el.textContent = ""; el.setAttribute("aria-label", opt.text.replace(/\n/g, " ")); el.classList.toggle("lt-wrap", !!opt.wrap);
      let last = null; const one = opt.mode === "mao" || opt.vazada ? pick(opt.text.replace(/\s+/g, ""), null) : null;
      for (const line of opt.text.split("\n")) {
        const le = document.createElement("span"); le.className = "lt-line"; le.setAttribute("aria-hidden", "true"); el.appendChild(le);
        for (const word of line.split(/\s+/).filter(Boolean)) {
          const we = document.createElement("span"); we.className = "lt-w"; le.appendChild(we);
          const wm = one || (opt.mode === "palavra" ? pick(word, last) : null); if (wm) last = wm;
          for (const ch of word) {
            const l = document.createElement("span"), q = document.createElement("span"), g = document.createElement("span"); l.className = "lt-l"; q.className = "lt-q"; g.className = "lt-g"; q.appendChild(g); l.appendChild(q); we.appendChild(l);
            const u = { ch, l, q, g, we, le, word, m: null }; units.push(u);
            const m = wm || pick(ch, last, word.length); if (!wm) last = m; dress(u, m);
          }
          if (opt.wrap) le.appendChild(document.createTextNode("​")); // só uma oportunidade de quebra: o espaço entre palavras é a margem, sem largura escondida
        }
      }
      fit();
    }
    function fit() { // aperto no fim da linha: o que não cabe é comprimido nas últimas letras, como o pintor que fica sem muro
      if (!alive) return;
      for (const u of units) { u.l.style.width = ""; u.q.style.transform = ""; }
      const lines = [...el.querySelectorAll(".lt-line")]; lines.forEach(le => le.style.fontSize = ""); el.querySelectorAll(".lt-w").forEach(we => we.style.fontSize = "");
      const W = el.clientWidth; if (!W || !opt.squeeze) return;
      const groups = opt.wrap ? [...new Set(units.map(u => u.we))].map(we => units.filter(u => u.we === we)) : lines.map(le => units.filter(u => u.le === le));
      for (const g of groups) {
        if (!g.length) continue; const box = opt.wrap ? g[0].we : g[0].le;
        const width = () => { // largura de layout: scrollWidth não serve, porque a letra apertada (scaleX) continua transbordando a caixa dela
          if (opt.wrap) return box.offsetWidth;
          const ws = box.querySelectorAll(".lt-w"), last = ws[ws.length - 1]; return last ? last.getBoundingClientRect().right - box.getBoundingClientRect().left : 0; };
        for (let pass = 0; pass < 2; pass++) {
          const total = width(), D = total - W; if (D <= 0.5) break;
          const n = Math.max(2, Math.min(g.length, Math.ceil(g.length * 0.55))), tail = g.slice(-n), ws = tail.map(u => u.l.offsetWidth);
          const cap = ws.reduce((a, w, j) => a + w * 0.58 * (j + 1) / n, 0); // o máximo que o aperto tira (a última letra chega a 42% da largura)
          if (D > cap && pass === 0) { box.style.fontSize = (Math.max(0.3, W / (total - cap)) * 99).toFixed(1) + "%"; continue; } // não cabe nem apertando: a linha inteira diminui
          const k = Math.min(0.58, D / ws.reduce((a, w, j) => a + w * (j + 1) / n, 0));
          tail.forEach((u, j) => { const f = 1 - k * (j + 1) / n; u.l.style.width = (ws[j] * f).toFixed(2) + "px"; u.q.style.transform = `scaleX(${f.toFixed(3)})`; });
          break;
        }
      }
    }
    function repaint(list, m) { // repintura: letra por letra, com névoa
      list.forEach((u, i) => setTimeout(() => {
        if (!alive) return; dress(u, m);
        u.l.classList.remove("lt-new"); void u.l.offsetWidth; u.l.classList.add("lt-new");
        if (i === list.length - 1) fit();
      }, reduced ? 0 : i * 70));
    }
    function mutar() {
      if (!units.length) return;
      if (opt.vazada) { cheia = !cheia; repaint(units, cheia ? BY.gelinho : BY.gelinhoV); return; }
      if (opt.mode === "mao") { repaint(units, pick(opt.text.replace(/\s+/g, ""), units[0].m)); return; }
      if (opt.mode === "letra") { // troca letra por letra: opt.mutateN letras sorteadas por vez, uma depois da outra
        const bag = units.slice(), n = Math.max(1, Math.min(bag.length, opt.mutateN | 0 || 1));
        for (let i = 0; i < n; i++) { const u = bag.splice((Math.random() * bag.length) | 0, 1)[0]; setTimeout(() => { if (alive) repaint([u], pick(u.ch, u.m, u.word.length)); }, reduced ? 0 : i * 160); }
        return; }
      const words = [...new Set(units.map(u => u.we))], we = words[(Math.random() * words.length) | 0], list = units.filter(u => u.we === we);
      repaint(list, pick(list[0].word, list[0].m));
    }
    function clock() { clearInterval(timer); if (opt.mutate > 0 && !reduced) timer = setInterval(() => { if (!document.hidden && el.offsetParent !== null) mutar(); }, opt.mutate); }
    const ro = "ResizeObserver" in window ? new ResizeObserver(() => fit()) : null; if (ro) ro.observe(el);
    build(); ready.then(() => { if (alive) { build(); clock(); } });
    return {
      set(t) { opt.text = String(t); build(); },
      opts(n) { Object.assign(opt, n || {}); if (n && "vazada" in n) cheia = false; build(); clock(); },
      sortear() { round++; build(); },
      mutar, fit,
      encher(v) { if (!opt.vazada || cheia === !!v) return; cheia = !!v; repaint(units, cheia ? BY.gelinho : BY.gelinhoV); },
      state() { return { text: opt.text, mode: opt.mode, seed: opt.seed, round, maos: units.map(u => u.m && u.m.id), letras: units.length }; },
      destroy() { alive = false; clearInterval(timer); if (ro) ro.disconnect(); }
    };
  }
  window.Letreiro = { mount, MAOS, ready, tem: (id, ch) => tem(BY[id], ch) };
})();
