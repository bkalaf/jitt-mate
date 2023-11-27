import { MRT_EditActionButtons, MRT_Row } from 'material-react-table';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { Form } from '../../Form';
import { Barcode } from '../../../dto/collections/Barcode';
import { IAddress, IBarcode, IBrand, IHashTag, IHashTagUsage, ILocationSegment, IMercariBrand, IMercariCategory, IMercariSubCategory, IMercariSubSubCategory, IProductTaxonomy } from '../../../dal/types';
import { BSON } from 'realm';
import { dateFromNow } from '../../../common/date/dateFromNow';
import { toNotNullOID, toOID } from '../../../dal/toOID';

/** @deprecated */
export function createRenderCreateRowDialogContent() {
    function RenderCreateRowDialogContent<T extends AnyObject>(props: MRT_TableOptionFunctionParams<T, 'renderCreateRowDialogContent'>) {
        //     const collection = useCollectionRoute();
        //     return (
        //         <>
        //             <DialogTitle variant='h5' className='flex items-center justify-center font-rubik'>
        //                 {toProperFromCamel(collection)}
        //             </DialogTitle>
        //             <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        //                 {props.internalEditComponents} {/* or render custom edit components here */}
        //             </DialogContent>
        //             <DialogActions>
        //                 <MRT_EditActionButtons variant='icon' table={props.table} row={props.row} />
        //             </DialogActions>
        //         </>
        //     );
        // }
        return null;
    }
}
export const initialCollection: Record<string, () => Promise<unknown>> = {
    mercariBrand: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            name: null,
            hashTags: []
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
    classifier: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            name: null,
            shortname: null,
            mercariSubSubCategory: null,
            isAthletic: false
        }),
    hashTagUsage: () =>
        Promise.resolve({
            from: new Date(Date.now()),
            count: 0
        }),
    hashTag: () =>
        Promise.resolve({
            _id: new BSON.ObjectId(),
            name: null,
            usage: []
        }),
    barcode: () =>
        Promise.resolve({
            rawValue: ''
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
        })
};

export type T1 = IAddress extends { _id: OID } ? true : false;
export type T2 = IBrand extends { _id: OID } ? true : false;

export type DBProperties<T extends AnyObject> = Exclude<GetNonReadOnlyProperties<T>, FunctionProperties<T>>;

export type _Serialized<T, TRoot = true> = T extends BSON.ObjectId
    ? OID
    : T extends BSON.UUID
    ? BSON.UUID | string
    : T extends ArrayBuffer
    ? string | ArrayBuffer
    : T extends Date
    ? Date | string
    : T extends number
    ? number | string
    : T extends boolean
    ? boolean | string
    : T extends string
    ? string
    : T extends DBList<infer R>
    ? _Serialized<R, false>[]
    : T extends DBSet<infer R>
    ? _Serialized<R, false>[]
    : T extends DBDictionary<infer R>
    ? Record<string, _Serialized<R, false>>
    : T extends Record<string, any>
    ? T extends { _id: OID }
        ? TRoot extends false
            ? OID
            : { [P in DBProperties<T> as `${P}`]: Serialized<T[P], false> }
        : { [P in DBProperties<T> as `${P}`]: Serialized<T[P], false> }
    : never;
export type Serialized<T, TRoot = true> = undefined extends T ? _Serialized<T, TRoot> | null : _Serialized<T, TRoot>;
export type Unserialized<T extends AnyObject> = {
    [P in DBProperties<T>]: T[P] extends DBList<infer R> ? R[] : T[P] extends DBSet<infer R> ? R[] : T[P] extends DBDictionary<infer R> ? Record<string, R> : T[P];
}
type O1 = Serialized<IMercariBrand['_id']>;
type O2 = Serialized<IBrand['website']>;

type St1 = Serialized<IMercariBrand>;
type sT2 = Serialized<IBrand>;
type st3 = Serialized<IHashTagUsage>;

type ConvertToRealmFunction<T extends AnyObject> = (payload: _Serialized<T, true>) => Unserialized<T>;

type us1 = Unserialized<IMercariBrand>;
type us2 = Unserialized<IBrand>;

type HTU = ConvertToRealmFunction<IHashTagUsage>;
const unserializedLookup = function<T extends EntityBase>(ot: string) {
    return (x: OID | null) => window.$$store?.objectForPrimaryKey<T>(ot, toOID(x ?? undefined) as any) as Entity<T>
}

