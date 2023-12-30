///<reference path="./global.d.ts" />
// import { MongoClient } from 'mongodb';
// import { IProductImage } from './../dal/types';
import * as Config from './config.json';
import Realm from 'realm';
import $$schema from './dto/collections';

export const addressSchema = {
    name: 'address',
    embedded: true,
    properties: {
        city: 'string?',
        country: 'string?',
        line1: 'string?',
        line2: 'string?',
        postalCode: 'string?',
        province: 'string?'
    }
};


export const apparelDetailsSchema = {
    name: 'apparelDetails',
    embedded: true,
    properties: {
        apparelType: 'string?',
        backlineType: 'string?',
        chestFitType: 'string?',
        clothingCare: 'string<>',
        collarType: 'string?',
        cuffType: 'string?',
        cutNo: 'string?',
        frontType: 'string?',
        gender: 'string?',
        itemGroup: 'string?',
        legType: 'string?',
        measurements: 'float{}',
        necklineType: 'string?',
        pocketCount: 'int?',
        rn: 'rn',
        size: 'string?',
        sleeveType: 'string?',
        styleNo: 'string?',
        topAdornment: 'string?',
        waistType: 'string?'
    }
};

export const barcodeSchema = {
    name: 'barcode',
    embedded: true,
    properties: {
        rawValue: 'string',
        type: 'string',
        valid: 'bool'
    }
};

export const binaryFileSchema = {
    name: 'binaryFile',
    embedded: true,
    properties: {
        data: 'data',
        mimeType: 'string',
        type: 'string'
    }
};

export const brandSchema = {
    name: 'brand',
    properties: {
        _id: 'objectId',
        folder: 'string?',
        hashTags: 'hashTag<>',
        mercariBrand: 'mercariBrand',
        name: 'string',
        owner: 'string',
        parent: 'brand',
        website: 'string?'
    },
    primaryKey: '_id'
};

export const classifierSchema = {
    name: 'classifier',
    properties: {
        _id: 'objectId',
        apparelGroup: 'string?',
        apparelType: 'string?',
        gender: 'string?',
        hashTags: 'hashTag<>',
        isAthletic: 'bool',
        itemGroup: 'string?',
        legType: 'string?',
        mercariSubSubCategory: 'mercariSubSubCategory',
        name: 'string',
        notes: 'string?',
        owner: 'string',
        shipWeightPercent: 'float?',
        shortname: 'string?',
        sizingType: 'string?',
        sleeveType: 'string?',
        taxon: 'productTaxonomy',
        topAdornment: 'string?'
    },
    primaryKey: '_id'
};

export const customItemFieldSchema = {
    name: 'customItemField',
    embedded: true,
    properties: {
        name: 'string',
        options: 'string[]'
    }
};

export const draftSchema = {
    name: 'draft',
    properties: {
        _id: 'objectId',
        description: 'string',
        draftId: 'string?',
        draftStatus: 'string',
        hashes: 'string[]',
        isReady: 'bool',
        isReadyToPost: 'bool',
        itemFolder: 'string',
        listingId: 'string?',
        marketplace: 'string',
        narrative: 'string?',
        owner: 'string',
        price: 'sellingPrice',
        recommendedPrice: 'float?',
        shippingPrice: 'float',
        sku: 'sku',
        title: 'string'
    },
    primaryKey: '_id'
};

export const hashTagSchema = {
    name: 'hashTag',
    properties: {
        _id: 'objectId',
        name: 'string',
        owner: 'string',
        usage: 'hashTagUsage[]'
    },
    primaryKey: '_id'
};

export const hashTagUsageSchema = {
    name: 'hashTagUsage',
    embedded: true,
    properties: {
        count: 'int',
        from: 'date'
    }
};

export const listingSchema = {
    name: 'listing',
    properties: {
        _id: 'objectId',
        auctionSite: 'string',
        createdOn: 'date',
        draft: 'draft',
        listingId: 'string',
        owner: 'string'
    },
    primaryKey: '_id'
};

