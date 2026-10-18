// MOTOR DE REGLAS de PLAYMAKER (sin interfaz, se puede probar con Node).
// Rachas, un intento por modalidad y día, fallos permitidos, marcador y guardado.
const FAILS=[["Sin fallos",0],["1",1],["3",3],["5",5],["Infinitos",null]];
const DIFF=["Fácil","Media","Difícil"],MODES=["pc","tr","xi"],KEY="playmaker:v1",KEEP=30;
const pad=n=>String(n).padStart(2,"0");
const dayOf=(d=new Date())=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
const fresh=()=>({v:1,streak:{pc:0,tr:0,xi:0},days:{}});
function load(st){try{const s=JSON.parse(st.getItem(KEY));if(s&&s.v===1&&s.streak&&s.days&&typeof s.days==="object")return s}catch(e){}return fresh()}
function save(st,s){try{st.setItem(KEY,JSON.stringify(s));return true}catch(e){return false}}
const rec=(s,date,k)=>(s.days[date]||{})[k]||null;
function scoreOf(s,date){let w=0,l=0;for(const k of MODES){const r=rec(s,date,k);if(!r)continue;if(r.st==="won")w++;else if(r.st==="lost"||r.st==="gaveup")l++}return{w,l}}
function start(s,date,k,d,f){
 if(!MODES.includes(k)||![0,1,2].includes(d)||!FAILS[f])return{ok:false,err:"invalid"};
 if(rec(s,date,k))return{ok:false,err:"already"};
 (s.days[date]=s.days[date]||{})[k]={d,f,max:FAILS[f][1],fails:0,ok:{},st:"playing"};
 Object.keys(s.days).sort().slice(0,-KEEP).forEach(x=>delete s.days[x]);
 return{ok:true}}
function finish(s,date,k,st){const r=rec(s,date,k);r.st=st;s.streak[k]=st==="won"?s.streak[k]+1:0;return{ok:true,st}}
function check(s,date,k,answers,fields){
 const r=rec(s,date,k);if(!r||r.st!=="playing")return{ok:false,err:"closed"};
 let filled=0,wrong=0;const res={};
 fields.forEach((f,i)=>{if(r.ok[i])return;const v=norm(answers[i]||"");if(!v)return;filled++;
  if(f.a.some(a=>norm(a)===v)){r.ok[i]=1;res[i]="ok"}else{wrong++;res[i]="bad"}});
 if(!filled)return{ok:false,err:"empty"};
 if(Object.keys(r.ok).length===fields.length)return Object.assign(finish(s,date,k,"won"),{res});
 if(!wrong)return{ok:true,st:"playing",res};
 r.fails++;
 if(r.max!==null&&r.fails>r.max)return Object.assign(finish(s,date,k,"lost"),{res});
 return{ok:true,st:"playing",res}}
function giveUp(s,date,k){const r=rec(s,date,k);if(!r||r.st!=="playing")return{ok:false,err:"closed"};return finish(s,date,k,"gaveup")}
if(typeof module!=="undefined"&&module.exports)module.exports={FAILS,DIFF,MODES,KEY,fresh,load,save,rec,scoreOf,start,check,giveUp,dayOf,norm};
