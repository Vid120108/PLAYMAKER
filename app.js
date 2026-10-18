// INTERFAZ de PLAYMAKER: pantallas y eventos. Usa engine.js y games-demo.js.
let store,persist=true;
try{localStorage.setItem("pm:t","1");localStorage.removeItem("pm:t");store=localStorage}catch(e){const m={};store={getItem:k=>m[k]||null,setItem:(k,v)=>{m[k]=v}};persist=false}
const S=load(store),$=s=>document.querySelector(s),app=$("#app");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const best=a=>a.reduce((x,y)=>y.length>x.length?y:x);
const cfgText=r=>DIFF[r.d]+" · "+(r.max===null?"fallos infinitos":r.max===0?"sin fallos":r.max+(r.max==1?" fallo":" fallos"));
let curDay=dayOf(),view="home";
const commit=()=>save(store,S);
function score(){const c=scoreOf(S,dayOf());$("#sw").textContent=c.w;$("#sl").textContent=c.l}
function home(){
 view="home";curDay=dayOf();score();
 const day=new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"});
 app.innerHTML=`<section class="hero"><h1>PLAY<span>MAKER</span></h1><p>Tres retos de fútbol al día. Uno por modalidad, el mismo para todos.</p></section>
 <div class="demo">${persist?"Tus rachas y resultados se guardan solo en este navegador y dispositivo; no se sincronizan.":"Tu navegador bloquea el guardado: el progreso se perderá al cerrar la página."} Los retos son ejemplos sin verificar.</div>
 <h2>Retos de hoy · ${esc(day)}</h2><div class="cards">`+MODES.map(k=>{
  const g=GAMES[k],r=rec(S,curDay,k),n=S.streak[k];
  const tag=!r?"Pendiente · elige dificultad y fallos":r.st==="playing"?"En curso · "+cfgText(r)+" · pulsa para continuar":(r.st==="won"?"Victoria":r.st==="lost"?"Derrota":"Rendido")+" · "+cfgText(r);
  return `<button class="card" data-g="${k}" ${r&&r.st!=="playing"?"disabled":""}><h3>${g.name}</h3><p>${g.desc}</p>
  <span class="streak">Racha: ${n} ${n==1?"día":"días"}</span><span class="tag">${tag}</span></button>`}).join("")+"</div>";
 app.querySelectorAll(".card").forEach(c=>c.onclick=()=>{const k=c.dataset.g,r=rec(S,curDay,k);r?play(k,curDay):setup(k)});
}
function chips(name,arr,sel){return `<div class="chips" data-n="${name}">`+arr.map((x,i)=>`<button class="chip" aria-pressed="${i==sel}" data-i="${i}">${Array.isArray(x)?x[0]:x}</button>`).join("")+"</div>"}
function setup(k){
 view="setup";const g=GAMES[k],cfg={d:0,f:2};
 app.innerHTML=`<button class="back" id="bk">← Volver</button><h2>${g.name}</h2>
 <p class="lives">Solo puedes jugar una configuración de esta modalidad hoy. Al empezar no podrás cambiarla ni repetir el reto.</p>
 <div class="grp"><b>Dificultad</b>${chips("d",DIFF,0)}</div>
 <div class="grp"><b>Fallos permitidos</b>${chips("f",FAILS,2)}</div>
 <div class="row"><button class="btn" id="go">Empezar reto</button></div>`;
 $("#bk").onclick=home;
 app.querySelectorAll(".chips").forEach(box=>box.onclick=e=>{const b=e.target.closest(".chip");if(!b)return;cfg[box.dataset.n]=+b.dataset.i;box.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed",c==b))});
 $("#go").onclick=()=>{const r=start(S,dayOf(),k,cfg.d,cfg.f);if(!r.ok)return home();commit();play(k,dayOf())};
}
function field(f,i){return `<div class="f"><label for="i${i}">${esc(f.l)}</label><input id="i${i}" autocomplete="off" autocapitalize="off" spellcheck="false"></div>`}
function play(k,date){
 view="play";const g=GAMES[k],c=g.ch,r=rec(S,date,k);let body;
 if(c.lines){let i=0;body=`<div class="pitch">`+c.lines.map(n=>`<div class="line" style="--n:${n}">`+Array.from({length:n},()=>field(c.fields[i],i++)).join("")+"</div>").join("")+"</div>"}
 else body=c.fields.map(field).join("");
 app.innerHTML=`<button class="back" id="bk">← Salir (el reto queda guardado)</button><h2>${g.name} · ${cfgText(r)}</h2>
 <p>${esc(c.prompt)}</p>${c.clues.length?`<div class="clues">${c.clues.map(x=>`<span>${esc(x)}</span>`).join("")}</div>`:""}
 ${body}<p class="lives" id="lv"></p><div class="row"><button class="btn" id="chk">Comprobar</button><button class="btn alt" id="giveup">Rendirme</button></div><p class="lives" id="hint"></p><div id="out"></div>`;
 $("#bk").onclick=home;
 c.fields.forEach((f,i)=>{if(r.ok[i]){const el=$("#i"+i);el.value=best(f.a);el.className="ok";el.readOnly=true}});
 const doCheck=()=>{const ans=c.fields.map((f,i)=>$("#i"+i).value);const x=check(S,date,k,ans,c.fields);
  if(!x.ok){$("#hint").textContent=x.err==="empty"?"Escribe al menos una respuesta antes de comprobar.":"";return}
  commit();$("#hint").textContent="";
  c.fields.forEach((f,i)=>{const el=$("#i"+i);if(x.res[i]==="ok"){el.className="ok";el.readOnly=true}else if(x.res[i]==="bad")el.className="bad"});
  r.st==="playing"?lives(r):end(k,date)};
 $("#chk").onclick=doCheck;
 app.querySelectorAll("input").forEach(i=>i.addEventListener("keydown",e=>{if(e.key==="Enter")doCheck()}));
 let armed=false;const gu=$("#giveup");
 gu.onclick=()=>{if(!armed){armed=true;gu.textContent="Confirmar rendición";setTimeout(()=>{armed=false;gu.textContent="Rendirme"},4000);return}giveUp(S,date,k);commit();end(k,date)};
 r.st==="playing"?lives(r):end(k,date);
}
function lives(r){$("#lv").textContent=r.max===null?"Fallos: "+r.fails+" (infinitos permitidos)":"Fallos: "+r.fails+" de "+r.max}
function end(k,date){
 const r=rec(S,date,k),g=GAMES[k],win=r.st==="won";score();lives(r);
 let sol="";
 if(!win){g.ch.fields.forEach((f,i)=>{if(!r.ok[i]){const el=$("#i"+i);el.value=best(f.a);el.className="bad"}});sol=" La solución se muestra en los campos."}
 app.querySelectorAll("input").forEach(i=>i.readOnly=true);$("#chk").disabled=$("#giveup").disabled=true;
 $("#out").innerHTML=`<div class="msg ${win?"win":"lose"}">${win?"¡Victoria! Tu racha sube a "+S.streak[k]+".":(r.st==="gaveup"?"Te has rendido.":"Has superado el límite de fallos.")+" Tu racha vuelve a 0."+sol}</div><div class="row"><button class="btn" id="hm">Volver al inicio</button></div>`;
 $("#hm").onclick=home;
}
$("#home").onclick=home;
const tick=()=>{if(dayOf()!==curDay){score();if(view!=="play")home()}};
setInterval(tick,30000);document.addEventListener("visibilitychange",tick);
home();
