///<reference path="./../global.d.ts" />
import { MongoClient, BSON, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb+srv://admin:Nv0DN8uRo9Otwb8i@jitt-core.p62mz.mongodb.net/test');
const collection = client.db('jitt-mate').collection('product');

collection.updateMany({}, [{ $unset: 'cutNo' }]).then((D) => console.log(`${D.acknowledged} acknowledged, ${D.matchedCount} matched, ${D.modifiedCount} modified.`));
