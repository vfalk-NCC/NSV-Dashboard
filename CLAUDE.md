# Project Control Hub (NSV)

Personlig projektstyrningsapp för Victor (NCC, projekt NSV). All text i gränssnittet är på svenska.

## Köra
- `start.bat` (Windows) startar `server/server.js` med portabel Node i `node\node.exe` om den finns, annars installerad Node.
- Hub: http://127.0.0.1:4800 · verktygsserver: http://127.0.0.1:4801 (separat origin, sandlådade iframes).
- Öppnas `index.html` direkt (file://) körs `js/app.bundle.js` i demoläge (data i webbläsaren).

## Viktigt vid ändringar
- Källkoden är ES-moduler i `js/` utan byggsteg. **Kör `node tools/build.js` efter varje ändring i `js/`** så att `js/app.bundle.js` (file://-läget) hålls i synk.
- Inga externa beroenden eller CDN:er – appen ska fungera helt offline (typsnitt ligger i `assets/fonts/`).
- Lokal data som aldrig ska committas: `data/`, `user_tools/`, `config.json`, `node/` (se `.gitignore`).
- Skript som "Hämta uppdateringar" får köra definieras bara i `config.json` → `scripts`, aldrig från webbläsaren.

## Struktur
- `js/store.js` datamodell, relationer, ångra, lagring · `js/filters.js` globala filter
- `js/actions.js` kommandon, menyer, dra och släpp · `js/context.js` kontextpanel/flytande fönster
- `js/palette.js` Ctrl+K · `js/sync.js` Hämta uppdateringar (källor: synkade SharePoint-mappar, mappar, Powerproject XML/CSV, skript)
- `js/views/*` översikt, tidplan, arbetspaket, ärenden, åtgärder, ritningar & modeller, whiteboard, My Tools
- `server/server.js` hub + verktygsserver · `server/sources.js` datakällor

## Status och nästa steg (2026-11-27)
- Projektdatan är exempeldata. Nästa steg är att koppla riktiga källor.
- Victor har ett skript "NSV Binder" som hämtar PDF:er från mappar. Det ska läggas in som skript i `config.json` och dess utmapp som mappkälla.
- Filnamnsmönstret för ritningar (standard `NUMMER_REV_Titel.pdf`) ska anpassas efter projektets riktiga filnamn.
- Utvecklingsgren: `claude/admiring-meitner-sey878` (`main` är tömd och ska få innehållet när Victor säger till).
