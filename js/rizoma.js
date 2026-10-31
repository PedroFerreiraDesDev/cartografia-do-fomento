/* Rizoma do Fomento — motor p5.js em modo instância
   Cartografia do Fomento · TCC Pedro H. F. Moreira (Design UFMG)
   Conceito: Deleuze & Guattari, "Introdução: Rizoma" (Mil platôs, v.1).
   Usado pelo site (index.html, seção Descobrir) e pelo protótipo standalone
   (rizoma/prototipo-p5). Requer p5.js 1.11+ carregado antes; só usa funções
   presentes também na referência 2.x. Feito com p5.js (LGPL 2.1).

   Interação:
   - os projetos aparecem soltos pelo gesto; ao pairar num nó, aparecem as
     ligações POSSÍVEIS (pontilhadas, por natureza) com todos os nós já revelados;
   - ligar uma "linha de fuga" (ano, mecanismo, edital, escala, regional, curadoria)
     faz as linhas daquela natureza nascerem; nos primeiros instantes a mola é
     mais forte, e os nós se puxam enquanto a linha se forma;
   - passar o mouse numa linha destaca-a e mostra a relação construída;
   - modo 3D: projeção em perspectiva feita no próprio sketch (sem WEBGL), com
     névoa por profundidade; arrastar o fundo gira o campo; giro lento só sem alvo;
   - modo "capa": o campo vive atrás da tela de entrada; sair da capa aproxima a câmera;
   - cortar uma linha faz outra brotar por outro atributo (ruptura);
   - modo árvore/decalque mostra a hierarquia oficial e, ao pairar, as relações
     transversais que a árvore esconde.

   API: Rizoma.mount({ container, data, relations, lines, paper, reduced, depth, intro,
                       treeTop, panelWidth, onOpen, onChange, onStarted, onHover })
        R.toggleLine(t) R.setLine(t,on) R.setMode("rizoma"|"arvore") R.setDepth(v)
        R.setIntro(v) R.setCutting(v) R.setPaused(v) R.setPaper(v) R.setReduced(v) R.setNodeStyle("circulo"|"muro")
        R.open(id, silent) R.close() R.connections(id) R.potentials(id) R.info(id)
        R.state() R.save(name) R.reset() R.resize() R.setVisible(v) R.refresh()      */
