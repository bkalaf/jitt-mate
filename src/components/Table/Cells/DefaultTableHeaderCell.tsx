import { HeaderContext } from '@tanstack/react-table';
import { BSON } from 'realm';
import { toProperFromCamel } from '../../../common/text/toProperCase';

export function DefaultTableHeaderCell<T>(p: HeaderContext<T, any>): JSX.Element {
    return <>{toProperFromCamel((p.column.columnDef as any).accessorKey ?? p.column.columnDef.id)}</>;
}
