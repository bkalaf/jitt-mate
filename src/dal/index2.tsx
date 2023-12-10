// ///<reference path="./../global.d.ts" />
import { MongoClient, BSON, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb+srv://admin:Nv0DN8uRo9Otwb8i@jitt-core.p62mz.mongodb.net/test');

const cursor = client
    .db('jitt-mate')
    .collection('product')
    .find({});

console.log(cursor.map);
cursor
    .map<any>(
        ({
            _id,
            brand,
            productLine,
            circa,
            classifier,
            color,
            cutNo,
            descriptiveText,
            dimensions,
            features,
            folder,
            hashTags,
            heightIn,
            isRare,
            isVintage,
            madeOf,
            materials,
            modelNo,
            notes,
            shipWeightPercent,
            styleNo,
            taxon,
            upcs,
            weightG,
            widthIn,
            _barcodes,
            lengthIn,
            flags,
            backlineType,
            chestIn,
            collarType,
            cuffType,
            hasTags,
            inseamIn,
            neckIn,
            necklineType,
            origin,
            pocketCount,
            rn,
            size,
            sleeveIn,
            sleeveType,
            topAdornment,
            torsoIn,
            waistIn,
            waistType
        }) =>
            Object.fromEntries(([
                ['_id', _id],
                ['folder', new BSON.UUID()],
                ['brand', brand],
                ['productLine', productLine],
                ['classifier', classifier],
                ['circa', circa],
                ['color', color],
                ['cutNo', cutNo],
                ['origin', origin],
                ['notes', notes],
                ['features', features ?? []], 
                ['hashTags', hashTags ?? []],
                ['modelNo', modelNo],
                ['descriptiveText', descriptiveText], 
                ['shipWeightPercent', shipWeightPercent],
                ['styleNo', styleNo],
                ['taxon',  taxon ?? ({ lock: false } as any)],
                ['upcs', upcs ?? (_barcodes ?? []).map((b: any) => ({ rawValue: b, type: 'ean13', valid: true }))],
                ['flags', flags ?? [hasTags, isVintage, isRare].some((x) => x != null)
                        ? Object.fromEntries(
                              (
                                  [
                                      ['isRare', isRare],
                                      ['isVintage', isVintage],
                                      ['hasTags', hasTags]
                                  ] as [string, Optional<boolean>][]
                              ).filter(([a, b]) => b != null)
                          )
                        : undefined],
                ['dimensions', dimensions ?? [heightIn, widthIn, lengthIn, weightG].some((x) => x != null)
                        ? Object.fromEntries(
                              (
                                  [
                                      ['lengthInches', lengthIn],
                                      ['widthInchdes', widthIn],
                                      ['heightInches', heightIn],
                                      ['weightGrams', weightG]
                                  ] as [string, Optional<number>][]
                              ).filter(([a, b]) => b != null)
                          )
                        : undefined],
                ['isRare', isRare],
                ['isVintage', isVintage],
                ['madeOf', madeOf],
                ['materials', madeOf != null
                        ? Object.fromEntries([
                              [
                                  '',
                                  Object.fromEntries(
                                      (
                                          [
                                              ['acrylic', madeOf.A],
                                              ['cotton', madeOf.C],
                                              ['modal', madeOf.M],
                                              ['spandex', madeOf.X],
                                              ['nylon', madeOf.N],
                                              ['polyester', madeOf.P],
                                              ['rayon', madeOf.R],
                                              ['polyurethane', madeOf.E]
                                          ] as [string, Optional<number>][]
                                      ).filter(([a, b]) => b != null)
                                  )
                              ]
                          ])
                        : undefined],
                        ['heightIn', heightIn], 
                        ['lengthIn', lengthIn],
                        ['widthIn', widthIn],
                        ['weightG', weightG],
                        ['apparelDetails', [
                    size,
                    styleNo,
                    cutNo,
                    collarType,
                    cuffType,
                    waistType,
                    sleeveType,
                    necklineType,
                    backlineType,
                    rn,
                    pocketCount,
                    chestIn,
                    neckIn,
                    torsoIn,
                    waistIn,
                    sleeveIn,
                    inseamIn
                ].some((x) => x != null)
                    ? Object.fromEntries(
                          (
                              [
                                  ['size', size],
                                  ['styleNo', styleNo],
                                  ['cutNo', cutNo],
                                  ['collarType', collarType],
                                  ['cuffType', cuffType],
                                  ['sleeveType', sleeveType],
                                  ['waistType', waistType],
                                  ['topAdornment', topAdornment],
                                  ['necklineType', necklineType],
                                  ['backlineType', backlineType],
                                  ['rn', rn],
                                  ['pocketCount', pocketCount],
                                  [
                                      'measurements',
                                      [chestIn, inseamIn, neckIn, sleeveIn, torsoIn, waistIn].some((x) => x != null)
                                          ? Object.fromEntries(
                                                (
                                                    [
                                                        ['chestInches', chestIn],
                                                        ['inseamInches', inseamIn],
                                                        ['neckInches', neckIn],
                                                        ['sleeveInches', sleeveIn],
                                                        ['torsoInches', torsoIn],
                                                        ['waistInches', waistIn]
                                                    ] as [string, Optional<number>][]
                                                ).filter(([a, b]) => b != null)
                                            )
                                          : null
                                  ]
                              ] as [string, any][]
                          ).filter(([a, b]) => b != null)
                      )
                    : undefined]
            ] as [string, any][]).filter(x => x[1] != null)) as { _id: BSON.ObjectId })    
    .forEach(({ _id, ...d }) => {
        console.log(`document: ${_id.toHexString()} start!`);
        console.log(d);

        client.db('jitt-mate').collection('product').replaceOne({ _id: new ObjectId(_id.toHexString()) }, d).then((d) => {
            console.log('FINISHED');
            console.log(`acknowledged: ${d.acknowledged}`)
            console.log(`matchedCount: ${d.matchedCount}`)
            console.log(`modifiedCount: ${d.modifiedCount}`)
        });
    }).finally(() => console.error('CURSOR COMPLETE'));
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
