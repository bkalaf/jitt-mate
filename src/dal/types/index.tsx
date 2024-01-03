import { BSON } from 'realm';
import { LocationTypesKeys } from '../enums/locationTypes';
import { MaterialTypes } from '../enums/materialTypes';
import { ColorsInfos } from '../enums/colors';
import * as LaundryCare from '../../../laundry-care.json';
import { ItemConditionsInfos } from '../enums/itemConditions';
import { IApparelEnums, IDecorEnums, IHomeEnums, IMediaEnums } from './enumTypes';
import { MarketplacesInfos } from '../enums/marketplaces';
import { DraftStatusInfos } from '../enums/draftStatus';
import { ShippingVersionsKeys } from '../enums/shippingVersions';
import { RnNumberTypesKeys } from '../enums/rnNumberType';
import { ChestFitTypesKeys } from '../enums/chestFitTypes';
import { LocationLabelColorsKeys } from '../enums/locationLabelColors';
import { LocationKindsKeys } from '../enums/locationKinds';
import { BarcodeTypesKeys } from '../enums/barcodeTypes';
import { IAppConfigContext } from '../../components/Contexts/AppConfigContext';

export type LaundryCareOptions = keyof typeof LaundryCare;

export interface IRealmObject<T> {
    update(this: Entity<T>): Entity<T>;
}
export interface IRealmEntity<T> extends IRealmObject<T> {
    _id: OID;
}
export interface IDetails<T, TEnum> extends IRealmObject<T & TEnum> {
    readonly getProduct: OptionalEntity<IProduct>;
    readonly getSku: OptionalEntity<ISku>;
    titleGenerator(sku: ISku, extraCharacters?: boolean, showMetric?: boolean, ignoreCap?: boolean): string;
    narrativeGenerator(sku: ISku, extraCharacters?: boolean, showMetric?: boolean, ignoreCap?: boolean): string;
    // generateTitle(ignoreCap?: boolean, indexCap?: number): string;
    // generateNarrative(indexCap?: number): string;
}

export interface IHashTagged {
    hashTags: DBSet<Entity<IHashTag>>;
    readonly effectiveHashTags: Entity<IHashTag>[];
}
export interface IProductAttributes extends IHashTagged {
    shipWeightPercent: Optional<number>;
    taxon: OptionalEntity<IProductTaxonomy>;
    readonly effectiveShipWeightPercent: Optional<number>;
    readonly effectiveKingdom: Optional<string>;
    readonly effectivePhylum: Optional<string>;
    readonly effectiveKlass: Optional<string>;
    readonly effectiveOrder: Optional<string>;
    readonly effectiveFamily: Optional<string>;
    readonly effectiveGenus: Optional<string>;
    readonly effectiveSpecies: Optional<string>;
    // readonly effectiveTaxon: OptionalEntity<IProductTaxonomy>;
}

export type Measurements = 'chest' | 'neck' | 'inseam' | 'length' | 'sleeve' | 'torso' | 'waist' | 'hip' | 'foot' | 'bust' | 'head' | 'heel';
export type ProductFlags = 'decorative' | 'rare' | 'vintage' | 'collectible' | 'discontinued' | 'missingTags';

export const Flags = ['isAthletic', 'isDecorative', 'isGraphic', 'isRare', 'isVintage', 'isCollectible', 'isDiscontinued', 'isMediaMail', 'isMissingTags'];
export type MeasurementKeys = `${Measurements}Inches`;

export interface IHashTagUsage {
    from: Date;
    count: number;
}

export interface IHashTag extends IRealmEntity<IHashTag> {
    name: string;
    usage: DBList<IHashTagUsage>;
    readonly $highestUsage: Optional<IHashTagUsage>;
    readonly $mostRecentUsage: Optional<IHashTagUsage>;
    readonly $maxCount: number;
    readonly $mostRecentCount: number;
    readonly $mostRecentDate: Optional<Date>;
    readonly $daysSinceMax: Optional<number>;
    addUsage(count?: number): Entity<IHashTag>;
}

