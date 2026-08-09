# Documentazione @ares/datasource-mongo

## Scopo

MongoDB module of aReS framework.

## Installazione

```bash
yarn add @ares/datasource-mongo
```

In un monorepo Yarn Workspaces:

```bash
yarn workspace <app> add @ares/datasource-mongo
```

## Quickstart

Questo modulo fornisce integrazioni/driver per il runtime datasource del `core`.

Esempio tipico (concettuale) di uso di una connection class:

```js
import { aReSInitialize } from "@ares/core";
import { /* driver */ } from "@ares/datasource-mongo";

const aReS = aReSInitialize({ name: "my-app", environments: [{ selected: true, type: "development" }] });

// In un datasource aReS, la connection class viene istanziata dal runtime datasource in base alla configurazione.
```

## API pubbliche (exports)

Questa sezione documenta la superficie pubblica reale a livello di entrypoint e simboli principali.

Entrypoint root:

- `@ares/datasource-mongo`

File principali nel root del package (indicativi):

- `index.js`

Export individuati in `index.*`:

- `MongoDB`

## Configurazione (appSetup / config / policies)

Questo modulo viene tipicamente usato dentro un datasource aReS. Le chiavi effettive dipendono dalla definizione del datasource e dal runtime `@ares/core`.

Indicazioni pratiche:

- definire gli ambienti (`environments`) e selezionare production/development tramite `aReS.isProduction`
- centralizzare segreti in `config` o variabili d’ambiente (mai hard-coded)

## Test

Esecuzione test del modulo (se presenti):

```bash
yarn workspace @ares/datasource-mongo test
```

## Note

- Questo documento è mantenuto in parallelo ai ticket del modulo.
