import Realm, { BSON } from 'realm';
import { ApparelGroupsKey } from '../enums/apparelGroups';
import { ApparelTypesKey } from '../enums/apparelType';
import { ItemGroupsKey } from '../enums/itemGroups';
import { GendersKey } from '../enums/genders';
import { LegTypes, LegTypesKey } from '../enums/legTypes';
import { TopAdornments, TopAdornmentsKey } from '../enums/topAdornments';
import { SleeveTypes, SleeveTypesKey } from '../enums/sleeveTypes';
import { SizingTypesKey } from '../enums/sizingTypes';
import { LocationTypesKey } from '../enums/locationTypes';
import { LocationLabelColorsKey } from '../enums/locationLabelColors';
import { LocationKindsKey } from '../enums/locationKinds';
import { BarcodeTypesKey } from '../enums/barcodeTypes';
import { RnNumberTypesKey } from '../enums/rnNumberType';
import { ProvincesKey } from '../enums/provinces';
import { Countries } from '../enums/countries';
import { MaterialTypes } from '../enums/materialTypes';
import { WaistTypes } from '../enums/waistTypes';
import { NecklineTypes } from '../enums/necklineTypes';
import { SizeKeys } from '../../enums/importNecklineType';
import { CuffTypes } from '../enums/cuffTypes';
import { CollarTypes } from '../enums/collarTypes';
import { BacklineTypes } from '../enums/backlineTypes';
import { Sizes } from '../enums/sizes';
import { Colors } from '../enums/colors';
import { FrontTypes } from '../enums/frontTypes';

export type AttributeObject = Record<string, any>;

export interface IRealmEntity {
    _id: OID;
    update<T>(this: T, realm: Realm): T;
}
export interface IGather<T extends { hashTags: DBSet<IHashTag> }, TKeys extends string = 'hashTags'> {
    gather(this: T): { [P in TKeys | 'hashTags']?: T[P & keyof T] extends never ? any : P extends 'hashTags' ? IHashTag[] : T[P & keyof T] extends DBList<infer R> ? R[] : T[P & keyof T] };
}
export type Measurements = 'chest' | 'neck' | 'inseam' | 'length' | 'sleeve' | 'torso' | 'waist' | 'hip' | 'foot' | 'bust' | 'head' | 'heel';
export type Flags = 'athletic' | 'decorative' | 'graphic' | 'rare' | 'vintage' | 'collectible' | 'discontinued' | 'mediaMail';
export type MeasurementKeys = `${Measurements}Inches`;

export interface IHashTagUsage {
    from: Date;
    count: number;
}

export interface IHashTag extends IRealmEntity {
    name: string;
    usage: DBList<IHashTagUsage>;
    readonly $highestUsage: Optional<IHashTagUsage>;
    readonly $mostRecentUsage: Optional<IHashTagUsage>;
    readonly $maxCount: number;
    readonly $mostRecentCount: number;
    readonly $mostRecentDate: Optional<Date>;
    readonly $daysSinceMax: Optional<number>;
    addUsage(realm: Realm, count?: number): IHashTag;
}

export interface IMercariBrand extends IRealmEntity, IGather<IMercariBrand, 'mercariBrandName'> {
    name: string;
    hashTags: DBSet<IHashTag>;
}

