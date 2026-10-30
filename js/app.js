(() => {
const PROJECTS=window.CARTOGRAFIA_DATA||[];
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const money=v=>v==null?"—":new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);
const shortMoney=v=>v>=1000000?`R$ ${(v/1000000).toFixed(2).replace(".",",")} mi`:v>=1000?`R$ ${Math.round(v/1000)} mil`:money(v);
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const idx=id=>PROJECTS.findIndex(p=>p.id===id);

function art(index,variant=0){
  const strokes=["M-40 270 Q100 -60 220 175 T520 30","M-20 80 C150 330 260 -80 530 195","M40 340 L140 -10 L260 310 L420 -20","M-30 300 Q165 -65 280 185 T520 100","M-40 20 Q215 365 530 15","M-35 300 L110 20 L250 290 L400 15 L540 280"];
  const d=strokes[index%strokes.length],trs=["","translate(-25 10) scale(1.08)","translate(35 -20) scale(.96)"][variant];
  return `<svg viewBox="0 0 520 340" preserveAspectRatio="xMidYMid slice"><rect width="520" height="340" fill="#f5f5f2"/><g stroke="#dfdfdc" stroke-width="2"><path d="M0 65H520M0 130H520M0 195H520M0 260H520"/><path d="M105 0V65M315 0V65M210 65V130M415 65V130M105 130V195M315 130V195M210 195V260M415 195V260M105 260V340M315 260V340"/></g><g transform="${trs}"><path d="${d}" fill="none" stroke="#444" stroke-width="68"/><path d="${d}" fill="none" stroke="#d2d2cf" stroke-width="18"/><path d="M0 315 Q260 30 520 300" fill="none" stroke="#888" stroke-width="13"/><circle cx="${180+(index%3)*70}" cy="${110+(index%4)*25}" r="${28+(index%5)*8}" fill="none" stroke="#777" stroke-width="9"/></g></svg>`;
}

let page="discover",currentProject=null,previous={page:"discover"},metric="count",selection=null,hoverSelection=null;
let comments={},answers={};
let R=null,reduced=false;
function showPage(name){
  page=name;
  ["discover","indicators","editais","research","about"].forEach(id=>$("#"+id).classList.toggle("hidden",id!==name));
  $("#projectPage").classList.add("hidden");
  $$("[data-nav]").forEach(b=>b.classList.toggle("active",b.dataset.nav===name));
  if(name==="discover"){ensureRizoma();R.setVisible(true)}else if(R)R.setVisible(false);
  if(name==="indicators")renderIndicators();
  if(name==="editais")renderEditais();
  if(name==="research"||name==="about"){requestAnimationFrame(observeText);if(R&&R.state().focus)R.close()} // páginas de leitura fecham a prévia; a trilha fica
  if(R)syncDiscover(R.state()); // tema da prévia e lista lateral acompanham a página
}
/* a capa é uma camada sobre o campo: o rizoma já vive atrás dela, em 3D, desde o primeiro quadro (montagem no fim do arquivo) */
document.body.classList.add("intro-active");
$("#enterBtn").onclick=()=>{
  const intro=$("#intro");intro.classList.add("leaving");document.body.classList.remove("intro-active");
  setTimeout(()=>intro.classList.add("hidden"),reduced?0:750);
  if(R)R.setIntro(false); // a câmera aproxima; o campo passa a responder ao gesto
};
$$("[data-nav]").forEach(b=>b.onclick=()=>showPage(b.dataset.nav));

/* ---------- descobrir: campo rizomático (motor em js/rizoma.js) ---------- */
const lineChips={};
function ensureRizoma(){
  if(R)return;
  R=Rizoma.mount({container:"#rizomaStage",paper:true,reduced,depth:true,intro:document.body.classList.contains("intro-active"),panelWidth:400,treeTop:()=>innerWidth<=780?(document.querySelector(".discover-copy").offsetHeight||70)+14:185,treeBottom:()=>innerWidth<=780?(document.querySelector(".discover-tools").offsetHeight||100)+16:50,
    onStarted:()=>{$("#blankMessage").style.opacity="0"},
    onChange:syncDiscover,
    onHover:showHoverCard,
    onOpen:showPreview});
  window.CartografiaRizoma=R; // acesso para testes e depuração
  for(const t in Rizoma.LINES){const L=Rizoma.LINES[t];const b=document.createElement("button");b.className="chip";b.innerHTML="<i></i><span>"+L.label+"</span><small></small>";b.style.setProperty("--sw","rgb("+L.color.join(",")+")");b.setAttribute("aria-pressed","false");
    b.onclick=()=>{clearSuggestedLines();const on=R.toggleLine(t);if(on){b.classList.add("growing");setTimeout(()=>b.classList.remove("growing"),1400)}if(R.state().focus)R.refresh()};$("#lineChips").appendChild(b);lineChips[t]=b}
  syncDiscover(R.state());
}
let lastFocus=null;
function syncDiscover(s){
  if(page==="indicators"&&s.focus!==lastFocus)renderSide();lastFocus=s.focus; // a lista lateral marca o nó aberto
  $("#wallCounter").textContent=`${s.revealed} / ${s.total} NÓS · ${s.lines} LINHAS${s.cuts?` · ${s.cuts} CORTES`:""}${s.started&&!s.anyLine?" · NENHUMA LINHA LIGADA":""}`;
  for(const t in lineChips){const b=lineChips[t],n=s.linesByType?s.linesByType[t]:0;b.classList.toggle("active",!!s.active[t]);b.classList.toggle("has-lines",n>0);b.setAttribute("aria-pressed",String(!!s.active[t]));b.querySelector("small").textContent=s.active[t]&&n?String(n):""}
  $("#cutMode").disabled=!s.lines;
  renderTrailBar(s);
  $("#modeTree").classList.toggle("active",s.mode==="arvore");$("#modeTree").textContent=s.mode==="arvore"?"Voltar ao rizoma":"Árvore / decalque";
  $("#cutMode").classList.toggle("active",s.cutting);$("#cutMode").textContent=s.cutting?"Cortando… (arraste sobre uma linha)":"Cortar linha";
  $("#pauseMotion").classList.toggle("active",s.paused);$("#pauseMotion").textContent=s.paused?"Retomar":"Pausar";
  $("#darkMode").classList.toggle("active",!s.paper);$("#darkMode").textContent=s.paper?"Modo escuro":"Modo papel";
  $("#discover").classList.toggle("dark",!s.paper);document.body.classList.toggle("field-dark",!s.paper&&page==="discover");
  $("#zoomReset").textContent=Math.abs(s.zoom-1)<.02?"1:1":`${s.zoom.toFixed(1)}×`;$("#zoomReset").classList.toggle("active",Math.abs(s.zoom-1)>=.02);
  $("#depthMode").classList.toggle("active",s.depth);$("#depthMode").textContent=s.depth?"3D · arraste para girar":"3D";
  $("#blankMessage").style.opacity=s.started||s.intro?"0":"1";$("#blankMessage").classList.toggle("hidden",s.started||s.intro);
  $("#lineHint").classList.toggle("show",s.started&&!s.anyLine&&s.mode==="rizoma"&&!s.intro);
  $("#discover").classList.toggle("preview-open",!!s.focus);document.body.classList.toggle("preview-open",!!s.focus); // as ferramentas cedem lugar ao painel, em vez de ficar escondidas atrás dele
  if(s.focus)$("#hoverCard").classList.remove("show");
  if(!s.focus)$("#preview").classList.remove("open");
}
/* prévia do nó: painel lateral (desktop) ou folha inferior (celular); a página completa só com "Explorar projeto" */
let previewId=null,previewOrigin="discover";
/* uma só organização para abrir projetos: campo, indicadores e editais chamam openPreview; a página inteira só por "Explorar projeto" */
function openPreview(id,origin){ensureRizoma();previewOrigin=origin||page;R.open(id)}
function showPreview(i){
  previewId=i.id;$("#hoverCard").classList.remove("show");
  const via=previewOrigin==="indicators"?"VIA INDICADORES · ":previewOrigin==="editais"?"VIA EDITAIS · ":"";
  $("#pvKicker").textContent=(via+(i.trailIndex>1?`NÓ ${i.trailIndex} DA SUA TRILHA · `:"NÓ ABERTO · ")+i.circuit).toUpperCase();
  $("#pvTitle").textContent=i.title;
  $("#pvTrans").innerHTML=`<b>Como foi viabilizado:</b> ${esc(i.translation)}`;
  $("#pvFacts").innerHTML=fact("Ano",String(i.year))+fact("Edital",i.edital)+fact("Valor registrado",i.valueText)+fact("Escala",i.scale)+fact("Regional",i.region)+(i.issue?`<div class="note">${esc(i.issue)}</div>`:"");
  $("#pvLines").innerHTML=i.connections.length?i.connections.map(c=>`<button class="line-link" data-pv="${c.id}" style="--sw:rgb(${c.color.join(",")})"><i></i><span>${esc(c.title)}</span><small>${esc(c.why)}${c.regrown?" · rebrotou":""} →</small></button>`).join(""):`<div class="note">Nenhuma linha ligada chega aqui. Ligue uma linha de fuga no topo para ver com quem este projeto se relaciona.</div>`;
  $$("[data-pv]").forEach(b=>b.onclick=()=>R.open(b.dataset.pv));
  // ligações possíveis ainda não ligadas, agrupadas por natureza; o botão liga a linha de fuga correspondente
  const groups={};for(const q of i.potentials){(groups[q.type]??={label:q.label,color:q.color,items:[]}).items.push(q)}
  const keys=Object.keys(groups);
  $("#pvPotentials").innerHTML=keys.length?keys.map(t=>`<button class="potential" data-pot="${t}" style="--sw:rgb(${groups[t].color.join(",")})"><i></i><span>Ligar ${esc(groups[t].label)}</span><small>${groups[t].items.length} nó(s): ${esc(groups[t].items.slice(0,3).map(q=>Rizoma.shortTitle(q.title)).join(", "))}${groups[t].items.length>3?"…":""}</small></button>`).join(""):`<div class="note">${i.connections.length?"Todas as ligações possíveis com os nós revelados já estão ligadas.":"Revele outros nós movendo a mão: as ligações possíveis aparecem pontilhadas ao pairar."}</div>`;
  $$("[data-pot]").forEach(b=>b.onclick=()=>{R.setLine(b.dataset.pot,true);const chip=lineChips[b.dataset.pot];if(chip){chip.classList.add("growing");setTimeout(()=>chip.classList.remove("growing"),1400)}R.refresh()});
  $("#pvTrail").innerHTML=i.trail.length>1?`<strong>Sua trilha:</strong> ${i.trail.map(esc).join(" → ")}`:"";
  $("#preview").classList.add("open");$("#preview").scrollTop=0;
}
$("#pvClose").onclick=()=>R&&R.close();
$("#pvOpen").onclick=()=>{if(previewId)openProject(previewId,previewOrigin==="indicators"||previewOrigin==="editais"?previewOrigin:"discover",true)};
/* trilha clicável: os últimos nós abertos, para voltar sem perder a referência */
function renderTrailBar(s){
  const bar=$("#trailBar"),ids=s.trail.slice(-5),titles=s.trailTitles.slice(-5);
  bar.hidden=!ids.length;if(!ids.length)return;
  bar.innerHTML=`<span class="kicker">SUA TRILHA</span>`+ids.map((id,k)=>`<button data-trail="${id}" class="${id===s.focus?"current":""}">${esc(titles[k])}</button>`).join(`<i>→</i>`);
  $$("[data-trail]").forEach(b=>b.onclick=()=>R.open(b.dataset.trail));
}
/* menu "Mais": ações terciárias */
$("#moreBtn").onclick=e=>{e.stopPropagation();const open=$("#moreMenu").hidden;$("#moreMenu").hidden=!open;$("#moreBtn").setAttribute("aria-expanded",String(open))};
document.addEventListener("click",e=>{if(!e.target.closest(".more-menu")){$("#moreMenu").hidden=true;$("#moreBtn").setAttribute("aria-expanded","false")}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){$("#moreMenu").hidden=true;$("#moreBtn").setAttribute("aria-expanded","false")}});
/* card visual do nó ou da relação sob o mouse (no rodapé, como a lateral dos Indicadores) */
function showHoverCard(h){
  const card=$("#hoverCard");
  if(!h||currentProject||$("#preview").classList.contains("open")){card.classList.remove("show");return} // com a prévia aberta, o card seria redundante
  if(h.kind==="node"){
    $("#hoverArt").innerHTML=art(h.index);
    $("#hoverKicker").textContent=`${h.year} · ${h.mechanism.toUpperCase()} · ${h.circuit.toUpperCase()}`;
    $("#hoverTitle").textContent=h.title;
    $("#hoverMeta").textContent=`${h.valueText||"Valor a verificar"} · ${h.scale||""} · ${h.connections.length} linha(s) ativa(s)${h.issue?" · dado em revisão":""}`;
    $("#hoverCta").textContent="CLIQUE PARA ABRIR O NÓ ↗";
  }else{
    const c=`rgb(${h.color.join(",")})`;
    $("#hoverArt").innerHTML=`<svg viewBox="0 0 96 64"><rect width="96" height="64" fill="#f5f5f2"/><path d="M18 44 C 40 10, 56 54, 78 20" fill="none" stroke="${c}" stroke-width="3"/><circle cx="18" cy="44" r="7" fill="#fff" stroke="#222" stroke-width="2"/><circle cx="78" cy="20" r="7" fill="#fff" stroke="#222" stroke-width="2"/></svg>`;
    $("#hoverKicker").textContent=`RELAÇÃO · ${h.label.toUpperCase()}${h.regrown?" · REBROTOU":""}`;
    $("#hoverTitle").textContent=`${h.a.title} ↔ ${h.b.title}`;
    $("#hoverMeta").textContent=`${h.why}. ${h.a.year} · ${h.a.mechanism} e ${h.b.year} · ${h.b.mechanism}.`;
    $("#hoverCta").textContent="CLIQUE PARA ABRIR O PRIMEIRO NÓ ↗";
  }
  card.classList.add("show");
}
$("#modeTree").onclick=()=>{if(!R)return;const next=R.state().mode==="arvore"?"rizoma":"arvore";R.setMode(next);if(next==="arvore")guide("tree","Árvore / decalque: os mesmos projetos agora aparecem pela hierarquia institucional — mecanismo → ano → projeto. Passe o mouse para ver as relações transversais que essa estrutura esconde.",7200);else guide("rizomaback","De volta ao rizoma: os projetos deixam a hierarquia fixa e voltam a se relacionar por múltiplas linhas de fuga.",6200)};
$("#depthMode").onclick=()=>R&&R.setDepth(!R.state().depth);
$("#cutMode").onclick=()=>R&&R.setCutting(!R.state().cutting);
$("#pauseMotion").onclick=()=>R&&R.setPaused(!R.state().paused);
$("#zoomIn").onclick=()=>R&&R.zoomBy(1.25);$("#zoomOut").onclick=()=>R&&R.zoomBy(0.8);$("#zoomReset").onclick=()=>R&&R.zoomReset();
$("#reduceMotion").onclick=()=>{reduced=!reduced;document.body.classList.toggle("reduce-motion",reduced);$("#reduceMotion").classList.toggle("active",reduced);$("#reduceMotion").setAttribute("aria-pressed",String(reduced));if(R)R.setReduced(reduced)};
if(matchMedia("(prefers-reduced-motion: reduce)").matches)$("#reduceMotion").click(); // respeita a preferência do sistema ao abrir
$("#darkMode").onclick=()=>R&&R.setPaper(!R.state().paper);
$("#saveMap").onclick=()=>R&&R.save();
$("#resetWalls").onclick=()=>R&&R.reset();

