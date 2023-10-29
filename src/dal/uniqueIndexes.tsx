import { MongoClient } from 'mongodb';

export async function createUniqueIndexes() {
    // const {} = useRealmContext();
    const client = new MongoClient('mongodb+srv://admin:Nv0DN8uRo9Otwb8i@jitt-core.p62mz.mongodb.net/jitt-mate');
    const db = client.db('jitt-mate');
    // await db.collection('mercariBrand').createIndex(
    //     {
    //         name: 1
    //     },
    //     {
    //         name: 'unique-mercariBrand-name',
    //         unique: true
    //     }
    // );
    // await db.collection('brand').createIndex(
    //     {
    //         name: 1
    //     },
    //     {
    //         name: 'unique-brand-name',
    //         unique: true
    //     }
    // );
    // await db.collection('brand').createIndex(
    //     {
    //         folder: 1
    //     },
    //     {
    //         name: 'unique-brand-folder',
    //         unique: true
    //     }
    // );
    // await db.collection('mercariSubSubCategory').createIndex({
    //     fullname: 1
    // }, {
    //     name: 'unique-mercariSubSubCategory-fullname',
    //     unique: true
    // });
    // await db.collection('classifier').createIndex(
    //     {
    //         name: 1
    //     },
    //     {
    //         name: 'unique-classifier-name',
    //         unique: true
    //     }
    // );
    // await db.collection('locationSegment').dropIndex('barcode_1');
    // await db.collection('locationSegment').createIndex(
    //     {
    //         barcode: 1
    //     },
    //     {
    //         name: 'unique-locationSegment-barcode',
    //         unique: true
    //     }
    // );
    // await db.collection('locationSegment').createIndex(
    //     {
    //         name: 1
    //     },
    //     {
    //         name: 'unique-locationSegment-name',
    //         unique: true
    //     }
    // );
    // await db.collection('sku').createIndex(
    //     {
    //         sku: 1
    //     },
    //     {
    //         name: 'unique-sku-sku',
    //         unique: true
    //     }
    // );
}

createUniqueIndexes().finally(() => console.log('DONE!'));