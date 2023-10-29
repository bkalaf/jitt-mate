import { IRealmContext, RealmContext } from '../components/Contexts/RealmContext';
import { useProvidedContext } from './useProvidedContext';

export function useRealmContext(): IRealmContext {
    return useProvidedContext(RealmContext);    
}
