(function(){
  "use strict";
  const C=window.RISK_CONFIG, $=s=>document.querySelector(s);
  const form=$("#riskForm"); let currentResult=null;

  function esc(v){return String(v??"").replace(/[&<>\"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
  function attendanceScore(n){if(n<100)return 0;if(n<500)return 1;if(n<=2000)return 2;if(n<=5000)return 3;if(n<=20000)return 4;return 5;}
  function clamp(n){return Math.min(5,Math.max(0,n));}
  function levelFromScore(n){return Math.min(5,Math.max(0,Math.ceil(n-1e-9)));}
  function dateMinus(date,days){const d=new Date(date+"T12:00:00");d.setDate(d.getDate()-days);return new Intl.DateTimeFormat("nl-BE").format(d);}
  function optionFor(id,value){return C.parameters.find(p=>p.id===id).options[Number(value)];}

  function build(){
    C.municipalities.forEach(x=>$("[name=municipality]").insertAdjacentHTML("beforeend",`<option>${esc(x)}</option>`));
    C.parameters.forEach(p=>{$("#parameterFields").insertAdjacentHTML("beforeend",`<label>${esc(p.label)}<select name="${p.id}" required><option value="">Kies een optie</option>${p.options.map((o,i)=>`<option value="${i}">${esc(o.label)}</option>`).join("")}</select></label>`)});
    C.extras.forEach(x=>$("#extraFields").insertAdjacentHTML("beforeend",`<label class="check"><input type="checkbox" name="extra" value="${x.id}"><span>${esc(x.label)}</span></label>`));
  }

  function getData(){const fd=new FormData(form), selected={};C.parameters.forEach(p=>selected[p.id]=Number(fd.get(p.id)));return {eventName:fd.get("eventName"),municipality:fd.get("municipality"),startDate:fd.get("startDate"),attendance:Number(fd.get("attendance")),address:fd.get("address"),parameters:selected,extras:fd.getAll("extra"),otherRisk:fd.get("otherRisk")||""};}
  function analyse(data){
    const base=attendanceScore(data.attendance), raw=[base,base,base], rows=[];
    C.parameters.forEach(p=>{const o=p.options[data.parameters[p.id]];o.scores.forEach((v,i)=>raw[i]+=v);rows.push({parameter:p.label,choice:o.label,scores:o.scores,review:!!o.review});});
    const disciplineScores=raw.map(clamp), disciplineLevels=disciplineScores.map(levelFromScore);
    // Conservatieve multidisciplinaire samenvatting: hoogste discipline-niveau; capaciteit blijft ondergrens.
    const generalLevel=Math.max(base,...disciplineLevels), level=C.levels[generalLevel];
    const advice=[]; const loc=optionFor("location",data.parameters.location), sec=optionFor("security",data.parameters.security), target=optionFor("targetGroup",data.parameters.targetGroup), type=optionFor("eventType",data.parameters.eventType), drink=optionFor("alcoholDrugs",data.parameters.alcoholDrugs), catering=optionFor("catering",data.parameters.catering);
    if(loc.kind!=="proper") advice.push("Een schriftelijke toelating is nodig.");
    if(generalLevel===2&&(loc.kind==="outdoor"||loc.kind==="tent"||loc.kind==="largeTent")) advice.push("Dien een inplantingsplan in.");
    if(loc.kind==="improper") advice.push("Vraag brandweeradvies voor het oneigenlijk gebruik van het lokaal.");
    if(loc.kind==="largeTent") advice.push("Laat de grote tent controleren door de brandweer.");
    if(catering.label.includes("Eigen catering - warm")) advice.push("Volg het sneladvies voor barbecue, vuurkorven en warme catering.");
    if(sec.label==="Eigen leden") advice.push("Bezorg de namen van alle leden met securitytaken aan de lokale politie.");
    if(disciplineScores[0]>2) advice.push("Vraag specifiek brandweeradvies (D1).");
    if(disciplineScores[1]>1) advice.push("Voorzie een EHBO-koffer.");
    if(data.attendance>1200) advice.push("Vraag een PRIMA-advies aan.");
    if(disciplineScores[2]>2) advice.push("Vraag specifiek politieadvies (D3).");
    if(type.label.includes("Fuif")&&drink.label!=="Niet aanwezig") advice.push("Vraag politieadvies voor de fuif en de aanwezigheid van alcohol/drugs.");
    if(target.label==="Risico tot geweld") advice.push("Vraag politieadvies wegens het verhoogde risico op geweld.");
    const extraText={fireworks:"Volg het sneladvies vuurwerk.",openFire:"Volg het sneladvies open vuur.",specialStructures:"Laat speciale constructies beoordelen door de bevoegde discipline.",camping:"Neem camping- en overnachtingsrisico’s op in het veiligheidsplan.",water:"Neem waterveiligheid en reddingsmogelijkheden op in het veiligheidsplan.",weather:"Voorzie een weersmonitoring- en evacuatiescenario."};
    data.extras.forEach(x=>{if(extraText[x])advice.push(extraText[x]);});if(data.extras.includes("other")&&data.otherRisk)advice.push(`Beoordeel bijkomend risico: ${data.otherRisk}.`);
    return {base,raw,disciplineScores,disciplineLevels,generalLevel,level,rows,advice:[...new Set(advice)]};
  }

  function render(data,r){currentResult={generatedAt:new Date().toISOString(),protocol:C.version,event:data,result:r};$("#emptyResult").classList.add("hidden");$("#resultContent").classList.remove("hidden");$("#riskNumber").textContent=r.generalLevel;$("#riskBadge").className=`risk-badge rn-${r.generalLevel}`;$("#resultTitle").textContent=`Risiconiveau ${r.generalLevel} · ${r.level.title}`;$("#resultSummary").textContent=`${r.level.summary} Actie: ${r.level.action}.`;
    $("#disciplineScores").innerHTML=["D1 · Brandweer","D2 · Medisch","D3 · Politie"].map((x,i)=>`<div><span>${x}</span><strong>${r.disciplineScores[i].toFixed(2).replace(".",",")}</strong><small>Niveau ${r.disciplineLevels[i]}</small></div>`).join("");
    $("#measures").innerHTML=(r.level.measures.length?r.level.measures:["Geen minimale multidisciplinaire maatregel volgens het protocol."]).map(x=>`<li>${esc(x)}</li>`).join("");
    $("#quickAdvice").innerHTML=(r.advice.length?r.advice:["Geen bijkomend sneladvies gegenereerd."]).map(x=>`<li>${esc(x)}</li>`).join("");
    const dl=[];if(data.startDate){dl.push(`Melding organisator: uiterlijk ${dateMinus(data.startDate,60)}`);dl.push(`Melding/adviesvraag gemeente: uiterlijk ${dateMinus(data.startDate,50)}`);if(r.generalLevel>=3)dl.push(`Adviezen disciplines: uiterlijk ${dateMinus(data.startDate,30)}`);if(r.generalLevel>=2)dl.push(`Definitieve plannen of dossier: uiterlijk ${dateMinus(data.startDate,5)}`);}$("#deadlines").innerHTML=dl.map(x=>`<li>${esc(x)}</li>`).join("");
    $("#calculation").innerHTML=`<p><strong>Methode:</strong> aanwezigheid bepaalt de basisscore. De protocolgewichten worden per discipline opgeteld, begrensd tot 0–5 en naar boven afgerond. Het algemene niveau is het hoogste discipline-niveau, met de capaciteitsklasse als ondergrens.</p><table><thead><tr><th>Parameter</th><th>Keuze</th><th>D1</th><th>D2</th><th>D3</th></tr></thead><tbody><tr><td>Aanwezigen</td><td>${data.attendance}</td><td colspan="3">${r.base}</td></tr>${r.rows.map(x=>`<tr><td>${esc(x.parameter)}${x.review?' *':''}</td><td>${esc(x.choice)}</td>${x.scores.map(v=>`<td>${String(v).replace('.',',')}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="fine">* De bron bevat bij deze waarde een revisiemarkering of onvolledige cel. Bevestig deze configuratie vóór productiegebruik.</p>`;
    $("#resultPanel").scrollIntoView({behavior:"smooth",block:"start"});
  }
  form.addEventListener("submit",e=>{e.preventDefault();if(!form.reportValidity())return;const d=getData();render(d,analyse(d));});
  form.addEventListener("change",e=>{if(e.target.name==="extra"&&e.target.value==="other")$("#otherWrap").classList.toggle("hidden",!e.target.checked);});
  $("#resetBtn").addEventListener("click",()=>{form.reset();localStorage.removeItem("eventrisk-draft");$("#resultContent").classList.add("hidden");$("#emptyResult").classList.remove("hidden");$("#otherWrap").classList.add("hidden");window.scrollTo({top:0,behavior:"smooth"});});
  $("#saveDraftBtn").addEventListener("click",()=>{const data={};new FormData(form).forEach((v,k)=>{if(k==="extra")(data[k]??=[]).push(v);else data[k]=v;});localStorage.setItem("eventrisk-draft",JSON.stringify(data));alert("Concept lokaal bewaard in deze browser.");});
  $("#printBtn").addEventListener("click",()=>window.print());
  $("#exportBtn").addEventListener("click",()=>{if(!currentResult)return;const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(currentResult,null,2)],{type:"application/json"}));a.download=`eventrisk-${(currentResult.event.eventName||"analyse").toLowerCase().replace(/[^a-z0-9]+/g,"-")}.json`;a.click();URL.revokeObjectURL(a.href);});
  build();
  const draft=JSON.parse(localStorage.getItem("eventrisk-draft")||"null");if(draft)Object.entries(draft).forEach(([k,v])=>{if(k==="extra"){v.forEach(x=>{const el=form.querySelector(`[name=extra][value="${CSS.escape(x)}"]`);if(el)el.checked=true;});}else{const el=form.elements[k];if(el)el.value=v;}});
  window.EventRisk={attendanceScore,levelFromScore,analyse};
})();
