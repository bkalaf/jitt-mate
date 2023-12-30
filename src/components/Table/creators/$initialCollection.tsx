import { BSON } from 'realm';
import { dateFromNow } from '../../../common/date/dateFromNow';
import { IApparelDetails, IProduct, IProductTaxonomy, ISku } from '../../../dal/types';

const apparelDetailsInit = async (): Promise<Serialized<IApparelDetails>> => ({
    backlineType: null,
    collarType: null,
    cuffType: null,
    necklineType: null,
    sleeveType: null,
    topAdornment: null,
    waistType: null,
    size: null,
    styleNo: null,
    cutNo: null,
    // pocketCount: 0,
    measurements: {} as any,
    rn: null,
    clothingCare: [],
    apparelType: null,
    chestFitType: null,
    frontType: null,
    gender: null,
    itemGroup: null,
    legType: null
});
const productTaxonomyInit = async (): Promise<Serialized<IProductTaxonomy>> => ({
    lock: false,
    kingdom: null,
    phylum: null,
    family: null,
    klass: null,
    order: null,
    genus: null,
    species: null,
    name: '',
    apparelType: null,
    backlineType: null,
    chestFitType: null,
    bookType: null,
    collarType: null,
    cuffType: null,
    gender: null,
    frontType: null,
    gameRating: null,
    movieRating: null,
    videoType: null,
    itemGroup: null,
    legType: null,
    mediaFormatType: null,
    necklineType: null,
    size: null,
    sleeveType: null,
    topAdornment: null,
    waistType: null
})
export const $initialCollection: Record<string, () => Promise<unknown>> = {
    string: () => Promise.resolve(''),
    int: () => Promise.resolve(null),
    float: () => Promise.resolve(null),
    date: () => Promise.resolve(null),
    bool: () => Promise.resolve(false),
    apparelDetails: apparelDetailsInit,
    barcode: () =>
        Promise.resolve({
            rawValue: ''
        }),
    brand: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            name: null,
            website: null,
            folder: null,
            parent: null,
            mercariBrand: null,
            hashTags: []
        }),
    classifier: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            name: null,
            shortname: null,
            mercariSubSubCategory: null,
            isAthletic: false
        }),
    hashTag: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            name: null,
            usage: []
        }),
    hashTagUsage: () =>
        Promise.resolve({
            from: new Date(Date.now()),
            count: 0
        }),
    locationSegment: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            name: null,
            type: null,
            color: null,
            notes: null,
            kind: null,
            upcs: []
        }),
    materialComposition: () =>
        Promise.resolve({
            acrylic: null,
            cotton: null,
            organicCotton: null,
            denim: null,
            linen: null,
            silk: null,
            wool: null,
            suede: null,
            leather: null,
            polyester: null,
            polyurethane: null,
            nylon: null,
            rayon: null,
            modal: null,
            spandex: null,
            cashmere: null
        }),
    mercariBrand: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            name: null,
            hashTags: []
        }),
    mercariCategory: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            name: null,
            id: null,
            hashTags: [],
            shipWeightPercent: null,
            taxon: {
                lock: false
            }
        }),
    mercariSubCategory: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            name: null,
            id: null,
            parent: null,
            hashTags: [],
            shipWeightPercent: null,
            taxon: {
                lock: false
            }
        }),
    mercariSubSubCategory: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            name: null,
            id: null,
            parent: null,
            fullname: null,
            customItemFields: [],
            hashTags: [],
            shipWeightPercent: null,
            taxon: {
                lock: false
            }
        }),
    product: async (): Promise<Serialized<IProduct>> => ({
        _id: new BSON.ObjectId(),
        folder: new BSON.UUID(),
        apparelDetails: await apparelDetailsInit() as any,
        brand: null,
        circa: null,
        classifier: null,
        color: null,
        descriptiveText: null,
        dimensions: {},
        features: [],
        flags: [],
        materials: {},
        modelNo: null,
        notes: null,
        origin: null,
        productLine: null,
        styleNo: null,
        taxon: await productTaxonomyInit(),
        hashTags: [],
        shipWeightPercent: null,
        upcs: []
    }),
    productImage: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            uploadedFrom: '',
            doNotRemoveBG: false,
            sku: null,
            originalData: null,
            originalMimeType: '',
            removeBGData: null,
            removeBGMimeType: ''
        }),
    productLine: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            name: null,
            brand: null,
            hashTags: []
        }),
    rn: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            companyName: '',
            legalBusinessName: null,
            companyType: null,
            rnNo: 0,
            isImporter: false,
            isRetailer: false,
            isMailOrder: false,
            isInternet: false,
            isOther: false,
            isManufacturer: false,
            isWholesaler: false,
            noType: 'rn',
            productLine: null,
            material: null,
            url: null,
            brand: null,
            addresses: []
        }),
    scan: () => {
        return Promise.resolve({
            timestamp: dateFromNow(),
            fixture: null,
            bin: null,
            shelf: null
        });
    },
    sku: async (): Promise<Serialized<ISku>> => {
        return {
            _id: new BSON.ObjectId(),
            defects: [],
            scans: [],
            upcs: [],
            hashTags: [],
            shipWeightPercent: null,
            price: 20,
            condition: 'good',
            skuPrinted: false,
            product: null
        };
    }
};
