// // ///<reference path="./../global.d.ts" />
// import { MongoClient, ObjectId } from 'mongodb';
// import * as fs from 'graceful-fs';

// const client = new MongoClient('mongodb+srv://admin:Nv0DN8uRo9Otwb8i@jitt-core.p62mz.mongodb.net/test');
// const collection = client.db('jitt-mate').collection('product');
// // collection.updateMany({ materials: { $exists: false }}, {
// //     $set: {
// //         materials: {}
// //     }
// // }).then(d => {
// //     console.log(`${d.modifiedCount}`)
// // })
// import * as Data from '../../../../../../../../media/bobby/1TB/mongo-backup/product.json';

// const data = JSON.parse(fs.readFileSync('../../../../../../../media/bobby/1TB/mongo-backup/product.json').toString()) as typeof Data;
// console.log(`data.length: ${data.length}`)
// data.filter((x) => x.madeOf != null).forEach((x) => console.log(JSON.stringify(x, null, '\t')));
// console.log(
//     Array.from(
//         new Set(
//             data
//                 .filter((x) => x.madeOf != null)
//                 .map((x) => Object.keys(x.madeOf ?? {}))
//                 .reduce((pv, cv) => [...pv, ...cv], [])
//         ).values()
//     )
// );
// function convert(value: 'R' | 'C' | 'M' | 'X' | 'P' | 'A' |  'E' | 'N') {
//     switch (value) {
//         case 'M':
//             return 'modal';
//         case 'C':
//             return 'cotton';
//         case 'P':
//             return 'polyester'
//         case 'N':
//             return 'nylon';
//         case 'X':
//             return 'spandex';
//         case 'R':
//             return 'rayon';
//         case 'A':
//             return 'acrylic';
//         case 'E':
//             return 'polyurethane'
//     }
// }
// async function run() {
//     const docs = data.filter((x) => x.madeOf != null);
//     for (const doc of docs) {
//         const result = await collection.updateOne(
//             { _id: new ObjectId(doc._id.$oid) },
//             {
//                 $set: {
//                     materials: {
//                         all: Object.fromEntries(Object.entries(doc.madeOf ?? {}).map(([k, v]) => [convert(k as any), parseFloat((v as number).toFixed(4))]))
//                     }
//                 }
//             }
//         );
//         console.log(`${result.modifiedCount}`)
//     }
//     // const funcs = docs.map(doc => () => {
//     //     console.log(JSON.stringify(doc.materials, null, '\t'));
//     //     const entries = Object.entries(doc.materials);
//     //     if (entries.length === 1) {
//     //         return collection.updateOne({ _id: new ObjectId(doc._id.toHexString()) }, {
//     //             $set: {
//     //                 materials: {
//     //                     all: entries[0][1]
//     //                 }
//     //             }
//     //         }).then((d) => console.log(`${d.modifiedCount}`)).finally(() => console.log('done!'));
//     //     }
//     //     return Promise.resolve()
//     // });
//     // return funcs.reduce((pv, cv) => async () => {
//     //     await pv();
//     //     await cv();
//     // }, () => Promise.resolve())()
// }
// run()
// // collection.updateMany({}, [{ $unset: 'cutNo' }]).then((D) => console.log(`${D.acknowledged} acknowledged, ${D.matchedCount} matched, ${D.modifiedCount} modified.`));

// // const dir = '/media/bobby';

// // async function handleFileItem(baseDir: string, fn: string): Promise<string[]> {
// //     const fullname = [baseDir, fn].join('/');
// //     console.log(fullname);
// //     const stats = await fs.promises.stat(fullname);
// //     if (stats.isFile()) return [fullname];
// //     return fs.readdirSync(fullname).map(x => handleFileItem(fullname, x)).reduce(async (pv, cv) => {
// //         const p = await pv;
// //         const c = await cv;
// //         return [...p, ...c];
// //     }, Promise.resolve([]));
// // }
// // const infos = handleFileItem(dir, '1TB');


// // const item1 = 'PXL_20231014_225717342';
// // const item2 = 'PXL_20231014_225800639';
// // const suffix = '-removebg-preview.png';
// // infos.then((list) => {
// //     const result1 = list.filter((x) => path.basename(x).startsWith(item1));
// //     const result2 = list.filter((x) => path.basename(x).startsWith(item2));
// //     console.log(JSON.stringify(result1, null, '\t'))
// //     console.log(JSON.stringify(result2, null, '\t'));
// // });

// // collection.find<IProductImage>({}).toArray().then(async docs => {
// //     const l = await infos;
// //     const funcs = docs.map(async doc => {
// //         const uploadedFrom = l.find((x) => path.basename(x) === path.basename(doc.uploadedFrom));
// //         const removeBG = l.find((x) => [path.dirname(x), path.basename(doc.uploadedFrom).replaceAll('.jpg', suffix)].join('/') === x);
// //         let downloadsRemoveBG: string | undefined;
// //         if (removeBG != null) {
// //             downloadsRemoveBG = [Config.downloadsPath, path.basename(removeBG)].join('/');
// //             fs.copyFileSync(removeBG, downloadsRemoveBG);
// //         }
// //         const originalData = uploadedFrom != null ? fs.readFileSync(uploadedFrom).buffer : undefined;
// //         const removeBGData = downloadsRemoveBG != null ? fs.readFileSync(downloadsRemoveBG ?? '').buffer : undefined;
// //         const originalFile = originalData ? new File([originalData], doc.uploadedFrom, { type: doc.originalMimeType }) : undefined;
// //         const removeBGFile = removeBGData && downloadsRemoveBG ? new File([removeBGData], downloadsRemoveBG, { type: doc.removeBGMimeType }) : undefined;
// //         console.log(`match1: ${doc.filename} to ${uploadedFrom} to ${removeBG}`);
// //         return collection.updateOne(
// //             {
// //                 _id: new ObjectId((doc._id as ObjectId).toHexString())
// //             },
// //             {
// //                 // $unset: {
// //                 //     filename: true
// //                 // }
// //                 $set: {
// //                     originalData: await originalFile?.arrayBuffer(),
// //                     removeBGData: await removeBGFile?.arrayBuffer()
// //                     // _filename: doc.filename,
// //                     // uploadedFrom: uploadedFrom,
// //                     // doNotRemoveBG: removeBGData == null,
// //                     // originalMimeType: path.extname(uploadedFrom ?? '').replaceAll('.', 'image/'),
// //                     // removeBGMimeType: 'image/png',
// //                 }
// //             }
// //         );
// //     })
// //     return Promise.all(funcs);
// // }).finally(() => console.log('DONE!'));
// // collection.find<IProductImage>({}).toArray().then(docs => {
// //     docs.forEach(doc => {
// //         collection.updateOne({
// //             _id: new ObjectId((doc._id as ObjectId).toHexString())
// //         }, {
// //             $set: {
// //                 uploadedFrom: ['/home/bobby/Downloads/', doc.filename].join(''),
// //                 originalMimeType: path.extname(doc.filename).replaceAll('.', 'image/'),
// //                 removeBGMimeType: 'image/png',
// //                 doNotRemoveBG: false,
// //                 originalData: fs.readFileSync()
// //             }
// //         })
// //     })
// // })


