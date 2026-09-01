# Obiettivi del modulo `@ares/datasource-mongo`

## Introduzione

`@ares/datasource-mongo` è il modulo driver **MongoDB** del framework aReS. Fornisce un driver/connection class che si integra col runtime `Datasource` di `@ares/core`, permettendo ai datasource aReS di parlare con database MongoDB (NoSQL).

## Obiettivi principali

- Fornire un driver MongoDB conforme al contratto `NOSQLDBConnection` del core.
- Gestire connessione, pool e sessioni verso MongoDB.
- Supportare transazioni MongoDB (replica set) e l'esecuzione di query native.

## Responsabilità

- `MongoDB` (classe, `export class MongoDB extends NOSQLDBConnection`):
  - costruzione: compone la URI `mongodb://host:port`, con pool condiviso via `datasource.getPool(...)`.
  - `nativeConnect(callback)` → connect al `MongoClient` e selezione della `db`.
  - `nativeDisconnect()` → chiusura client e pulizia della sessione.
  - `startTransaction(name)` / `commit(name)` / `rollback(name)` → transazioni via `client.startSession()` (solo replica set).
  - `executeNativeQueryAsync(command, params)` → supporto operazioni semplici a stringa (`collection.find`, `findOne`, `insertOne`, `updateOne`, `deleteOne`) e oggetti complessi (`aggregate`, `bulkWrite`, operazioni generiche).
  - `executeQuerySync` e `_executeNativeQueryAsync` per la compatibilità col runtime.

## Cosa il modulo NON fa

- **Non** fornisce CLI: non c'è alcun `bin`, nessun comando da riga di comando.
- **Non** implementa il reverse-engineering dello schema né la generazione di `current-schemas.json`.
- **Non** gestisce migrazioni SQL/DDL: è un puro driver di connessione NoSQL; il contratto di console del driver NON include i metodi `getSchemasUsing`/`getEntitiesUsing`/ecc. usati da `@ares/datasource-files`.
- **Non** ha logica di business applicativa.