export interface IMercariBrand extends IRealmEntity<IMercariBrand>, IHashTagged {
    name: string;
}

export interface IBrand extends IRealmEntity<IBrand>, IHashTagged {
    name: string;
    mercariBrand: OptionalEntity<IMercariBrand>;
    website: Optional<string>;
    folder: string;
    parent: OptionalEntity<IBrand>;
    readonly mercariBrandName: Optional<string>;
}

export interface IAddress {
    line1: Optional<string>;
    line2: Optional<string>;
    city: Optional<string>;
    province: Optional<string>;
    postalCode: Optional<string>;
    country?: Optional<string>;
    readonly streetOnly: Optional<string>;
    readonly cityState: Optional<string>;
    readonly output: string;
}
export type RnTypes = 'importer' | 'other' | 'mailOrder' | 'retailer' | 'wholesale' | 'manufacturing' | 'internet';

export type ToIsKey<T extends string> = `is${Capitalize<T>}`;
export type FlagsKeys<TFlags extends string, TExtends extends Array<{ flags: DBSet<any> }>> =
    | ToIsKey<TFlags>
    | (TExtends extends never[] ? never : TExtends extends Array<{ flags: DBSet<infer R> }> ? R : never);
// export type IFlagDictionary = Partial<Record<FlagsKeys, boolean>>;
export type FK2 = FlagsKeys<'mediaMail' | 'athletic' | 'graphic', []>;
export type FK1 = FlagsKeys<'importer' | 'retailer', [{ flags: DBSet<FK2> }]>;

export type Flagged<TFlags extends string, TExtends extends Array<{ flags: DBSet<any> }>> = {
    readonly [P in FlagsKeys<TFlags, TExtends>]: boolean;
} & {
    flags: DBSet<FlagsKeys<TFlags, TExtends>>;
};

export interface IRn extends IRealmEntity<IRn>, Flagged<RnTypes, []> {
    companyName: string;
    rnNo: number;
    legalBusinessName: Optional<string>;
    companyType: Optional<string>;
    // isRetailer: boolean;
    // isMailOrder: boolean;
    // isInternet: boolean;
    // isImporter: boolean;
    // isOther: boolean;
    noType: Optional<RnNumberTypesKeys>;
    // flags: DBSet<RnTypesFlags>;
    // isManufacturer: boolean;
    // isWholesaler: boolean;
    productLine: Optional<string>;
    material: Optional<string>;
    url: Optional<string>;
    brand: OptionalEntity<IBrand>;
    readonly scrapedOn: Date;
    addresses: DBList<IAddress>;
}

export interface IMeasurementDictionary {
    chestInches: Optional<number>;
    chestFit: Optional<ChestFitTypesKeys>;
    neckInches: Optional<number>;
    inseamInches: Optional<number>;
    lengthInches: Optional<number>;
    sleeveInches: Optional<number>;
    torsoInches: Optional<number>;
    bustInches: Optional<number>;
    headInches: Optional<number>;
    heelInches: Optional<number>;
    hipInches: Optional<number>;
    footInches: Optional<number>;
    waistInches: Optional<number>;
}
export interface IProductTaxonomy extends IRealmObject<IProductTaxonomy> {
    kingdom: Optional<string>;
    phylum: Optional<string>;
    klass: Optional<string>;
    order: Optional<string>;
    family: Optional<string>;
    genus: Optional<string>;
    species: Optional<string>; //apparel
    name: Optional<string>;
    lock: Optional<boolean>;
    readonly fullname: string;
}
export interface ICategorySelector extends IProductAttributes {
    id: string;
}
export interface IParented<T> {
    parent: OptionalEntity<T>;
    readonly fullname: string;
}
export interface IMercariCategory extends IRealmEntity<IMercariCategory>, ICategorySelector {
    name: string;
}
export interface IMercariSubCategory extends IRealmEntity<IMercariSubCategory>, ICategorySelector, IParented<IMercariCategory> {
    name: string;
    readonly categoryID: Optional<string>;
}

