import { CellContext } from '@tanstack/react-table';
import { OIDTableCell } from './OIDTableCell';
import { useColumnMeta } from '../../../hooks/useColumnMeta';
import { BSON } from 'realm';
import { StringTableCell } from './StringTableCell';
import { EnumTableCell } from './EnumTableCell';
import { LookupTableCell } from './LookupTableCell';

export function DefaultTableCell<T extends { _id: BSON.ObjectId; }>(props: CellContext<T, any>) {
    const { datatype, defaultValue, enumMap, objectType, labelProperty } = useColumnMeta<T>(props.column);
    switch (datatype) {
        case 'string':
            return <StringTableCell {...props} />;
        case 'objectId':
            return <OIDTableCell {...props} />;
        case 'object':
            return <LookupTableCell {...props} />;
        case 'enum':
            return <EnumTableCell {...props} />;
        default:
            break;
    }
}