/* ---------- busca: uma porta direta sem substituir a exploração rizomática ---------- */
const searchInput=$("#projectSearch"),searchResults=$("#searchResults");
const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
function closeSearch(){if(searchResults){searchResults.hidden=true;searchResults.innerHTML=""}}
function renderSearch(){if(!searchInput||!searchResults)return;const q=norm(searchInput.value.trim());if(q.length<2){closeSearch();return}const list=PROJECTS.filter(p=>norm([p.title,p.year,p.mechanism,p.edital,p.circuit,p.region].filter(Boolean).join(" ")).includes(q)).slice(0,8);searchResults.innerHTML=list.length?list.map(p=>`<button type="button" data-search-id="${p.id}"><small>${p.year} · ${esc(p.mechanism)} · ${esc(p.circuit)}</small><b>${esc(p.title)}</b></button>`).join(""):`<div class="search-empty">Nenhum projeto encontrado.</div>`;searchResults.hidden=false;$("[data-search-id]").forEach(b=>b.onclick=()=>{const id=b.dataset.searchId;closeSearch();searchInput.value="";openPreview(id,"discover")})}
if(searchInput){searchInput.addEventListener("input",renderSearch);searchInput.addEventListener("keydown",e=>{if(e.key==="Escape"){closeSearch();searchInput.blur()}if(e.key==="Enter"){const first=searchResults&&searchResults.querySelector("[data-search-id]");if(first)first.click()}})}
document.addEventListener("click",e=>{if(!e.target.closest(".project-search"))closeSearch()});
document.addEventListener("keydown",e=>{if(e.key==="/"&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/INPUT|TEXTAREA/.test(document.activeElement?.tagName||"")){e.preventDefault();searchInput?.focus()}});

