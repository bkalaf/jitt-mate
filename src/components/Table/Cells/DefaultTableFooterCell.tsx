import { HeaderContext } from '@tanstack/react-table';
import { BSON } from 'realm';

export function DefaultTableFooterCell<T>(p: HeaderContext<T, any>): JSX.Element {
    return <>{p.column.id}</>;
}
