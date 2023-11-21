import { useProvidedContext } from '../../hooks/useProvidedContext';
import { ReflectionContext } from './ReflectionContext';


export function useReflectionContext() {
    return useProvidedContext(ReflectionContext);
}
