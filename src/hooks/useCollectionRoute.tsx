import { useParams } from 'react-router';

export function useCollectionRoute() {
    const result = useParams<{ collection: string }>().collection;
    if (result == null) throw new Error('no collection name');
    return result;
}
