import { useProvidedContext } from './useProvidedContext';
import { ToasterContext } from '../components/Contexts/ToasterContext';

export function useToasterContext() {
    return useProvidedContext(ToasterContext);
}