export interface ICustomItemField {
    name: string;
    options: string[];
    readonly $selectors: { input: string; dropdown: string; options: string };
    readonly $optionMap: Record<number, string>;
}

export interface IMercariSubSubCategory extends IRealmEntity<IMercariSubSubCategory>, ICategorySelector, IParented<IMercariSubCategory> {
    name: string;
    fullname: string;
    customItemFields: DBList<ICustomItemField>;
    readonly categoryID: Optional<string>;
    readonly subCategoryID: Optional<string>;
}

export interface IClassifier extends IRealmEntity<IClassifier>, IProductAttributes {
    name: string;
    mercariSubSubCategory: OptionalEntity<IMercariSubSubCategory>;
    shortname: Optional<string>;
    notes: Optional<string>;
    readonly categoryID: Optional<string>;
    readonly subCategoryID: Optional<string>;
    readonly subSubCategoryID: Optional<string>;
    readonly isAthletic: boolean;
    readonly isMediaMail: boolean;
    readonly isGraphic: boolean;
}
export interface IUPC {
    upcs: DBList<Entity<IBarcode>>;
    readonly barcode: OptionalEntity<IBarcode>;
}

export interface ILocationSegment extends IRealmEntity<ILocationSegment>, IUPC {
    name: string;
    type: Optional<LocationTypesKeys>;
    color: Optional<LocationLabelColorsKeys>;
    notes: Optional<string>;
    kind: Optional<LocationKindsKeys>;
}
export interface IProductLine extends IRealmEntity<IProductLine>, IHashTagged {
    brand: OptionalEntity<IBrand>;
    name: string;
}
// export interface IBranding_Brand extends IRealmEntity<IBranding_Brand>, IHashTagged {
//     brand: OptionalEntity<IBrand>;
//     modelNo: Optional<string>;
//     description: Optional<string>;
//     readonly getBrand: IBrand;
// }
// export interface IBranding_ProductLine extends IRealmEntity<IBranding_ProductLine>, IHashTagged {
//     productLine: OptionalEntity<IProductLine>;
//     readonly getBrand: IBrand;
//     modelNo: Optional<string>;
//     description: Optional<string>;
// }
// export interface IBranding extends IRealmEntity<IBranding>, IHashTagged {
//     type: 'brand' | 'productLine';
//     brand: OptionalEntity<IBrand>;
//     productLine: OptionalEntity<IProductLine>;
//     modelNo: Optional<string>;
//     description: Optional<string>;
//     readonly getBrand: OptionalEntity<IBrand>;
// }

export interface IScan {
    fixture?: OptionalEntity<ILocationSegment>;
    shelf?: OptionalEntity<ILocationSegment>;
    bin?: OptionalEntity<ILocationSegment>;
    timestamp: Date;
    readonly output: string;
}
// export interface IMediaDetails {
//     authors: string[];
//     title: Optional<string>;
//     copyright: Optional<number>;
//     subtitle: Optional<string>;
//     gameRating: Optional<GameRatingKeys>;
// }
// export interface IBookDetails extends IMediaDetails {
//     bookType: Optional<BookTypeKeys>;
//     pages: Optional<number>;
//     publisher: Optional<string>;
//     edition: Optional<number>;
// }
// export interface IVideoDetails extends IMediaDetails {
//     starring: string[];
//     movieRatings: Optional<MovieRatingKeys>;
//     directedBy: string[];
//     runtimeMin: Optional<number>;
//     studio: Optional<string>;
// }

