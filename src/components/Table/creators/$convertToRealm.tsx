/* eslint-disable @typescript-eslint/no-explicit-any */
import { BSON } from 'realm';
import { dateFromNow } from '../../../common/date/dateFromNow';
import { BacklineTypes } from '../../../dal/enums/backlineTypes';
import { CollarTypes } from '../../../dal/enums/collarTypes';
import { Countries } from '../../../dal/enums/countries';
import { CuffTypes } from '../../../dal/enums/cuffTypes';
import { LocationKindsKey } from '../../../dal/enums/locationKinds';
import { LocationLabelColorsKey } from '../../../dal/enums/locationLabelColors';
import { LocationTypesObj } from '../../../dal/enums/locationTypes';
import { NecklineTypes } from '../../../dal/enums/necklineTypes';
import { ProvincesKey } from '../../../dal/enums/provinces';
import { RnNumberTypesKey } from '../../../dal/enums/rnNumberType';
import { SleeveTypes } from '../../../dal/enums/sleeveTypes';
import { TopAdornments } from '../../../dal/enums/topAdornments';
import { WaistTypes } from '../../../dal/enums/waistTypes';
import { toOID, toNotNullOID } from '../../../dal/toOID';
import {
    IHashTagUsage,
    IBarcode,
    IHashTag,
    IMercariBrand,
    IBrand,
    IProductTaxonomy,
    IMercariCategory,
    IMercariSubCategory,
    IMercariSubSubCategory,
    IProductLine,
    IProductImage,
    ISku,
    IApparelDetails,
    IMeasurementDictionary,
    IClassifier,
    IAddress,
    ILocationSegment,
    IRn,
    LaundryCareOptions,
    IScan,
    IProduct,
    IMaterialComposition,
} from '../../../dal/types';
import { Barcode } from '../../../dto/collections/Barcode';
import { Colors } from '../../../dal/enums/colors';
import { ItemConditions } from '../../../dal/enums/itemConditions';

const unserializeUUID = (x?: string | BSON.UUID) => x == null ? undefined : x instanceof BSON.UUID ? x : typeof x === 'string' ? new BSON.UUID(x) : undefined;
const unserializeInt = (x?: string | null | number) => (x == null ? undefined : typeof x === 'number' ? x : typeof x === 'string' ? parseInt(x, 10) : undefined);
const unserializeNumber = (x?: string | null | number) => (x == null ? undefined : typeof x === 'number' ? x : typeof x === 'string' ? parseFloat(x) : undefined);

const unserializedLookup = function <T extends EntityBase>(ot: string): (x: OID | null) => OptionalEntity<T> {
    return (x: OID | null) =>
        (x == null
            ? undefined
            : x instanceof Realm.Object
            ? x
            : typeof x === 'object'
            ? x
            : (window.$$store?.objectForPrimaryKey<T>(ot, toOID(x ?? undefined) as any) as Entity<T>)) as OptionalEntity<T>;
};
const unserializeBool = (b: boolean | string) => (b != null ? (typeof b === 'boolean' ? b : typeof b === 'string' ? (b === 'true' ? true : b === 'false' ? false : undefined) : undefined) : undefined);

const unserializeData = (data: ArrayBuffer | null) => data == null ? undefined : data instanceof ArrayBuffer ? data : new TextEncoder().encode(data).buffer;

const unserializeString = (b: string | null) => b ?? undefined;
const unserializeEnum = function <T>(b: string | T | null) {
    return (b as T) ?? undefined;
};
const unserializeDate = (b?: string | Date) => b == null ? dateFromNow() : b instanceof Date ? b : typeof b === 'string' && b.length > 0 ? new Date(Date.parse(b)) : dateFromNow();

const $unserialize = {
    oid: toNotNullOID,
    lookup: unserializedLookup,
    string: unserializeString,
    int: unserializeInt,
    float: unserializeNumber,
    bool: unserializeBool,
    enum: unserializeEnum,
    date: unserializeDate,
    data: unserializeData,
    uuid: unserializeUUID
};

