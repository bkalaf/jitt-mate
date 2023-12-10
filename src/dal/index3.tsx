// ///<reference path="./../global.d.ts" />
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb+srv://admin:Nv0DN8uRo9Otwb8i@jitt-core.p62mz.mongodb.net/test');
const collection = client.db('jitt-mate').collection('product');

collection.updateMany({  }, [{ $unset: '_flags' }]).then((D) => console.log(`${D.acknowledged} acknowledged, ${D.matchedCount} matched, ${D.modifiedCount} modified.`));
collection.updateMany({}, [{ $set: { 'apparelDetails.clothingCare': [] } }]).then((D) => console.log(`${D.acknowledged} acknowledged, ${D.matchedCount} matched, ${D.modifiedCount} modified.`));

// collection
//     .find({}).toArray()
//     .then(docs => {
//         docs.forEach((doc) => {
//             collection
//                 .updateOne(
//                     { _id: new ObjectId(doc._id.toHexString()) },
//                     {
//                         $set: {
//                             flags: [
//                                 doc._flags.isRare ? 'isRare' : undefined,
//                                 doc._flags.isVintage ? 'isVintage' : undefined,
//                                 doc._flags.hasTags ? undefined : 'isMissingTags'
//                             ].filter((x) => x != null)
//                         }
//                     }
//                 )
//                 .then((D) => console.log(`${D.acknowledged} acknowledged, ${D.matchedCount} matched, ${D.modifiedCount} modified.`));
//         });
//     })
//     ;