/* ---------- projeto (nó aberto) ---------- */
function fact(label,value){const miss=value==null||value==="";return `<div class="fact"><span>${label}</span><b class="${miss?"missing":""}">${miss?"A verificar":esc(value)}</b></div>`}
function openProject(id,from="discover",fromRizoma=false){
  const p=PROJECTS.find(x=>x.id===id);if(!p)return;previous={page:from,selection};currentProject=p;
  ensureRizoma();if(!fromRizoma)R.open(id,true); // entra na trilha mesmo vindo dos gráficos ou editais
  $("#hoverCard").classList.remove("show");$("#preview").classList.remove("open");
  ["discover","indicators","editais","research","about"].forEach(id=>$("#"+id).classList.add("hidden"));$("#projectPage").classList.remove("hidden");$("#projectPage").scrollTop=0;
  $("#projectBack").textContent=from==="discover"?"FECHAR NÓ · A TRILHA FICA":from==="indicators"?"← VOLTAR AOS INDICADORES":from==="editais"?"← VOLTAR AOS EDITAIS":"← VOLTAR";
  renderProject(p);
}
function closeProject(){const back=previous.page||"discover";showPage(back);if(back==="indicators"){selection=previous.selection;renderIndicators()}currentProject=null;if(R){previewOrigin=back;R.refresh()}} // voltar reabre a prévia do mesmo nó, onde quer que se estivesse
$("#projectBack").onclick=closeProject;
$$("[data-project-section]").forEach(b=>b.onclick=()=>$("#project-"+b.dataset.projectSection).scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"}));
function renderProject(p){
  const i=idx(p.id);$("#projectHeroArt").innerHTML=art(i)+`<div class="project-image-label">PLACEHOLDER — FOTOGRAFIA REAL A INCORPORAR</div>`;$("#projectStatus").textContent=p.issue?"ATENÇÃO / DADO EM REVISÃO":"REGISTRO PRESENTE NO TCC";$("#projectMeta").textContent=`${p.year} · ${p.mechanism.toUpperCase()} · ${p.circuit.toUpperCase()}`;$("#projectTitle").textContent=p.title;$("#projectSummary").textContent=Rizoma.TRANSLATE[p.mechanism]||"Página de projeto estruturada para receber imagem, narrativa, território, financiamento, relatos, questionário e fontes verificáveis.";
  $("#projectFacts").innerHTML=fact("Ano",String(p.year))+fact("Mecanismo",p.mechanism)+fact("Edital",p.edital)+fact("Valor registrado",money(p.value))+fact("Escala",Rizoma.scaleOf(p.value))+fact("Regional",p.region)+fact("Proponente",p.proponent)+fact("Situação",p.verification);
  $("#projectGallery").innerHTML=[0,1,2].map((v,n)=>`<div class="gallery-item">${art(i,v)}<span class="gallery-label">${n===0?"OBRA / VISTA GERAL":n===1?"DETALHE":"TERRITÓRIO / CONTEXTO"}</span></div>`).join("");
  $("#projectNarrative").innerHTML=`<p>O projeto <strong>${esc(p.title)}</strong> integra o corpus da Cartografia do Fomento no recorte de <strong>${p.year}</strong>.</p><p>Textos interpretativos específicos devem ser preenchidos somente quando houver documentação suficiente.</p>${p.issue?`<div class="note"><strong>Atenção documental:</strong><br>${esc(p.issue)}</div>`:""}`;
  renderLines(p);
  $("#territoryContent").innerHTML=`<p>Esta camada deverá reunir localização de execução, características do entorno, atividades abertas ao público e relatos associados ao projeto.</p><div class="social-grid"><div class="social-card"><small>REGIONAL</small><b>${p.region||"Ainda não verificada"}</b></div><div class="social-card"><small>PERFIL SOCIOECONÔMICO</small><b>Dados ainda não consolidados</b></div><div class="social-card"><small>RELAÇÃO COM A COMUNIDADE</small><b>A investigar</b></div></div><p>Renda, raça, gênero ou classe social não devem ser inferidos a partir do bairro ou da regional.</p>`;
  $("#fundingContent").innerHTML=fact("Mecanismo",p.mechanism)+fact("Edital / fonte",p.edital)+fact("Valor registrado",money(p.value))+fact("Ano",String(p.year))+fact("Situação documental",p.verification)+`<div class="note">Na versão final, diferencie valor solicitado, aprovado, captado, pago e executado sempre que os documentos permitirem.</div>`;
  $("#sourceContent").innerHTML=`<div class="source-row"><div><h3>Tabela do corpus do TCC</h3><p>Fonte-base desta estrutura.</p></div><span class="kicker">BASE</span></div><div class="source-row"><div><h3>Resultado oficial do edital</h3><p>Vincular documento específico do projeto antes da publicação final.</p></div><span class="kicker">A VINCULAR</span></div><div class="source-row"><div><h3>Execução da obra</h3><p>Fotografia, endereço, créditos e evidência de realização.</p></div><span class="kicker">A COMPLETAR</span></div>`;
  renderComments();requestAnimationFrame(observeText);
}
function renderLines(p){
  const cons=R?R.connections(p.id):[],s=R?R.state():null;
  $("#projectLines").innerHTML=cons.length?cons.map(c=>`<button class="line-link" data-line="${c.id}" style="--sw:rgb(${c.color.join(",")})"><i></i><span>${esc(c.title)}</span><small>${esc(c.why)}${c.regrown?" · rebrotou":""} →</small></button>`).join(""):`<div class="note">Nenhuma linha ativa chega a este projeto. Em Descobrir, ligue outra linha de fuga (ano, mecanismo, edital, escala, regional).</div>`;
  $$("[data-line]").forEach(b=>b.onclick=()=>openProject(b.dataset.line,previous.page));
  $("#projectTrail").innerHTML=s&&s.trailTitles.length?`<strong>Sua trilha:</strong> ${s.trailTitles.map(esc).join(" → ")}`:"";
}
$("#addComment").onclick=()=>{if(!currentProject)return;const t=$("#commentText").value.trim();if(!t)return;comments[currentProject.id]??=[];comments[currentProject.id].unshift({id:Date.now(),text:t});$("#commentText").value="";renderComments()};
function renderComments(){if(!currentProject)return;const list=comments[currentProject.id]||[];$("#commentList").innerHTML=list.length?list.map(c=>`<div class="comment"><small>RELATO DE TESTE / VISITANTE</small><p>${esc(c.text)}</p><button data-del="${c.id}">excluir</button></div>`).join(""):`<div class="note" style="margin-top:15px">Ainda não existem relatos nesta sessão.</div>`;$$("[data-del]").forEach(b=>b.onclick=()=>{comments[currentProject.id]=comments[currentProject.id].filter(c=>c.id!==Number(b.dataset.del));renderComments()})}
$$(".rating").forEach(g=>g.onclick=e=>{const b=e.target.closest("button");if(!b||!currentProject)return;answers[currentProject.id]??={};answers[currentProject.id][g.dataset.question]=Number(b.textContent);Array.from(g.children).forEach(x=>x.classList.toggle("selected",x===b))});
// Observa o elemento pai: o próprio .spray-text começa com clip-path de área zero e nunca "intersecta".
let observer=null;function observeText(){if(observer)observer.disconnect();observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.querySelectorAll(".spray-text").forEach(x=>x.classList.add("visible"))}),{root:currentProject?$("#projectPage"):null,threshold:.05});$$(".spray-text").forEach(el=>{el.classList.remove("visible");observer.observe(el.parentElement)})}