export const locationSegmentSchema = {
    name: 'locationSegment',
    properties: {
        _id: 'objectId',
        color: 'string?',
        kind: 'string?',
        name: 'string',
        notes: 'string?',
        owner: 'string',
        type: 'string',
        upcs: 'barcode[]'
    },
    primaryKey: '_id'
};

export const materialCompositionSchema = {
    name: 'materialComposition',
    embedded: true,
    properties: {
        acrylic: 'float?',
        cashmere: 'float?',
        cotton: 'float?',
        denim: 'float?',
        leather: 'float?',
        linen: 'float?',
        modal: 'float?',
        nylon: 'float?',
        organicCotton: 'float?',
        polyester: 'float?',
        polyurethane: 'float?',
        rayon: 'float?',
        silk: 'float?',
        spandex: 'float?',
        suede: 'float?',
        wool: 'float?'
    }
};

export const mercariBrandSchema = {
    name: 'mercariBrand',
    properties: {
        _id: 'objectId',
        hashTags: 'hashTag<>',
        name: 'string',
        owner: 'string'
    },
    primaryKey: '_id'
};

export const mercariCategorySchema = {
    name: 'mercariCategory',
    properties: {
        _id: 'objectId',
        gender: 'string?',
        hashTags: 'hashTag<>',
        id: 'string',
        itemGroup: 'string?',
        name: 'string',
        owner: 'string',
        shipWeightPercent: 'float?',
        taxon: 'productTaxonomy'
    },
    primaryKey: '_id'
};

export const mercariSubCategorySchema = {
    name: 'mercariSubCategory',
    properties: {
        _id: 'objectId',
        apparelGroup: 'string?',
        apparelType: 'string?',
        hashTags: 'hashTag<>',
        id: 'string',
        itemGroup: 'string?',
        name: 'string',
        owner: 'string',
        parent: 'mercariCategory',
        shipWeightPercent: 'float?',
        taxon: 'productTaxonomy'
    },
    primaryKey: '_id'
};

export const mercariSubSubCategorySchema = {
    name: 'mercariSubSubCategory',
    properties: {
        _id: 'objectId',
        apparelGroup: 'string?',
        apparelType: 'string?',
        customItemFields: 'customItemField[]',
        fullname: 'string?',
        hashTags: 'hashTag<>',
        id: 'string',
        itemGroup: 'string?',
        legType: 'string?',
        name: 'string',
        owner: 'string',
        parent: 'mercariSubCategory',
        shipWeightPercent: 'float?',
        sizingType: 'string?',
        sleeveType: 'string?',
        taxon: 'productTaxonomy',
        topAdornment: 'string?'
    },
    primaryKey: '_id'
};

export const productSchema = {
    name: 'product',
    properties: {
        _id: 'objectId',
        apparelDetails: 'apparelDetails',
        brand: 'brand',
        circa: 'string?',
        classifier: 'classifier',
        color: 'string?',
        descriptiveText: 'string?',
        dimensions: 'float{}',
        features: 'string[]',
        flags: 'string<>',
        folder: 'uuid',
        hashTags: 'hashTag<>',
        materials: 'materialComposition{}',
        modelNo: 'string?',
        notes: 'string?',
        origin: 'string?',
        owner: 'string',
        productLine: 'productLine',
        shipWeightPercent: 'float?',
        styleNo: 'string?',
        taxon: 'productTaxonomy',
        upcs: 'barcode[]'
    },
    primaryKey: '_id'
};

export const productImageSchema = {
    name: 'productImage',
    properties: {
        _id: 'objectId',
        doNotRemoveBG: 'bool',
        original: 'binaryFile',
        owner: 'string',
        removeBg: 'binaryFile',
        sku: 'sku',
        uploadedFrom: 'string'
    },
    primaryKey: '_id'
};

