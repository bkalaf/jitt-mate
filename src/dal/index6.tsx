///<reference path="./../global.d.ts" />
import { MongoClient } from 'mongodb';
import { IProductImage } from './../dal/types';
import * as Config from '../config.json';
import Realm from 'realm';
import $$schema from '../dto/collections';
const client = new MongoClient('mongodb+srv://admin:Nv0DN8uRo9Otwb8i@jitt-core.p62mz.mongodb.net/test');
const collection = client.db('jitt-mate').collection('productImage');

// collection.updateMany({}, [{ $unset: 'cutNo' }]).then((D) => console.log(`${D.acknowledged} acknowledged, ${D.matchedCount} matched, ${D.modifiedCount} modified.`));

const dir = '/media/bobby';

// const Data = JSON.parse(fs.readFileSync('/home/bobby/Desktop/image-output.json').toString()) as typeof DataSchema;
// console.log(`Data`);
// console.log(JSON.stringify(Data, null, '\t'));

async function setupRealm() {
    try {
        const app = new Realm.App(Config.realm.appID);
        const user = await app.logIn(Realm.Credentials.emailPassword({ email: 'admin@junk-in-the-trunk.com', password: 'diane1221' }));
        const db = await Realm.open({
            schema: $$schema,
            sync: {
                partitionValue: 'admin@junk-in-the-trunk.com',
                user: user,
                newRealmFileBehavior: {
                    type: 'downloadBeforeOpen' as Realm.OpenRealmBehaviorType,
                    timeOut: 5 * 60 * 1000,
                    timeOutBehavior: 'throwException' as Realm.OpenRealmTimeOutBehavior
                },
                existingRealmFileBehavior: {
                    type: 'downloadBeforeOpen' as Realm.OpenRealmBehaviorType,
                    timeOut: 5 * 60 * 1000,
                    timeOutBehavior: 'throwException' as Realm.OpenRealmTimeOutBehavior
                },
                clientReset: {
                    mode: Realm.ClientResetMode.RecoverOrDiscardUnsyncedChanges
                }
            }
        });
        window.$$store = db;
        return db;
    } catch (error) {
        console.error((error as any).message);
        throw error
    }
}
async function run() {
    console.log('run');
    const db = await setupRealm();
    // db.syncSession?.addProgressNotification(ProgressDirection.Upload, ProgressMode.ReportIndefinitely, (transferred, transferrable) => {
    //     console.log(`${transferred}/${transferrable} completed.`);
    //     process.stdout.write(`${transferred}/${transferrable} completed.\n`);
    // });
    // const func = () => {
    //     for (const item of Data) {
    //         const sku = db.objectForPrimaryKey<ISku>('sku', new BSON.ObjectId(item.sku.$oid)) ?? undefined;
    //         const entered = db.create<IProductImage>('productImage', {
    //             uploadedFrom: item.originalfn,
    //             doNotRemoveBG: false,
    //             sku: sku,
    //             _id: new BSON.ObjectId()
    //         });
    //         entered.update();
    //         const toDelete = db.objectForPrimaryKey('productImage', new BSON.ObjectId(item._id.$oid));
    //         db.delete(toDelete);
    //     }
    // // }
    const promises = db
        .objects<IProductImage>('productImage')
        .filter(x => x.original == null || x.removeBg == null);
    console.log(promises);
    console.log(`length: ${promises.length}`);
    // const promises2 =promises
    //     .map((productImage) => () => {
    //         return productImage.updateAsync(db);
    //     })
    //     .reduce(
    //         (pv, cv) => async () => {
    //             await pv();
    //             await cv();
    //         },
    //         () => Promise.resolve()
    //     );
    // return promises2().finally(() => console.log('promises done'));
}
run();
// run()
//     .then(() => {
//         return window.$$store?.syncSession?.uploadAllLocalChanges();
//     })
//     .catch(catchError)
//     .finally(() => console.log('DONE!'));

// async function handleFileItem(baseDir: string, fn: string): Promise<string[]> {
//     const fullname = [baseDir, fn].join('/');
//     console.log(fullname);
//     const stats = await fs.promises.stat(fullname);
//     if (stats.isFile()) return [fullname];
//     return fs
//         .readdirSync(fullname)
//         .map((x) => handleFileItem(fullname, x))
//         .reduce(async (pv, cv) => {
//             const p = await pv;
//             const c = await cv;
//             return [...p, ...c];
//         }, Promise.resolve([]));
// }
// const infos = handleFileItem(dir, '1TB');
// async function findFile(filename: string) {
//     const info = await infos;
//     return info.find((x) => path.basename(x) === filename);
// }
// async function run() {
//     const output = [];
//     for (const entry of Data) {
//         output.push({
//             ...entry,
//             originalfn: await findFile(path.basename(entry.uploadedFrom))
//         });
//     }
//     fs.writeFileSync('/home/bobby/Desktop/image-output.json', JSON.stringify(output, null, '\t'));
// }
// run().finally(() => console.log('DONE!'))
