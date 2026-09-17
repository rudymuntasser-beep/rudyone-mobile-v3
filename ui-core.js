export function groupMetrics(metrics=[]){const out={};for(const m of metrics){const g=String(m?.group||'other');(out[g] ||= []).push(m)}return out}
export function toneClass(tone='INFO'){const t=String(tone||'INFO').toUpperCase();if(t==='OK')return'tone-ok';if(t==='WARN'||t==='WAIT')return'tone-warn';if(t==='ERROR')return'tone-error';if(t==='RUDY')return'tone-rudy';return'tone-info'}
export function formatFire(fire={}){return `EMAIL ${fire.master?'ON':'OFF'} · FORM ${fire.form?'ON':'OFF'} · RUNTIME ${fire.runtime?'ON':'OFF'}`}
export function metricByKey(metrics=[],key=''){return metrics.find(m=>m?.key===key)||null}
