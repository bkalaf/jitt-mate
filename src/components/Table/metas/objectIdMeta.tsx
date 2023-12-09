import { MRT_OIDCell } from '../Cells/MRT_OIDCell';
import { fromOID } from '../../../dal/fromOID';
import { toOID } from '../../../dal/toOID';
import { BSON } from 'realm';
import { RHFM_TextControl } from '../../Controls/RHFM_TextControl';

export const objectIdMeta = {
    id: '_id',
    header: 'OID',
    Cell: MRT_OIDCell,
    enableEditing: false,
    enableColumnActions: false,
    enableColumnDragging: false,
    maxSize: 100,
    muiTableBodyCellProps: { style: { justifyContent: 'center' } },
    meta: {
        valueIn: (x?: OID | null) => (x == null || (typeof x === 'string' && x.length === 0) ? null : fromOID(x)) ?? '',
        valueOut: (x?: string) => (x == null || x.length === 0 ? null : toOID(x) ?? null),
        defaultValue: () => Promise.resolve(new BSON.ObjectId())
    },
    Edit: RHFM_TextControl('_id', 'OID', undefined, undefined, undefined, true, true)
};