export const productLineSchema = {
    name: 'productLine',
    properties: {
        _id: 'objectId',
        brand: 'brand',
        hashTags: 'hashTag<>',
        name: 'string',
        owner: 'string'
    },
    primaryKey: '_id'
};

export const productTaxonomySchema = {
    name: 'productTaxonomy',
    embedded: true,
    properties: {
        apparelType: 'string?',
        backlineType: 'string?',
        bookType: 'string?',
        collarType: 'string?',
        cuffType: 'string?',
        family: 'string?',
        frontType: 'string?',
        gender: 'string?',
        genus: 'string?',
        itemGroup: 'string?',
        kingdom: 'string?',
        klass: 'string?',
        legType: 'string?',
        lock: 'bool',
        mediaType: 'string?',
        name: 'string?',
        necklineType: 'string?',
        order: 'string?',
        phylum: 'string?',
        size: 'string?',
        sleeveType: 'string?',
        species: 'string?',
        topAdornment: 'string?',
        videoType: 'string?',
        waistType: 'string?'
    }
};

export const rnSchema = {
    name: 'rn',
    properties: {
        _id: 'objectId',
        addresses: 'address[]',
        brand: 'brand',
        companyName: 'string?',
        companyType: 'string?',
        flags: 'string<>',
        isImporter: 'bool',
        isInternet: 'bool',
        isMailOrder: 'bool',
        isManufacturer: 'bool',
        isOther: 'bool',
        isRetailer: 'bool',
        isWholesaler: 'bool',
        legalBusinessName: 'string?',
        material: 'string?',
        no: 'int',
        noType: 'string',
        owner: 'string',
        productLine: 'string?',
        rnNo: 'int',
        url: 'string?'
    },
    primaryKey: '_id'
};

export const scanSchema = {
    name: 'scan',
    embedded: true,
    properties: {
        bin: 'locationSegment',
        fixture: 'locationSegment',
        shelf: 'locationSegment',
        timestamp: 'date'
    }
};

export const sellingPriceSchema = {
    name: 'sellingPrice',
    embedded: true,
    properties: {
        floorPrice: 'float?',
        itemPrice: 'float?',
        shippingPayor: 'string',
        shippingService: 'shippingService',
        taxChargedToBuyer: 'float'
    }
};

export const shippingServiceSchema = {
    name: 'shippingService',
    embedded: true,
    properties: {
        carrier: 'string?',
        carrierId: 'int?',
        isMediaMail: 'bool?',
        maxWeightLbs: 'float?',
        shippingFee: 'float?',
        versionDate: 'string'
    }
};

export const skuSchema = {
    name: 'sku',
    properties: {
        _id: 'objectId',
        _barcode: 'string?',
        condition: 'string?',
        defects: 'string[]',
        owner: 'string',
        price: 'float',
        product: 'product',
        scans: 'scan[]',
        shipWeightPercent: 'float?',
        sku: 'barcode',
        skuPrinted: 'bool',
        upcs: 'barcode[]'
    },
    primaryKey: '_id'
};
const schema = [
    addressSchema,
    apparelDetailsSchema,
    barcodeSchema,
    binaryFileSchema,
    brandSchema,
    classifierSchema,
    customItemFieldSchema,
    draftSchema,
    hashTagSchema,
    hashTagUsageSchema,
    listingSchema,
    locationSegmentSchema,
    materialCompositionSchema,
    mercariBrandSchema,
    mercariCategorySchema,
    mercariSubCategorySchema,
    mercariSubSubCategorySchema,
    productSchema,
    productImageSchema,
    productLineSchema,
    productTaxonomySchema,
    rnSchema,
    scanSchema,
    sellingPriceSchema,
    shippingServiceSchema,
    skuSchema
];
// import $$schema from '../dto/collections';
// const client = new MongoClient('mongodb+srv://admin:Nv0DN8uRo9Otwb8i@jitt-core.p62mz.mongodb.net/test');
// const collection = client.db('jitt-mate').collection('productImage');

