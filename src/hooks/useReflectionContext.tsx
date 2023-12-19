import { useProvidedContext } from './useProvidedContext';
import { ReflectionContext } from '../components/Contexts/ReflectionContext';


export function useReflectionContext() {
    return useProvidedContext(ReflectionContext);
}
