import { useCollectionRoute } from './useCollectionRoute';
import { useInvalidator } from './useInvalidator';

export function useInvalidateRoute() {
    const collection = useCollectionRoute();
    return useInvalidator(collection);
}