const toHashTagUsage: ConvertToRealmFunction<IHashTagUsage> = ({ from, count }: Serialized<IHashTagUsage, true>) => ({
    from: typeof from === 'string' ? (from.length > 0 ? new Date(Date.parse(from)) : dateFromNow()) : from instanceof Date ? from : dateFromNow(),
    count: count != null ? (typeof count === 'number' ? count : typeof count === 'string' ? parseInt(count, 10) : 0) : 0
});
const toBarcode: ConvertToRealmFunction<IBarcode> = ({ rawValue }) => Barcode.ctor(rawValue, false);

const toHashTag: ConvertToRealmFunction<IHashTag> = ({ _id, name, usage }) => ({
    _id: toNotNullOID(_id),
    name,
    usage: usage.map(toHashTagUsage)
});
const toMercariBrand: ConvertToRealmFunction<IMercariBrand> = ({ _id, hashTags, name }: Serialized<IMercariBrand, true>) => ({
    _id: toNotNullOID(_id),
    name,
    hashTags: hashTags.map(x => window.$$store?.objectForPrimaryKey<IHashTag>('hashTag', toOID(x))) as Entity<IHashTag>[]
});
const toBrand: ConvertToRealmFunction<IBrand> = ({ _id, folder, hashTags, mercariBrand, name, parent, website }) => ({
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
    lock: lock != null ? typeof lock === 'boolean' ? lock : typeof lock === 'string' ? lock === 'true' ? true : lock === 'false' ? false : undefined : undefined : undefined
});
const toMercariCategory: ConvertToRealmFunction<IMercariCategory> = ({ _id, hashTags, id, name, shipWeightPercent, taxon }) => ({
    _id: toNotNullOID(_id),
    id, 
    name, 
    shipWeightPercent: shipWeightPercent != null ? typeof shipWeightPercent === 'number' ? shipWeightPercent : typeof shipWeightPercent === 'string' ? parseFloat(shipWeightPercent) : undefined : undefined,
    taxon: (taxon == null ? { lock: false } : toProductTaxonomy(taxon) )as any,
    hashTags: hashTags.map((x) => window.$$store?.objectForPrimaryKey<IHashTag>('hashTag', toOID(x))) as Entity<IHashTag>[]
})
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
export const convertToRealm = {
    hashTagUsage: toHashTagUsage,
    hashTag: toHashTag,
    mercariBrand: toMercariBrand,
    brand: toBrand,
    barcode: toBarcode,
    productTaxonomy: toProductTaxonomy,
    mercariCategory: toMercariCategory,
    mercariSubCategory: toMercariSubCategory,
    mercariSubSubCategory: toMercariSubSubCategory
};

const insertAction = {
    locationSegmentBarcode: (row: MRT_Row<ILocationSegment>) => (payload: { rawValue: string }) => () => {
        row.original.upcs.push(insertAction.barcode(payload) as any);
    },
    barcode: (payload: { rawValue: string }) => Barcode.ctor(payload.rawValue, false)
};

export function createRenderCreateRowDialogContentRHF<T extends AnyObject>(collection: string, insertAsync: UseMutateAsyncFunction<AnyObject, Error, { values: T }>) {
    function RenderCreateRowDialogContent(props: MRT_TableOptionFunctionParams<T, 'renderEditRowDialogContent'>) {
        const initFunc = initialCollection[collection];
        const convertTo = convertToRealm[collection as keyof typeof convertToRealm] as any as ConvertToRealmFunction<T>;
        console.log(`initialForm`, props.row.original.toJSON());
        // const initial = async () => props.row.original.toJSON() as T;
        console.log(`'internalEditComponents`, props.internalEditComponents);
        const initial = async () => (await initFunc()) as T;
        return (
            <>
                <Form
                    defaultValues={initial}
                    onValid={(data: T) => {
                        console.log(`data`, data);
                        const payload = convertTo(data as _Serialized<T, true>);
                        console.log(`payload`, payload);
                        return insertAsync(
                            { values: payload as T },
                            {
                                onSuccess: () => {
                                    props.table.setEditingRow(null);
                                }
                            }
                        );
                    }}
                    onInvalid={(errors) => {
                        alert('ERROR');
                        const errs = Object.values(errors)
                            .map((e) => e?.message)
                            .join('\n');
                        alert(errs);
                    }}>
                    <DialogTitle variant='h5' className='flex items-center justify-center font-rubik'>
                        {toProperFromCamel(collection)}
                    </DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {props.internalEditComponents} {/* or render custom edit components here */}
                    </DialogContent>
                    <DialogActions>
                        <MRT_EditActionButtons variant='icon' table={props.table} row={props.row} />
                    </DialogActions>
                </Form>
            </>
        );
    }
    return RenderCreateRowDialogContent;
}
