import { useProvidedContext } from './useProvidedContext';
import { ToasterContext } from '../components/contexts/ToasterContext';

export function useToasterContext() {
    return useProvidedContext(ToasterContext);
}
