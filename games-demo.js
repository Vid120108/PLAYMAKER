// RETOS DE EJEMPLO SIN VERIFICAR. Solo sirven para el prototipo.
// En la Fase 3 los retos y sus respuestas saldrán de la base de datos del servidor
// y este archivo desaparecerá (las respuestas no deben estar en el código público).
const GAMES={
pc:{name:"Player Career",desc:"Adivina al futbolista por los clubes de su carrera.",
 ch:{prompt:"¿Quién es este jugador?",clues:["Malmö FF","Ajax","Juventus","Inter","Barcelona","Milan","PSG","Manchester United","LA Galaxy"],fields:[{l:"Jugador",a:["zlatan","ibrahimovic","zlatan ibrahimovic"]}]}},
tr:{name:"Trophy Room",desc:"Adivina quién ganó cada título en cada año.",
 ch:{prompt:"¿Quién ganó cada premio?",clues:[],fields:[{l:"Balón de Oro 2008",a:["cristiano ronaldo","ronaldo","cristiano"]},{l:"Balón de Oro 2009",a:["messi","lionel messi"]},{l:"Balón de Oro 2018",a:["modric","luka modric"]},{l:"Champions League 2005 (equipo)",a:["liverpool","liverpool fc"]}]}},
xi:{name:"All-Time XI",desc:"Completa el once histórico escribiendo cada nombre.",
 ch:{prompt:"Once de ejemplo (se sustituirá por un once real verificado)",clues:[],lines:[1,4,2,3,1],fields:[{l:"POR",a:["casillas","iker casillas"]},{l:"LD",a:["ramos","sergio ramos"]},{l:"DFC",a:["pique","gerard pique"]},{l:"DFC",a:["puyol","carles puyol"]},{l:"LI",a:["capdevila","joan capdevila"]},{l:"MCD",a:["busquets","sergio busquets"]},{l:"MC",a:["xabi alonso","alonso"]},{l:"MC",a:["xavi","xavi hernandez"]},{l:"MC",a:["iniesta","andres iniesta"]},{l:"EXT",a:["pedro"]},{l:"DEL",a:["villa","david villa"]}]}}
};
