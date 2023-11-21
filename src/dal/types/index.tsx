import Realm from 'realm';
import { LocationTypesKey } from '../enums/locationTypes';
import { LocationLabelColorsKey } from '../enums/locationLabelColors';
import { LocationKindsKey } from '../enums/locationKinds';
import { BarcodeTypesKey } from '../enums/barcodeTypes';
import { RnNumberTypesKey } from '../enums/rnNumberType';
import { ProvincesKey } from '../enums/provinces';
import { Countries } from '../enums/countries';
import { MaterialTypes } from '../enums/materialTypes';
import { Colors } from '../enums/colors';

export type AttributeObject = Record<string, any>;

export interface IRealmObject<T> {
    update(this: Entity<T>): Entity<T>;
}
export interface IRealmEntity<T> extends IRealmObject<T> {
    _id: OID;
}
export interface IHashTagged {
    hashTags: DBSet<Entity<IHashTag>>;
    readonly allHashTags: Entity<IHashTag>[];
}
export interface IProductAttributes extends IHashTagged {
    shipWeightPercent: Optional<number>;
    taxon: OptionalEntity<IProductTaxonomy>;
    readonly effectiveShipWeightPercent: Optional<number>;
    readonly effectiveTaxon: OptionalEntity<IProductTaxonomy>;
}

export type Measurements = 'chest' | 'neck' | 'inseam' | 'length' | 'sleeve' | 'torso' | 'waist' | 'hip' | 'foot' | 'bust' | 'head' | 'heel';
export type Flags = 'athletic' | 'decorative' | 'graphic' | 'rare' | 'vintage' | 'collectible' | 'discontinued' | 'mediaMail';
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
    province: Optional<ProvincesKey>;
    postalCode: Optional<string>;
    country?: Optional<keyof Countries>;
    readonly streetOnly: Optional<string>;
    readonly cityState: Optional<string>;
}

export interface IRn extends IRealmEntity<IRn> {
    companyName: string;
    no: number;
    legalBusinessName: Optional<string>;
    companyType: Optional<string>;
    isImporter: boolean;
    isRetailer: boolean;
    isMailOrder: boolean;
    isInternet: boolean;
    isOther: boolean;
    noType: Optional<RnNumberTypesKey>;
    isManufacturer: boolean;
    isWholesaler: boolean;
    productLine: Optional<string>;
    material: Optional<string>;
    url: Optional<string>;
    brand: OptionalEntity<IBrand>;
    products: DBBacklink<IProduct>;
    readonly scrapedOn: Date;
    addresses: DBList<IAddress>;
}

export type FlagsKeys = `is${Capitalize<Flags>}`;
export type IFlagDictionary = Partial<Record<FlagsKeys, boolean>>;
export type IMeasurementDictionary = Partial<Record<MeasurementKeys, number>>;
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
}
export interface ICategorySelector extends IProductAttributes {
    id: string;
}
export interface IMercariCategory extends IRealmEntity<IMercariCategory>, ICategorySelector {
    name: string;
}
export interface IMercariSubCategory extends IRealmEntity<IMercariSubCategory>, ICategorySelector {
    name: string;
    parent: OptionalEntity<IMercariCategory>;
    readonly categoryID: Optional<string>;
}

export interface ICustomItemField {
    name: string;
    options: string[];
    readonly $selectors: { input: string; dropdown: string; options: string };
    readonly $optionMap: Record<number, string>;
}

export interface IMercariSubSubCategory extends IRealmEntity<IMercariSubSubCategory>, ICategorySelector {
    name: string;
    parent: OptionalEntity<IMercariSubCategory>;
    fullname: string;
    customItemFields: DBList<ICustomItemField>;
    readonly categoryID: Optional<string>;
    readonly subCategoryID: Optional<string>;
}

