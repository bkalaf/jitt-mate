import { useParams } from 'react-router';

export function useCollectionRoute(objectType?: string) {
    const result = useParams<{ collection: string }>().collection;
    if (result == null) {
        if (objectType == null) throw new Error('no collection name');
        return objectType as RealmObjects;
    }
    return result as RealmObjects;
}
