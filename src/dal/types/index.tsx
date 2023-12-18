import Realm, { BSON } from 'realm';
import { LocationTypesObj } from '../enums/locationTypes';
import { LocationLabelColorsKey } from '../enums/locationLabelColors';
import { LocationKindsKey } from '../enums/locationKinds';
import { BarcodeTypesKey } from '../enums/barcodeTypes';
import { RnNumberTypesKey } from '../enums/rnNumberType';
import { ProvincesKey } from '../enums/provinces';
import { Countries } from '../enums/countries';
import { MaterialTypes } from '../enums/materialTypes';
import { Colors } from '../enums/colors';
import { BacklineTypes } from '../enums/backlineTypes';
import { NecklineTypes } from '../enums/necklineTypes';
import { CollarTypes } from '../enums/collarTypes';
import { CuffTypes } from '../enums/cuffTypes';
import { TopAdornments } from '../enums/topAdornments';
import { WaistTypes } from '../enums/waistTypes';
import { SleeveTypes } from '../enums/sleeveTypes';
import * as LaundryCare from '../../../laundry-care.json';
import { ItemConditions } from '../enums/itemConditions';
import { ChestFitTypesKey } from '../enums/chestFitTypes';

export type LaundryCareOptions = keyof typeof LaundryCare;
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
export type Flags = 'athletic' | 'decorative' | 'graphic' | 'rare' | 'vintage' | 'collectible' | 'discontinued' | 'mediaMail' | 'missingTags';

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
    province: Optional<ProvincesKey>;
    postalCode: Optional<string>;
    country?: Optional<keyof Countries>;
    readonly streetOnly: Optional<string>;
    readonly cityState: Optional<string>;
    readonly output: string;
}
export type RnTypes = 'imporer' | 'other' | 'mailOrder' | 'retailer' | 'wholesale' | 'manufacturing' | 'internet';
export type RnTypesFlags = `is${Capitalize<RnTypes>}`;
export interface IRn extends IRealmEntity<IRn> {
    companyName: string;
    rnNo: number;
    legalBusinessName: Optional<string>;
    companyType: Optional<string>;
    // isRetailer: boolean;
    // isMailOrder: boolean;
    // isInternet: boolean;
    // isImporter: boolean;
    // isOther: boolean;
    noType: Optional<RnNumberTypesKey>;
    flags: DBSet<RnTypesFlags>;
    // isManufacturer: boolean;
    // isWholesaler: boolean;
    productLine: Optional<string>;
    material: Optional<string>;
    url: Optional<string>;
    brand: OptionalEntity<IBrand>;
    readonly scrapedOn: Date;
    addresses: DBList<IAddress>;
}

export type FlagsKeys = `is${Capitalize<Flags>}`;
// export type IFlagDictionary = Partial<Record<FlagsKeys, boolean>>;

export interface IMeasurementDictionary {
    chestInches: Optional<number>;
    chestFit: Optional<ChestFitTypesKey>;
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
    isAthletic: boolean;
    mercariSubSubCategory: OptionalEntity<IMercariSubSubCategory>;
    shortname: Optional<string>;
    notes: Optional<string>;
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
    name: string;
    type: Optional<keyof typeof LocationTypesObj>;
    color: Optional<LocationLabelColorsKey>;
    notes: Optional<string>;
    kind: Optional<LocationKindsKey>;
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

export type db = Realm.Types.Dictionary<string>
// export interface IMadeOfPart {
//     material:   ;
//     percent: number;
// }
// export interface IMadeOfSection {
//     parts: DBList<IMadeOfPart>;
//     readonly isComplete: boolean;
//     addPart(key: MaterialTypesKey, percent: number): void;
// }

export interface IApparelDetails extends IRealmObject<IApparelDetails> {
    backlineType: Optional<keyof BacklineTypes>;
    collarType: Optional<keyof CollarTypes>;
    cuffType: Optional<keyof CuffTypes>;
    cutNo: Optional<string>;
    measurements: IMeasurementDictionary;
    necklineType: Optional<keyof NecklineTypes>;
    pocketCount: Optional<number>;
    size: Optional<string>;
    sleeveType: Optional<keyof SleeveTypes>;
    topAdornment: Optional<keyof TopAdornments>;
    waistType: Optional<keyof WaistTypes>;
    rn: OptionalEntity<IRn>;
    styleNo: Optional<string>;
    clothingCare: DBSet<LaundryCareOptions>;
}

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

export interface IProduct extends IRealmEntity<IProduct>, IProductAttributes, IHashTagged {
    readonly summaryName: string;
    _id: BSON.ObjectId;

