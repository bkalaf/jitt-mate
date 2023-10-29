import { useProvidedContext } from './useProvidedContext';
import { LocalForageContext } from '../components/Contexts/LocalForageContext';

export function useLocalForageContext() {
    return useProvidedContext(LocalForageContext);
}
