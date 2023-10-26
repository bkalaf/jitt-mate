import Realm, { BSON } from 'realm';
import {
    ApparelTypeKeys,
    BacklineTypeKeys,
    BookTypeKeys,
    CollarTypeKeys,
    ColorKeys,
    CuffTypeKeys,
    GameRatingKeys,
    GenderKeys,
    ItemGroupKeys,
    LegTypeKeys,
    MaterialKeys,
    MovieRatingKeys,
    NecklineTypeKeys,
    OriginKeys,
    SizeKeys,
    SizingTypeKeys,
    SleeveTypeKeys,
    TopAdornmentKeys,
    WaistTypeKeys
} from '../../enums/importNecklineType';
import { ApparelGroupKeys } from '../../enums/sizes';
import { ApparelGroupsKey } from '../enums/apparelGroups';
import { ApparelTypesKey } from '../enums/apparelType';
import { ItemGroupsKey } from '../enums/itemGroups';
import { GendersKey } from '../enums/genders';
import { LegTypesKey } from '../enums/legTypes';
import { TopAdornmentsKey } from '../enums/topAdornments';
import { SleeveTypesKey } from '../enums/sleeveTypes';
import { SizingTypesKey } from '../enums/sizingTypes';

export type AttributeObject = Record<string, any>;

export interface IRealmEntity<T> {
    _id: BSON.ObjectId;
    update(this: T, realm: Realm): T;
}
export interface IGather<T extends { hashTags: DBSet<IHashTag> }, TKeys extends string = 'hashTags'> {
    gather(this: T): { [P in TKeys | 'hashTags']?: T[P & keyof T] extends never ? any : P extends 'hashTags' ? IHashTag[] : T[P & keyof T] extends DBList<infer R> ? R[] :  T[P & keyof T]};
}
export interface IHashTagUsage {
    from: Date;
    count: number;
}

export interface IHashTag extends IRealmEntity<IHashTag> {
    name: string;
    usage: DBList<IHashTagUsage>;
    readonly $highestUsage: IHashTagUsage;
    readonly $mostRecentUsage: IHashTagUsage;
    addUsage(realm: Realm, count?: number): IHashTag;
}
export interface IMercariBrand extends IRealmEntity<IMercariBrand>, IGather<IMercariBrand, 'mercariBrandName'> {
    name: string;
    hashTags: DBSet<IHashTag>;
}

export interface IBrand extends IRealmEntity<IBrand>, IGather<IBrand, 'brandName' | 'brandFolder'> {
    name: string;
    mercariBrand: OptObj<IMercariBrand>;
    website: Optional<string>;
    folder: string;
    parent: OptObj<IBrand>;
    hashTags: DBSet<IHashTag>;
}
export interface IMercariCategory extends IRealmEntity<IMercariCategory>, IGather<IMercariCategory, 'categoryId' | 'gender' | 'itemGroup'> {
    name: string;
    id: string;
    gender: Optional<GendersKey>;
    itemGroup: Optional<ItemGroupsKey>;
    hashTags: DBSet<IHashTag>;
    readonly $selector: string;
}
export interface IMercariSubCategory extends IRealmEntity<IMercariSubCategory>, IGather<IMercariSubCategory, 'subCategoryId' | 'apparelType' | 'apparelGroup' | 'itemGroup'> {
    name: string;
    id: string;
    parent: OptObj<IMercariCategory>;
    apparelType: Optional<ApparelTypesKey>;
    apparelGroup: Optional<ApparelGroupsKey>;
    itemGroup: Optional<ItemGroupsKey>;
    hashTags: DBSet<IHashTag>;
    readonly $selector: string;
}

export interface ICustomItemField {
    name: string;
    options: string[];
    readonly $selectors: { input: string; dropdown: string; options: string };
    readonly $optionMap: Record<number, string>;
}