const toHashTagUsage: ConvertToRealmFunction<IHashTagUsage> = ({ from, count }: Serialized<IHashTagUsage, true>) => ({
    from: typeof from === 'string' ? (from.length > 0 ? new Date(Date.parse(from)) : dateFromNow()) : from instanceof Date ? from : dateFromNow(),
    count: count != null ? (typeof count === 'number' ? count : typeof count === 'string' ? parseInt(count, 10) : 0) : 0
});
const toBarcode: ConvertToRealmFunction<IBarcode> = ({ rawValue }) => Barcode.ctor(rawValue, false) as any;

const toHashTag: ConvertToRealmFunction<IHashTag> = ({ _id, name, usage }) => ({
    _id: toNotNullOID(_id),
    name,
    usage: usage.map(toHashTagUsage)
});
const toMercariBrand: ConvertToRealmFunction<IMercariBrand> = ({ _id, hashTags, name }: Serialized<IMercariBrand, true>) => ({
    _id: toNotNullOID(_id),
    name,
    hashTags: hashTags.map((x) => window.$$store?.objectForPrimaryKey<IHashTag>('hashTag', toOID(x))) as Entity<IHashTag>[]
});
const toBrand: ConvertToRealmFunction<IBrand> = ({ _id, folder, hashTags, mercariBrand, name, parent, website }: Serialized<IBrand, true>) => ({
    _id: toNotNullOID(_id),
    name,
    website: website ?? undefined,
    folder,
    mercariBrand: unserializedLookup<IMercariBrand>('mercariBrand')(mercariBrand),
    parent: unserializedLookup<IBrand>('brand')(parent),
    hashTags: hashTags.map((x) => window.$$store?.objectForPrimaryKey<IHashTag>('hashTag', toOID(x))) as Entity<IHashTag>[]
});
const toProductTaxonomy: ConvertToRealmFunction<IProductTaxonomy> = ({ family, genus, kingdom, klass, order, name, lock, phylum, species }) => ({
    kingdom: kingdom ?? undefined,
    phylum: phylum ?? undefined,
    klass: klass ?? undefined,
    order: order ?? undefined,
    family: family ?? undefined,
    genus: genus ?? undefined,
    species: species ?? undefined,
    name: name ?? undefined,
    lock: lock != null ? (typeof lock === 'boolean' ? lock : typeof lock === 'string' ? (lock === 'true' ? true : lock === 'false' ? false : undefined) : undefined) : undefined
});
const toMercariCategory: ConvertToRealmFunction<IMercariCategory> = ({ _id, hashTags, id, name, shipWeightPercent, taxon }) => ({
    _id: toNotNullOID(_id),
    id,
    name,
    shipWeightPercent:
        shipWeightPercent != null ? (typeof shipWeightPercent === 'number' ? shipWeightPercent : typeof shipWeightPercent === 'string' ? parseFloat(shipWeightPercent) : undefined) : undefined,
    taxon: (taxon == null ? { lock: false } : toProductTaxonomy(taxon)) as any,
    hashTags: hashTags.map((x) => window.$$store?.objectForPrimaryKey<IHashTag>('hashTag', toOID(x))) as Entity<IHashTag>[]
});
const toMercariSubCategory: ConvertToRealmFunction<IMercariSubCategory> = ({ _id, hashTags, id, name, shipWeightPercent, taxon, parent }) => ({
    _id: toNotNullOID(_id),
    id,
    name,
    shipWeightPercent:
        shipWeightPercent != null ? (typeof shipWeightPercent === 'number' ? shipWeightPercent : typeof shipWeightPercent === 'string' ? parseFloat(shipWeightPercent) : undefined) : undefined,
    taxon: (taxon == null ? { lock: false } : toProductTaxonomy(taxon)) as any,
    hashTags: hashTags.map((x) => window.$$store?.objectForPrimaryKey<IHashTag>('hashTag', toOID(x))) as Entity<IHashTag>[],
    parent: unserializedLookup<IMercariCategory>('mercariCategory')(parent)
});
const toMercariSubSubCategory: ConvertToRealmFunction<IMercariSubSubCategory> = ({ _id, hashTags, id, name, shipWeightPercent, taxon, parent, fullname, customItemFields }) => ({
    _id: toNotNullOID(_id),
    id,
    name,
    customItemFields: (customItemFields ?? []) as any,
    shipWeightPercent:
        shipWeightPercent != null ? (typeof shipWeightPercent === 'number' ? shipWeightPercent : typeof shipWeightPercent === 'string' ? parseFloat(shipWeightPercent) : undefined) : undefined,
    taxon: (taxon == null ? { lock: false } : toProductTaxonomy(taxon)) as any,
    hashTags: hashTags.map((x) => window.$$store?.objectForPrimaryKey<IHashTag>('hashTag', toOID(x))) as Entity<IHashTag>[],
    parent: unserializedLookup<IMercariSubCategory>('mercariSubCategory')(parent),
    fullname
});
const toClassifier: ConvertToRealmFunction<IClassifier> = ({ _id, hashTags, mercariSubSubCategory, isAthletic, name, notes, shipWeightPercent, shortname, taxon }) => ({
    _id: toNotNullOID(_id),
    name,
    notes: unserializeString(notes),
    isAthletic: unserializeBool(isAthletic) ?? false,
    hashTags: hashTags.map((x) => window.$$store?.objectForPrimaryKey<IHashTag>('hashTag', toOID(x))) as Entity<IHashTag>[],
    shortname: unserializeString(shortname),
    taxon: (taxon == null ? { lock: false } : toProductTaxonomy(taxon)) as any,
    shipWeightPercent:
        shipWeightPercent != null ? (typeof shipWeightPercent === 'number' ? shipWeightPercent : typeof shipWeightPercent === 'string' ? parseFloat(shipWeightPercent) : undefined) : undefined,
    mercariSubSubCategory: unserializedLookup<IMercariSubSubCategory>('mercariSubSubCategory')(mercariSubSubCategory)
});
const toProductLine: ConvertToRealmFunction<IProductLine> = ({ _id, name, brand, hashTags }) => ({
    _id: toNotNullOID(_id),
    name,
    brand: unserializedLookup<IBrand>('brand')(brand),
    hashTags: hashTags.map((x) => window.$$store?.objectForPrimaryKey<IHashTag>('hashTag', toOID(x))) as Entity<IHashTag>[]
});
const toProductImage: ConvertToRealmFunction<IProductImage> = ({ _id, doNotRemoveBG, sku, uploadedFrom }) => ({
    _id: toNotNullOID(_id),
    doNotRemoveBG: unserializeBool(doNotRemoveBG) ?? false,
    sku: unserializedLookup<ISku>('sku')(sku),
    uploadedFrom,
    original: undefined,
    removeBg: undefined
});