export interface IBrand extends IRealmEntity, IGather<IBrand, 'brandName' | 'brandFolder' | 'mercariBrandName'> {
    name: string;
    mercariBrand: OptObj<IMercariBrand>;
    website: Optional<string>;
    folder: string;
    parent: OptObj<IBrand>;
    hashTags: DBSet<IHashTag>;
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

export interface IRn extends IRealmEntity {
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
    brand: OptObj<IBrand>;
    products: DBBacklink<IProduct>;
    readonly scrapedOn: Date;
    addresses: DBList<IAddress>;
}

export type FlagsKeys = `is${Capitalize<Flags>}`;
export type IFlagDictionary = Partial<Record<FlagsKeys, boolean>>;
export type IMeasurementDictionary = Partial<Record<MeasurementKeys, number>>;
export interface IProductTaxonomy {
    kingdom: Optional<string>;
    phylum: Optional<string>;
    klass: Optional<string>;
    order: Optional<string>;
    family: Optional<string>;
    genus: Optional<string>;
    species: Optional<string>;
    //apparel
    backlineType: Optional<keyof BacklineTypes>;
    collarType: Optional<keyof CollarTypes>;
    cuffType: Optional<keyof CuffTypes>;
    necklineType: Optional<keyof NecklineTypes>;
    topAdornment: Optional<keyof TopAdornments>;
    frontType: Optional<keyof FrontTypes>;
    waistType: Optional<keyof WaistTypes>;
    sleeveType: Optional<keyof SleeveTypes>;
    pocketCount: Optional<number>;
    size: Optional<keyof typeof Sizes>;
    legType: Optional<keyof LegTypes>;
    flags: IFlagDictionary;
}
export interface IMercariCategory extends IRealmEntity, IGather<IMercariCategory, 'categoryId' | 'gender' | 'itemGroup' | 'categoryName' | 'shipWeightPercent'> {
    name: string;
    id: string;
    gender: Optional<GendersKey>;
    itemGroup: Optional<ItemGroupsKey>;
    hashTags: DBSet<IHashTag>;
    shipWeightPercent: Optional<number>;
    readonly $selector: string;
    taxa: IProductTaxonomy;
}
export interface IMercariSubCategory
    extends IRealmEntity,
        IGather<IMercariSubCategory, 'gender' | 'categoryId' | 'subCategoryId' | 'apparelType' | 'apparelGroup' | 'itemGroup' | 'categoryName' | 'subCategoryName' | 'shipWeightPercent'> {
    name: string;
    id: string;
    parent: OptObj<IMercariCategory>;
    apparelType: Optional<ApparelTypesKey>;
    apparelGroup: Optional<ApparelGroupsKey>;
    itemGroup: Optional<ItemGroupsKey>;
    hashTags: DBSet<IHashTag>;
    shipWeightPercent: Optional<number>;
    readonly $selector: string;
    taxa: IProductTaxonomy;
}

export interface ICustomItemField {
    name: string;
    options: string[];
    readonly $selectors: { input: string; dropdown: string; options: string };
    readonly $optionMap: Record<number, string>;
}

export interface IMercariSubSubCategory
    extends IRealmEntity,
        IGather<
            IMercariSubSubCategory,
            | 'subSubCategoryId'
            | 'apparelType'
            | 'apparelGroup'
            | 'itemGroup'
            | 'legType'
            | 'topAdornment'
            | 'sleeveType'
            | 'sizingType'
            | 'customItemFields'
            | 'gender'
            | 'categoryId'
            | 'subCategoryId'
            | 'apparelType'
            | 'apparelGroup'
            | 'itemGroup'
            | 'categoryName'
            | 'subCategoryName'
            | 'subSubCategoryName'
            | 'shipWeightPercent'
        > {
    name: string;
    id: string;
    parent: OptObj<IMercariSubCategory>;
    fullname: string;
    hashTags: DBSet<IHashTag>;
    apparelType: Optional<ApparelTypesKey>;
    apparelGroup: Optional<ApparelGroupsKey>;
    shipWeightPercent: Optional<number>;
    itemGroup: Optional<ItemGroupsKey>;
    legType: Optional<LegTypesKey>;
    topAdornment: Optional<TopAdornmentsKey>;
    sleeveType: Optional<SleeveTypesKey>;
    sizingType: Optional<SizingTypesKey>;
    customItemFields: DBList<ICustomItemField>;
    readonly $selector: string;
    taxa: IProductTaxonomy;
}

export interface IClassifier
    extends IRealmEntity,
        IGather<
            IClassifier,
            | 'subSubCategoryId'
            | 'shipWeightPercent'
            | 'apparelType'
            | 'apparelGroup'
            | 'itemGroup'
            | 'legType'
            | 'topAdornment'
            | 'sleeveType'
            | 'sizingType'
            | 'customItemFields'
            | 'gender'
            | 'categoryId'
            | 'subCategoryId'
            | 'apparelType'
            | 'apparelGroup'
            | 'itemGroup'
            | 'categoryName'
            | 'athletic'
            | 'subCategoryName'
            | 'subSubCategoryName'
            | 'isMediaMail'
        > {
    name: string;
    isAthletic: boolean;
    mercariSubSubCategory: OptObj<IMercariSubSubCategory>;
    gender: Optional<GendersKey>;
    shipWeightPercent: Optional<number>;
    apparelType: Optional<ApparelTypesKey>;
    legType: Optional<LegTypesKey>;
    apparelGroup: Optional<ApparelGroupsKey>;
    itemGroup: Optional<ItemGroupsKey>;
    hashTags: DBSet<IHashTag>;
    topAdornment: Optional<TopAdornmentsKey>;
    sleeveType: Optional<SleeveTypesKey>;
    sizingType: Optional<SizingTypesKey>;
    readonly isMediaMail: boolean;
    readonly athletic: Optional<string>;
    taxa: IProductTaxonomy;
}

export interface ILocationSegment extends IRealmEntity {
    barcode: Optional<IBarcode>;
    _barcode: string;
    name: string;
    type: Optional<LocationTypesKey>;
    color: Optional<LocationLabelColorsKey>;
    notes: Optional<string>;
    kind: Optional<LocationKindsKey>;
}
export interface IScan {
    fixture?: ILocationSegment;
    shelf?: ILocationSegment;
    bin?: ILocationSegment;
    timestamp: Date;
}
export interface IMediaDetails {
    authors: string[];
    title: Optional<string>;
    copyright: Optional<number>;
    subtitle: Optional<string>;
    gameRating: Optional<GameRatingKeys>;
}
export interface IBookDetails extends IMediaDetails {
    bookType: Optional<BookTypeKeys>;
    pages: Optional<number>;
    publisher: Optional<string>;
    edition: Optional<number>;
}
export interface IVideoDetails extends IMediaDetails {
    starring: string[];
    movieRatings: Optional<MovieRatingKeys>;
    directedBy: string[];
    runtimeMin: Optional<number>;
    studio: Optional<string>;
}

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

export interface IProduct extends IRealmEntity {
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
    brand: OptObj<IBrand>;
    circa: Optional<string>;
    classifier: OptObj<IClassifier>;
    color: Optional<keyof typeof Colors>;
    cutNo: Optional<string>;
    descriptiveText: Optional<string>;
    features: string[];
    hashTags: DBSet<IHashTag>;
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
    taxa: IProductTaxonomy;
    measurements: IMeasurementDictionary;
    rn: Optional<IRn>;
    dimensions: IDimensions;
    clothingCare: DBList<string>;
}

export interface IBarcode {
    update(realm: Realm): IBarcode;
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
export interface ISku extends IRealmEntity {
    sku: Optional<IBarcode>;
    _barcode: Optional<string>;
    product: OptObj<IProduct>;
    price: number;
    condition: ConditionKeys;
    defects: string[];
    skuPrinted: boolean;
    scans: DBList<IScan>;
    productImages: DBBacklink<IProductImage>;
    markForPrinting(realm: Realm): ISku;
    unmarkForPrinting(realm: Realm): ISku;
    appendScan(realm: Realm, fixture?: ILocationSegment, shelf?: ILocationSegment, bin?: ILocationSegment): ISku;
}

export interface IProductImage extends IRealmEntity {
    _id: BSON.ObjectId;
    filename: string;
    sku: OptObj<ISku>;
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
    : never;
