import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb+srv://admin:Nv0DN8uRo9Otwb8i@jitt-core.p62mz.mongodb.net/test');

console.log(client);

client
    .db('jitt-mate')
    .collection('classifier')
    .updateMany({ taxon: null }, { $set: { taxon: {} } })
    .then((result) => {
        console.log(`updated: ${result.modifiedCount}/${result.upsertedCount}`);
        client
            .db('jitt-mate')
            .collection('classifier')
            .updateMany({ 'taxon.lock': null }, { $set: { 'taxon.lock': false } })
            .then((result2) => { 
                console.log(`updated: ${result2.modifiedCount}/${result2.upsertedCount}`);
            });
    })
    .finally(() => console.log('DONE!'));
