import { dateFromNow } from '../../../common/date/dateFromNow';
import { toOID, toNotNullOID } from '../../../dal/toOID';
import { IHashTagUsage, IBarcode, IHashTag, IMercariBrand, IBrand, IProductTaxonomy, IMercariCategory, IMercariSubCategory, IMercariSubSubCategory, IProductLine, IProductImage, ISku } from '../../../dal/types';
import { Barcode } from '../../../dto/collections/Barcode';
import { ConvertToRealmFunction, Serialized } from './createRenderCreateRowDialogContent';

const unserializedLookup = function <T extends EntityBase>(ot: string): (x: OID | null) => OptionalEntity<T> {
    return (x: OID | null) => (x == null ? undefined : x instanceof Realm.Object ? x : typeof x === 'object' ? x : (window.$$store?.objectForPrimaryKey<T>(ot, toOID(x ?? undefined) as any) as Entity<T>)) as OptionalEntity<T>;
};
const unserializeBool = (b: boolean | string) => b != null ? (typeof b === 'boolean' ? b : typeof b === 'string' ? (b === 'true' ? true : b === 'false' ? false : undefined) : undefined) : undefined;

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
    shipWeightPercent:
        shipWeightPercent != null ? (typeof shipWeightPercent === 'number' ? shipWeightPercent : typeof shipWeightPercent === 'string' ? parseFloat(shipWeightPercent) : undefined) : undefined,
    taxon: (taxon == null ? { lock: false } : toProductTaxonomy(taxon)) as any,
    hashTags: hashTags.map((x) => window.$$store?.objectForPrimaryKey<IHashTag>('hashTag', toOID(x))) as Entity<IHashTag>[],
    parent: unserializedLookup<IMercariSubCategory>('mercariSubCategory')(parent),
    fullname,
    customItemFields: [] as any[]
});
const toProductLine: ConvertToRealmFunction<IProductLine> = ({ _id, name, brand }) => ({
    _id: toNotNullOID(_id),
    name,
    brand: unserializedLookup<IBrand>('brand')(brand)
});
const toProductImage: ConvertToRealmFunction<IProductImage> = ({ _id, doNotRemoveBG, originalData, originalMimeType, removeBGData, removeBGMimeType, sku, uploadedFrom }) => ({
    _id: toNotNullOID(_id),
    doNotRemoveBG: unserializeBool(doNotRemoveBG) ?? false,
    sku: unserializedLookup<ISku>('sku')(sku),
    uploadedFrom,
    originalMimeType,
    removeBGMimeType,
    originalData: originalData == null ? undefined : originalData instanceof ArrayBuffer ? originalData : new TextEncoder().encode(originalData).buffer,
    removeBGData: removeBGData == null ? undefined : removeBGData instanceof ArrayBuffer ? removeBGData : new TextEncoder().encode(removeBGData).buffer
});
// const toBranding: ConvertToRealmFunction<IBranding> = ({ _id, brand, description, hashTags, modelNo, type, productLine }) => ({
//     _id: toNotNullOID(_id),
//     description: description ?? undefined,
//     modelNo: modelNo ?? undefined,
//     type: type as IBranding['type'],
//     brand: unserializedLookup<IBrand>('brand')(brand),
//     productLine: unserializedLookup<IProductLine>('productLine')(productLine),
//     hashTags: hashTags.map((x) => window.$$store?.objectForPrimaryKey<IHashTag>('hashTag', toOID(x))) as Entity<IHashTag>[]
// });

export const $convertToRealm = {
    hashTagUsage: toHashTagUsage,
    hashTag: toHashTag,
    mercariBrand: toMercariBrand,
    brand: toBrand,
    barcode: toBarcode,
    productTaxonomy: toProductTaxonomy,
    mercariCategory: toMercariCategory,
    mercariSubCategory: toMercariSubCategory,
    mercariSubSubCategory: toMercariSubSubCategory,
    productLine: toProductLine,
    productImage: toProductImage
    // branding: toBranding
};