export interface IClassifier extends IRealmEntity<IClassifier>, IProductAttributes {
    name: string;
    isAthletic: boolean;
    mercariSubSubCategory: OptionalEntity<IMercariSubSubCategory>;
    shortname: Optional<string>;
    readonly isMediaMail: boolean;
    readonly athletic: Optional<string>;
    readonly categoryID: Optional<string>;
    readonly subCategoryID: Optional<string>;
    readonly subSubCategoryID: Optional<string>;
}
export interface IUPC {
    upcs: DBList<Entity<IBarcode>>;
    readonly barcode: OptionalEntity<IBarcode>;
}
export interface ILocationSegment extends IRealmEntity<ILocationSegment>, IUPC {
    _barcode: string;
    name: string;
    type: Optional<LocationTypesKey>;
    color: Optional<LocationLabelColorsKey>;
    notes: Optional<string>;
    kind: Optional<LocationKindsKey>;
}
export interface IScan {
    fixture?: OptionalEntity<ILocationSegment>;
    shelf?: OptionalEntity<ILocationSegment>;
    bin?: OptionalEntity<ILocationSegment>;
    timestamp: Date;
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
export type DimensionKeys = `${Distances}Inches` | `${Volumes}FlOz` | `${Capacity}GB` | `${Timespans}Min` | Electrical;
export type IDimensions = Partial<Record<DimensionKeys, number>>;
export type IMadeOfDictionary = Partial<Record<string, Record<keyof MaterialTypes, number>>>;

export interface IProduct extends IRealmEntity<IProduct>, IProductAttributes {
    // IApparelDetails,
    // IMediaDetails,
    // IVideoDetails,
    // IBookDetails,
    // IGather<
    //     IProduct,
    //     | 'brandName'
    //     | 'brandFolder'
    //     | 'mercariBrandName'
    //     | 'subSubCategoryId'
    //     | 'apparelType'
    //     | 'apparelGroup'
    //     | 'itemGroup'
    //     | 'legType'
    //     | 'topAdornment'
    //     | 'sleeveType'
    //     | 'sizingType'
    //     | 'customItemFields'
    //     | 'gender'
    //     | 'categoryId'
    //     | 'subCategoryId'
    //     | 'apparelType'
    //     | 'apparelGroup'
    //     | 'itemGroup'
    //     | 'categoryName'
    //     | 'subCategoryName'
    //     | 'subSubCategoryName'
    //     | 'isMediaMail'
    //     | 'color'
    //     | 'cutNo'
    //     | 'features'
    //     | 'isRare'
    //     | 'isVintage'
    //     | 'height'
    //     | 'width'
    //     | 'length'
    //     | 'madeOf'
    //     | 'modelNo'
    //     | 'styleNo'
    //     | 'origin'
    //     | 'upcs'
    //     | 'rawWeight'
    //     | 'shipWeight'
    //     | 'shipWeightPercent'
    // >
    brand: OptionalEntity<IBrand>;
    origin: Optional<keyof Countries>;
    circa: Optional<string>;
    classifier: OptionalEntity<IClassifier>;
    color: Optional<keyof typeof Colors>;
    cutNo: Optional<string>;
    descriptiveText: Optional<string>;
    features: string[];
    heightIn: Optional<number>;
    isRare: boolean;
    isVintage: boolean;
    madeOf: Partial<Record<keyof MaterialTypes, number>>;
    materials: IMadeOfDictionary;
    modelNo: Optional<string>;
    notes: Optional<string>;
    // origin: Optional<OriginKeys>;
    styleNo: Optional<string>;
    upcs: DBList<IBarcode>;
    _barcodes: string[];
    weightG: Optional<number>;
    widthIn: Optional<number>;
    dimensions: IDimensions;
    readonly mercariBrandName: Optional<string>;
    readonly brandName: Optional<string>;
    readonly brandFolder: Optional<string>;
    readonly skuBarcode: Optional<string>;
    readonly categoryID: Optional<string>;
    readonly subCategoryID: Optional<string>;
    readonly subSubCategoryID: Optional<string>;
}

export interface IBarcode extends IRealmObject<IBarcode> {
    rawValue: string;
    type: Optional<BarcodeTypesKey>;
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
    _barcode: Optional<string>;
    product: OptionalEntity<IProduct>;
    price: number;
    condition: ConditionKeys;
    defects: string[];
    skuPrinted: boolean;
    scans: DBList<IScan>;
    productImages: DBBacklink<IProductImage>;
    markForPrinting(realm: Realm): Entity<ISku>;
    unmarkForPrinting(realm: Realm): Entity<ISku>;
    appendScan(fixture?: ILocationSegment, shelf?: ILocationSegment, bin?: ILocationSegment): Entity<ISku>;
    readonly mercariBrandName: Optional<string>;
    readonly brandName: Optional<string>;
    readonly brandFolder: Optional<string>;
    readonly skuBarcode: Optional<string>;
    readonly categoryID: Optional<string>;
    readonly subCategoryID: Optional<string>;
    readonly subSubCategoryID: Optional<string>;
}

export interface IProductImage extends IRealmEntity<IProductImage> {
    filename: string;
    sku: OptionalEntity<ISku>;
    readonly $sku: ISku;
    readonly $barcode: string;
    readonly $paths: {
        originalSource: (index: number) => string;
        removeBgSource: string;
        originalDestination: string;
        removeBgDestination: string;
    };
    readonly $removeBgFilename: string;
    readonly $hasRemoveBg: boolean;
    readonly $effectivePath: string;
    moveOriginal(index: number): Promise<void>;
    moveRemoveBg(): Promise<void>;
    checkDestinationFolder(): Promise<void>;
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
