import { LookupCell } from '../Cells/LookupCell';
import { RHFM_LookupControl } from '../../Controls/RHFM_LookupControl';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { IDependency } from '../Controls/RHFM_Depends';

export function lookupMeta<TLookup extends AnyObject, TParent extends EntityBase>(name: string, objectType: string, lookupProperty: string, opts: { maxSize?: number; header?: string; } = {}, ...dependencies: IDependency[]) {
    return ({
        header: opts.header ?? toProperFromCamel(name),
        // maxSize: opts.maxSize ?? 200,
        Cell: LookupCell<TLookup, TParent>(lookupProperty),
        enableColumnFilter: false,
        // editVariant: 'select' as const,
        // meta: {
        //     valueIn: (x?: OptionalEntity<TLookup> | null) => fromOID(x?._id) ?? '',
        //     valueOut: (x?: string) => (x != null && x.length > 0 ? window.$$store?.objectForPrimaryKey<TLookup>(objectType, toOID(x) as any) ?? null : null),
        //     defaultValue: undefined
        // },
        Edit: RHFM_LookupControl(objectType, name, opts.header ?? toProperFromCamel(name), lookupProperty, ...dependencies)
    });
}
