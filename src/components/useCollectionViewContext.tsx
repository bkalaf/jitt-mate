import { BSON } from 'realm';
import { useProvidedContext } from '../hooks/useProvidedContext';
import { ICollectionViewContext, CollectionViewContext } from './CollectionViewContext';


export function useCollectionViewContext<T extends { _id: BSON.ObjectId; }>(): ICollectionViewContext<T> {
    return useProvidedContext<ICollectionViewContext<T>>(CollectionViewContext as any);
}
