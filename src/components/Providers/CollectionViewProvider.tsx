import { useProvideCollectionViewContext } from '../useProvideCollectionViewContext';
import { useCollectionRoute } from '../../hooks/useCollectionRoute';
import { CollectionViewContext } from '../Contexts/CollectionViewContext';

export function CollectionViewProvider<T>({ children, param }: { children?: Children; param?: string }) {
    const collectionName = useCollectionRoute();
    const value = useProvideCollectionViewContext(param ?? collectionName);
    return <CollectionViewContext.Provider value={value as any}>{children}</CollectionViewContext.Provider>;
}
