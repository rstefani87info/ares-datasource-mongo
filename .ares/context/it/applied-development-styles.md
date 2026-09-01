# Stile di sviluppo applicato — `@ares/datasource-mongo`

## Standard di programmazione

- **JavaScript ESM** (package non dichiara `"type": "module"` esplicito ma il codice usa `import`/`export`), ereditarietà da `@ares/core`.
- **Contratto core**: la classe estende `NOSQLDBConnection` dal core e implementa il ciclo di vita atteso dal runtime (connect/disconnect/query/transaction).
- **Logging misto**: usa `asyncConsole` da `@ares/core/console.js` per i messaggi diagnostici interni, ma anche `console.log`/`console.error` diretti per connessione/transazioni.
- **Pool condiviso**: riuso del pool tramite `datasource.getPool(uri, factory)`.
- Naming: classe PascalCase, metodi camelCase, costanti nulla di rilievo.

## Contratto directory/file

Il modulo è un package sorgente minimale, senza build.

```
datasource-mongo/
├─ .ares/                # MANUALE  (contesto + docs obbligatorie; README del context)
├─ .git/                 # GENERATO (controllo versione)
├─ .gitignore            # MANUALE
├─ index.js              # MANUALE  (tutta la logica, export MongoDB)
├─ package.json          # MANUALE
└─ README.md             # MANUALE
```

## MACRO-SUDDIVISIONE: GENERATO vs MANUALE

| Elemento | Categoria | Note |
|---|---|---|
| `index.js`, `package.json`, `README.md`, `.gitignore` | **MANUALE** | codice sorgente, mai rigenerato |
| `.ares/context/`, `.ares/docs/`, `.ares/tasks/` | **MANUALE** | documentazione di contesto; i file `it/` creati non vanno sovrascritti |
| `.git/`, `node_modules/` | **GENERATO** | mai versionato |

**Regola pratica**: non esistono artefatti generati di build nel modulo. Qualsiasi file di configurazione o codice nel repo va trattato come manuale.
