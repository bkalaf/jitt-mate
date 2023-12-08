///<reference path="./../global.d.ts" />
import { MongoClient, BSON, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb+srv://admin:Nv0DN8uRo9Otwb8i@jitt-core.p62mz.mongodb.net/test');
const collection = client.db('jitt-mate').collection('product');

collection
    .updateMany({}, [
        {
            $set: {
                'dimensions.capacityGB': 0,
                'dimensions.diameterInches': 0,
                'dimensions.heightInches': '$heightIn',
                'dimensions.lengthInches': '$lengthIn',
                'dimensions.inputVoltageVolts': 0,
                'dimensions.inputAmperageAmps': 0,
                'dimensions.inputWattageWatts': 0,
                'dimensions.outputVoltageVolts': 0,
                'dimensions.outputAmperageAmps': 0,
                'dimensions.outputWattageWatts': 0,
                'dimensions.runtimeMin': 0,
                'dimensions.volumeFlOz': 0,
                'dimensions.widthInches': '$widthIn'
            }
        }
    ])
    .then((D) => console.log(`${D.acknowledged} acknowledged, ${D.matchedCount} matched, ${D.modifiedCount} modified.`));
