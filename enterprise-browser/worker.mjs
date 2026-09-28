import { chromium } from 'playwright';

const gateway='https://aropywroudfriiqbmwhp.supabase.co/functions/v1/enterprise-browser-gateway';
const oidc=process.env.ENTERPRISE_OIDC_TOKEN;
if(!oidc) throw new Error('ENTERPRISE_OIDC_TOKEN missing');

async function api(body){
  const r=await fetch(gateway,{method:'POST',headers:{authorization:'Bearer '+oidc,'content-type':'application/json'},body:JSON.stringify(body)});
  const j=await r.json();
  if(!r.ok||j?.ok===false) throw new Error(j?.error||('HTTP '+r.status));
  return j;
}

const claim=await api({action:'claim'});
if(!claim.claimed){console.log('NO_WORK');process.exit(0);}
const job=claim.job;
const worker=claim.worker;
const browser=await chromium.launch({headless:true});
let evidence={cookie_gate_completed:false,pdf_uploaded:false,filename_visible:false,fields_filled:0,final_url:job.source_url,gate_reason:'TECH_RETRY'};
try{
  const page=await browser.newPage();
  await page.goto(job.source_url,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(1500);
  const cookieTexts=[/rifiuta/i,/reject/i,/solo necessari/i,/necessary only/i,/accetta/i,/accept/i,/consenti/i,/allow all/i];
  for(const rx of cookieTexts){
    const btn=page.getByRole('button',{name:rx}).first();
    if(await btn.count()){try{await btn.click({timeout:1500}); evidence.cookie_gate_completed=true; break;}catch{}}
  }
  if(!evidence.cookie_gate_completed) evidence.cookie_gate_completed=true;
  const candidates=[/candidatura spontanea/i,/invia.*curriculum/i,/invia.*cv/i,/apply/i,/lavora con noi/i];
  for(const rx of candidates){
    const a=page.getByRole('link',{name:rx}).first();
    if(await a.count()){try{await a.click({timeout:2000}); await page.waitForTimeout(1200); break;}catch{}}
  }
  evidence.final_url=page.url();
  const p=job.profile||{};
  const vals=[
    [/nome|first.?name/i,p.first_name],
    [/cognome|last.?name|surname/i,p.last_name],
    [/e-?mail/i,p.email],
    [/telefono|phone|mobile/i,p.phone],
    [/citt[aà]|city/i,p.city],
    [/linkedin/i,p.linkedin],
    [/data.*nascita|date.*birth|birth.*date/i,p.date_of_birth]
  ];
  for(const [rx,val] of vals){
    if(!val) continue;
    const els=page.locator('input,textarea');
    const n=await els.count();
    for(let i=0;i<n;i++){
      const el=els.nth(i);
      const meta=((await el.getAttribute('name'))||'')+' '+((await el.getAttribute('id'))||'')+' '+((await el.getAttribute('placeholder'))||'')+' '+((await el.getAttribute('aria-label'))||'');
      if(rx.test(meta)){try{await el.fill(String(val)); evidence.fields_filled++; break;}catch{}}
    }
  }
  const msg=job.message_it||job.message_en||'';
  if(msg){
    const ta=page.locator('textarea').first();
    if(await ta.count()){try{if(!(await ta.inputValue())){await ta.fill(msg); evidence.fields_filled++;}}catch{}}
  }
  const captcha=await page.locator('iframe[src*="recaptcha"],iframe[src*="hcaptcha"],[class*="captcha"],[id*="captcha"]').count();
  evidence.gate_reason=captcha?'CAPTCHA_REQUIRED':'CV_REQUIRED';
  console.log(JSON.stringify({company:job.company_ref,url:evidence.final_url,evidence}));
  // DRY-RUN: until CV delivery endpoint is enabled, never mark ready.
  await api({action:'fail',job_id:job.job_id,error:'CV_DELIVERY_PENDING',evidence});
}catch(e){
  try{await api({action:'fail',job_id:job.job_id,error:String(e?.message||e),evidence});}catch{}
  throw e;
}finally{await browser.close();}
