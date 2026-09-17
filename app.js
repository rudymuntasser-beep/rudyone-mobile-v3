const BASE='https://aropywroudfriiqbmwhp.supabase.co/functions/v1';
const AUTH=BASE+'/starship-v3-mobile-auth';
const UI=BASE+'/starship-v2-ui/bootstrap.js';
const UIBASE=BASE+'/starship-v2-ui';
const DK='sv3_device',SK='sv2',PK='sv2_persist';
const BOOT_TIMEOUT_MS=12000;
const boot=document.getElementById('boot');
const gate=document.getElementById('gate');
const error=document.getElementById('error');
const code=document.getElementById('code');
const enter=document.getElementById('enter');
const err=document.getElementById('err');
const errtxt=document.getElementById('errtxt');
const retry=document.getElementById('retry');
const nativeFetch=window.fetch.bind(window);
let renewing=false;
let bootTimer=setTimeout(()=>showError('Apertura troppo lenta. Tocca RIPROVA.'),BOOT_TIMEOUT_MS);
function stage(msg){if(boot)boot.textContent=msg}
function doneBoot(){clearTimeout(bootTimer)}
function saveSession(t){sessionStorage.setItem(SK,t);localStorage.setItem(PK,t)}
function clearSession(){sessionStorage.removeItem(SK);localStorage.removeItem(PK)}
function showGate(msg=''){doneBoot();clearSession();boot.style.display='none';error.style.display='none';gate.style.display='grid';err.textContent=msg;enter.disabled=false;try{code.focus()}catch{}}
function showError(msg){doneBoot();boot.style.display='none';gate.style.display='none';error.style.display='grid';errtxt.textContent=msg||'Riprova tra poco. Il telefono resta autorizzato.'}
async function fetchWithTimeout(url,opts={},ms=8000){const c=new AbortController();const t=setTimeout(()=>c.abort(),ms);try{return await nativeFetch(url,{...opts,signal:c.signal})}finally{clearTimeout(t)}}
async function sessionFromDevice(){const d=localStorage.getItem(DK);if(!d)return {kind:'NO_DEVICE'};stage('STARSHIP · VERIFICA TELEFONO…');try{const r=await fetchWithTimeout(AUTH+'/session',{method:'POST',headers:{authorization:'Bearer '+d,'content-type':'application/json'},cache:'no-store'});const z=await r.json().catch(()=>({}));if(r.status===401){localStorage.removeItem(DK);clearSession();return {kind:'REVOKED'}}if(!r.ok||!z.session_token)return {kind:'TEMP',message:z.error||('HTTP '+r.status)};saveSession(z.session_token);return {kind:'OK'}}catch(e){return {kind:'TEMP',message:e?.name==='AbortError'?'timeout autenticazione':(e?.message||String(e))}}}
async function enroll(){const v=String(code.value||'').trim();if(!v)return;enter.disabled=true;err.textContent='';try{const r=await fetchWithTimeout(AUTH+'/enroll',{method:'POST',headers:{'x-pair-code':v,'content-type':'application/json'},cache:'no-store'});const z=await r.json().catch(()=>({}));if(!r.ok||!z.device_token||!z.session_token)throw Error(z.error||'Abbinamento non riuscito');localStorage.setItem(DK,z.device_token);saveSession(z.session_token);location.replace(location.pathname)}catch(e){err.textContent=e?.message||'Abbinamento non riuscito';enter.disabled=false}}
async function loadUI(){stage('STARSHIP · CARICAMENTO PLANCIA…');try{const r=await fetchWithTimeout(UI+'?v=mobilev3-pages2',{cache:'no-store'},8000);if(!r.ok)throw Error('UI HTTP '+r.status);let js=await r.text();js=js.replaceAll('__BASE__',UIBASE);if(js.includes('__BASE__'))throw Error('UI base non risolta');const blob=new Blob([js],{type:'application/javascript'});const src=URL.createObjectURL(blob);const s=document.createElement('script');s.src=src;s.onload=()=>{doneBoot();URL.revokeObjectURL(src);try{boot.remove()}catch{}};s.onerror=()=>{URL.revokeObjectURL(src);showError('Errore apertura Ponte di Comando')};document.body.appendChild(s)}catch(e){showError('Errore apertura Ponte: '+(e?.message||e))}}
window.fetch=async(...args)=>{const r=await nativeFetch(...args);if(r.status!==401||renewing)return r;let msg='';try{const z=await r.clone().json();msg=String(z?.error||'').toLowerCase()}catch{}if(!msg.includes('sessione non valida'))return r;renewing=true;const q=await sessionFromDevice();if(q.kind==='OK'){location.reload();return r}renewing=false;if(q.kind==='REVOKED'||q.kind==='NO_DEVICE')showGate('Telefono da abbinare');else showError('Sessione non rinnovabile al momento. '+(q.message||''));return r};
retry.onclick=()=>location.reload();
enter.onclick=enroll;
code.addEventListener('keydown',e=>{if(e.key==='Enter')enroll()});
(async()=>{try{if(new URLSearchParams(location.search).get('reset')==='1'){localStorage.removeItem(DK);clearSession()}const q=await sessionFromDevice();if(q.kind==='OK')return loadUI();if(q.kind==='NO_DEVICE'||q.kind==='REVOKED')return showGate();showError('Starship non raggiungibile. Il telefono resta autorizzato. '+(q.message||''))}catch(e){showError('Errore avvio: '+(e?.message||e))}})();