/* ---------- indicadores ---------- */
$$("[data-metric]").forEach(b=>b.onclick=()=>{metric=b.dataset.metric;$$("[data-metric]").forEach(x=>x.classList.toggle("active",x.dataset.metric===metric));renderIndicators()});
function aggregate(list,keyFn){const m=new Map();list.forEach(p=>{const k=keyFn(p);if(!m.has(k))m.set(k,[]);m.get(k).push(p)});return [...m.entries()].map(([key,projects])=>({key,projects,count:projects.length,value:projects.reduce((s,p)=>s+(p.value||0),0)}))}
function renderIndicators(){renderRegion();renderYears();renderTree();renderSide()}
function renderRegion(){
  const groups=aggregate(PROJECTS,p=>p.region||"Não verificada").sort((a,b)=>b[metric]-a[metric]),max=Math.max(1,...groups.map(g=>g[metric]));
  $("#regionChart").innerHTML=groups.map(g=>`<button class="chart-bar ${selection?.type==="region"&&selection.key===g.key?"active":""}" data-chart-type="region" data-chart-key="${esc(g.key)}"><span class="chart-bar-label">${esc(g.key)}</span><span class="bar-track"><span class="bar-fill" style="width:${Math.max(2,g[metric]/max*100)}%"></span></span><span class="chart-bar-value">${metric==="count"?g.count+" proj.":shortMoney(g.value)}</span></button>`).join("");bindCharts();
}
function renderYears(){
  const years=[...new Set(PROJECTS.map(p=>p.year))].sort();
  $("#yearChart").innerHTML=years.map(y=>{const ps=PROJECTS.filter(p=>p.year===y),pieces=["Incentivo Fiscal","Fundo Municipal","Descentra"].map(m=>{const n=ps.filter(p=>p.mechanism===m).length;if(!n)return"";return`<div class="year-piece ${m==="Fundo Municipal"?"fundo":m==="Descentra"?"descentra":""}" style="height:${n*20}px"></div>`}).join("");return`<button class="year-col ${selection?.type==="year"&&String(selection.key)===String(y)?"active":""}" data-chart-type="year" data-chart-key="${y}"><div class="year-stack">${pieces}</div><div class="year-number">${y}</div><div class="year-caption">${ps.length} projeto(s)</div></button>`}).join("");bindCharts();
}
function renderTree(){const max=Math.max(...PROJECTS.map(p=>p.value||0));$("#treemap").innerHTML=PROJECTS.map(p=>{const span=Math.max(2,Math.min(6,Math.round((p.value||0)/max*6)));return`<button class="tree-item ${MECH_CLASS[p.mechanism]||""}" style="grid-column:span ${span}" data-chart-type="project" data-chart-key="${p.id}"><b>${esc(p.title)}</b><span>${money(p.value)}</span></button>`}).join("");bindCharts()}
function selectedProjects(sel){if(!sel)return PROJECTS;if(sel.type==="region")return PROJECTS.filter(p=>(p.region||"Não verificada")===sel.key);if(sel.type==="year")return PROJECTS.filter(p=>String(p.year)===String(sel.key));if(sel.type==="mechanism")return PROJECTS.filter(p=>p.mechanism===sel.key);if(sel.type==="project")return PROJECTS.filter(p=>p.id===sel.key);return PROJECTS}
/* cor por mecanismo (semelhança, Gestalt): a mesma em gráfico de anos, legenda, lista lateral e treemap */
const MECH_CLASS={"Incentivo Fiscal":"if","Fundo Municipal":"fundo","Descentra":"descentra"};
function renderLegend(){$("#mechLegend").innerHTML=Object.keys(MECH_CLASS).map(m=>`<button class="legend-item" data-mech-legend="${m}"><i class="dot ${MECH_CLASS[m]}"></i><b>${m}</b><small>${esc((Rizoma.TRANSLATE[m]||"").split(".")[0])}</small></button>`).join("");$$("[data-mech-legend]").forEach(b=>b.onclick=()=>{const m=b.dataset.mechLegend;selection=selection&&selection.type==="mechanism"&&selection.key===m?null:{type:"mechanism",key:m,label:m};renderIndicators()})}
function renderSide(){const sel=hoverSelection||selection,list=selectedProjects(sel);
  const kicker=sel?(hoverSelection?"PRÉ-VISUALIZAÇÃO":"RECORTE FIXADO"):"CORPUS DO TCC",title=sel?(sel.label||sel.key):"Todos os projetos";
  $("#filterKicker").textContent=kicker;$("#filterTitle").textContent=title;$("#fsKicker").textContent=kicker;$("#fsTitle").textContent=`${title} · ${list.length} projeto(s)`;$("#fsClear").hidden=!selection;
  $("#filterDescription").textContent=sel?`${list.length} projeto(s) correspondem a este recorte. Toque num projeto para abrir a prévia.`:"Passe o mouse sobre qualquer gráfico para ver os projetos que formam aquele resultado. Toque num projeto para abrir a prévia.";
  $("#filteredProjects").innerHTML=list.map(p=>`<div class="side-project ${R&&R.state().focus===p.id?"current":""}"><button data-side="${p.id}"><small><i class="dot ${MECH_CLASS[p.mechanism]||""}"></i>${p.year} · ${esc(p.mechanism)} · ${esc(p.circuit)}</small><b>${esc(p.title)}</b><p>${esc(p.verification)}</p><strong>${money(p.value)} · PRÉVIA ↗</strong></button></div>`).join("");
  $$("[data-side]").forEach(b=>b.onclick=()=>openPreview(b.dataset.side,"indicators"))}
