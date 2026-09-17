const OFFICERS={
  DATA:{role:'Flussi · code · diagnostica',what:'Data sorveglia il movimento del lavoro nella nave: ingressi, code, anomalie e coerenza dei flussi.',why:'È il riferimento quando vuoi capire dove il lavoro sta rallentando, accumulandosi o deviando dal percorso previsto.'},
  WORF:{role:'Fuoco · Arsenale · P3 · sicurezza',what:'Worf presidia la preparazione al fuoco, l’Arsenale, P3 e i blocchi di sicurezza prima dell’invio.',why:'È il riferimento quando vuoi sapere cosa è pronto, cosa non deve partire e se le autorizzazioni di fuoco sono corrette.'},
  UHURA:{role:'FORM · comunicazioni · risposte',what:'Uhura presidia le comunicazioni operative: FORM, segnali in arrivo, risposte e risultati esterni.',why:'È il riferimento quando vuoi sapere cosa stiamo inviando tramite form e cosa ci sta rispondendo il mercato.'},
  SCOTTY:{role:'Worker · motore · infrastruttura',what:'Scotty presidia la parte tecnica che fa muovere la nave: worker, runtime, collegamenti e guasti tecnici.',why:'È il riferimento quando una corsia è corretta ma non procede per un problema tecnico.'},
  SPOCK:{role:'Logica · qualità · contraddittorio',what:'Spock presidia i controlli logici e qualitativi, inclusi i confronti e i casi che richiedono ragionamento prima di avanzare.',why:'È il riferimento quando il problema non è tecnico ma riguarda qualità, confronto o coerenza della decisione.'}
};

const OWNER={
  crm:'DATA',p1:'DATA',p2:'DATA',p22:'DATA',p11:'DATA',
  hold:'SPOCK',
  auto:'UHURA',captcha:'UHURA',login:'UHURA',serve:'UHURA',
  tech:'SCOTTY',
  arsenale:'WORF',rack_aziende:'WORF',rack_careers:'WORF',rack_hh:'WORF',rack_hh_star:'WORF',p3:'WORF',targeted:'WORF',
  sent_targeted:'UHURA',sent_generic:'UHURA',positive:'UHURA',interviews:'UHURA'
};

const GROUP_OWNER={flow:'DATA',alerts:'DATA',forms:'UHURA',weapons:'WORF',results:'UHURA'};

export function officerForMetric(key=''){return OWNER[key]||'DATA'}
export function officerForGroup(group=''){return GROUP_OWNER[group]||'DATA'}
export function officerInfo(name='DATA'){return {name,...(OFFICERS[name]||OFFICERS.DATA)}}
