import {interpretCommand} from './command-core.js?v=1';

export function initCommanderConsole({getDashboard,openOfficer,openMetric,renderGroup}){
  const $=id=>document.getElementById(id);
  const input=$('commandInput'),send=$('sendCommand'),mic=$('micBtn'),confirmBox=$('confirmBox'),confirmText=$('confirmText'),cancel=$('cancelCommand'),confirm=$('confirmCommand'),cont=$('continueCommand'),clear=$('clearConversation'),conversation=$('conversation');
  if(!input||!send||!mic||!confirmBox||!confirmText||!cancel||!confirm||!cont||!clear||!conversation)return;
  let pending=null,recognition=null,listening=false;
  function addMessage(role,text){const d=document.createElement('div');d.className='msg '+(role==='commander'?'commander':'ship');const b=document.createElement('b');b.textContent=role==='commander'?'COMANDANTE RUDY':'STARSHIP';d.appendChild(b);d.append(document.createTextNode(text));conversation.appendChild(d);conversation.scrollTop=conversation.scrollHeight}
  function resetPending(){pending=null;confirmBox.hidden=true;confirmText.textContent=''}
  function stage(text){const raw=String(text||'').trim();if(!raw)return;addMessage('commander',raw);input.value='';const cmd=interpretCommand(raw);if(cmd.type==='UNKNOWN'){addMessage('ship','Questo ordine non è ancora collegato. Puoi riformularlo o proseguire la conversazione.');resetPending();return}if(cmd.type==='EMPTY'){resetPending();return}pending=cmd;confirmText.textContent=cmd.label;confirmBox.hidden=false}
  function shipReport(){const d=getDashboard?.()||{};const f=d.fire||{};const metrics=d.metrics||[];const serve=metrics.find(m=>m.key==='serve')?.count||0;const p2=metrics.find(m=>m.key==='p2')?.count||0;const p3=metrics.find(m=>m.key==='p3')?.count||0;return `EMAIL ${f.master?'ON':'OFF'} · FORM ${f.form?'ON':'OFF'} · RUNTIME ${f.runtime?'ON':'OFF'} · P2 ${p2} · P3 ${p3} · SERVE RUDY ${serve}.`}
  async function execute(){if(!pending)return;const cmd=pending;resetPending();try{if(cmd.type==='REPORT_SHIP'){addMessage('ship',shipReport());return}if(cmd.type==='OPEN_OFFICER'){openOfficer(cmd.officer);addMessage('ship',`${cmd.officer} aperto.`);return}if(cmd.type==='OPEN_ALERTS'){renderGroup('alerts');addMessage('ship','Allarmi e anomalie aperti.');return}if(cmd.type==='OPEN_SERVE_RUDY'){renderGroup('forms');openMetric('serve');addMessage('ship','Serve Rudy aperto.');return}if(cmd.type==='OPEN_METRIC'){openMetric(cmd.key);addMessage('ship',`${cmd.key.toUpperCase()} aperto.`);return}addMessage('ship','Ordine non disponibile.')}catch(e){addMessage('ship','Errore nell’esecuzione: '+(e?.message||String(e)))}}
  send.addEventListener('click',()=>stage(input.value));
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();stage(input.value)}});
  cancel.addEventListener('click',()=>{resetPending();input.value='';addMessage('ship','Ordine cancellato.');input.focus()});
  confirm.addEventListener('click',execute);
  cont.addEventListener('click',()=>{resetPending();input.focus()});
  clear.addEventListener('click',()=>{conversation.innerHTML='<div class="msg ship"><b>STARSHIP</b>Conversazione pulita. Console pronta.</div>';resetPending();input.value='';input.focus()});
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){mic.disabled=true;mic.textContent='MICROFONO NON DISPONIBILE';}
  else{recognition=new SR();recognition.lang='it-IT';recognition.interimResults=false;recognition.maxAlternatives=1;recognition.onstart=()=>{listening=true;mic.classList.add('active');mic.textContent='ASCOLTO…'};recognition.onend=()=>{listening=false;mic.classList.remove('active');mic.textContent='🎙 MICROFONO'};recognition.onerror=e=>addMessage('ship','Microfono: '+(e.error||'errore'));recognition.onresult=e=>{const t=e.results?.[0]?.[0]?.transcript||'';input.value=t;stage(t)};mic.addEventListener('click',()=>{if(listening)recognition.stop();else recognition.start()})}
}
