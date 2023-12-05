import { BSON } from 'realm';

export const $initialCollection: Record<string, () => Promise<unknown>> = {
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
    productLine: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            name: null,
            brand: null
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
        })
    // branding: () => Promise.resolve({
    //     _id: new BSON.ObjectID(),
    //     type: 'brand',
    //     description: null,
    //     modelNo: null,
    //     brand: null,
    //     productLine: null,
    //     hashTags: []
    // })
};