const toApparelDetails: ConvertToRealmFunction<IApparelDetails> = ({
    backlineType,
    collarType,
    cuffType,
    cutNo,
    measurements,
    necklineType,
    pocketCount,
    size,
    sleeveType,
    topAdornment,
    waistType,
    rn, 
    clothingCare,
    styleNo
}) => ({
    backlineType: unserializeEnum<keyof BacklineTypes>(backlineType),
    collarType: unserializeEnum<keyof CollarTypes>(collarType),
    cuffType: unserializeEnum<keyof CuffTypes>(cuffType),
    necklineType: unserializeEnum<keyof NecklineTypes>(necklineType),
    sleeveType: unserializeEnum<keyof SleeveTypes>(sleeveType),
    topAdornment: unserializeEnum<keyof TopAdornments>(topAdornment),
    waistType: unserializeEnum<keyof WaistTypes>(waistType),
    size: unserializeString(size),
    cutNo: unserializeString(cutNo),
    pocketCount: unserializeInt(pocketCount) ?? 0,
    measurements: Object.fromEntries(Object.entries(measurements ?? {}).map(([k, v]) => [k, unserializeNumber(v)] as [string, Optional<number>])) as any as IMeasurementDictionary,
    rn: unserializedLookup<IRn>('rn')(rn),
    clothingCare: clothingCare.map(x => unserializeEnum<LaundryCareOptions>(x)) as any,
    styleNo: unserializeString(styleNo)
});
export const toAddress: ConvertToRealmFunction<IAddress> = ({ city, country, line1, line2, postalCode, province }) => ({
    line1: unserializeString(line1),
    line2: unserializeString(line2),
    city: unserializeString(city),
    country: unserializeEnum<keyof Countries>(country),
    province: unserializeEnum<ProvincesKey>(province),
    postalCode: unserializeString(postalCode)
});
export const toLocationSegment: ConvertToRealmFunction<ILocationSegment> = ({ _id, color, kind, name, notes, type, upcs }) => ({
    _id: toNotNullOID(_id),
    name: name,
    notes: unserializeString(notes),
    type: unserializeEnum<keyof typeof LocationTypesObj>(type),
    color: unserializeEnum<LocationLabelColorsKey>(color),
    kind: unserializeEnum<LocationKindsKey>(kind),
    upcs: upcs.map(toBarcode) as Entity<IBarcode>[]
});
export const toMaterialComposition: ConvertToRealmFunction<IMaterialComposition> = ({ acrylic, cashmere, cotton, organicCotton, denim, leather,linen, modal, nylon, polyester, polyurethane, rayon, silk, spandex, suede, wool}) => ({
    acrylic: $unserialize.float(acrylic),
    cotton: $unserialize.float(cotton),
    cashmere: $unserialize.float(cashmere),
    organicCotton: $unserialize.float(organicCotton),
    denim: $unserialize.float(denim),
    leather: $unserialize.float(leather),
    linen: $unserialize.float(linen),
    modal: $unserialize.float(modal),
    nylon: $unserialize.float(nylon),
    polyester: $unserialize.float(polyester),
    polyurethane: $unserialize.float(polyurethane),
    rayon: $unserialize.float(rayon),
    silk: $unserialize.float(silk),
    spandex: $unserialize.float(spandex),
    suede: $unserialize.float(suede),
    wool: $unserialize.float(wool)
})
export const toRn: ConvertToRealmFunction<IRn> = ({ _id, addresses, brand, companyName, companyType, flags, legalBusinessName, material, rnNo, noType, productLine, url }) => ({
    _id: toNotNullOID(_id),
    flags: (flags ?? []) as any[],    
    // [unserializeBool(isImporter) ?? false ? 'isImporter' : null, unserializeBool(isInternet) ?? false ? 'isInternet' : null,  unserializeBool(isMailOrder) ?? false ? 'isMailOrder' : null, unserializeBool(isManufacturer) ?? false ? 'isManufacturer' : null,unserializeBool(isOther) ?? false ? 'isOther' : null, unserializeBool(isRetailer) ?? false ? 'isRetailer' : null, unserializeBool(isWholesaler) ?? false ? 'isWholesale' : null ].filter(x => x != null) as any[],
    productLine: unserializeString(productLine),
    material: unserializeString(material),
    url: unserializeString(url),
    companyName: unserializeString(companyName) ?? '',
    legalBusinessName: unserializeString(legalBusinessName) ?? '',
    companyType: unserializeString(companyType),
    rnNo: unserializeInt(rnNo) ?? 0,
    noType: unserializeEnum<RnNumberTypesKey>(noType),
    brand: unserializedLookup<IBrand>('brand')(brand),
    addresses: addresses.map(toAddress) as IAddress[]
})
const toScan: ConvertToRealmFunction<IScan> = ({ bin, fixture, shelf, timestamp }) => ({
    fixture: unserializedLookup<ILocationSegment>('locationSegment')(fixture),
    shelf: unserializedLookup<ILocationSegment>('locationSegment')(shelf),
    bin: unserializedLookup<ILocationSegment>('locationSegment')(bin),
    timestamp: unserializeDate(timestamp)
});
const toProduct: ConvertToRealmFunction<IProduct> = ({
    _id,
    brand,
    circa,
    classifier,
    color,
    descriptiveText,
    dimensions,
    features,
    flags,
    folder,
    hashTags,
    materials,
    modelNo,
    notes,
    origin,
    productLine,
    shipWeightPercent,
    styleNo,
    taxon,
    upcs,
    apparelDetails
}) => ({
    _id: toNotNullOID(_id),
    brand: $unserialize.lookup<IBrand>('brand')(brand),
    productLine: $unserialize.lookup<IProductLine>('productLine')(productLine),
    classifier: $unserialize.lookup<IClassifier>('classifier')(classifier),
    folder: $unserialize.uuid(folder) ?? new BSON.UUID(),
    modelNo: $unserialize.string(modelNo),
    styleNo: $unserialize.string(styleNo),
    circa: $unserialize.string(circa),
    descriptiveText: $unserialize.string(descriptiveText),
    notes: $unserialize.string(notes),
    color: $unserialize.enum<keyof Colors>(color),
    dimensions: Object.fromEntries(Object.entries(dimensions ?? {}).map(([k, v]) => [k, $unserialize.float(v) ?? 0] as [string, number])) as any,
    features: features ?? [],
    upcs: (upcs ?? []).map(toBarcode) as Entity<IBarcode>[],
    shipWeightPercent: $unserialize.float(shipWeightPercent),
    origin: $unserialize.enum<keyof Countries>(origin),
    taxon: taxon ? (toProductTaxonomy(taxon) as Entity<IProductTaxonomy>) : ({ lock: false } as Entity<IProductTaxonomy>),
    hashTags: hashTags.map((x) => window.$$store?.objectForPrimaryKey<IHashTag>('hashTag', toOID(x))) as Entity<IHashTag>[],
    flags: (flags ? flags : []) as any,
    materials: materials ? Object.entries(materials).map(([name, parts]) => [name, toMaterialComposition(parts)]) : {},
    apparelDetails: toApparelDetails((apparelDetails ?? {}) as any) as any
});
const toSku: ConvertToRealmFunction<ISku> = ({ _barcode, _id, condition, defects, hashTags, price, product, scans, shipWeightPercent, skuPrinted, upcs }) => ({
    _id: toNotNullOID(_id),
    defects: defects ?? [],
    condition: $unserialize.enum<keyof typeof ItemConditions>(condition) ?? ('good' as const),
    hashTags: hashTags.map((x) => window.$$store?.objectForPrimaryKey<IHashTag>('hashTag', toOID(x))) as Entity<IHashTag>[],
    skuPrinted: $unserialize.bool(skuPrinted) ?? false,
    price: $unserialize.float(price) ?? 0,
    product: $unserialize.lookup<IProduct>('product')(product),
    shipWeightPercent: $unserialize.float(shipWeightPercent),
    upcs: (upcs ?? []).map(toBarcode) as Entity<IBarcode>[],
    _barcode: _barcode ?? undefined,
    scans: (scans ?? []).map(toScan) as Entity<IScan>[]
});
export const $convertToRealm = {
    string: (({ value }: { value?: string }) => value) as ConvertToRealmFunction<any>,
    int: (({ value }: { value?: number | string }) => $unserialize.int(value))as ConvertToRealmFunction<any>,
    float: (({ value }: { value?: number | string }) => $unserialize.float(value))as ConvertToRealmFunction<any>,
    data: (({ value }: { value?: Date | string }) => $unserialize.date(value))as ConvertToRealmFunction<any>,
    bool: (({ value }: { value?: boolean | string }) => $unserialize.bool(value ?? false))as ConvertToRealmFunction<any>,
    objectid: (({ value }: { value?: BSON.ObjectId | string }) => $unserialize.oid(value ?? new BSON.ObjectId()))as ConvertToRealmFunction<any>,
    uuid: (({ value }: { value?: BSON.UUID | string }) => $unserialize.uuid(value))as ConvertToRealmFunction<any>,
    address: toAddress,
    apparelDetails: toApparelDetails,
    barcode: toBarcode,
    brand: toBrand,
    classifier: toClassifier,
    hashTag: toHashTag,
    hashTagUsage: toHashTagUsage,
    locationSegment: toLocationSegment,
    materialComposition: toMaterialComposition,
    mercariBrand: toMercariBrand,
    mercariCategory: toMercariCategory,
    mercariSubCategory: toMercariSubCategory,
    mercariSubSubCategory: toMercariSubSubCategory,
    product: toProduct,
    productImage: toProductImage,
    productLine: toProductLine,
    productTaxonomy: toProductTaxonomy,
    rn: toRn,
    scan: toScan,
    sku: toSku
};