export interface IMercariSubSubCategory
    extends IRealmEntity<IMercariSubSubCategory>,
        IGather<IMercariSubSubCategory, 'subSubCategoryId' | 'apparelType' | 'apparelGroup' | 'itemGroup' | 'legType' | 'topAdornment' | 'sleeveType' | 'sizingType' | 'customItemFields'> {
    name: string;
    id: string;
    parent: OptObj<IMercariSubCategory>;
    fullname: string;
    hashTags: DBSet<IHashTag>;
    apparelType: Optional<ApparelTypesKey>;
    apparelGroup: Optional<ApparelGroupsKey>;
    itemGroup: Optional<ItemGroupsKey>;
    legType: Optional<LegTypesKey>;
    topAdornment: Optional<TopAdornmentsKey>;
    sleeveType: Optional<SleeveTypesKey>;
    sizingType: Optional<SizingTypesKey>;
    customItemFields: DBList<ICustomItemField>;
    readonly $selector: string;
}

export interface IClassifier extends IRealmEntity<IClassifier> {
    name: string;
    mercariSubSubCategory: OptObj<IMercariSubSubCategory>;
    gender: GenderKeys;
    apparelType: ApparelTypeKeys;
    legType: LegTypeKeys;
    apparelGroup: ApparelGroupKeys;
    itemGroup: ItemGroupKeys;
    hashTags: DBSet<IHashTag>;
    topAdornment: TopAdornmentKeys;
    sleeveType: SleeveTypeKeys;
    sizingType: SizingTypeKeys;
}

export interface ILocationSegment extends IRealmEntity<ILocationSegment> {
    barcode: string;
    name: string;
    type: LocationTypeKeys;
    color: LocationLabelColor;
    notes: string;
    kind: LocationKind
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
}
export interface IBookDetails extends IMediaDetails {
    bookType: Optional<BookTypeKeys>;
    rating: Optional<MovieRatingKeys | GameRatingKeys>;
    pages: Optional<number>;
    publisher: Optional<string>;
    edition: Optional<number>;
}
export interface IVideoDetails  extends IMediaDetails {
    starring: string[];
    rating: Optional<MovieRatingKeys>;
    directedBy: string[];
    runtimeMin: Optional<number>;
    studio: Optional<string>;
}
export interface IApparelDetails {
    apparelType: Optional<ApparelTypeKeys>;
    backlineType: Optional<BacklineTypeKeys>;
    collarType: Optional<CollarTypeKeys>;
    cuffType: Optional<CuffTypeKeys>;
    rn: number;
    necklineType: Optional<NecklineTypeKeys>;
    topAdornment: Optional<TopAdornmentKeys>;
    waistType: Optional<WaistTypeKeys>;
    sleeveType: Optional<SleeveTypeKeys>;
    pocketCount: Optional<number>;
    size: Optional<SizeKeys>;
    legType: Optional<LegTypeKeys>;
}
export interface IMeasurements {
    chestIn: Optional<number>;
    neckIn: Optional<number>;
    inseamIn: Optional<number>;
    lengthIn: Optional<number>;
    sleeveIn: Optional<number>;
    torsoIn: Optional<number>;
    waistIn: Optional<number>;
}
export interface IProduct extends IRealmEntity<IProduct> {
    brand: OptObj<IBrand>;
    circa: Optional<string>;
    classifier: OptObj<IClassifier>;
    color: Optional<ColorKeys>;
    cutNo: Optional<string>;
    descriptiveText: Optional<string>;
    features: string[];
    hashTags: DBSet<IHashTag>;
    heightIn: Optional<number>;
    isRare: boolean;
    isVintage: boolean;
    madeOf: Partial<Record<MaterialKeys, number>>;
    modelNo: Optional<string>;
    notes: Optional<string>;
    origin: Optional<OriginKeys>;
    styleNo: Optional<string>;
    upcs: string[];
    weightG: Optional<number>;
    widthIn: Optional<number>;
}

export interface ISku extends IRealmEntity<ISku> {
    sku: string;
    product: OptObj<IProduct>;
    price: number;
    condition: ConditionKeys;
    defects: string[];
    skuPrinted: boolean;
    scans: DBList<IScan>;
    productImages: DBBacklink<IProductImage>;
    $markForPrinting(realm: Realm): ISku;
    $unmarkForPrinting(realm: Realm): ISku;
    appendScan(realm: Realm, fixture?: ILocationSegment, shelf?: ILocationSegment, bin?: ILocationSegment): ISku;
}

export interface IProductImage extends IRealmEntity<IProductImage> {
    _id: BSON.ObjectId;
    filename: string;
    sku: OptObj<ISku>;
    readonly $sku: ISku;
    readonly $barcode: string;
    readonly $brandFolder: string;
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
