import { createContext } from 'react';
import { Row } from '@tanstack/react-table';


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

