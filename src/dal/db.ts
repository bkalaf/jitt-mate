import Realm, { PropertySchema, PropertyTypeName, Types, BSON } from 'realm';

import {
    MaterialKeys,
    AuctionSiteKeys} from '../enums/importNecklineType';
import { toType } from '../common/toType';
import { ISku } from './types';

export type MadeOf = Partial<Record<MaterialKeys, number>>;
// export type Optional<T> = T | undefined;
export type OptObj<T> = (Realm.Object<T> & T) | undefined;



export interface IRealmType {
    (): string;
    req: string;
    opt: string;
    list: string;
    dictionary: string;
    set: string;
}
interface BoolType {
    (): string;
    true: { type: PropertyTypeName; default: boolean };
    false: { type: PropertyTypeName; default: boolean };
}
interface StringType extends IRealmType {
    empty: { type: PropertyTypeName; default: string };
}
interface NumberType extends IRealmType {
    zero: { type: PropertyTypeName; default: number };
    two: { type: PropertyTypeName; default: number };
}
const $bool = (() => 'bool?') as BoolType;
$bool.true = { type: 'bool', default: true };
$bool.false = { type: 'bool', default: false };
const $string: StringType = toType('string') as any;
$string.empty = { type: 'string', default: '' };
const $number = (n: PropertyTypeName): NumberType => {
    const result = toType(n) as NumberType;
    result.zero = { type: n, default: 0 };
    result.two = { type: n, default: 2 };
    return result;
};

type DB = { [P in RealmObjects]: IRealmType } & {
    objectId: string;
    bool: BoolType;
    string: StringType;
    int: NumberType;
    float: NumberType;
    decimal128: NumberType;
    double: NumberType;
    uuid: string;
    date: IRealmType;
    data: IRealmType;
    backlink(name: string, property: string): PropertySchema;
};
export const $db: DB = {
    objectId: 'objectId',
    bool: $bool,
    string: $string,
    int: $number('int'),
    float: $number('float'),
    double: $number('double'),
    decimal128: $number('decimal128'),
    uuid: 'uuid',
    date: toType('date'),
    data: toType('data'),
    mercariBrand: toType('mercariBrand'),
    brand: toType('brand'),
    mercariCategory: toType('mercariCategory'),
    mercariSubCategory: toType('mercariSubCategory'),
    mercariSubSubCategory: toType('mercariSubSubCategory'),
    classifier: toType('classifier'),
    product: toType('product'),
    sku: toType('sku'),
    listing: toType('listing'),
    draft: toType('draft'),
    locationSegment: toType('locationSegment'),
    productImage: toType('productImage'),
    scan: toType('scan'),
    customItemField: toType('customItemField'),
    hashTagUsage: toType('hashTagUsage'),
    hashTag: toType('hashTag'),
    rn: toType('rn'),
    barcode: toType('barcode'),
    address: toType('address')
} as any;

$db.backlink = (name: keyof typeof $db, property: string) =>
    ({
        type: 'linkingObjects',
        objectType: name,
        property
    } as PropertySchema);


export interface IDraft {
    _id: BSON.ObjectId;
    sku: OptObj<ISku>;
    draftId: Optional<string>;
    title: string;
    description: string;
    hashes: string[];
    itemFolder: string;
    shippingPrice: number;
    listingBackLink: Types.LinkingObjects<IListing, 'draft'>;
    isReadyToPost: boolean;
    isReady: boolean;
    recommendedPrice: Optional<number>;
        // readonly getCategoryName: string;
        // readonly getSubCategoryName: string;
        // readonly getSubSubCategoryName: string;
        // readonly isPostable: boolean;
        // readonly isNoBrand: boolean;
        // readonly getBrandName: string | undefined;
        // readonly getMercariBrandName: string | undefined;
        // readonly getBrandFolder: string | undefined;
        // readonly getCategoryId: string;
        // readonly getSubCategoryId: string;
        // readonly getSubSubCategoryId: string;
        // readonly getCondition: ConditionKeys;
        // readonly getColor: ColorKeys | undefined;
        // readonly getMercariColor: MercariColor | undefined;
        // readonly getWeight: number;
        // readonly getShipWeight: EnglishWeight;
        // readonly getDimensions: LWH | undefined;
        // readonly hasDimensions: boolean;
        // readonly getShippingService: ShippingServiceKeys;
        // readonly getCarrier: string;
        // readonly getCarrierId: number;
        // readonly isListed: boolean;
        // readonly getFullBrandFolder: string;
        // readonly getFullItemFolder: string;
        // readonly getFullFinalFolder: string;
        // readonly getImages: string[];
    autofill(realm: Realm): Realm.Object<IDraft> & IDraft;
}
export interface IListing {
    _id: BSON.ObjectId;
    draft: OptObj<IDraft>;
    auctionSite: AuctionSiteKeys;
    listingId: string;
    createdOn: Date;
}






export interface IListing2 {
    _id: BSON.ObjectId;
    sku: OptObj<ISku>;
    listingId: Optional<string>;
    title: string;
    description: string;
    hashes: string[];
    shippingPrice: number;
    itemFolder: Optional<string>;

    isNoBrand(): boolean;
    brandName(): string | undefined;
    categoryId(): string;
    subCategoryId(): string;
    subSubCategoryId(): string;
    condition(): ConditionKeys;
    color(): string | undefined;
    weight(): EnglishWeight;
    dims(): LWH | undefined;
    hasDims(): boolean;
    shippingService(): ShippingServiceKeys;
    price(): number;
    carrier(): string;
    carrierId(): number;
    smartPricingOn(): boolean;
    smartOffersOn(): boolean;
    brandFolder(): string;
}
