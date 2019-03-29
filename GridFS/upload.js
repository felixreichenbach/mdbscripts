const assert = require('assert');
const fs = require('fs');
const mongodb = require('mongodb');

const uri = 'mongodb+srv://demo:demo@ktm-bi-connector-28m2i.gcp.mongodb.net/test?retryWrites=true';
const dbName = 'GridFS';

const client = new mongodb.MongoClient(uri,{ useNewUrlParser: true });

client.connect(function(error) {
  assert.ifError(error);

  const db = client.db(dbName);

  var bucket = new mongodb.GridFSBucket(db,{
        //chunkSizeBytes: 1024,    //Default size 255kb (255*1024)
        bucketName: 'fs'        //Default fs
  });

  fs.createReadStream('./50MB.zip').
    pipe(bucket.openUploadStream('50MB.zip')).
    on('error', function(error) {
      assert.ifError(error);
    }).
    on('finish', function() {
      console.log('done!');
      process.exit(0);
    });
});