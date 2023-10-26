import { createContext } from 'react';
import { BSON } from 'realm';
import { Row } from '@tanstack/react-table';
import { useProvideCollectionViewContext } from './useProvideCollectionViewContext';

export type ICollectionViewContext<T extends { _id: BSON.ObjectId } = { _id: BSON.ObjectId }> = {
    isInEditMode: () => boolean;
    edittingRow: string | undefined;
    isEdittable: (row: Row<T>) => boolean;
    setEdittingRow: (row?: Row<T>) => void;
    mutate: (props: { id: string, propertyName: string, value?: any }) => void;
};

export const CollectionViewContext = createContext<ICollectionViewContext | undefined>(undefined);
CollectionViewContext.displayName = 'CollectionViewContext';

export function CollectionViewProvider({ children }: { children?: Children }) {
    const value = useProvideCollectionViewContext();
    return <CollectionViewContext.Provider value={value}>
        {children}
    </CollectionViewContext.Provider>
}