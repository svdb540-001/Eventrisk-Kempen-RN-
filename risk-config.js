window.RISK_CONFIG = {
  version: "Protocolakkoord werkdocument v2.3",
  municipalities: ["Balen","Dessel","Geel","Grobbendonk","Herentals","Herenthout","Herselt","Hulshout","Laakdal","Meerhout","Mol","Olen","Retie","Vorselaar","Westerlo"],
  parameters: [
    {id:"targetGroup",label:"Doelgroep",options:[
      {label:"Normaal",scores:[0,0,0]},{label:"Jong / oud / kwetsbaar",scores:[0,.33,0]},{label:"Risico tot geweld",scores:[0,.66,1]}
    ]},
    {id:"eventType",label:"Type evenement",options:[
      {label:"Fuif / dancefestival",scores:[.33,0,.33]},{label:"Optreden / muziekfestival",scores:[0,0,0],review:true},{label:"Sportwedstrijd (recreatief)",scores:[0,.33,0]},{label:"Sportwedstrijd (competitief)",scores:[0,.66,.33]},{label:"Familiaal / recreatief",scores:[0,0,0]},{label:"Kermis / markt / stoet",scores:[0,0,0]},{label:"Doortocht",scores:[-1,-1,-1]},{label:"Circus",scores:[0,0,0]},{label:"Vliegshow",scores:[1,1,1]},{label:"Foodtruckfestival",scores:[.33,0,0],review:true},{label:"Privé",scores:[-4,-4,-4]}
    ]},
    {id:"catering",label:"Catering",options:[
      {label:"Geen",scores:[0,0,0]},{label:"Koud",scores:[0,.33,0]},{label:"Warm",scores:[.33,.33,0]},{label:"Extern - koud",scores:[0,.33,0]},{label:"Extern - warm",scores:[.33,.33,0]}
    ]},
    {id:"security",label:"Security",options:[
      {label:"Geen",scores:[0,0,0]},{label:"Eigen leden",scores:[0,0,.33]},{label:"Extern professioneel",scores:[-.33,0,.33],review:true}
    ]},
    {id:"alcoholDrugs",label:"Drank / drugs",options:[
      {label:"Niet aanwezig",scores:[-.33,0,0]},{label:"Aanwezig zonder risico",scores:[0,0,.33]},{label:"Overvloedig, met risico",scores:[.33,.33,.66]}
    ]},
    {id:"noise",label:"Afwijking geluidsnorm",options:[
      {label:"Geen",scores:[0,0,0]},{label:"Tot 95 dB",scores:[0,0,.33]},{label:"Tot 100 dB",scores:[0,0,.66]}
    ]},
    {id:"location",label:"Locatietype",options:[
      {label:"Voornamelijk openlucht (marktplein / straten)",scores:[0,0,0],kind:"outdoor"},{label:"Voornamelijk open terrein (weides)",scores:[-1,0,0],kind:"outdoor"},{label:"Recreatiedomein",scores:[-1,-.33,-.33],kind:"outdoor"},{label:"Lokaal, eigenlijk gebruik",scores:[-1,-.33,-.33],kind:"proper"},{label:"Lokaal, oneigenlijk gebruik",scores:[1,.33,.33],kind:"improper"},{label:"Kleine tent (tot 200 m²)",scores:[0,0,0],kind:"tent"},{label:"Middelgrote tent (200-499 m²)",scores:[.33,.33,0],kind:"tent"},{label:"Grote tent (vanaf 500 m²)",scores:[.66,.33,0],kind:"largeTent"}
    ]},
    {id:"reputation",label:"Reputatie",options:[
      {label:"Goed",scores:[-.66,-.66,-.66]},{label:"Geen / onbekend",scores:[0,0,0]},{label:"Slecht",scores:[1,1,1]}
    ]},
    {id:"accessibility",label:"Bereikbaarheid",options:[
      {label:"Goed",scores:[-.66,-.66,-.66]},{label:"Normaal",scores:[0,0,0]},{label:"Slecht",scores:[1,1,1]}
    ]}
  ],
  extras:[
    {id:"fireworks",label:"Vuurwerk"},{id:"openFire",label:"Open vuur"},{id:"specialStructures",label:"Speciale constructies"},{id:"camping",label:"Camping"},{id:"water",label:"Water"},{id:"weather",label:"Weersomstandigheden"},{id:"other",label:"Andere"}
  ],
  levels:[
    {level:0,title:"Verwaarloosbaar evenement",action:"Geen",summary:"Officieus niveau voor evenementen die doorgaans niet gemeld hoeven te worden.",measures:[]},
    {level:1,title:"Klein evenement",action:"Melding",summary:"Klein evenement met weinig bijkomende risico’s.",measures:["Melding aan de disciplines"]},
    {level:2,title:"Gemiddeld evenement",action:"Standaardadvies",summary:"Risico’s zijn doorgaans eenvoudig te remediëren door een ervaren organisator of ploeg.",measures:["Melding aan de disciplines","Inplantingsplan wanneer het evenement niet in een lokaal plaatsvindt","Standaardadvies opnemen in de toelating"]},
    {level:3,title:"Middelgroot evenement",action:"Specifiek advies",summary:"De specifieke risico’s moeten door de disciplines worden geanalyseerd.",measures:["Melding aan de disciplines","Specifiek advies vragen aan D1, D2 en D3","Voorlopig inplantingsplan bij de melding","Voorlopig veiligheidsplan bij de melding","Definitieve plannen uiterlijk 5 dagen voor de start"]},
    {level:4,title:"Groot evenement",action:"Controle",summary:"Een actieve aanpak van de disciplines is vereist.",measures:["Melding en specifiek advies van de disciplines","Veiligheidsoverleg met organisator, gemeente en disciplines","Voorlopig veiligheidsdossier bij de melding","Definitief dossier uiterlijk 5 dagen voor de start","Veiligheidsrondgang vóór de start"]},
    {level:5,title:"Zeer groot evenement",action:"Permanentie",summary:"Een actieve inzet en multidisciplinaire coördinatie ter plaatse is vereist.",measures:["Alle maatregelen van risiconiveau 4","CP-OPS en permanentie van de disciplines voorzien","Evaluatievergadering na afloop"]}
  ]
};
