import { useProvidedContext } from '../../hooks/useProvidedContext';
import { JITTCollectionContext } from './JITTCollectionContext';


export function useJITTCollectionContext() {
    return useProvidedContext(JITTCollectionContext);
}
