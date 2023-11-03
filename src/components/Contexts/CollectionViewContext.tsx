import { createContext } from 'react';
import { Row } from '@tanstack/react-table';

export type CollectionViewState = {
    pageSize: number;
    pages: number;
    page: number;
    visibility: string[]; // Record<string, boolean>
    rowsSelected: OID[]; // Record<string, boolean>
    sort: ([column: string] | [column: string, isDesc: boolean])[];
    filter: [id: string, value: unknown][];
    globalFilter: any;
    edittingRow: OID | undefined;
};
export interface ICollectionViewContext<T> {
    depth: number;
    params: string[];
    isRowEdittable: (row: Row<T>) => boolean;
    setRowEdittable: (row?: Row<T>) => void;
    updateRecord: UpdateRecordMutation<T>;
    toggleFiltering: () => void;
    filteringEnabled: () => boolean;
    // insertRecord: InsertRecordMutation<T>;
};

export const CollectionViewContext = createContext<ICollectionViewContext<any> | undefined>(undefined);
CollectionViewContext.displayName = 'CollectionViewContext';