$("#fsClear").onclick=()=>{selection=null;renderIndicators()};
$("#fsList").onclick=()=>$("#indicatorSide").scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
function chartProjects(type,key){if(type==="region")return PROJECTS.filter(p=>(p.region||"Não verificada")===key);if(type==="year")return PROJECTS.filter(p=>String(p.year)===String(key));if(type==="project")return PROJECTS.filter(p=>p.id===key);return[]}
function showTip(e,type,key){const list=chartProjects(type,key),total=list.reduce((s,p)=>s+(p.value||0),0);$("#tooltip").innerHTML=`<div class="kicker">${type==="region"?"REGIÃO":type==="year"?"ANO":"PROJETO"}</div><h4>${esc(key)}</h4><p>${list.length} projeto(s)</p><p>Soma dos valores registrados: <strong>${money(total)}</strong></p><div class="tooltip-projects">${list.slice(0,6).map(p=>`<div>${esc(p.title)}</div>`).join("")}${list.length>6?`<div>+ ${list.length-6} outros</div>`:""}</div>`;$("#tooltip").classList.remove("hidden");moveTip(e)}
function moveTip(e){$("#tooltip").style.left=Math.min(innerWidth-295,e.clientX+14)+"px";$("#tooltip").style.top=Math.min(innerHeight-255,e.clientY+14)+"px"}
function bindCharts(){$$("[data-chart-type]").forEach(el=>{el.onmouseenter=e=>{const type=el.dataset.chartType,key=el.dataset.chartKey;hoverSelection={type,key,label:key};showTip(e,type,key);renderSide()};el.onmousemove=e=>moveTip(e);el.onmouseleave=()=>{hoverSelection=null;$("#tooltip").classList.add("hidden");renderSide()};el.onclick=()=>{const type=el.dataset.chartType,key=el.dataset.chartKey;if(type==="project"){openPreview(key,"indicators");return}selection=selection&&selection.type===type&&String(selection.key)===String(key)?null:{type,key,label:key};renderIndicators()}})}

