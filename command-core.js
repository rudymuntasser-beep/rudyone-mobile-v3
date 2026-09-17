export function normalizeCommand(input=''){
  return String(input).trim().replace(/\s+/g,' ').toLowerCase();
}

export function interpretCommand(input=''){
  const text=normalizeCommand(input);
  if(!text) return {type:'EMPTY',label:'',requiresConfirmation:false};
  if(/\b(report|rapporto)\b.*\bnave\b|\bstato nave\b/.test(text)) return {type:'REPORT_SHIP',label:'Mostra report nave',requiresConfirmation:true};
  const officerMap=[['data','DATA'],['worf','WORF'],['uhura','UHURA'],['spock','SPOCK'],['scotty','SCOTTY']];
  for(const [word,name] of officerMap){
    if(text.includes(word) && /(apri|mostra|vai|fammi vedere|parla|chiama)/.test(text)) return {type:'OPEN_OFFICER',officer:name,label:`Apri ${name}`,requiresConfirmation:true};
  }
  if(/\ballarm/.test(text) || /\banomal/.test(text)) return {type:'OPEN_ALERTS',label:'Apri allarmi e anomalie',requiresConfirmation:true};
  if(/serve rudy|captcha|login/.test(text)) return {type:'OPEN_SERVE_RUDY',label:'Apri Serve Rudy',requiresConfirmation:true};
  if(/\bp2\b/.test(text)) return {type:'OPEN_METRIC',key:'p2',label:'Apri P2',requiresConfirmation:true};
  if(/\bp3\b/.test(text)) return {type:'OPEN_METRIC',key:'p3',label:'Apri P3',requiresConfirmation:true};
  return {type:'UNKNOWN',label:'Comando non riconosciuto',requiresConfirmation:false};
}

export function conversationEntry(role,text){
  return {role,text:String(text||''),at:new Date().toISOString()};
}
