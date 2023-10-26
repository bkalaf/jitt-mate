// import Realm, { PropertySchema, PropertyTypeName, Types, BSON } from 'realm';

// import {
//     // MaterialKeys,
//     GenderKeys,
//     ApparelTypeKeys,
//     SizeKeys,
//     OriginKeys,
//     ColorKeys,
//     SleeveTypeKeys,
//     BookTypeKeys,
//     MovieRatingKeys,
//     GameRatingKeys,
//     AuctionSiteKeys,
//     LegTypeKeys,
//     NecklineTypeKeys,
//     BacklineTypeKeys,
//     WaistTypeKeys,
//     CollarTypeKeys,
//     CuffTypeKeys,
//     TopAdornmentKeys,
//     ItemGroupKeys
// } from './enums/importNecklineType';

// import { ApparelGroupKeys, ISizeEntry } from './enums/sizes';

// export interface IMercariBrand {
//     _id: BSON.ObjectId;
//     name: string;
// }
// export interface IBrand {
//     _id: BSON.ObjectId;
//     name: string;
//     mercariBrand: OptObj<IMercariBrand>;
//     website: Opt<string>;
//     folder: Opt<string>;
//     hash: Opt<string>;
// }
// export interface IMercariCategory {
//     _id: BSON.ObjectId;
//     name: string;
//     id: string;
// }
// export interface IMercariSubCategory {
//     _id: BSON.ObjectId;
//     name: string;
//     id: string;
//     parent: OptObj<IMercariCategory>;
// }
// export interface IMercariSubSubCategory {
//     _id: BSON.ObjectId;
//     name: string;
//     id: string;
//     parent: OptObj<IMercariSubCategory>;
//     fullname: string;
//     hash: Opt<string>;
// }
// export interface IClassifier {
//     _id: BSON.ObjectId;
//     name: string;
//     gender: Opt<GenderKeys>;
//     mercariSubSubCategory: OptObj<IMercariSubSubCategory>;
//     parent: OptObj<IClassifier>;
//     apparelType: Opt<ApparelTypeKeys>;
//     legType: Opt<LegTypeKeys>;
//     mediaMail: boolean;
//     apparelGroup: Opt<ApparelGroupKeys>;
//     itemGroup: Opt<ItemGroupKeys>;
//     hash: string[];
//     getCategory(): IMercariCategory;
//     getSubCategory(): IMercariSubCategory;
//     getSubSubCategory(): IMercariSubSubCategory;
//     getImportSize(): (value?: SizeKeys) => ISizeEntry | undefined;
// }
// export interface IProduct {
//     _id: BSON.ObjectId;
//     brand: OptObj<IBrand>;
//     classifier: OptObj<IClassifier>;
//     upcs: string[];
//     modelNo: Opt<string>;
//     styleNo: Opt<string>;
//     cutNo: Opt<string>;

//     size: Opt<SizeKeys>;
//     origin: Opt<OriginKeys>;
//     color: Opt<ColorKeys>;
//     // gender: Opt<GenderKeys>;

//     weightG: Opt<number>;
//     lengthIn: Opt<number>;
//     widthIn: Opt<number>;
//     heightIn: Opt<number>;
//     neckIn: Opt<number>;
//     sleeveIn: Opt<number>;
//     chestIn: Opt<number>;
//     waistIn: Opt<number>;
//     inseamIn: Opt<number>;
//     torsoIn: Opt<number>;

//     descriptiveText: Opt<string>;
//     rn: Opt<number>;
//     pocketCount: Opt<number>;
//     sleeveType: Opt<SleeveTypeKeys>;
//     necklineType: Opt<NecklineTypeKeys>;
//     backlineType: Opt<BacklineTypeKeys>;
//     waistType: Opt<WaistTypeKeys>;
//     collarType: Opt<CollarTypeKeys>;
//     cuffType: Opt<CuffTypeKeys>;
//     topAdornment: Opt<TopAdornmentKeys>;
//     // apparelType: Opt<ApparelTypeKeys>;
//     madeOf: Opt<MadeOf>;
//     features: string[];
//     circa: Opt<string>;

//     title: Opt<string>;
//     subtitle: Opt<string>;
//     authors: string[];
//     publisher: Opt<string>;
//     pages: Opt<number>;
//     copyright: Opt<number>;
//     edition: Opt<number>;
//     bookType: Opt<BookTypeKeys>;

//     rating: Opt<MovieRatingKeys | GameRatingKeys>;
//     runtimeMin: Opt<number>;
//     starring: string[];
//     directedBy: string[];

//     hasTags: boolean;
//     isVintage: boolean;
//     isRare: boolean;
//     notes: Opt<string>;
// }

// export const toType = (name: string) => {
//     const result: IRealmType = (() => {
//         return name;
//     }) as any;
//     result.req = name;
//     result.opt = [name, '?'].join('');
//     result.list = [name, '[]'].join('');
//     result.dictionary = [name, '{}'].join('');
//     result.set = [name, '<>'].join('');
//     return result;
// };

// const $bool = (() => 'bool?') as BoolType;
// $bool.true = { type: 'bool', default: true };
// $bool.false = { type: 'bool', default: false };
// const $string: StringType = toType('string') as any;
// $string.empty = { type: 'string', default: '' };
// const $number = (n: PropertyTypeName): NumberType => {
//     const result = toType(n) as NumberType;
//     result.zero = { type: n, default: 0 };
//     result.two = { type: n, default: 2 };
//     return result;
// };

