# Panoramica CLI — `@ares/datasource-mongo`

**Il modulo non ha CLI.**

- Non è presente alcun campo `bin` in `package.json`.
- Non esiste alcuno script CLI né subcomando.
- Lo script `test` esiste ma è un placeholder (`echo "Error: no test specified" && exit 1`), non esegue veri test.

L'unico consumatore è programmatico: altre parti di aReS (il runtime datasource del core) importano e istanziano la classe `MongoDB` come driver di connessione.
