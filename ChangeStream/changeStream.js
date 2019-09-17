const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


// MongoDB Connection Parameters

const url = "mongodb+srv://demo:<password>@hostname.provider.mongodb.net/test?retryWrites=true&w=majority"
const dbName = "demo";
const colName = "changestream";

const pipeline = [
    { $match: { 'fullDocument.username': 'agnes' } },
    { $addFields: { 'newField': 'this is an added field!' } }
];

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true });

// Use connect method to connect to the Server
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection(colName);
    const changeStream = collection.watch(pipeline, { fullDocument: 'updateLookup' });

    changeStream.on('change', next => {
        // process next document
        console.log("Change Event:\n" + JSON.stringify(next, null, 4));
    });

});