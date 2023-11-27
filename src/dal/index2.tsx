// import { MongoClient } from 'mongodb';
// import { BSON } from 'realm';

// const client = new MongoClient('mongodb+srv://admin:Nv0DN8uRo9Otwb8i@jitt-core.p62mz.mongodb.net/test');

console.log(!!true);
// console.log(client);

// client
//     .db('jitt-mate')
//     .collection('locationSegment')
//     .updateMany({}, { $unset: { upcs: '' } })
//     .then((result) => {
//         console.log(`updated: ${result.modifiedCount}/${result.upsertedCount}`);
//     });
// client
//     .db('jitt-mate')
//     .collection('locationSegment')
//     .updateMany({}, { $set: { upcs: [] } })
//     .then((result) => {
//         console.log(`updated: ${result.modifiedCount}/${result.upsertedCount}`);
//     });
// client
//     .db('jitt-mate')
//     .collection('locationSegment')
//     .find<{ _id: BSON.ObjectId; barcode: string; upcs?: any[] }>({})
//     .forEach((locationSegment: { _id: BSON.ObjectId; barcode: string; upcs?: any[] }) => {
//         client
//             .db('jitt-mate')
//             .collection('locationSegment')
//             .updateOne(
//                 {
//                     _id: locationSegment._id
//                 },
//                 { $set: { upcs: [locationSegment.barcode] } }
//             );
//     })
// // .updateMany({}, [{ $push: { upcs: '$barcode' } } as any])
// // .then((result) => {
// //     console.log(`updated: ${result.modifiedCount}/${result.upsertedCount}`);
// // });
// // client
// //     .db('jitt-mate')
// //     .collection('mercariCategory')
// //     .updateMany({ taxon: { $exists: true }, 'taxon.lock': null }, { $set: { 'taxon.lock': false } })
// //     .then((result) => {
// //         console.log(`updated: ${result.modifiedCount}/${result.upsertedCount}`);
// //         // client
// //         //     .db('jitt-mate')
// //         //     .collection('classifier')
// //         //     .updateMany({ 'taxon.lock': null }, { $set: { $set: { 'taxon.lock': false } } })
// //         //     .then((result2) => {
// //         //         console.log(`updated: ${result2.modifiedCount}/${result2.upsertedCount}`);
// //         //     });
// //     })
// //     .finally(() => console.log('DONE!'));
// // client
// //     .db('jitt-mate')
// //     .collection('mercariSubCategory')
// //     .updateMany({ taxon: { $exists: true }, 'taxon.lock': null }, { $set: { 'taxon.lock': false } })
// //     .then((result) => {
// //         console.log(`updated: ${result.modifiedCount}/${result.upsertedCount}`);
// //         // client
// //         //     .db('jitt-mate')
// //         //     .collection('classifier')
// //         //     .updateMany({ 'taxon.lock': null }, { $set: { $set: { 'taxon.lock': false } } })
// //         //     .then((result2) => {
// //         //         console.log(`updated: ${result2.modifiedCount}/${result2.upsertedCount}`);
// //         //     });
// //     })
// //     .finally(() => console.log('DONE!'));
// // client
// //     .db('jitt-mate')
// //     .collection('mercariSubSubCategory')
// //     .updateMany({ taxon: { $exists: true }, 'taxon.lock': null }, { $set: { 'taxon.lock': false } })
// //     .then((result) => {
// //         console.log(`updated: ${result.modifiedCount}/${result.upsertedCount}`);
// //         // client
// //         //     .db('jitt-mate')
// //         //     .collection('classifier')
// //         //     .updateMany({ 'taxon.lock': null }, { $set: { $set: { 'taxon.lock': false } } })
// //         //     .then((result2) => {
// //         //         console.log(`updated: ${result2.modifiedCount}/${result2.upsertedCount}`);
// //         //     });
// //     })
// //     .finally(() => console.log('DONE!'));
// // client
// //     .db('jitt-mate')
// //     .collection('classifier')
// //     .updateMany({ taxon: { $exists: true }, 'taxon.lock': null }, { $set: { 'taxon.lock': false } })
// //     .then((result) => {
// //         console.log(`updated: ${result.modifiedCount}/${result.upsertedCount}`);
// //         // client
// //         //     .db('jitt-mate')
// //         //     .collection('classifier')
// //         //     .updateMany({ 'taxon.lock': null }, { $set: { $set: { 'taxon.lock': false } } })
// //         //     .then((result2) => {
// //         //         console.log(`updated: ${result2.modifiedCount}/${result2.upsertedCount}`);
// //         //     });
// //     })
