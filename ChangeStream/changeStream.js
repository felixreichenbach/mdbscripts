const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


// MongoDB Connection Parameters

const url = "mongodb+srv://demo:demo@haufe-lexware-28m2i.mongodb.net/test?retryWrites=true&w=majority"
const dbName = "bankdata";
const colName = "customers";

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true });

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  const collection = db.collection(colName);
  const changeStream = collection.watch();
  
  changeStream.on('change', next => {
    // process next document
    console.log("New Customer:"+next.fullDocument.name);
  });

  //client.close();
});