export type Distances = 'length' | 'width' | 'height' | 'diameter';
export type Volumes = 'volume';
export type Capacity = 'capacity';
export type Timespans = 'runtime';
export type CurrentDirection = 'input' | 'output';
export type Voltages = 'Voltage';
export type Wattages = 'Wattage';
export type Amperages = 'Amperage';
export type ChargeWithUnits = `${Voltages}Volts` | `${Amperages}Amps` | `${Wattages}Watts`;
export type Electrical = `${CurrentDirection}${ChargeWithUnits}`;
export type DimensionKeys = `${Distances}Inches` | `${Volumes}FlOz` | `${Capacity}GB` | `${Timespans}Min` | `weightGrams` | Electrical;
export type IDimensions = Record<DimensionKeys, number>;
export type IMadeOfDictionary = Partial<Record<string, Record<keyof typeof MaterialTypes, number>>>;

export interface IApparelProperties {
    discriminator: 'apparel';
    clothingCare: DBSet<LaundryCareOptions>;
    cutNo: Optional<string>;
    measurements: IMeasurementDictionary;
    rn: OptionalEntity<IRn>;
    styleNo: Optional<string>;
}
export interface IMediaProperties {
    discriminator: 'media';
}
export type IApparelDetails = IDetails<IApparelProperties, IApparelEnums>;
export type IMediaDetails = IDetails<IMediaProperties, IMediaEnums>;
export type IHomeDetails = IDetails<AnyObject, IHomeEnums>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type IDecorDetails = IDetails<
    AnyObject,
    // eslint-disable-next-line @typescript-eslint/ban-types
    IDecorEnums
> & IDecorEnums;

export interface IMaterialComposition extends IRealmObject<IMaterialComposition> {
    acrylic: Optional<number>;
    cotton: Optional<number>;
    cashmere: Optional<number>;
    denim: Optional<number>;
    polyurethane: Optional<number>;
    leather: Optional<number>;
    silk: Optional<number>;
    linen: Optional<number>;
    modal: Optional<number>;
    nylon: Optional<number>;
    organicCotton: Optional<number>;
    polyester: Optional<number>;
    rayon: Optional<number>;
    suede: Optional<number>;
    wool: Optional<number>;
    spandex: Optional<number>;
    readonly toOutput: string;
    readonly isComplete: boolean;
    readonly remaining: number;
    readonly hasValues: boolean;
}

export interface IDetailed {
    readonly effectiveDiscriminator: string;
    readonly effectiveApparelDetails: Optional<Partial<IApparelEnums & IApparelProperties>>;
    readonly effectiveMediaDetails: Optional<Partial<IMediaEnums & IMediaProperties>>;
}
export interface IAttachment extends IRealmEntity<IAttachment> {
    uploadedFrom: string;
    fullpath: string;
    file: Optional<IBinaryFile<'manual' | 'video' | 'doc'>>;
    product: OptionalEntity<IProduct>;
}
export interface ILinkedItem {
    type: string;
    attachment: OptionalEntity<IAttachment>;
    url: Optional<string>;
}
export interface IProduct extends IRealmEntity<IProduct>, IProductAttributes, IHashTagged, IUPC, IDetailed {
    checkTaxa(...items: string[]): boolean;
    readonly summaryName: string;
    _id: BSON.ObjectId;
    flags: DBSet<string>;
    apparelDetails: IApparelDetails & IApparelProperties & IApparelEnums; // OptionalEntity<IApparelDetails>;
    brand: OptionalEntity<IBrand>;
    circa: Optional<string>;
    classifier: OptionalEntity<IClassifier>;
    color: Optional<keyof typeof ColorsInfos>;
    decorDetails: OptionalEntity<IDecorDetails>;
    descriptiveText: Optional<string>;
    dimensions: IDimensions & DBDictionary<number>;
    features: DBList<string>;
    folder: BSON.UUID;
    materials: DBDictionary<IMaterialComposition>;
    modelNo: Optional<string>;
    notes: Optional<string>;
    origin: Optional<string>;
    productLine?: OptionalEntity<IProductLine>;
    styleNo: Optional<string>;
    taxon: OptionalEntity<IProductTaxonomy>;
    shipWeightPercent: Optional<number>;
    attachments: DBDictionary<IAttachment>;
    links: DBDictionary<ILinkedItem>;
    compatibleWith: DBList<string>;
    readonly isNoBrand: boolean;
    readonly effectiveBrand: OptionalEntity<IBrand>;
    readonly effectiveMercariBrandName: Optional<string>;
    readonly effectiveBrandName: Optional<string>;
    readonly effectiveBrandFolder: Optional<string>;
    readonly effectiveCategoryID: Optional<string>;
    readonly effectiveCategoryName: Optional<string>;
    readonly effectiveSubCategoryID: Optional<string>;
    readonly effectiveSubCategoryName: Optional<string>;
    readonly effectiveSubSubCategoryName: Optional<string>;

