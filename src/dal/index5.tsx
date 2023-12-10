// ///<reference path="./../global.d.ts" />
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb+srv://admin:Nv0DN8uRo9Otwb8i@jitt-core.p62mz.mongodb.net/test');
const collection = client.db('jitt-mate').collection('sku');

async function run() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docs = await collection.find<{ _id: ObjectId, sku: Record<string, any> }>({}).toArray();
    for (const doc of docs) {
        await collection.updateOne({ _id: new ObjectId(doc._id.toHexString()) }, {
            $unset: {
                sku: true,
                _barcode: true
            }
        });
        // { $set: { upcs: [ doc.sku ]}}
    }
}
run().finally(() => console.log('DONE!'));

// const skus = collection.updateMany({}, { $set: { upcs: 'good' } }).then((D) => console.log(`${D.acknowledged} acknowledged, ${D.matchedCount} matched, ${D.modifiedCount} modified.`));

//     .updateMany({}, [
//         {
//             $set: {
//                 'dimensions.capacityGB': 0,
//                 'dimensions.diameterInches': 0,
//                 'dimensions.heightInches': '$heightIn',
//                 'dimensions.lengthInches': '$lengthIn',
//                 'dimensions.inputVoltageVolts': 0,
//                 'dimensions.inputAmperageAmps': 0,
//                 'dimensions.inputWattageWatts': 0,
//                 'dimensions.outputVoltageVolts': 0,
//                 'dimensions.outputAmperageAmps': 0,
//                 'dimensions.outputWattageWatts': 0,
//                 'dimensions.runtimeMin': 0,
//                 'dimensions.volumeFlOz': 0,
//                 'dimensions.widthInches': '$widthIn'
//             }
//         }
//     ])
    