    apparelDetails: OptionalEntity<IApparelDetails>;
    brand: OptionalEntity<IBrand>;
    circa: Optional<string>;
    classifier: OptionalEntity<IClassifier>;
    color: Optional<keyof typeof Colors>;
    descriptiveText: Optional<string>;
    dimensions: IDimensions & DBDictionary<number>;
    features: DBList<string>;
    flags: DBSet<FlagsKeys>;
    folder: BSON.UUID;
    materials: DBDictionary<IMaterialComposition>;
    modelNo: Optional<string>;
    notes: Optional<string>;
    origin: Optional<keyof Countries>;
    productLine?: OptionalEntity<IProductLine>;
    styleNo: Optional<string>;
    taxon: OptionalEntity<IProductTaxonomy>;
    upcs: DBList<Entity<IBarcode>>;
    shipWeightPercent: Optional<number>;
    readonly isNoBrand: boolean;

    readonly effectiveShipWeightPercent: Optional<number>;
    readonly effectiveBrand: OptionalEntity<IBrand>;
    readonly effectiveMercariBrandName: Optional<string>;
    readonly effectiveBrandName: Optional<string>;
    readonly effectiveBrandFolder: Optional<string>;
    readonly effectiveCategoryID: Optional<string>;
    readonly effectiveSubCategoryID: Optional<string>;
    readonly effectiveSubSubCategoryID: Optional<string>;
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
    condition: keyof typeof ItemConditions;
    defects: DBList<string>;
    skuPrinted: boolean;
    scans: DBList<IScan>;
    readonly productImages: DBBacklink<IProductImage>;
    readonly summaryName: string;
    shipWeightPercent: Optional<number>;
    // markForPrinting(realm: Realm): Entity<ISku>;
    // unmarkForPrinting(realm: Realm): Entity<ISku>;
    appendScan(fixture?: ILocationSegment, shelf?: ILocationSegment, bin?: ILocationSegment): Entity<ISku>;
    readonly effective: {
        brand: OptionalEntity<IBrand>;
        mercariBrandName: Optional<string>;
        isNoBrand: boolean;
        brandName: Optional<string>;
        brandFolder: Optional<string>;
        productFolder: Optional<string>;
        skuFolder: Optional<string>;
        taxon: OptionalEntity<IProductTaxonomy>;
        shipWeightPercent: Optional<number>;
        hashTags: string[];
        categoryID: Optional<string>;
        subCategoryID: Optional<string>;
        subSubCategoryID: Optional<string>;
        colorID: Optional<string>;
        conditionID: Optional<string>;
        // productImages: string[];
        productUPCS: string[];
        sku: OptionalEntity<IBarcode>;
        weightGrams: number;
        // shipWeightGrams: number;
        // shipWeightPounds: [number, number];
    }

}

export interface IBinaryFile<T extends 'original' | 'remove-bg'> extends IRealmObject<IBinaryFile<T>> {
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
    updateAsync(db: Realm): Promise<this>;

    // originalData: Optional<ArrayBuffer>;
    // removeBGData: Optional<ArrayBuffer>;

    // originalMimeType: string;
    // removeBGMimeType: string;

    // readonly filename: string;
    // readonly removeBGFilename: string;
    // readonly removeBGUploadPath: string;

    // readonly brandFolder: string;
    // readonly productFolder: string;
    // readonly skuFolder: string;
    // readonly destinationOriginal: string;
    // readonly destinationRemoveBG: string;

    // moveOriginal(): Promise<void>;
    // hasRemoveBGUpload(): boolean;
    // moveRemoveBG(): Promise<void>;
    // hasRemoveBG(): boolean;

    readonly effectivePath: string;
}

// export interface IProductImage extends IRealmEntity<IProductImage> {
//     filename: string;
//     sku: OptionalEntity<ISku>;
//     readonly $sku: ISku;
//     readonly $barcode: string;
//     readonly $paths: {
//         originalSource: (index: number) => string;
//         removeBgSource: string;
//         originalDestination: string;
//         removeBgDestination: string;
//     };
//     readonly $removeBgFilename: string;
//     readonly $hasRemoveBg: boolean;
//     readonly $effectivePath: string;
//     moveOriginal(index: number): Promise<void>;
//     moveRemoveBg(): Promise<void>;
//     checkDestinationFolder(): Promise<void>;
// }

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