// export const $db: DB = {
//     objectId: 'objectId',
//     bool: $bool,
//     string: $string,
//     int: $number('int'),
//     float: $number('float'),
//     double: $number('double'),
//     decimal128: $number('decimal128'),
//     uuid: 'uuid',
//     date: toType('date'),
//     data: toType('data'),
//     mercariBrand: toType('mercariBrand'),
//     brand: toType('brand'),
//     mercariCategory: toType('mercariCategory'),
//     mercariSubCategory: toType('mercariSubCategory'),
//     mercariSubSubCategory: toType('mercariSubSubCategory'),
//     classifier: toType('classifier'),
//     product: toType('product'),
//     sku: toType('sku'),
//     listing: toType('listing'),
//     draft: toType('draft'),
//     locationSegment: toType('locationSegment'),
//     productImage: toType('productImage'),
//     scan: toType('scan'),
    
// } as any;

// $db.backlink = (name: keyof typeof $db, property: string) =>
//     ({
//         type: 'linkingObjects',
//         objectType: name,
//         property
//     } as PropertySchema);

// export interface ISku {
//     _id: BSON.ObjectId;
//     sku: string;
//     product: OptObj<IProduct>;
//     price: number;
//     condition: 1 | 2 | 3 | 4 | 5;
//     defects: string[];
//     skuPrinted: boolean;
//     scans: Realm.Types.List<IScan>;
//     readonly productImages: IProductImage[];
//     isNoBrand(): boolean;
//     mercariBrandName(): string | undefined;
//     brandName(): string;
//     categoryId(): string;
//     subCategoryId(): string;
//     subSubCategoryId(): string;
//     apparelType(): ApparelTypeKeys | undefined;
//     gender(): GenderKeys | undefined;
//     color(): string | undefined;
//     weight(): { lb?: number; oz?: number };
//     dims():
//         | {
//               length?: number;
//               width?: number;
//               height?: number;
//           }
//         | undefined;
//     isMediaMail(): boolean;
//     shippingService(): 'standard' | 'media-mail';
//     carrier(): [number, string, number];
//     addScan(realm: Realm, scan: IScan): ISku;
//     readonly lastLocation: IScan | undefined;
// }

// export interface IProductImage {
//     _id: BSON.ObjectId;
//     filename: string;
//     sku: OptObj<ISku>;
//     readonly skuBarcode: Opt<string>;
//     readonly brandFolder: string;
//     readonly itemFolder: Opt<string>;
//     readonly fullpath: Opt<string>;
//     readonly originalFullPath: Opt<string>;
//     readonly removeBGFilename: string;
//     readonly removeBGFullPath: Opt<string>;
//     readonly hasRemoveBG: boolean;
//     readonly effectivePath: Opt<string>;
// }

// export interface IDraft {
//     _id: BSON.ObjectId;
//     sku: OptObj<ISku>;
//     draftId: Opt<string>;
//     title: string;
//     description: string;
//     hashes: string[];
//     itemFolder: string;
//     shippingPrice: number;
//     listingBackLink: Types.LinkingObjects<IListing, 'draft'>;
//     isReadyToPost: boolean;
//     isReady: boolean;
//     recommendedPrice: Opt<number>;
//     readonly getCategoryName: string;
//     readonly getSubCategoryName: string;
//     readonly getSubSubCategoryName: string;
//     readonly isPostable: boolean;
//     readonly isNoBrand: boolean;
//     readonly getBrandName: string | undefined;
//     readonly getMercariBrandName: string | undefined;
//     readonly getBrandFolder: string | undefined;
//     readonly getCategoryId: string;
//     readonly getSubCategoryId: string;
//     readonly getSubSubCategoryId: string;
//     readonly getCondition: ConditionKeys;
//     readonly getColor: ColorKeys | undefined;
//     readonly getMercariColor: MercariColor | undefined;
//     readonly getWeight: number;
//     readonly getShipWeight: EnglishWeight;
//     readonly getDimensions: LWH | undefined;
//     readonly hasDimensions: boolean;
//     readonly getShippingService: ShippingService;
//     readonly getCarrier: string;
//     readonly getCarrierId: number;
//     readonly isListed: boolean;
//     readonly getFullBrandFolder: string;
//     readonly getFullItemFolder: string;
//     readonly getFullFinalFolder: string;
//     readonly getImages: string[];
//     autofill(realm: Realm): Realm.Object<IDraft> & IDraft;
// }
// export interface IListing {
//     _id: BSON.ObjectId;
//     draft: OptObj<IDraft>;
//     auctionSite: AuctionSiteKeys;
//     listingId: string;
//     createdOn: Date;
// }

// export interface ILocationSegment {
//     _id: BSON.ObjectId;
//     barcode: string;
//     name: string;
//     type: LocationTypeKeys;
//     color: Opt<LocationLabelColor>;
//     notes: Opt<string>;
//     kind: Opt<LocationKind>;
// }

// export interface IScan {
//     fixture?: Opt<ILocationSegment>;
//     shelf?: Opt<ILocationSegment>;
//     bin?: Opt<ILocationSegment>;
//     timestamp: Date;
// }
