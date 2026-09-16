# EventRisk Kempen

Statische webapp voor een multidisciplinaire risicoanalyse van evenementen op basis van het aangeleverde **Protocolakkoord zonale aanpak evenementen (werkdocument v2.3)**.

## Functies

- score per discipline: D1 brandweer, D2 medisch en D3 politie;
- algemeen risiconiveau 0 t/m 5;
- minimale multidisciplinaire maatregelen;
- voorwaardelijke sneladviezen;
- termijnen vanaf de startdatum;
- concept lokaal bewaren, JSON-export en afdruk/PDF;
- geen server of databank nodig; geschikt voor GitHub Pages.

## Lokaal starten

Open `index.html` rechtstreeks of gebruik:

```bash
python3 -m http.server 8080
```

Open daarna `http://localhost:8080`.

## Publiceren met GitHub Pages

1. Maak een nieuwe repository, bijvoorbeeld `eventrisk-kempen`.
2. Upload alle bestanden uit deze map naar de hoofdmap van de repository.
3. Ga naar **Settings > Pages**.
4. Kies **Deploy from a branch**, branch **main**, map **/(root)**.
5. Bewaar. GitHub toont daarna de publieke URL.

> Publiceer dossiers met persoonsgegevens niet in een publieke repository. De broncode mag publiek staan; ingevulde analyses horen in een beveiligde dossieromgeving.

## Berekeningsmethode

De aanwezigheidsklasse bepaalt de basisscore voor alle disciplines. De overige gewichten uit bijlage 1 worden per discipline opgeteld. De score wordt begrensd tot 0–5 en naar boven afgerond. Het algemene risiconiveau is het hoogste van de drie discipline-niveaus, waarbij de aanwezigheidsklasse als ondergrens geldt.

Deze concrete afrondings- en aggregatieregel staat niet expliciet uitgeschreven in het aangeleverde werkdocument. Laat ze vóór productiegebruik formeel valideren door het zonaal overleg/noodplanning. Alle parameters staan centraal in `risk-config.js`.

## Te valideren bronwaarden

Het aangeleverde PDF-werkdocument bevat revisiemarkeringen en enkele onvolledige cellen. In deze versie zijn de leesbare waarden overgenomen en zijn gemarkeerde keuzes aangeduid in de berekening. Vooral de waarden voor `Optreden/muziekfestival`, `Foodtruckfestival` en `Extern professioneel security` moeten formeel worden bevestigd.

## Privacy en productie

Deze demonstratie bewaart alleen een optioneel concept in de lokale browser. Voor dossiers, persoonsgegevens, Microsoft-login, rollen, auditlogging en koppelingen met Eagle B/Flowlab is een beveiligde backend en een gegevensbeschermingseffectbeoordeling nodig.
