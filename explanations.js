const COPY={
  crm:{what:'Serbatoio delle aziende ancora da qualificare.',why:'Sono aziende disponibili che non hanno ancora completato il percorso di valutazione.',actions:['Apri elenco','Chiedi a GPT','Prepara ordine']},
  p1:{what:'Raccolta dei dati di base prima della valutazione.',why:'Qui vengono completati i dati minimi necessari prima che l’azienda possa avanzare.',actions:['Apri elenco','Chiedi a GPT','Prepara ordine']},
  p2:{what:'Aziende realmente in lavorazione nella valutazione P2.',why:'Il numero rappresenta solo aziende QUEUED o IN_REVIEW; gli HOLD 5→2 sono separati.',actions:['Apri elenco','Chiedi a GPT','Prepara ordine']},
  hold:{what:'Aziende valide rimaste fuori dal top 2 del confronto corrente.',why:'Attendono un nuovo gruppo completo; non sono ferme per errore.',actions:['Apri elenco','Chiedi a GPT']},
  p22:{what:'Officina delle anomalie vere emerse da P2.',why:'Qui entrano problemi operativi reali; gli HOLD 5→2 non sono conteggiati.',actions:['Apri anomalie','Chiedi a GPT','Prepara ordine']},
  p11:{what:'Recovery tecnico per casi che richiedono recupero o verifica.',why:'Contiene soltanto record ancora attivi nel recupero.',actions:['Apri recovery','Chiedi a GPT','Prepara ordine']},
  tech:{what:'Form con un errore tecnico da riparare.',why:'Non richiedono Rudy: il blocco è tecnico, non umano.',actions:['Apri form','Chiedi a GPT','Prepara ordine']},
  auto:{what:'Form pronte per il percorso automatico.',why:'Non hanno CAPTCHA, login o altro gate umano.',actions:['Apri form','Chiedi a GPT','Prepara ordine']},
  captcha:{what:'Form che richiedono intervento umano sul CAPTCHA.',why:'Il browser non può superare autonomamente questo gate.',actions:['Apri Serve Rudy','Chiedi a GPT']},
  login:{what:'Form che richiedono account, login o verifica umana.',why:'Il percorso è valido ma necessita di un passaggio umano.',actions:['Apri Serve Rudy','Chiedi a GPT']},
  serve:{what:'Tutto ciò che richiede davvero Rudy.',why:'Comprende CAPTCHA, login o altri gate umani non delegabili.',actions:['Apri Serve Rudy','Chiedi a GPT']},
  arsenale:{what:'Pacchetti in preparazione nell’Arsenale.',why:'Sono candidature in lavorazione, non ancora pronte per il fuoco.',actions:['Apri Arsenale','Chiedi a GPT']},
  rack_aziende:{what:'Candidature aziende complete e pronte nella rastrelliera.',why:'Sono conteggiati solo i record READY o READY_TO_FIRE.',actions:['Apri rastrelliera','Chiedi a GPT','Prepara ordine']},
  rack_careers:{what:'Candidature CAREERS complete e pronte nella rastrelliera.',why:'Sono conteggiati solo i record realmente eseguibili.',actions:['Apri rastrelliera','Chiedi a GPT','Prepara ordine']},
  rack_hh:{what:'Candidature headhunter complete e pronte.',why:'La corsia HH resta separata dalle altre candidature.',actions:['Apri rastrelliera','Chiedi a GPT','Prepara ordine']},
  rack_hh_star:{what:'Candidature HH★ complete e pronte.',why:'La corsia HH★ ha priorità e regole dedicate.',actions:['Apri rastrelliera','Chiedi a GPT','Prepara ordine']},
  p3:{what:'Revisione finale prima del fuoco.',why:'Qui arrivano soltanto pacchetti completi usciti dal Magazzino.',actions:['Apri P3','Chiedi a GPT','Prepara ordine']},
  targeted:{what:'Candidature email complete e pronte al fuoco.',why:'Il pacchetto ha superato le verifiche necessarie.',actions:['Apri pronte','Chiedi a GPT','Prepara ordine']},
  sent_targeted:{what:'Candidature mirate inviate nelle ultime 24 ore.',why:'Conta soltanto invii realmente registrati come SENT.',actions:['Apri invii','Chiedi a GPT']},
  sent_generic:{what:'Messaggi generic referral inviati nelle ultime 24 ore.',why:'Sono separati dalle candidature complete con allegati.',actions:['Apri invii','Chiedi a GPT']},
  positive:{what:'Risposte classificate positive negli ultimi 7 giorni.',why:'È un indicatore di risposta reale del mercato.',actions:['Apri risposte','Chiedi a GPT']},
  interviews:{what:'Colloqui con esito positivo, secondo step o offerta.',why:'Qui non entrano semplici risposte email.',actions:['Apri colloqui','Chiedi a GPT']}
};

export function metricExplanation(m={}){
  const x=COPY[m.key]||{what:'Elemento operativo della nave.',why:'Il suo stato deriva dai dati correnti della corsia.',actions:['Apri dettaglio','Chiedi a GPT']};
  return {
    what:x.what,
    now:`${m.title||m.key||'Elemento'}: ${Number(m.count||0)} · ${m.subtitle||'stato corrente'}.`,
    why:x.why,
    actions:x.actions
  };
}

export function shipExplanation(fire={}){
  return {
    what:'Quadro sintetico dei sistemi di fuoco e del runtime FORM.',
    now:`EMAIL ${fire.master?'ON':'OFF'} · FORM ${fire.form?'ON':'OFF'} · RUNTIME ${fire.runtime?'ON':'OFF'}.`,
    why:'Questi tre stati dicono se il cannone email, il fuoco form e il runtime operativo sono attivi in questo momento.',
    actions:['Chiedi a GPT','Prepara ordine']
  };
}
