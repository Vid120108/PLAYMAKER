// Ejecutar con: node tests/engine.test.js
const E=require('../js/engine.js');
let ok=0,bad=0;const t=(n,c)=>{c?ok++:(bad++,console.log('FALLA',n));};
const F=[{a:['messi']},{a:['xavi','xavi hernandez']}];
const A=(a,b)=>[a,b];
const mk=()=>E.fresh();
let s=mk();const D='2026-10-17',D2='2026-10-18';
t('inicia',E.start(s,D,'pc',1,2).ok);
t('no repite misma modalidad',E.start(s,D,'pc',0,0).err==='already');
t('config bloqueada',E.rec(s,D,'pc').d===1&&E.rec(s,D,'pc').f===2);
t('otra modalidad ok',E.start(s,D,'tr',0,0).ok);
t('config invalida',!E.start(s,D,'xi',9,0).ok&&!E.start(s,D,'zz',0,0).ok);
// vacío no cuenta
t('vacio no cuenta',E.check(s,D,'pc',['',''],F).err==='empty'&&E.rec(s,D,'pc').fails===0);
// max 3: 3 fallos siguen, 4º pierde
for(let i=0;i<3;i++)E.check(s,D,'pc',['x',''],F);
t('3 fallos sigue',E.rec(s,D,'pc').st==='playing'&&E.rec(s,D,'pc').fails===3);
let r=E.check(s,D,'pc',['x',''],F);
t('4º fallo pierde',r.st==='lost'&&s.streak.pc===0);
t('tras perder no se puede comprobar',E.check(s,D,'pc',['messi','xavi'],F).err==='closed');
t('tras perder no se puede rendir',E.giveUp(s,D,'pc').err==='closed');
// sin fallos
t('sin fallos: 1 fallo pierde',E.check(s,D,'tr',['x',''],F).st==='lost');
// 1 fallo
s=mk();E.start(s,D,'pc',0,1);E.check(s,D,'pc',['x',''],F);
t('1 fallo permitido',E.rec(s,D,'pc').st==='playing');
t('2º pierde',E.check(s,D,'pc',['x',''],F).st==='lost');
// infinitos
s=mk();E.start(s,D,'pc',2,4);for(let i=0;i<200;i++)E.check(s,D,'pc',['x',''],F);
t('infinitos: 200 fallos sigue',E.rec(s,D,'pc').st==='playing'&&E.rec(s,D,'pc').fails===200);
r=E.check(s,D,'pc',['MESSI','Xavi Hernández'],F);
t('infinitos: acierta con tildes/mayúsculas',r.st==='won'&&s.streak.pc===1);
t('infinitos sobrevive a JSON',E.rec(JSON.parse(JSON.stringify(s)),D,'pc').max===null);
// parcial: no penaliza lo en blanco
s=mk();E.start(s,D,'xi',0,1);r=E.check(s,D,'xi',['messi',''],F);
t('parcial correcto no penaliza',r.st==='playing'&&E.rec(s,D,'xi').fails===0&&E.rec(s,D,'xi').ok[0]===1);
r=E.check(s,D,'xi',['',''],F);t('campo resuelto no se reevalúa',r.err==='empty');
r=E.check(s,D,'xi',['','xavi'],F);t('completar gana',r.st==='won');
// rendirse
s=mk();s.streak.pc=4;s.streak.tr=2;E.start(s,D,'pc',0,2);
t('rendirse resetea solo su racha',E.giveUp(s,D,'pc').st==='gaveup'&&s.streak.pc===0&&s.streak.tr===2);
// marcador
s=mk();E.start(s,D,'pc',0,4);E.start(s,D,'tr',0,4);E.start(s,D,'xi',0,4);
E.check(s,D,'pc',['messi','xavi'],F);E.giveUp(s,D,'tr');
t('marcador 1-1 con xi en curso',JSON.stringify(E.scoreOf(s,D))==='{"w":1,"l":1}');
// cambio de día
t('día nuevo marcador a 0',JSON.stringify(E.scoreOf(s,D2))==='{"w":0,"l":0}');
t('día nuevo permite iniciar',E.start(s,D2,'pc',2,0).ok);
E.check(s,D2,'pc',['messi','xavi'],F);
t('racha sigue y suma al día siguiente',s.streak.pc===2);
t('ayer intacto',E.rec(s,D,'pc').st==='won');
// persistencia
const mem={};const st={getItem:k=>mem[k]??null,setItem:(k,v)=>{mem[k]=v}};
s=mk();E.start(s,D,'xi',1,2);E.check(s,D,'xi',['messi','x'],F);E.save(st,s);
const s2=E.load(st);
t('persistencia: reanuda con fallos y aciertos',E.rec(s2,D,'xi').fails===1&&E.rec(s2,D,'xi').ok[0]===1&&E.rec(s2,D,'xi').f===2);
t('persistencia: no permite reiniciar',E.start(s2,D,'xi',0,0).err==='already');
mem[E.KEY]='{corrupto';t('JSON corrupto -> estado limpio',E.load(st).streak.pc===0);
mem[E.KEY]='{"v":1,"streak":{},"days":5}';t('estructura inválida -> limpio',typeof E.load(st).days==='object'&&E.load(st).days!==5);
// poda
s=mk();for(let i=1;i<=40;i++)E.start(s,'2026-09-'+String(i).padStart(2,'0'),'pc',0,0);
t('poda historial a 30 días',Object.keys(s.days).length===30);
console.log(ok+' correctas, '+bad+' fallidas');process.exit(bad?1:0);
