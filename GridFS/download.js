const assert = require('assert');
const fs = require('fs');
const mongodb = require('mongodb');


// Single Node Local
const uri = "mongodb://localhost:27017/admin";

// Atlas Replica Set
//const uri = 'mongodb+srv://user:password@hostname.cloudprovider.mongodb.net/test?retryWrites=true';

const dbName = 'GridFS';

const fileName = '50MB.zip';

console.log("file" + fileName + " will be downloaded from: " + dbName);


const client = new mongodb.MongoClient(uri, { useNewUrlParser: true });

client.connect(function (error) {
    assert.ifError(error);

    const db = client.db(dbName);

    var bucket = new mongodb.GridFSBucket(db);

    bucket.openDownloadStreamByName(fileName).
        //start(1024 * 1585). // <-- skip the first 1585 KB in a video or mp3 i.e.
        pipe(fs.createWriteStream('./50MBdownload.zip')).
        on('error', function (error) {
            assert.ifError(error);
        }).
        on('finish', function () {
            console.log('done!');
            process.exit(0);
        });
});

