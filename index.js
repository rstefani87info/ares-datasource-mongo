import { MongoClient } from "mongodb";
import { NOSQLDBConnection } from "@ares/core/datasources.js";
import { asyncConsole } from "@ares/core/console.js";

export class MongoDB extends NOSQLDBConnection {
  constructor(connectionParameters, datasource, sessionId, connectionSettingName) {
    super(connectionParameters, datasource, sessionId, connectionSettingName);
    this.uri = "mongodb://" + this.host + ":" + (this.port ?? 27017);
    
    this.client = this.datasource.getPool(this.uri + this.database, () => {
      return new MongoClient(this.uri, {
        maxPoolSize: this.maxPoolSize ?? 100, 
        minPoolSize: this.minPoolSize ?? 5, 
        serverSelectionTimeoutMS: this.serverSelectionTimeoutMS ?? 5000,
      });
    });
  }

  async nativeConnect(callback) {
    try {
      const dbConn = this;
      const sessionId = this.sessionId;
      
      this.client.on("close", () => {
        if(dbConn.datasource.sessions[sessionId]) 
          delete dbConn.datasource.sessions[sessionId];
      });
      
      console.log("creating MongoDB instance");
      await this.client.connect();
      this.connection = this.client.db(this.database);
      callback(null, this.connection);
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      callback(error);
    }
  }

  async nativeDisconnect() {
    try {
      await this.client.close();
      delete this.datasource.sessions[this.sessionId];
    } catch (releaseError) {
      console.error("Error releasing connection:", releaseError);
    }
  }

  // Implementazione dei metodi per le transazioni
  // (MongoDB supporta le transazioni solo in configurazioni replica set)
  async startTransaction(name) {
    if (!this.transaction) {
      console.log("Starting transaction: " + name + ' on ' + this.sessionId);
      this.session = this.client.startSession();
      this.session.startTransaction();
      this.transaction = name;
    }
  }

  async rollback(name) {
    if (this.transaction === name && this.session) {
      await this.session.abortTransaction();
      await this.session.endSession();
      this.session = null;
      this.transaction = null;
    }
  }

  async commit(name) {
    if (this.transaction === name && this.session) {
      try {
        await this.session.commitTransaction();
        await this.session.endSession();
        this.session = null;
        this.transaction = null;
      } catch (commitError) {
        throw new Error('Error on committing transaction "' + name + '": ' + commitError);
      }
    }
  }

  // Implementazione del metodo per eseguire query
  async executeNativeQueryAsync(command, params) {
    const date = new Date();
    const response = { executionTime: date.getTime(), executionDateTime: date };
    
    try {
      // Supporto per diversi tipi di operazioni MongoDB
      let collection, operation, options;
      
      if (typeof command === 'string') {
        // Supporto per comandi semplici come "collection.find"
        const parts = command.split('.');
        collection = this.connection.collection(parts[0]);
        operation = parts[1];
        
        let result;
        if (operation === 'find') {
          result = await collection.find(params).toArray();
        } else if (operation === 'findOne') {
          result = await collection.findOne(params);
        } else if (operation === 'insertOne') {
          result = await collection.insertOne(params);
        } else if (operation === 'updateOne') {
          result = await collection.updateOne(params.filter, params.update);
        } else if (operation === 'deleteOne') {
          result = await collection.deleteOne(params);
        } else {
          throw new Error(`Unsupported operation: ${operation}`);
        }
        
        response.results = result;
      } else if (typeof command === 'object') {
        // Supporto per comandi più complessi
        collection = this.connection.collection(command.collection);
        operation = command.operation;
        options = command.options || {};
        
        let result;
        if (operation === 'aggregate') {
          result = await collection.aggregate(params, options).toArray();
        } else if (operation === 'bulkWrite') {
          result = await collection.bulkWrite(params, options);
        } else {
          // Supporto per operazioni generiche
          result = await collection[operation](params, options);
        }
        
        response.results = result;
      }
      
      response.executionTime = new Date().getTime() - response.executionTime;
      return response;
    } catch (error) {
      response.error = error;
      response.executionTime = new Date().getTime() - response.executionTime;
      throw response;
    }
  }

  // Implementazione del metodo per eseguire query in modo sincrono (simulato)
  executeQuerySync(command, params, callback) {
    const date = new Date();
    const response = { executionTime: date.getTime(), executionDateTime: date };
    const logName = "executeQuerySync_" + response.executionTime;
    
    asyncConsole.log(logName, "Waiting for query results:");
    
    this.executeNativeQueryAsync(command, params)
      .then(result => {
        response.results = result.results;
        response.executionTime = new Date().getTime() - response.executionTime;
        callback(response);
      })
      .catch(error => {
        response.error = error;
        response.executionTime = new Date().getTime() - response.executionTime;
        callback(response);
      });
      
    return response;
  }
  
  // Implementazione del metodo richiesto da _executeNativeQueryAsync
  async _executeNativeQueryAsync(command, params, mapper, req) {
    return await this.executeNativeQueryAsync(command, params);
  }
}