(function () {
  "use strict";

  /* ---------- vocabulário: tradução semântica (TCC, seção 6.6.2) ---------- */
  const TRANSLATE = {
    "Incentivo Fiscal": "Captado com empresas (renúncia fiscal). Projeto de grande escala, circuito monumental.",
    "Fundo Municipal": "Dinheiro direto da Prefeitura, sem patrocínio (Fundo Municipal de Cultura).",
    "Descentra": "Dinheiro direto da Prefeitura pelo edital Descentra: valores menores, pontuação territorial."
  };
  const scaleOf = v => v == null ? null : v <= 30000 ? "Micro (até R$ 30 mil)" : v <= 100000 ? "Médio (R$ 30 a 100 mil)" : "Macro (acima de R$ 100 mil)";
  const money = v => v == null ? "A verificar" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const shortTitle = t => String(t == null ? "" : t).split(" – ")[0].split(":")[0];

  /* ---------- linhas de fuga: cada tipo de conexão é uma natureza diferente ---------- */
  const LINES = {
    ano: { label: "Ano", key: p => String(p.year), color: [255, 210, 63], why: k => "mesmo ano " + k },
    mecanismo: { label: "Mecanismo", key: p => p.mechanism, color: [64, 196, 255], why: k => "mesmo mecanismo: " + k },
    edital: { label: "Edital", key: p => p.edital, color: [255, 92, 168], why: k => "mesmo edital " + k },
    escala: { label: "Escala", key: p => scaleOf(p.value), color: [120, 255, 150], why: k => "mesma escala: " + k },
    territorio: { label: "Regional", key: p => p.region, color: [200, 170, 255], why: k => "mesma regional: " + k }, // null nunca conecta
    curadoria: { label: "Curadoria", pair: true, color: [255, 150, 80], why: k => k } // relações documentadas em data.js (CARTOGRAFIA_RELATIONS)
  };
  const DEFAULT_ACTIVE = { ano: false, mecanismo: false, edital: false, escala: false, territorio: false, curadoria: false };
  const REP = 9000, SPRING = 0.004, CENTER = 0.0025, DRIFT = 0.12, FOCAL = 900, PULL_MS = 1400;

  function mount(opts) {
    opts = opts || {};
    const container = typeof opts.container === "string" ? document.querySelector(opts.container) : opts.container;
    const data = opts.data || window.CARTOGRAFIA_DATA || [];
    const relations = opts.relations || window.CARTOGRAFIA_RELATIONS || [];
    const active = Object.assign({}, DEFAULT_ACTIVE, opts.lines || {});
    const cb = { open: opts.onOpen || function () {}, change: opts.onChange || function () {}, started: opts.onStarted || function () {}, hover: opts.onHover || null };
    const MECH_COLOR = { "Incentivo Fiscal": [255, 79, 154], "Fundo Municipal": [49, 168, 255], "Descentra": [101, 231, 125] }; // mesma paleta dos labs
    const S = { nodeStyle: opts.nodeStyle === "muro" ? "muro" : "circulo", mode: "rizoma", depth: !!opts.depth, intro: !!opts.intro, cutting: false, paused: false, paper: !!opts.paper, reduced: !!opts.reduced, focus: null, hover: null, hoverEdge: null, trail: [], started: false, cutKeys: new Set(), visible: true };
    const view = { rx: -0.35, ry: 0.45, lastDrag: 0, zoom: S.intro ? 0.72 : 1, zoomTarget: S.intro ? 0.72 : 1, px: 0, py: 0, pxT: 0, pyT: 0 };
    const ZOOM_MIN = 0.5, ZOOM_MAX = 3.2;
    const coarsePointer = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
    let pinch = null; // { d, x, y } da pinça em andamento
    let touchGesture = null, touchInspect = null, touchInspectAt = 0;
    let nodes = [], edges = [], regrown = [], spray = null, cnv = null, p = null;
    let pointerDist = 0, lastPointer = null, lastReveal = 0, lastHoverKey = "";

    const W = () => Math.max(10, container.clientWidth);
    const H = () => Math.max(10, container.clientHeight);
    const byId = id => nodes.find(n => n.p.id === id);
    const edgeKey = (a, b, t) => [Math.min(a.i, b.i), Math.max(a.i, b.i), t].join("|");
    const depthOn = () => S.depth && S.mode === "rizoma";
    const depthRange = () => depthOn() ? Math.min(p.width, p.height) * 0.35 : 0;
    const col = t => LINES[t].color;

    /* ---------- relações possíveis entre dois nós (todas as naturezas) ---------- */
    function relationsBetween(a, b) {
      const out = [];
      for (const t in LINES) {
        const L = LINES[t];
        if (L.pair) { for (const r of relations) if ((r.a === a.p.id && r.b === b.p.id) || (r.a === b.p.id && r.b === a.p.id)) out.push({ t, k: r.why, source: r.source }); continue; }
        const ka = L.key(a.p), kb = L.key(b.p);
        if (ka != null && kb != null && ka === kb) out.push({ t, k: ka });
      }
      return out;
    }

    /* ---------- projeção 3D → tela (perspectiva simples, sem WEBGL) ---------- */
    function project(v) {
      const cx = p.width / 2 + view.px, cy = p.height / 2 + view.py, z0 = view.zoom;
      if (!depthOn()) return { x: cx + (v.x - p.width / 2) * z0, y: cy + (v.y - p.height / 2) * z0, s: z0, z: 0 };
      const x = v.x - p.width / 2, y = v.y - p.height / 2, z = v.z || 0;
      const cyy = Math.cos(view.ry), syy = Math.sin(view.ry);
      const x1 = x * cyy + z * syy, z1 = -x * syy + z * cyy;
      const cxx = Math.cos(view.rx), sxx = Math.sin(view.rx);
      const y1 = y * cxx - z1 * sxx, z2 = y * sxx + z1 * cxx;
      const s = FOCAL / (FOCAL + z2) * z0;
      return { x: cx + x1 * s, y: cy + y1 * s, s, z: z2 };
    }
    function unproject(x, y) { // ponto da tela → plano z=0 do campo girado
      const cx = p.width / 2, cy = p.height / 2, px = (x - cx - view.px) / view.zoom, py = (y - cy - view.py) / view.zoom;
      if (!depthOn()) return p.createVector(cx + px, cy + py, 0);
      const cxx = Math.cos(-view.rx), sxx = Math.sin(-view.rx);
      const y1 = py * cxx, z1 = py * sxx;
      const cyy = Math.cos(-view.ry), syy = Math.sin(-view.ry);
      const x1 = px * cyy + z1 * syy, z2 = -px * syy + z1 * cyy;
      return p.createVector(cx + x1, cy + y1, z2);
    }

    /* ---------- nós ---------- */
    function buildNodes() {
      nodes = data.map((d, i) => ({
        i, p: d,
        pos: p.createVector(p.random(p.width * 0.15, p.width * 0.85), p.random(p.height * 0.15, p.height * 0.85), 0),
        vel: p.createVector(), acc: p.createVector(), target: null, scr: { x: 0, y: 0, s: 1, z: 0 },
        r: d.value == null ? 8 : p.map(d.value, 19740, 165000, 7, 22),
        seed: p.random(1000), revealed: false, born: 0
      }));
      if (depthOn()) scatterDepth();
    }
    function scatterDepth() { const D = depthRange(); for (const n of nodes) { n.pos.z = p.random(-D, D) * 0.8; } }

    /* ---------- arestas ---------- */
    function makeEdge(a, b, t, k, extra) { return Object.assign({ key: edgeKey(a, b, t), a, b, t, k, growth: S.reduced ? 1 : 0, born: p.millis(), seed: p.random(100), rest: 120 + p.random(80), regrown: false, pts: [] }, extra || {}); }
    function buildEdges() {
      const keep = new Map(edges.map(e => [e.key, e]));
      edges = [];
      for (const t in LINES) {
        if (!active[t]) continue;
        const L = LINES[t];
        if (L.pair) {
          for (const r of relations) {
            const a = byId(r.a), b = byId(r.b); if (!a || !b) continue;
            const key = edgeKey(a, b, t); if (S.cutKeys.has(key)) continue;
            edges.push(keep.get(key) || makeEdge(a, b, t, r.why, { source: r.source }));
          }
          continue;
        }
        for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
          const ka = L.key(nodes[i].p), kb = L.key(nodes[j].p);
          if (ka == null || kb == null || ka !== kb) continue;
          const key = edgeKey(nodes[i], nodes[j], t);
          if (S.cutKeys.has(key)) continue;
          edges.push(keep.get(key) || makeEdge(nodes[i], nodes[j], t, ka));
        }
      }
      for (const e of regrown) if (!S.cutKeys.has(e.key) && !edges.find(x => x.key === e.key)) edges.push(e);
      if (S.hoverEdge && !edges.includes(S.hoverEdge)) S.hoverEdge = null;
      cb.change(state());
    }

    /* ruptura a-significante: cortar não destrói, rebrota por outra linha */
    function cutEdge(e) {
      S.cutKeys.add(e.key);
      edges = edges.filter(x => x !== e);
      regrown = regrown.filter(x => x !== e);
      if (S.hoverEdge === e) S.hoverEdge = null;
      const ends = p.shuffle([e.a, e.b]);
      for (const n of ends) {
        const cands = [];
        for (const m of nodes) {
          if (m === n) continue;
          for (const r of relationsBetween(n, m)) {
            const key = edgeKey(n, m, r.t);
            if (S.cutKeys.has(key) || edges.find(x => x.key === key)) continue;
            cands.push(makeEdge(n, m, r.t, r.k, { regrown: true, source: r.source, rest: 140 + p.random(80) }));
          }
        }
        if (cands.length) {
          const ne = p.random(cands);
          if (!ne.b.revealed) reveal(ne.b, n.scr.x + p.random(-120, 120), n.scr.y + p.random(-120, 120));
          edges.push(ne); regrown.push(ne);
          break;
        }
      }
      cb.change(state());
    }

    /* ---------- revelação pelo gesto ---------- */
    function revealAt(x, y, r, max = 3) { // revela os nós ocultos mais próximos de (x,y), dentro do raio r (toque no vazio, lupa do Lab 03)
      const near = nodes.filter(n => !n.revealed).map(n => ({ n, d: p.dist(x, y, n.scr.x, n.scr.y) })).filter(o => o.d < r).sort((a, b) => a.d - b.d).slice(0, max);
      for (const o of near) reveal(o.n, o.n.scr.x, o.n.scr.y);
      if (!near.length) { const left = nodes.filter(n => !n.revealed); if (left.length) reveal(p.random(left), x + p.random(-60, 60), y + p.random(-60, 60)); return 1; }
      return near.length;
    }
    function reveal(n, x, y) {
      if (!n || n.revealed) return;
      n.revealed = true; n.born = p.millis();
      if (x != null) {
        const v = unproject(p.constrain(x, 40, p.width - 40), p.constrain(y, 40, p.height - 40));
        n.pos.set(v.x, v.y, p.constrain(v.z, -depthRange(), depthRange())); n.vel.set(0, 0, 0); n.scr = project(n.pos);
      }
      burst(n.scr.x, n.scr.y);
      if (!S.started) { S.started = true; cb.started(); }
      cb.change(state());
    }
    function pointerMove(x, y) {
      if (S.mode !== "rizoma" || S.intro) return;
      if (x < 0 || y < 0 || x > p.width || y > p.height) { lastPointer = null; return; }
      const now = p.millis();
      if (lastPointer) pointerDist += Math.min(80, p.dist(x, y, lastPointer.x, lastPointer.y));
      lastPointer = { x, y };
      if (p.frameCount % 2 === 0) dot(x + p.random(-8, 8), y + p.random(-8, 8), p.random(2, 9));
      const revealRadius = coarsePointer ? 52 : 90;
      const revealDistance = coarsePointer ? 230 : 140;
      const revealCooldown = coarsePointer ? 1050 : 700;
      for (const n of nodes) if (!n.revealed && p.dist(x, y, n.scr.x, n.scr.y) < revealRadius) reveal(n);
      if (pointerDist > revealDistance && now - lastReveal > revealCooldown) {
        pointerDist = 0; lastReveal = now;
        let best = null, bd = 1e9;
        for (const n of nodes) if (!n.revealed) { const d = p.dist(x, y, n.scr.x, n.scr.y); if (d < bd) { bd = d; best = n; } }
        if (best) reveal(best, x + p.random(-60, 60), y + p.random(-60, 60));
      }
    }
    function dot(x, y, s) {
      if (S.reduced || !spray) return;
      const c = S.paper ? [40, 40, 40] : [230, 230, 240];
      spray.fill(c[0], c[1], c[2], S.paper ? 28 : 22);
      spray.circle(x, y, s);
    }
    function burst(x, y) {
      if (S.reduced) return;
      for (let i = 0; i < 40; i++) { const a = p.random(p.TWO_PI), r = Math.abs(p.randomGaussian(0, 26)); dot(x + Math.cos(a) * r, y + Math.sin(a) * r, p.random(2, 14)); }
    }

    /* ---------- forças (Fruchterman & Reingold, simplificado, em 2D ou 3D) ---------- */
    function simulate(dt) {
      const now = p.millis();
      for (const n of nodes) n.acc.set(0, 0, 0);
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = p5.Vector.sub(b.pos, a.pos); const m = Math.max(d.mag(), 24);
        d.setMag(REP / (m * m)); a.acc.sub(d); b.acc.add(d);
      }
      for (const e of edges) {
        if (!(e.a.revealed && e.b.revealed)) continue;
        // puxão: nos primeiros instantes a mola é mais forte e curta; os nós se aproximam enquanto a linha se forma
        const age = (now - e.born) / PULL_MS, pull = S.reduced ? 0 : Math.max(0, 1 - age);
        const d = p5.Vector.sub(e.b.pos, e.a.pos); const m = d.mag();
        const target = e.rest * (1 - 0.25 * pull), boost = m > target ? 1 + 3 * pull : 1; // o puxão só aproxima; nunca empurra (medido: 80→21→171 px com 5×; 3× suaviza o rebote)
        d.setMag((m - target) * SPRING * boost); e.a.acc.add(d); e.b.acc.sub(d);
      }
      const cx = p.width / 2, cy = p.height / 2, drift = S.reduced ? 0 : DRIFT * (opts.drift || 1), D = depthRange(); // opts.drift: quanto os nós vagam (Lab 04 usa 2,4)
      const anchor = S.hover || S.focus; // vizinhança estável
      const frozen = new Set();
      if (anchor) { frozen.add(anchor); for (const e of edges) { if (e.a === anchor && e.b.revealed) frozen.add(e.b); if (e.b === anchor && e.a.revealed) frozen.add(e.a); } }
      if (S.hoverEdge) { frozen.add(S.hoverEdge.a); frozen.add(S.hoverEdge.b); }
      for (const n of nodes) {
        n.acc.add((cx - n.pos.x) * CENTER, (cy - n.pos.y) * CENTER, -n.pos.z * CENTER * 1.5);
        const still = frozen.has(n);
        if (!still && drift) {
          const ang = p.noise(n.seed, p.frameCount * 0.003) * p.TWO_PI * 2;
          n.acc.add(p5.Vector.fromAngle(ang).mult(drift));
          if (D) n.acc.z += (p.noise(n.seed + 50, p.frameCount * 0.003) - 0.5) * drift;
        }
        n.vel.add(p5.Vector.mult(n.acc, dt)).mult(0.88).limit(3.5);
        if (still) n.vel.mult(0.35);
        if (n === S.hover && !depthOn()) { const dx = p.mouseX - n.scr.x, dy = p.mouseY - n.scr.y, m = Math.hypot(dx, dy) || 1, k = Math.min(0.6, m * 0.05); n.pos.add(dx / m * k, dy / m * k, 0); } // ímã sutil
        n.pos.add(p5.Vector.mult(n.vel, dt));
        n.pos.x = p.constrain(n.pos.x, 40, p.width - 40); n.pos.y = p.constrain(n.pos.y, 40, p.height - 40); n.pos.z = D ? p.constrain(n.pos.z, -D, D) : 0;
      }
    }

    /* ---------- decalque: a árvore oficial (Mecanismo > Ano > Projeto) ---------- */
    const optNum = (v, d) => (typeof v === "function" ? v() : v) || d;
    const treeNarrow = () => p.width < 640; // celular / tablet em pé: esboço indentado em vez de colunas
    const treeUsable = () => (opts.panelWidth && S.focus && p.width > 900) ? p.width - opts.panelWidth : p.width;
    function treeTargets() {
      const mechs = ["Incentivo Fiscal", "Fundo Municipal", "Descentra"];
      const top = optNum(opts.treeTop, 60), bottom = optNum(opts.treeBottom, 40);
      const narrow = treeNarrow(), usable = treeUsable();
      const out = { roots: [], years: [], links: [], narrow, width: usable, top, height: 0, labelMax: 30 };
      if (narrow) { // celular: sumário indentado, uma linha por nó, rolável
        const xm = 16, xy = 44, xp = 112, row = 36; let y = top;
        mechs.forEach(m => {
          const ps = nodes.filter(n => n.p.mechanism === m);
          const years = [...new Set(ps.map(n => n.p.year))].sort();
          const root = { x: xm, y, label: m }; out.roots.push(root); y += row + 2;
          years.forEach(yr => {
            const yrow = { x: xy, y, label: String(yr), rootX: xm, rootY: root.y }; out.years.push(yrow); y += row;
            for (const n of ps.filter(n => n.p.year === yr)) { n.target = p.createVector(xp, y, 0); out.links.push({ x1: xy, y1: yrow.y, x2: xp, y2: y, elbow: true }); y += row; }
          });
          y += row * 0.6;
        });
        out.height = y - top; out.labelMax = Math.max(12,Math.floor((p.width - 142) / 5.6));
        return out;
      }
      // desktop: leque (mecanismo no alto, anos abrindo em leque, projetos pendurados)
      const colW = usable / mechs.length;
      let maxK = 1, minYW = 150;
      mechs.forEach(m => { const ps = nodes.filter(n => n.p.mechanism === m); const ys = [...new Set(ps.map(n => n.p.year))]; minYW = Math.min(minYW, (colW - 40) / Math.max(1, ys.length)); for (const y of ys) maxK = Math.max(maxK, ps.filter(n => n.p.year === y).length); });
      const rowH = p.constrain((p.height - bottom - top - 200) / Math.max(1, maxK - 1), 40, 70);
      const stagger = minYW < 120 ? rowH / 2 : 0; // colunas de ano vizinhas alternam a altura: os títulos não ficam na mesma linha
      out.labelMax = Math.max(8, Math.floor((2 * minYW - 26) / 5.4));
      mechs.forEach((m, mi) => {
        const x0 = colW * mi + colW / 2;
        const ps = nodes.filter(n => n.p.mechanism === m);
        const years = [...new Set(ps.map(n => n.p.year))].sort();
        out.roots.push({ x: x0, y: top, label: m });
        const yW = Math.min(150, (colW - 40) / Math.max(1, years.length));
        years.forEach((y, yi) => {
          const yx = x0 + (yi - (years.length - 1) / 2) * yW, yy = top + 110;
          out.years.push({ x: yx, y: yy, label: String(y), rootX: x0, rootY: top });
          ps.filter(n => n.p.year === y).forEach((n, k) => {
            n.target = p.createVector(yx, top + 190 + (yi % 2) * stagger + k * rowH, 0);
            out.links.push({ x1: yx, y1: yy, x2: n.target.x, y2: n.target.y });
          });
        });
      });
      out.height = 190 + stagger + (maxK - 1) * rowH + 30;
      return out;
    }
    let treeInfo = null; // último layout, para travar o deslocamento dentro da árvore
    function clampPan() { // a câmera nunca perde o campo: o conteúdo fica sempre, pelo menos em parte, na tela
      const z = view.zoomTarget, cx = p.width / 2, cy = p.height / 2;
      let minX, maxX, minY, maxY;
      if (S.mode === "arvore" && treeInfo) {
        const t = treeInfo, bottom = optNum(opts.treeBottom, 40);
        const left = cx + (0 - cx) * z, right = cx + (t.width - cx) * z, topY = cy + (t.top - 24 - cy) * z, botY = cy + (t.top + t.height - cy) * z;
        // horizontal: se cabe, fica parada; se não, pode correr até encostar nas bordas
        minX = Math.min(0, p.width - right); maxX = Math.max(0, -left);
        const viewTop = 0, viewBot = p.height - bottom;
        minY = Math.min(0, viewBot - botY); maxY = Math.max(0, viewTop - topY);
      } else { const lx = p.width * 0.45 * z, ly = p.height * 0.45 * z; minX = -lx; maxX = lx; minY = -ly; maxY = ly; }
      view.pxT = p.constrain(view.pxT, minX, maxX); view.pyT = p.constrain(view.pyT, minY, maxY);
      view.px = p.constrain(view.px, minX, maxX); view.py = p.constrain(view.py, minY, maxY);
    }

    /* ---------- hover: nó tem prioridade; depois, linha ---------- */
    function updateHover() {
      if (S.intro) { S.hover = null; S.hoverEdge = null; return; }
      S.hover = coarsePointer && touchInspect ? touchInspect : pickNode(p.mouseX, p.mouseY);
      S.hoverEdge = null;
      if (!S.hover && S.mode === "rizoma") {
        let best = null, bd = 100; // 10px
        for (const e of edges) {
          if (!(e.a.revealed && e.b.revealed) || e.growth < 0.3 || !e.pts.length) continue;
          for (const q of e.pts) { const dx = q[0] - p.mouseX, dy = q[1] - p.mouseY, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = e; } }
        }
        S.hoverEdge = best;
      }
      const key = S.hover ? "n:" + S.hover.p.id : S.hoverEdge ? "e:" + S.hoverEdge.key : "";
      if (key !== lastHoverKey) {
        lastHoverKey = key;
        if (cb.hover) cb.hover(S.hover ? Object.assign({ kind: "node", x: S.hover.scr.x, y: S.hover.scr.y }, info(S.hover.p.id)) : S.hoverEdge ? edgeInfo(S.hoverEdge) : null);
      }
    }
    function edgeInfo(e) {
      const L = LINES[e.t], mid = e.pts[Math.floor(e.pts.length / 2)] || [0, 0];
      return { kind: "edge", type: e.t, label: L.label, why: L.why(e.k), source: e.source || null, color: L.color, regrown: e.regrown, x: mid[0], y: mid[1], a: { id: e.a.p.id, title: e.a.p.title, year: e.a.p.year, mechanism: e.a.p.mechanism }, b: { id: e.b.p.id, title: e.b.p.title, year: e.b.p.year, mechanism: e.b.p.mechanism } };
    }

    /* ---------- desenho ---------- */
    function drawAll() {
      const dt = Math.min(2, p.deltaTime / 16.7);
      if (opts.transparent) p.clear(); else if (S.paper) p.background(255); else p.background(11, 14, 20); // transparente: o Lab 03 desenha a cidade por baixo
      if (spray) p.image(spray, 0, 0);
      // câmera: aproxima ao sair da capa
      if (Math.abs(view.zoom - view.zoomTarget) > 0.0005) view.zoom += (view.zoomTarget - view.zoom) * (S.reduced ? 1 : 0.06 * dt); else view.zoom = view.zoomTarget;
      const ke = S.reduced ? 1 : Math.min(1, 0.12 * dt); view.px += (view.pxT - view.px) * ke; view.py += (view.pyT - view.py) * ke;
      if (depthOn() && !S.paused && !S.reduced && !S.hover && !S.hoverEdge && !S.focus && p.millis() - view.lastDrag > 4000) view.ry += (S.intro ? 0.0018 : 0.0012) * dt; // giro lento, só sem alvo
      for (const n of nodes) n.scr = project(n.pos);
      updateHover();
      p.cursor(S.cutting ? "crosshair" : S.hover ? "pointer" : S.hoverEdge ? "help" : "default");
      const lit = S.hover || S.focus; // nó que acende as suas linhas
      if (S.mode === "rizoma") {
        if (!S.paused) simulate(dt);
        if (S.intro) drawIntroWeb();
        const litEdges = lit ? edges.filter(e => (e.a === lit || e.b === lit) && e.a.revealed && e.b.revealed) : [];
        for (const e of edges) {
          if (!(e.a.revealed && e.b.revealed)) { e.pts = []; continue; }
          if (!S.paused) e.growth = Math.min(1, e.growth + (S.reduced ? 1 : 0.025 * dt));
          const isLit = litEdges.includes(e), isHov = e === S.hoverEdge;
          drawEdge(e, isHov ? 255 : isLit ? 230 : lit ? 50 : 150, isHov ? 2.8 : isLit ? 2 : e.regrown ? 1 : 1.4);
        }
        if (lit && lit.revealed) drawPotentials(lit);
        if (litEdges.length && litEdges.length <= 6) for (const e of litEdges) edgeLabel(e, 200);
        if (S.hoverEdge) edgeLabel(S.hoverEdge, 255);
      } else {
        const t = treeTargets(); treeInfo = t; clampPan();
        for (const n of nodes) { if (!n.revealed) reveal(n); n.pos.lerp(n.target, S.reduced ? 1 : 0.08); n.scr = project(n.pos); }
        const P = (x, y) => project({ x, y, z: 0 }), z = view.zoom; // tronco, anos e ligações no mesmo espaço dos nós
        if (lit) drawTreeArcs(lit); // relações transversais por baixo de tudo: nunca cruzam por cima dos textos
        p.stroke(S.paper ? 160 : 70); p.strokeWeight(Math.max(0.6, z)); p.noFill();
        for (const y of t.years) {
          const r = t.roots.find(r => r.x === y.rootX && r.y === y.rootY); if (!r) continue;
          if (t.narrow) { const a = P(r.x + 4, r.y + 10), b = P(r.x + 4, y.y), c = P(y.x - 6, y.y); p.line(a.x, a.y, b.x, b.y); p.line(b.x, b.y, c.x, c.y); }
          else { const a = P(r.x, r.y + 14), b = P(y.x, y.y - 12); p.line(a.x, a.y, b.x, b.y); }
        }
        for (const l of t.links) {
          if (l.elbow) { const a = P(l.x1 + 4, l.y1 + 10), b = P(l.x1 + 4, l.y2), c = P(l.x2 - 8, l.y2); p.line(a.x, a.y, b.x, b.y); p.line(b.x, b.y, c.x, c.y); }
          else { const a = P(l.x1, l.y1 + 12), b = P(l.x2, l.y2); p.line(a.x, a.y, b.x, b.y); }
        }
        p.noStroke(); p.textAlign(t.narrow ? p.LEFT : p.CENTER, p.CENTER);
        p.textSize(12 * z);
        for (const r of t.roots) { const q = P(r.x, r.y); labelBox(r.label.toUpperCase(), q.x, q.y, t.narrow ? p.LEFT : p.CENTER, S.paper ? 30 : 235); }
        p.textSize(11 * z);
        for (const y of t.years) { const q = P(y.x, y.y); labelBox(y.label, q.x, q.y, t.narrow ? p.LEFT : p.CENTER, S.paper ? 110 : 150); }
        p.textAlign(p.LEFT, p.BASELINE);
      }
      drawTrail();
      const order = nodes.filter(n => n.revealed || S.intro).sort((a, b) => b.scr.z - a.scr.z); // longe primeiro
      for (const n of order) drawNode(n);
      if (!cb.hover && S.hover && S.hover.revealed) tooltip(S.hover);
    }

    // capa: teia tênue de relações entre os nós ainda não revelados (atmosfera, sem interação)
    function drawIntroWeb() {
      p.noFill(); p.strokeWeight(0.8);
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const rel = relationsBetween(nodes[i], nodes[j]).find(r => r.t === "ano" || r.t === "curadoria"); if (!rel) continue;
        const c = col(rel.t), A = nodes[i].scr, B = nodes[j].scr;
        if (S.paper) p.stroke(c[0] * 0.5, c[1] * 0.5, c[2] * 0.5, 22); else p.stroke(c[0], c[1], c[2], 20);
        p.line(A.x, A.y, B.x, B.y);
      }
    }

    // ligações possíveis do nó pairado com os nós revelados: pontilhadas, por natureza, ainda não "ligadas"
    function drawPotentials(n) {
      const seen = new Set();
      p.noFill();
      for (const m of nodes) {
        if (m === n || !m.revealed) continue;
        const rels = relationsBetween(n, m).filter(r => !edges.find(e => e.key === edgeKey(n, m, r.t)));
        if (!rels.length) continue;
        rels.forEach((r, k) => {
          const c = col(r.t); if (S.paper) p.stroke(c[0] * 0.45, c[1] * 0.45, c[2] * 0.45, 110); else p.stroke(c[0], c[1], c[2], 120);
          p.strokeWeight(1);
          const A = n.scr, B = m.scr, dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, off = (k - (rels.length - 1) / 2) * 5;
          for (let s = 0; s < L; s += 9) { const t0 = s / L, t1 = Math.min(1, (s + 4) / L); p.line(A.x + dx * t0 + nx * off, A.y + dy * t0 + ny * off, A.x + dx * t1 + nx * off, A.y + dy * t1 + ny * off); }
          seen.add(r.t);
        });
        // rótulo discreto junto ao nó possível: as naturezas que ligariam
        p.push(); p.noStroke(); p.textSize(8); p.textAlign(p.LEFT, p.CENTER); p.fill(S.paper ? 110 : 170);
        p.text(rels.map(r => LINES[r.t].label).join(" · ").toUpperCase(), m.scr.x + m.r * m.scr.s / 2 + 8, m.scr.y + 12); p.pop();
      }
    }

    // modo árvore: arcos pontilhados até os nós ligados por qualquer natureza
    function labelBox(txt, x, y, align, fillCol) { // texto com fundo opaco: nenhuma linha passa por cima
      const w = p.textWidth(txt), h = p.textSize() * 1.25, x0 = align === p.CENTER ? x - w / 2 - 3 : x - 3;
      p.noStroke(); if (S.paper) p.fill(255, 235); else p.fill(11, 14, 20, 235); p.rect(x0, y - h / 2, w + 6, h, 2);
      p.fill(fillCol); p.text(txt, x, y);
    }
    function drawTreeArcs(n) {
      p.noFill();
      const related = nodes.filter(m => m !== n && relationsBetween(n, m).length);
      if (treeInfo && treeInfo.narrow) {
        const P=(x,y)=>project({x,y,z:0});
        for (const m of related) {
          const rels=relationsBetween(n,m);
          rels.slice(0,3).forEach((r,k)=>{
            const c=col(r.t), rail=P(82-k*7,0).x, A=n.scr, B=m.scr;
            if(S.paper)p.stroke(c[0]*.55,c[1]*.55,c[2]*.55,150);else p.stroke(c[0],c[1],c[2],160);
            p.strokeWeight(1.35);
            p.line(A.x,A.y,rail,A.y);p.line(rail,A.y,rail,B.y);p.line(rail,B.y,B.x,B.y);
          });
          p.push();p.noStroke();p.textSize(7.2);p.textAlign(p.LEFT,p.CENTER);p.fill(S.paper?105:175);
          p.text(rels.slice(0,3).map(r=>LINES[r.t].label.toUpperCase()).join(" · "),m.scr.x+12,m.scr.y+12);p.pop();
        }
        if(related.length){
          p.push();p.textSize(7.4);p.textAlign(p.LEFT,p.CENTER);
          labelBox(("SELECIONADO · "+related.length+" PROJETOS RELACIONADOS · TOQUE NOVAMENTE PARA ABRIR").toUpperCase(),n.scr.x+12,n.scr.y-13,p.LEFT,S.paper?70:210);p.pop();
        }
        return;
      }
      for (const m of related) {
        const rels = relationsBetween(n, m);
        const A = n.scr, B = m.scr, mx = (A.x + B.x) / 2, my = Math.min(A.y, B.y) - Math.min(140, Math.abs(B.x - A.x) * 0.35 + 30);
        rels.forEach((r, k) => {
          const c = col(r.t); if (S.paper) p.stroke(c[0] * 0.55, c[1] * 0.55, c[2] * 0.55, 110); else p.stroke(c[0], c[1], c[2], 120);
          p.strokeWeight(1.1);
          const steps = 24; let prev = null;
          for (let i = 0; i <= steps; i++) { const t = i / steps, x = (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * mx + t * t * B.x, y = (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * (my - k * 8) + t * t * B.y; if (prev && i % 2 === 0) p.line(prev[0], prev[1], x, y); prev = [x, y]; }
        });
      }
      if (related.length) { // resumo das relações embaixo do nó, com fundo; os detalhes ficam na prévia
        const count = {}; for (const m of related) for (const r of relationsBetween(n, m)) count[r.t] = (count[r.t] || 0) + 1;
        p.push(); p.textSize(Math.max(7, 8.5 * view.zoom)); p.textAlign(p.LEFT, p.CENTER);
        labelBox((related.length + " NÓS LIGADOS · " + Object.keys(count).map(t => LINES[t].label + " " + count[t]).join(" · ")).toUpperCase(), n.scr.x + n.r * n.scr.s / 2 + 8, n.scr.y + 13 * view.zoom, p.LEFT, S.paper ? 70 : 210); p.pop();
      }
    }

    function drawEdge(e, alpha, weight) {
      const c = col(e.t);
      const A = e.a.scr, B = e.b.scr; const dx = B.x - A.x, dy = B.y - A.y; const L = Math.hypot(dx, dy) || 1;
      const nx = -dy / L, ny = dx / L;
      p.noFill();
      if (S.paper) p.stroke(c[0] * 0.5, c[1] * 0.5, c[2] * 0.5, alpha); else p.stroke(c[0], c[1], c[2], alpha);
      p.strokeWeight(weight * Math.min(A.s, B.s));
      const steps = Math.max(8, Math.floor(L / 12));
      e.pts = [];
      p.beginShape();
      for (let i = 0; i <= steps; i++) {
        const t = i / steps; if (t > e.growth) break;
        const q = depthOn() ? project(p5.Vector.lerp(e.a.pos, e.b.pos, t)) : { x: A.x + dx * t, y: A.y + dy * t };
        const amp = Math.sin(t * p.PI) * Math.min(30, L * 0.2);
        const off = (p.noise(e.seed + t * 2.2, p.frameCount * 0.0025) - 0.5) * 2 * amp;
        if (e.regrown && i % 3 === 1) { p.endShape(); p.beginShape(); } // pontilhado = linha que rebrotou
        const x = q.x + nx * off, y = q.y + ny * off;
        e.pts.push([x, y]);
        p.vertex(x, y);
      }
      p.endShape();
    }
    function edgeLabel(e, alpha) {
      if (!e.pts.length) return;
      const m = e.pts[Math.floor(e.pts.length / 2)], c = col(e.t);
      const label = LINES[e.t].why(e.k).toUpperCase() + (e.regrown ? " · REBROTOU" : "");
      p.push(); p.textSize(9); p.textAlign(p.CENTER, p.CENTER);
      const w = p.textWidth(label) + 14;
      p.noStroke(); if (S.paper) p.fill(255, alpha); else p.fill(16, 20, 30, alpha); p.rect(m[0] - w / 2, m[1] - 9, w, 18, 9);
      if (S.paper) p.fill(c[0] * 0.45, c[1] * 0.45, c[2] * 0.45, alpha); else p.fill(c[0], c[1], c[2], alpha);
      p.text(label, m[0], m[1]);
      p.pop();
    }

    function drawWall(n, r, mon, ease, dim, ghost, isF, lit) { // o projeto como superfície: empena (monumental) ou fachadas (capilar)
      const c = MECH_COLOR[n.p.mechanism] || [120, 120, 120], a = 255 * dim * (ghost ? 0.5 : 1);
      const ink = S.paper ? 30 : 240;
      if (!S.paper) { p.blendMode(p.ADD); p.noStroke(); p.fill(c[0], c[1], c[2], 22 * ease * dim); p.circle(0, 0, r * 4); p.blendMode(p.BLEND); }
      else { p.noStroke(); p.fill(c[0], c[1], c[2], 18 * ease * dim); p.circle(0, 0, r * 3); }
      p.stroke(ink, a); p.strokeWeight(1);
      if (mon) { // uma empena: retângulo alto, a área cresce com o valor
        const w = r * 0.95, h = r * 1.75;
        p.fill(isF ? ink : c[0], isF ? ink : c[1], isF ? ink : c[2], isF ? a : a * (S.paper ? 0.75 : 0.9)); p.rect(-w / 2, -h / 2, w, h);
        p.stroke(ink, a * 0.55); p.line(-w / 2, -h / 2 + h * 0.22, w / 2, -h / 2 + h * 0.22); // platibanda
        if (S.paper) { p.stroke(255, a * 0.5); for (let i = 1; i < 3; i++) p.line(-w / 2 + 2, -h / 2 + h * (0.22 + i * 0.22), w / 2 - 2, -h / 2 + h * (0.22 + i * 0.22)); }
      } else { // várias fachadas: 3 a 5 blocos pequenos, mais blocos para mais valor
        const k = (n.p.value || 0) > 100000 ? 5 : (n.p.value || 0) > 30000 ? 4 : 3, bw = r * 0.62, bh = r * 0.8, gap = r * 0.14;
        const total = k * bw + (k - 1) * gap, x0 = -total / 2;
        for (let i = 0; i < k; i++) { const hh = bh * (0.72 + ((i * 7) % 3) * 0.14), x = x0 + i * (bw + gap);
          p.fill(isF ? ink : c[0], isF ? ink : c[1], isF ? ink : c[2], isF ? a : a * (S.paper ? 0.7 : 0.9)); p.rect(x, bh / 2 - hh, bw, hh); }
        p.stroke(ink, a * 0.5); p.line(x0 - 2, bh / 2 + 1, -x0 + 2, bh / 2 + 1); // o chão comum: a unidade nasce do conjunto
      }
      if (lit || isF) { p.noFill(); p.stroke(ink, 200); p.strokeWeight(1); p.rect(-r * 1.1, -r * 1.1, r * 2.2, r * 2.2, 3); }
    }
    function drawNode(n) {
      const ghost = !n.revealed; // só na capa
      const age = ghost ? 1 : Math.min(1, (p.millis() - n.born) / 600);
      const ease = 1 - Math.pow(1 - age, 3);
      const r = n.r * (0.6 + 0.4 * ease) * n.scr.s;
      const mon = n.p.circuit === "Monumental";
      const fog = depthOn() ? 0.45 + 0.55 * p.constrain((n.scr.s / view.zoom - 0.6) / 0.8, 0, 1) : 1; // névoa: longe = mais apagado
      const isF = n === S.focus, isH = n === S.hover, inTrail = S.trail.includes(n);
      const edgeEnd = S.hoverEdge && (S.hoverEdge.a === n || S.hoverEdge.b === n);
      const anchor = S.hover || S.focus;
      const relatedToAnchor = anchor && n!==anchor && (S.mode==="arvore" ? relationsBetween(anchor,n).length>0 : edges.some(e => (e.a===anchor||e.b===anchor)&&(e.a===n||e.b===n)));
      const dim = (anchor && !isF && !isH && !edgeEnd && !relatedToAnchor ? (S.mode==="arvore"?0.24:0.45) : 1) * fog * (ghost ? 0.35 : 1);
      p.push();
      p.translate(n.scr.x, n.scr.y);
      if (S.nodeStyle === "muro") drawWall(n, r, mon, ease, dim, ghost, isF, isH || edgeEnd);
      else if (!S.paper) {
        p.blendMode(p.ADD);
        p.noStroke();
        p.fill(mon ? 255 : 120, mon ? 200 : 200, mon ? 90 : 255, (mon ? 26 : 18) * ease * dim);
        p.circle(0, 0, r * (mon ? 5 : 4));
        p.fill(mon ? 255 : 150, mon ? 215 : 215, mon ? 120 : 255, (mon ? 60 : 45) * ease * dim);
        p.circle(0, 0, r * 2.2);
        p.blendMode(p.BLEND);
        if (isF) p.fill(255); else if (mon) p.fill(255, 225, 150, 255 * dim); else p.fill(200, 225, 255, 255 * dim);
        p.noStroke();
        p.circle(0, 0, r);
        if (isF || isH || edgeEnd) { p.noFill(); p.stroke(255, 200); p.strokeWeight(1.2); p.circle(0, 0, r + 10); }
      } else {
        p.noStroke(); p.fill(0, 0, 0, 10 * ease * dim); p.circle(0, 0, r * 2.6);
        p.stroke(30, 255 * dim); p.strokeWeight(mon ? 2.4 : 1.2); p.fill(isF ? 30 : 255, 255 * (ghost ? 0.6 : 1));
        p.circle(0, 0, r);
        if (isF || isH || edgeEnd) { p.noFill(); p.stroke(30); p.strokeWeight(1); p.circle(0, 0, r + 10); }
      }
      if (!ghost && (isF || isH || inTrail || edgeEnd || n.p.issue || S.mode === "arvore")) {
        const tree = S.mode === "arvore" && !isF && !isH;
        const ts = S.mode === "arvore" ? Math.max(7, (tree ? 9.5 : 10.5) * view.zoom) : 10; // na árvore o texto acompanha o zoom
        p.noStroke(); p.textSize(ts); p.textAlign(p.LEFT, p.CENTER);
        p.fill(S.paper ? 40 : 235, (tree ? 190 : 255) * fog);
        const max = S.mode === "arvore" ? ((isF || isH) ? 40 : (treeInfo ? treeInfo.labelMax : 16)) : 30;
        const txt = n.p.title.length > max ? n.p.title.slice(0, max - 1) + "…" : n.p.title;
        if (S.mode === "arvore") labelBox(txt, r / 2 + 8, 0, p.LEFT, p.color(S.paper ? 40 : 235, (tree ? 190 : 255) * fog)); else p.text(txt, r / 2 + 8, 0);
        if (n.p.issue) { p.fill(S.paper ? 150 : 170); p.textSize(8); p.text("DADO EM REVISÃO", r / 2 + 8, 12); }
      }
      p.pop();
    }

    function drawTrail() {
      if (S.trail.length < 2) return;
      p.noFill(); p.stroke(S.paper ? 30 : 255, S.paper ? 120 : 110); p.strokeWeight(2);
      p.beginShape();
      for (let i = 0; i < S.trail.length; i++) {
        const a = S.trail[i].scr;
        if (i > 0) {
          const b = S.trail[i - 1].scr; const steps = 10;
          for (let s = 1; s <= steps; s++) { const t = s / steps; const w = (p.noise(i * 7 + t * 3) - 0.5) * 14; p.vertex(p.lerp(b.x, a.x, t) + w, p.lerp(b.y, a.y, t) + w); }
        } else p.vertex(a.x, a.y);
      }
      p.endShape();
    }

    function tooltip(n) { // só quando a página não fornece onHover
      const w = 230, h = 54; let x = n.scr.x + 18, y = n.scr.y - h - 8;
      x = p.constrain(x, 8, p.width - w - 8); y = p.constrain(y, 8, p.height - h - 8);
      p.noStroke(); p.fill(S.paper ? 255 : 18, S.paper ? 255 : 23, S.paper ? 255 : 34, 240); p.stroke(S.paper ? 190 : 60); p.strokeWeight(1);
      p.rect(x, y, w, h, 2);
      p.noStroke(); p.fill(S.paper ? 30 : 240); p.textSize(11); p.textAlign(p.LEFT, p.TOP);
      p.text(n.p.title, x + 10, y + 8, w - 20, 30);
      p.fill(S.paper ? 120 : 150); p.textSize(9);
      p.text((n.p.year + " · " + n.p.mechanism + " · " + money(n.p.value)).toUpperCase(), x + 10, y + h - 16);
    }

    /* ---------- interação ---------- */
    function pickNode(x, y) {
      let best = null, bd = 1e9;
      for (const n of nodes) if (n.revealed) { const d = p.dist(x, y, n.scr.x, n.scr.y); if (d < Math.max(14, (n.r * n.scr.s) / 2 + 8) && d < bd) { bd = d; best = n; } }
      if (!best && S.hover && S.hover.revealed && p.dist(x, y, S.hover.scr.x, S.hover.scr.y) < Math.max(14, (S.hover.r * S.hover.scr.s) / 2 + 8) * 1.7) return S.hover; // histerese
      return best;
    }
    const onCanvas = e => !e || !e.target || (cnv && e.target === cnv.elt);
    const typing = () => { const a = document.activeElement; return a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.isContentEditable); };
    const shown = () => S.visible && !S.intro && container.offsetParent !== null;

    function tryCut(x1, y1, x2, y2) {
      for (const e of edges) {
        if (!(e.a.revealed && e.b.revealed) || e.growth < 0.5) continue;
        if (segmentsCross(x1, y1, x2, y2, e.a.scr.x, e.a.scr.y, e.b.scr.x, e.b.scr.y)) { cutEdge(e); burst((x1 + x2) / 2, (y1 + y2) / 2); return; }
      }
    }
    function segmentsCross(ax, ay, bx, by, cx, cy, dx, dy) {
      const o = (px, py, qx, qy, rx, ry) => Math.sign((qx - px) * (ry - py) - (qy - py) * (rx - px));
      return o(ax, ay, bx, by, cx, cy) !== o(ax, ay, bx, by, dx, dy) && o(cx, cy, dx, dy, ax, ay) !== o(cx, cy, dx, dy, bx, by);
    }

    /* ---------- nó aberto ---------- */
    function openNode(n, silent) {
      if (!n) return;
      touchInspect=null;
      S.focus = n;
      if (!n.revealed) reveal(n);
      if (S.trail[S.trail.length - 1] !== n) S.trail.push(n);
      if (!silent) cb.open(info(n.p.id));
      cb.change(state());
    }
    function connections(id) {
      const n = byId(id); if (!n) return [];
      return edges.filter(e => e.a === n || e.b === n).map(e => {
        const o = e.a === n ? e.b : e.a; const L = LINES[e.t];
        return { id: o.p.id, title: o.p.title, type: e.t, label: L.label, why: L.why(e.k), source: e.source || null, color: L.color, regrown: e.regrown, revealed: o.revealed };
      });
    }
    function potentials(id) { // ligações possíveis ainda não ligadas (qualquer natureza), com nós revelados
      const n = byId(id); if (!n) return [];
      const out = [];
      for (const m of nodes) { if (m === n || !m.revealed) continue; for (const r of relationsBetween(n, m)) if (!edges.find(e => e.key === edgeKey(n, m, r.t))) out.push({ id: m.p.id, title: m.p.title, type: r.t, label: LINES[r.t].label, why: LINES[r.t].why(r.k), color: LINES[r.t].color }); }
      return out;
    }
    function info(id) {
      const n = byId(id); if (!n) return null;
      const d = n.p;
      return {
        id, index: n.i, title: d.title, circuit: d.circuit, x: n.scr.x, y: n.scr.y, year: d.year, mechanism: d.mechanism, translation: TRANSLATE[d.mechanism] || d.mechanism,
        edital: d.edital, value: d.value, valueText: d.value == null ? null : money(d.value), scale: scaleOf(d.value), region: d.region, proponent: d.proponent,
        verification: d.verification, issue: d.issue, trailIndex: S.trail.indexOf(n) + 1, trail: S.trail.map(t => shortTitle(t.p.title)),
        connections: connections(id), potentials: potentials(id)
      };
    }
    function zoomAt(f, mx, my) { // multiplica o zoom mantendo (mx,my) fixo na tela
      const z0 = view.zoomTarget, z1 = p.constrain(z0 * f, ZOOM_MIN, ZOOM_MAX); if (z1 === z0) return;
      const cx = p.width / 2, cy = p.height / 2, wx = (mx - cx - view.pxT) / z0, wy = (my - cy - view.pyT) / z0;
      view.zoomTarget = z1; view.pxT = mx - cx - wx * z1; view.pyT = my - cy - wy * z1; clampPan();
      if (S.reduced) { view.zoom = z1; view.px = view.pxT; view.py = view.pyT; }
      cb.change(state());
    }
    function panBy(dx, dy) { view.pxT += dx; view.pyT += dy; view.px += dx; view.py += dy; clampPan(); }
    function zoomReset() { view.zoomTarget = S.intro ? 0.72 : 1; view.pxT = view.pyT = 0; if (S.reduced) { view.zoom = view.zoomTarget; view.px = view.py = 0; } cb.change(state()); }
    function state() {
      const linesByType = {}; for (const t in LINES) linesByType[t] = 0;
      for (const e of edges) if (e.a.revealed && e.b.revealed) linesByType[e.t]++;
      return {
        zoom: view.zoomTarget, revealed: nodes.filter(n => n.revealed).length, total: nodes.length,
        lines: edges.filter(e => e.a.revealed && e.b.revealed).length, linesByType, cuts: S.cutKeys.size,
        trail: S.trail.map(t => t.p.id), trailTitles: S.trail.map(t => shortTitle(t.p.title)),
        nodeStyle: S.nodeStyle, mode: S.mode, depth: S.depth, intro: S.intro, cutting: S.cutting, paused: S.paused, paper: S.paper, reduced: S.reduced,
        active: Object.assign({}, active), anyLine: Object.keys(active).some(k => active[k]), focus: S.focus ? S.focus.p.id : null, started: S.started
      };
    }

    /* ---------- sketch (instância) ---------- */
    const sketch = function (q) {
      p = q;
      q.setup = function () {
        q.pixelDensity(Math.min(coarsePointer ? 1.5 : 2, q.displayDensity())); // celular: menos pixels, mais quadros
        cnv = q.createCanvas(W(), H());
        q.frameRate(60);
        q.randomSeed(Date.now() % 100000);   // cada visita entra por outro lugar
        q.noiseSeed(Date.now() % 100000);
        q.noiseDetail(3, 0.5);
        q.textFont("Arial");
        q.strokeCap(q.ROUND);
        spray = q.createGraphics(q.width, q.height); spray.noStroke();
        q.describe("Campo rizomático: vinte projetos de grafite e muralismo financiados em Belo Horizonte aparecem como nós. Ao pairar num nó, linhas pontilhadas mostram com quem ele poderia se ligar; ao ligar uma linha de fuga (ano, mecanismo, edital, escala, regional ou curadoria), os nós se puxam e as linhas nascem. A pessoa revela os nós movendo o mouse, abre prévias, corta linhas, gira o campo em 3D e alterna entre o modo rizoma e o modo árvore.");
        buildNodes();
        buildEdges();
      };
      q.draw = drawAll;
      q.windowResized = function () { api.resize(); };
      q.mouseMoved = function (e) { if (shown() && onCanvas(e)) pointerMove(q.mouseX, q.mouseY); };
      q.mouseWheel = function (e) { // roda: zoom no ponto do cursor
        if (!shown() || !onCanvas(e)) return;
        zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, q.mouseX, q.mouseY); return false;
      };
      q.mouseDragged = function (e) {
        if (!shown() || !onCanvas(e)) return;
        if (pinch) return false; // dois dedos: tratado em touchMoved
        if ((e && e.shiftKey) || q.mouseButton === q.CENTER) { panBy(q.mouseX - q.pmouseX, q.mouseY - q.pmouseY); return false; } // shift+arrastar ou botão do meio: deslocar
        if (S.mode === "arvore") { panBy(q.mouseX - q.pmouseX, q.mouseY - q.pmouseY); dragged += Math.abs(q.mouseX - q.pmouseX) + Math.abs(q.mouseY - q.pmouseY); return false; } // na árvore, arrastar desloca a página
        if (S.cutting && S.mode === "rizoma") { tryCut(q.pmouseX, q.pmouseY, q.mouseX, q.mouseY); return false; }
        if (depthOn()) { // arrastar o fundo gira o campo
          view.ry += (q.mouseX - q.pmouseX) * 0.005; view.rx = p.constrain(view.rx + (q.mouseY - q.pmouseY) * 0.005, -1.2, 1.2); view.lastDrag = p.millis();
          return false;
        }
        pointerMove(q.mouseX, q.mouseY);
        return false;
      };
      let dragged = 0;
      q.mousePressed = function (e) {
        if (!shown() || !onCanvas(e) || S.cutting) return;
        dragged = 0;
        if (S.mode === "arvore") return; // na árvore o nó abre ao soltar, se não houve arrasto
        const n = pickNode(q.mouseX, q.mouseY);
        if (n) openNode(n);
        else if (S.hoverEdge) openNode(S.hoverEdge.a);
        else if (S.mode === "rizoma") { pointerDist = 999; lastReveal = 0; pointerMove(q.mouseX, q.mouseY); }
      };
      function pinchOf() { const t = q.touches; if (!t || t.length < 2) return null; const dx = t[0].x - t[1].x, dy = t[0].y - t[1].y; return { d: Math.hypot(dx, dy), x: (t[0].x + t[1].x) / 2, y: (t[0].y + t[1].y) / 2 }; }
      q.mouseReleased = function (e) { if (!shown() || !onCanvas(e) || S.mode !== "arvore" || dragged > 6) return; const n = pickNode(q.mouseX, q.mouseY); if (n) openNode(n); };
      q.touchStarted = function (e) {
        if (!shown() || !onCanvas(e)) return;
        const pz=pinchOf();
        if(pz){pinch=pz;touchGesture=null;return false;}
        touchGesture={x:q.mouseX,y:q.mouseY,lx:q.mouseX,ly:q.mouseY,move:0,t:p.millis()};
        return false;
      };
      q.touchMoved = function (e) {
        if (!shown() || !onCanvas(e)) return;
        const pz=pinchOf();
        if(pz){
          if(pinch){if(pinch.d>0)zoomAt(pz.d/pinch.d,pz.x,pz.y);panBy(pz.x-pinch.x,pz.y-pinch.y);}
          pinch=pz;touchGesture=null;return false;
        }
        if(!touchGesture)return false;
        const dx=q.mouseX-touchGesture.lx,dy=q.mouseY-touchGesture.ly;
        touchGesture.move+=Math.hypot(dx,dy);touchGesture.lx=q.mouseX;touchGesture.ly=q.mouseY;
        if(touchGesture.move<12)return false;
        touchInspect=null;
        if(S.mode==="arvore"){panBy(dx,dy);return false;}
        if(S.cutting){tryCut(q.pmouseX,q.pmouseY,q.mouseX,q.mouseY);return false;}
        pointerMove(q.mouseX,q.mouseY); // no celular, um dedo explora; 2 dedos ficam para zoom/pan
        return false;
      };
      q.touchEnded = function (e) {
        const wasPinch=!!pinch;if(!q.touches||q.touches.length<2)pinch=null;
        if(!shown()||!onCanvas(e)){touchGesture=null;return;} // fora do canvas, NUNCA devolver false: o p5 escuta o toque na janela inteira e `false` cancela o clique dos botões (Android)
        if(wasPinch||!touchGesture){touchGesture=null;return false;}
        const g=touchGesture;touchGesture=null;
        if(g.move>12||p.millis()-g.t>520)return false;
        const n=pickNode(g.x,g.y);
        if(n){
          const second=touchInspect===n && p.millis()-touchInspectAt<1800;
          if(second){touchInspect=null;openNode(n);}
          else{touchInspect=n;touchInspectAt=p.millis();S.hover=n;lastHoverKey="";cb.change(state());}
        }else{
          touchInspect=null;S.hover=null;lastHoverKey="";
          if(S.mode==="rizoma"){pointerDist=999;lastReveal=0;pointerMove(g.x,g.y);revealAt(g.x,g.y,160,2);} // toque no vazio: revela por perto
        }
        return false;
      };
      q.keyPressed = function () {
        if (!shown() || typing() || opts.keys === false) return;
        const k = String(q.key).toLowerCase();
        if (k === "+" || k === "=") api.zoomBy(1.25); if (k === "-") api.zoomBy(0.8); if (k === "0") api.zoomReset();
        if (k === "c") api.setCutting(!S.cutting);
        if (k === "p") api.setPaused(!S.paused);
        if (k === "t") api.setPaper(!S.paper);
        if (k === "s") api.save();
        if (k === "r") api.reset();
        if (k === "a") api.setMode(S.mode === "rizoma" ? "arvore" : "rizoma");
        if (k === "d") api.setDepth(!S.depth);
        if (q.keyCode === q.ESCAPE) api.close();
      };
    };

    /* ---------- API ---------- */
    const api = {
      LINES, state, info, connections, potentials,
      toggleLine(t) { active[t] = !active[t]; buildEdges(); return active[t]; },
      setLine(t, on) { active[t] = !!on; buildEdges(); return active[t]; },
      setMode(m) {
        touchInspect=null;
        S.mode = m === "arvore" ? "arvore" : "rizoma";
        if (S.mode === "arvore") { if (!S.started) { S.started = true; cb.started(); } view.zoomTarget = 1; view.pxT = view.pyT = 0; if (S.reduced) { view.zoom = 1; view.px = view.py = 0; } }
        else { for (const n of nodes) n.vel.set(p.random(-1, 1), p.random(-1, 1), 0); if (depthOn()) scatterDepth(); }
        cb.change(state());
      },
      setDepth(v) {
        S.depth = !!v;
        if (S.depth) { view.rx = -0.35; view.ry = 0.45; view.lastDrag = 0; if (S.mode === "rizoma") scatterDepth(); }
        else for (const n of nodes) { n.pos.z = 0; n.vel.z = 0; }
        cb.change(state());
      },
      setIntro(v) { S.intro = !!v; view.zoomTarget = S.intro ? 0.72 : 1; if (!S.intro && S.reduced) view.zoom = 1; cb.change(state()); },
      setCutting(v) { S.cutting = !!v; cb.change(state()); },
      setPaused(v) { S.paused = !!v; cb.change(state()); },
      setPaper(v) { S.paper = !!v; if (spray) spray.clear(); cb.change(state()); },
      setNodeStyle(v) { S.nodeStyle = v === "muro" ? "muro" : "circulo"; cb.change(state()); },
      setReduced(v) { S.reduced = !!v; if (S.reduced) { for (const e of edges) e.growth = 1; if (spray) spray.clear(); view.zoom = view.zoomTarget; } cb.change(state()); },
      open(id, silent) { openNode(byId(id), silent); },
      close() { S.focus = null; touchInspect=null; cb.change(state()); },
      refresh() { if (S.focus) cb.open(info(S.focus.p.id)); },
      revealAll() { for (const n of nodes) reveal(n); },
      revealAt(x, y, r, max) { return revealAt(x, y, r, max); },
      ghosts() { return nodes.filter(n => !n.revealed).map(n => ({ id: n.p.id, title: n.p.title, mechanism: n.p.mechanism, year: n.p.year, circuit: n.p.circuit, x: n.scr.x, y: n.scr.y, s: n.scr.s })); },
      zoomBy(f) { zoomAt(f, p.width / 2, p.height / 2); },
      zoomReset,
      zoom() { return view.zoomTarget; },
      revealOne() { // revelação sutil quando a pessoa não se move: um nó por vez, perto do centro ou de um nó já visível
        const left = nodes.filter(n => !n.revealed); if (!left.length) return null;
        const n = p.random(left), seen = nodes.filter(m => m.revealed);
        const near = seen.length ? p.random(seen).scr : { x: p.width / 2, y: p.height / 2 };
        reveal(n, near.x + p.random(-150, 150), near.y + p.random(-110, 110));
        return n.p.id;
      },
      save(name) {
        p.push(); p.noStroke(); p.fill(S.paper ? 30 : 235); p.textSize(10); p.textAlign(p.LEFT, p.BOTTOM);
        p.text("RIZOMA DO FOMENTO · meu mapa · " + nodes.filter(n => n.revealed).length + " nós · " + S.trail.length + " na trilha · posições cenográficas", 12, p.height - 10);
        p.pop();
        p.saveCanvas(name || "meu-mapa-rizoma", "png");
      },
      reset() {
        S.focus = null; S.hover = null; S.hoverEdge = null; touchInspect=null; S.trail = []; S.cutKeys = new Set(); regrown = []; S.started = false; S.cutting = false; S.mode = "rizoma";
        if (spray) spray.clear(); p.randomSeed(Date.now() % 100000); buildNodes(); buildEdges();
      },
      resize() {
        if (!p || !cnv) return;
        const w = W(), h = H(); if (w === p.width && h === p.height) return;
        p.resizeCanvas(w, h); const s = p.createGraphics(w, h); s.noStroke(); if (spray) s.image(spray, 0, 0); spray = s;
      },
      setVisible(v) { S.visible = !!v; if (!p) return; if (S.visible) { api.resize(); p.loop(); } else p.noLoop(); },
      tick(n) { for (let i = 0; i < (n || 1); i++) p.redraw(); }, // avança quadros à mão (testes; quando o rAF está parado)
      screen() { return { nodes: nodes.filter(n => n.revealed).map(n => ({ id: n.p.id, x: n.scr.x, y: n.scr.y })), edges: edges.filter(e => e.pts.length).map(e => { const m = e.pts[Math.floor(e.pts.length / 2)]; return { key: e.key, x: m[0], y: m[1] }; }) }; },
      remove() { if (p) p.remove(); }
    };

    new p5(sketch, container);
    return api;
  }

  window.Rizoma = { mount, LINES, TRANSLATE, scaleOf, money, shortTitle };
})();