// // collection.updateMany({}, [{ $unset: 'cutNo' }]).then((D) => console.log(`${D.acknowledged} acknowledged, ${D.matchedCount} matched, ${D.modifiedCount} modified.`));

// const dir = '/media/bobby';

// // const Data = JSON.parse(fs.readFileSync('/home/bobby/Desktop/image-output.json').toString()) as typeof DataSchema;
// // console.log(`Data`);
// // console.log(JSON.stringify(Data, null, '\t'));

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
        // window.$$store = db;
        return db;
    } catch (error) {
        console.error((error as any).message);
        throw error
    }
}
// async function run() {
//     console.log('run');
//     const db = await setupRealm();
//     // db.syncSession?.addProgressNotification(ProgressDirection.Upload, ProgressMode.ReportIndefinitely, (transferred, transferrable) => {
//     //     console.log(`${transferred}/${transferrable} completed.`);
//     //     process.stdout.write(`${transferred}/${transferrable} completed.\n`);
//     // });
//     // const func = () => {
//     //     for (const item of Data) {
//     //         const sku = db.objectForPrimaryKey<ISku>('sku', new BSON.ObjectId(item.sku.$oid)) ?? undefined;
//     //         const entered = db.create<IProductImage>('productImage', {
//     //             uploadedFrom: item.originalfn,
//     //             doNotRemoveBG: false,
//     //             sku: sku,
//     //             _id: new BSON.ObjectId()
//     //         });
//     //         entered.update();
//     //         const toDelete = db.objectForPrimaryKey('productImage', new BSON.ObjectId(item._id.$oid));
//     //         db.delete(toDelete);
//     //     }
//     // // }
//     const promises = db
//         .objects<IProductImage>('productImage')
//         .filter(x => x.original == null || x.removeBg == null);
//     console.log(promises);
//     console.log(`length: ${promises.length}`);
//     // const promises2 =promises
//     //     .map((productImage) => () => {
//     //         return productImage.updateAsync(db);
//     //     })
//     //     .reduce(
//     //         (pv, cv) => async () => {
//     //             await pv();
//     //             await cv();
//     //         },
//     //         () => Promise.resolve()
//     //     );
//     // return promises2().finally(() => console.log('promises done'));
// }
// // run();
// // run()
// //     .then(() => {
// //         return window.$$store?.syncSession?.uploadAllLocalChanges();
// //     })
// //     .catch(catchError)
// //     .finally(() => console.log('DONE!'));

// // async function handleFileItem(baseDir: string, fn: string): Promise<string[]> {
// //     const fullname = [baseDir, fn].join('/');
// //     console.log(fullname);
// //     const stats = await fs.promises.stat(fullname);
// //     if (stats.isFile()) return [fullname];
// //     return fs
// //         .readdirSync(fullname)
// //         .map((x) => handleFileItem(fullname, x))
// //         .reduce(async (pv, cv) => {
// //             const p = await pv;
// //             const c = await cv;
// //             return [...p, ...c];
// //         }, Promise.resolve([]));
// // }
// // const infos = handleFileItem(dir, '1TB');
// // async function findFile(filename: string) {
// //     const info = await infos;
// //     return info.find((x) => path.basename(x) === filename);
// // }
// // async function run() {
// //     const output = [];
// //     for (const entry of Data) {
// //         output.push({
// //             ...entry,
// //             originalfn: await findFile(path.basename(entry.uploadedFrom))
// //         });
// //     }
// //     fs.writeFileSync('/home/bobby/Desktop/image-output.json', JSON.stringify(output, null, '\t'));
// // }
// // run().finally(() => console.log('DONE!'))

setupRealm().then(r => {
    console.log(r);
    r.objects('product').forEach(prod => {
        prod.app
    })
    console.log()
    console.log('DONE!');
})