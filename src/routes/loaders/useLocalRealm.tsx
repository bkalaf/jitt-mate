import { useRealmContext } from '../../hooks/useRealmContext';


export function useLocalRealm() {
    const { db } = useRealmContext();
    if (db == null) throw new Error('db is null');
    return db;
}
