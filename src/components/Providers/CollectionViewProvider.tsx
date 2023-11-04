import { useProvideCollectionViewContext } from '../../hooks/useProvideCollectionViewContext';
import { useCollectionRoute } from '../../hooks/useCollectionRoute';
import { CollectionViewContext } from '../Contexts/CollectionViewContext';
import { useOptionalCollectionRoute } from '../../hooks/useOptionalCollectionRoute';

export function CollectionViewProvider<T>({ children, param }: { children?: Children; param?: string }) {
    const collectionName = useOptionalCollectionRoute(param);
    const value = useProvideCollectionViewContext(param ?? collectionName);
    return <CollectionViewContext.Provider value={value as any}>{children}</CollectionViewContext.Provider>;
}
