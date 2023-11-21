import { MRT_RowData } from 'material-react-table';
import { useMemo } from 'react';
import { collections } from '../components/Table/collections';

export function useStaticDefs<T extends MRT_RowData>(collection: keyof typeof collections & string): StaticTableDefinitions<T> {
    return useMemo(() => collections[collection], [collection]);
}
