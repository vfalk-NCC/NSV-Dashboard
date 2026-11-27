# Project Control Hub

Projektstyrning för NSV: arbetspaket, tidplan, ritningar, modeller, ärenden, åtgärder, beslut och möten, med kopplingar mellan allt. Appen har också en personlig verktygslåda, **My Tools**, där dina egna HTML-appar körs direkt i hubben.

> Projektdatan som följer med är **exempeldata**. Den kan återställas eller tömmas under *Inställningar och data* (klicka på statusen längst ned i navigeringen).

## Starta

**Windows:** dubbelklicka på `start.bat`. Appen öppnas på <http://127.0.0.1:4800>.

**Annars:**

```bash
npm start
```

Det enda som krävs är [Node.js](https://nodejs.org) 18 eller senare. Inga paket installeras.

### Utan internet

Appen fungerar helt offline. Typsnitten (Inter och JetBrains Mono, SIL Open Font License) ligger i `assets/fonts/`, och inga filer hämtas från externa adresser. Det enda som kräver internet är att installera Node.js och hämta repot första gången. Därefter kan datorn vara helt frånkopplad.

Utan server, till exempel på GitHub Pages, körs appen i **demoläge**. Då sparas datan bara i webbläsaren, och My Tools tar bara emot enskilda HTML-filer.

## Struktur

```
index.html            appens skal
css/app.css           designsystem (mörkt och ljust tema)
js/                   appen (ES-moduler, inget byggsteg)
  store.js            datamodell, relationer, ångra, lagring
  filters.js          globala filter, sparade och senaste filter
  actions.js          kommandon, högerklicksmenyer, dra och släpp
  context.js          kontextpanel och flytande fönster
  palette.js          kommandopalett (Ctrl+K)
  views/              översikt, tidplan, arbetspaket, ärenden, åtgärder,
                      ritningar & modeller, whiteboard, My Tools
server/server.js      lokal server: hub (4800) och verktygsserver (4801)
examples/tools/       exempelverktyg som installeras vid första start
data/                 db.json, säkerhetskopia, bilagor   (skapas, ignoreras av git)
user_tools/           dina registrerade verktyg           (skapas, ignoreras av git)
```

## My Tools

- **Lägg till verktyg:** välj en HTML-fil, välj en mapp med `index.html`, eller släpp filer och mappar direkt på sidan.
- Startfilen kontrolleras. Saknas `index.html` får du välja bland HTML-filerna i mappen. Fel och varningar (t.ex. `file://`-sökvägar) visas innan något registreras.
- Originalet ändras aldrig. En kopia läggs i `user_tools/<id>/`, och metadatan (namn, kategori, version, taggar, ikon, omslag, anteckningar, favorit, senast använd) sparas i databasen.
- **Öppna** kör verktyget i en egen arbetsyta med knapparna Tillbaka, Uppdatera, Öppna externt, Helskärm och Info.
- Verktyg kan vara **personliga** eller **projektverktyg**.

### Säkerhet

- Hubben och verktygen körs på olika origins: `127.0.0.1:4800` och `127.0.0.1:4801`. Verktygen körs dessutom i en sandlådad iframe. Ett verktyg kan inte läsa hubbens gränssnitt, lagring eller API.
- Hubbens API tar bara emot skrivanrop från hubbens egen origin.
- Verktygsservern lämnar bara ut filer under `user_tools/`. Försök att ta sig ut ur mappen (`../`) nekas.
- Båda servrarna lyssnar bara på `127.0.0.1`. Det kan ändras i `config.json` (se `config.example.json`).

### Project Control Hub API (förberett)

Ett API för dina verktyg finns, men det är **avstängt** som standard och tillåter **bara läsning**. Slå på det i `config.json`:

```json
{ "toolApi": { "enabled": true } }
```

Då kan verktygen hämta projektdata från sin egen origin, till exempel:

```
GET /api/project/activities
GET /api/project/drawings
GET /api/project/issues
GET /api/project/areas/745      (området med kopplade paket, aktiviteter, ritningar …)
```

Skrivåtkomst ska inte byggas förrän autentisering och behörigheter är på plats.

## Arbetssätt

| | |
|---|---|
| `Ctrl` `K` | Sök i all information och kör kommandon ("new action", "745", "open latest structural model") |
| Klick / `Shift`+klick | Visa i kontextpanelen / öppna i flytande fönster |
| Högerklick | Snabbval: status, tilldela, deadline, koppla, whiteboard, anteckning |
| Dra och släpp | Ritning → aktivitet, PDF eller foto → paket, mejl → beslut, IFC → Modellkontroll, åtgärd → kolumn, allt → whiteboard |
| `G` + `O/S/P/I/A/R/W/T` | Gå till en vy |
| `J` `K` · `↵` · `E` · `S` · `W` | Bläddra · öppna · redigera · favorit · till whiteboard |
| `N` · `I` | Ny åtgärd · nytt ärende |
| `[` · `]` | Visa/dölj navigering och kontextpanel |
| `Ctrl` `Z` | Ångra senaste ändringen |
| `?` | Alla kortkommandon |

Panelernas bredd, flytande fönster, fästning och tema sparas lokalt.

## Nästa steg

- **Skapa nytt verktyg** med editor för HTML, CSS och JS, förhandsvisning och versioner. Verktygsmallen och mappstrukturen finns redan.
- Automatisk skärmbild som miniatyr för verktyg.
- Import av riktig projektdata (tidplan, ritningsförteckning, ärendelogg) och koppling mot Trimble Connect.
