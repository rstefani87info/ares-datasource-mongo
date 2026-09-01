# Dipendenze aReS — `@ares/datasource-mongo`

## Dipendenze (da `package.json`)

| Modulo | Perché (uso reale) |
|---|---|
| `@ares/core` | Fondamentale: la classe `MongoDB` estende `NOSQLDBConnection` da `@ares/core/datasources.js`, usa `asyncConsole` da `@ares/core/console.js` e si appoggia al runtime datasource (`datasource.getPool`) per il pool. |
| `mongodb` (npm, ^6) | Driver MongoClient ufficiale usato per connessione, sessioni e query (`MongoClient`, `startSession`). |

## DevDependencies

- `@ares/core-dev` e `@ares/scd`: solo di sviluppo/tooling del workspace, non usate nel runtime del driver.

## Chi dipende da questo modulo

- **Nessun modulo** del monorepo dichiara `@ares/datasource-mongo` come dipendenza diretta nei `package.json` esaminati.

## Note

- Come gli altri driver datasource (es. MySQL), è **risolto a runtime** dall'istanza `Datasource` del core tramite la configurazione `environments.*.<conn>.driver`, quindi anche se non compare come dipendenza esplicita, viene usato da chi configura un datasource di tipo MongoDB.
