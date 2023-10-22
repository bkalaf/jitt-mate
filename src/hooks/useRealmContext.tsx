import { RealmContext } from '../components/contexts/RealmContext';
import { useProvidedContext } from './useProvidedContext';

export function useRealmContext() {
    return useProvidedContext(RealmContext);
}
