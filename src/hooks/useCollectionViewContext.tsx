import { ICollectionViewContext, CollectionViewContext } from '../components/Contexts/CollectionViewContext';
import { useContext } from 'react';

export function useCollectionViewContext<T>(): ICollectionViewContext<T> | undefined {
    const context = useContext(CollectionViewContext) as ICollectionViewContext<T> | undefined;
    return context;
}

