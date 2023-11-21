import { CellContext } from '@tanstack/react-table';
import { OIDTableCell } from './OIDTableCell';
import { useColumnMeta } from '../../../hooks/_useColumnMeta';
import { BSON } from 'realm';
import { StringTableCell } from './StringTableCell';
import { EnumChipTableCell, EnumTableCell } from './EnumTableCell';
import { CheckboxTableCell } from './CheckboxTableCell';
import { LookupTableCell } from './LookupTableCell';

export function DefaultTableBodyCell<T>(props: CellContext<T, any>) {
    const { datatype, colorMap, defaultValue, enumMap, objectType, labelProperty } = useColumnMeta<T>(props.column);
    switch (datatype) {
        case 'string':
            return <StringTableCell<T> {...props} />;
        case 'objectId':
            return <OIDTableCell<T> {...props} />;
        case 'object':
            return <LookupTableCell<T, EntityBase> {...props} />;
        case 'enum':
            return colorMap != null ? <EnumChipTableCell<T> {...props} /> : <EnumTableCell<T> {...props} />;
        case 'bool':
            return <CheckboxTableCell {...props} />;
        case 'list':
        case 'dictionary':
        case 'set':
            return <StringTableCell<T> {...props} />;
        default:
            break;
    }
}
