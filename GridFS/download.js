const assert = require('assert');
const fs = require('fs');
const mongodb = require('mongodb');

const uri = 'mongodb+srv://demo:demo@ktm-bi-connector-28m2i.gcp.mongodb.net/test?retryWrites=true';
const dbName = 'GridFS';

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true });

client.connect(function (error) {
    assert.ifError(error);

    const db = client.db(dbName);

    var bucket = new mongodb.GridFSBucket(db);

    bucket.openDownloadStreamByName('50MB.zip').
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