    readonly effectiveSubSubCategoryID: Optional<string>;
    // readonly effectiveApparelDetails: Optional<IApparelEnums>;
}

export interface IBarcode extends IRealmObject<IBarcode> {
    rawValue: string;
    type: Optional<BarcodeTypesKeys>;
    valid: boolean;
    equalTo(value: string): boolean;
    equalToWithoutCheckdigit(value: string): boolean;
    scanEqual(value: string): boolean;
    readonly ordinal: number;
    readonly checkdigit: string;
    readonly barcode: string;
    readonly scanValue: string; // padded to 17 with checkdigt
    readonly isUPC: boolean;
    readonly isISBN: boolean;
    readonly isLocator: boolean;
    readonly isSKU: boolean;
    readonly isTruncated: boolean;
}
export interface ISku extends IRealmEntity<ISku>, IHashTagged, IUPC {
    addSKU(pullNextUPC: IAppConfigContext['pullNextUPC'], bc?: string): ISku;
    readonly isNoBrand: boolean;
    readonly effectiveBrand: OptionalEntity<IBrand>;
    product: OptionalEntity<IProduct>;
    price: number;
    condition: keyof typeof ItemConditionsInfos;
    defects: DBList<string>;
    skuPrinted: boolean;
    scans: DBList<IScan>;
    // readonly productImages: DBBacklink<IProductImage>;
    readonly summaryName: string;
    shipWeightPercent: Optional<number>;
    // markForPrinting(realm: Realm): Entity<ISku>;
    // unmarkForPrinting(realm: Realm): Entity<ISku>;
    appendScan(fixture?: ILocationSegment, shelf?: ILocationSegment, bin?: ILocationSegment): Entity<ISku>;
    // readonly effective: {
    //     brand: OptionalEntity<IBrand>;
    //     mercariBrandName: Optional<string>;
    //     isNoBrand: boolean;
    //     brandName: Optional<string>;
    //     brandFolder: Optional<string>;
    //     productFolder: Optional<string>;
    //     skuFolder: Optional<string>;
    //     taxon: OptionalEntity<IProductTaxonomy>;
    //     shipWeightPercent: Optional<number>;
    //     hashTags: string[];
    //     categoryID: Optional<string>;
    //     subCategoryID: Optional<string>;
    //     subSubCategoryID: Optional<string>;
    //     colorID: Optional<string>;
    //     conditionID: Optional<string>;
    //     // productImages: string[];
    //     productUPCS: string[];
    //     sku: OptionalEntity<IBarcode>;
    //     weightGrams: number;
    //     // shipWeightGrams: number;
    //     // shipWeightPounds: [number, number];
    // }
}

export interface IBinaryFile<T extends string> extends IRealmObject<IBinaryFile<T>> {
    mimeType: string;
    data: ArrayBuffer;
    type: T;
}

export interface IProductImage extends IRealmEntity<IProductImage> {
    uploadedFrom: string;
    sku: OptionalEntity<ISku>;
    doNotRemoveBG: boolean;
    original: OptionalEntity<IBinaryFile<'original'>>;
    removeBg: OptionalEntity<IBinaryFile<'remove-bg'>>;
    readonly effectivePath: string;
}

