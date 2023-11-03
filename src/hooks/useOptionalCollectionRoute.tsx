import { useParams } from 'react-router';

export function useOptionalCollectionRoute($collectionName?: string) {
    const _collectionName = useParams<'collection'>().collection;
    const collectionName = $collectionName ?? _collectionName;
    return collectionName;
}