/* ---------- editais ---------- */
function renderEditais(){
  const mechs=["Incentivo Fiscal","Fundo Municipal","Descentra"];
  $("#editalList").innerHTML=mechs.map(m=>{const list=PROJECTS.filter(p=>p.mechanism===m),total=list.reduce((s,p)=>s+(p.value||0),0);return`<div class="edital-row"><div class="kicker">${list.length} REGISTROS</div><div><h3>${m}</h3><p>${esc(Rizoma.TRANSLATE[m]||"")} Abra este mecanismo nos indicadores e veja os projetos do corpus associados a ele.</p></div><strong>${money(total)}<br><button data-mech="${m}">EXPLORAR ↗</button></strong></div>`}).join("");
  $$("[data-mech]").forEach(b=>b.onclick=()=>{selection={type:"mechanism",key:b.dataset.mech,label:b.dataset.mech};showPage("indicators");renderSide()});
}

/* portas secundárias da capa */
$$("[data-door]").forEach(b=>b.onclick=()=>{$("#enterBtn").click();showPage(b.dataset.door)});

/* tempo ocioso no campo: pontos podem surgir sozinhos, mas nenhuma relação é ativada sem ação da pessoa. */
/* tempos do campo ocioso, em ms e em nós: um só lugar para afinar o ritmo */
const IDLE={reveal:6000,every:3,maxNodes:6,nudge:4000,suggest:12000};
let lastActivity=Date.now(),idleTick=0,guideTimer=0,guideShown={};
["pointermove","pointerdown","touchstart","keydown","wheel"].forEach(ev=>document.addEventListener(ev,()=>{lastActivity=Date.now()},{passive:true}));
/* a melhor linha é usada apenas como sugestão visual; o visitante decide se quer ativá-la. */
function bestLine(){const count={};for(const n of R.screen().nodes)for(const q of R.potentials(n.id))count[q.type]=(count[q.type]||0)+1;const types=Object.keys(count).filter(t=>lineChips[t]);return types.sort((x,y)=>count[y]-count[x])[0]||null}
function clearSuggestedLines(){for(const t in lineChips)lineChips[t].classList.remove("suggested")}
function guide(key,text,ms=5200){if(guideShown[key])return;guideShown[key]=true;const g=$("#guide");$("#guideText").textContent=text;g.hidden=false;clearTimeout(guideTimer);guideTimer=setTimeout(()=>{g.hidden=true},ms)}
setInterval(()=>{
  if(page!=="discover"||!R||currentProject)return;const s=R.state();if(s.intro||s.mode!=="rizoma"||s.paused)return;
  const idle=Date.now()-lastActivity;
  if(idle>IDLE.reveal&&s.revealed<IDLE.maxNodes&&(++idleTick%IDLE.every===0)){R.revealOne();guide("auto","Alguns projetos surgem como convite. Mova a mão para escolher por onde entrar; clique num nó para abrir a prévia. As relações só aparecem quando você escolher uma linha de fuga.")}
  if(s.revealed>=2&&!s.anyLine){$("#lineChips").classList.toggle("nudge",idle>IDLE.nudge);if(idle>IDLE.nudge)guide("chips","Os nós já podem se relacionar. Escolha uma linha de fuga para revelar um tipo de relação: ano, mecanismo, edital, escala, regional ou curadoria.")}else{$("#lineChips").classList.remove("nudge");clearSuggestedLines()}
  if(s.revealed>=4&&!s.anyLine&&idle>IDLE.suggest){const best=bestLine();clearSuggestedLines();if(best&&lineChips[best]){lineChips[best].classList.add("suggested");guide("suggestline",`Sugestão: a linha ${Rizoma.LINES[best].label} conecta vários nós já revelados. Ela só será ativada se você clicar.`,6500)}}
},1000);

renderLegend();renderIndicators();renderEditais();
showPage("discover"); // monta o campo já na capa
})();