export interface IShippingService extends IRealmObject<IShippingService> {
    versionDate: ShippingVersionsKeys;
    maxWeightLbs: Optional<number>;
    carrier: Optional<string>;
    carrierId: Optional<number>;
    shippingFee: Optional<number>;
    isMediaMail: boolean;
}

export interface ISellingPrice {
    itemPrice: number;
    floorPrice: Optional<number>;
    shippingService: IShippingService;
    shippingPayor: 'buyer' | 'seller';
    readonly sellingFee: number; // 0.10 of itemPrice
    readonly processingFee: number; // 0.029 of totalPrice + 0.50
    taxChargedToBuyer: number;
    readonly isUsingSmaringPricing: boolean;
    readonly totalPrice: number;
    readonly youMadePrice: number;
}

export interface IDraft extends IRealmEntity<IDraft> {
    sku: ISku;
    draftStatus: keyof typeof DraftStatusInfos;
    marketplace: keyof typeof MarketplacesInfos;
    listingId: Optional<string>; // m56309399497
    title: string;
    readonly brandName: Optional<string>;
    readonly isUsingMediaMail: boolean;
    readonly hasNoBrand: boolean;
    readonly categoryId: Optional<string>;
    readonly subCategoryId: Optional<string>;
    readonly subSubCategoryId: Optional<string>;
    hashTags: DBList<IHashTag>;
    readonly lengthInches: Optional<number>;
    readonly widthInches: Optional<number>;
    readonly heightInches: Optional<number>;
    readonly unpackagedWeightGrams: Optional<number>;
    readonly packagedWeightGrams: Optional<number>;
    readonly packagedWeightPoundsOunces: Optional<number>;
    readonly packagedWeightPounds: Optional<number>;
    readonly packagedWeightOunces: Optional<number>;
    readonly itemCondition: keyof typeof ItemConditionsInfos;
    readonly itemConditionId: string;
    readonly aliasColor: Optional<string>;
    readonly aliasId: Optional<string>;
    price: OptionalEntity<ISellingPrice>;
}

export interface IProductDraft {
    readonly $weightLb: number;
    readonly $shipWeight: number;
    readonly $shipWeightObj: EnglishWeight;

    readonly $weight: ProductAttribute<number>;
    readonly $length: ProductAttribute<number>;
    readonly $width: ProductAttribute<number>;
    readonly $height: ProductAttribute<number>;

    readonly $isNoBrand: boolean;
    readonly $shippingService: ShippingServiceKeys;
    readonly $shippingClass: ShippingDetails;
    readonly $shipping: ShippingServiceInfo;
    readonly $carrier: string;
    readonly $shippingPrice: number;
    readonly $shippingSelector: string;
}

export type ObjectReference<T extends RealmObjects> = T extends 'mercariBrand'
    ? IMercariBrand
    : T extends 'brand'
    ? IBrand
    : T extends 'mercariCategory'
    ? IMercariCategory
    : T extends 'mercariSubCategory'
    ? IMercariSubCategory
    : T extends 'mercariSubSubCategory'
    ? IMercariSubSubCategory
    : T extends 'classifier'
    ? IClassifier
    : T extends 'product'
    ? IProduct
    : T extends 'sku'
    ? ISku
    : T extends 'productImage'
    ? IProductImage
    : T extends 'hashTag'
    ? IHashTag
    : T extends 'hashTagUsage'
    ? IHashTagUsage
    : T extends 'customItemField'
    ? ICustomItemField
    : T extends 'scan'
    ? IScan
    : T extends 'locationSegment'
    ? ILocationSegment
    : T extends 'draft'
    ? IProductDraft
    : T extends 'rn'
    ? undefined
    : T extends 'listing'
    ? undefined
    : T;
