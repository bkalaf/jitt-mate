import { useCallback } from 'react';
import { useLocalRealm } from '../routes/loaders/useLocalRealm';
import { IRealmEntity } from '../dal/types';
import { useLog } from './Contexts/useLogger';


export function useUpdate() {
    const db = useLocalRealm();
    const log = useLog('data');
    return useCallback((obj: IRealmEntity) => {
        log(`triggerUpdateCB: ${JSON.stringify(obj, null, '\t')}`);
        obj.update(db);
    }, [db, log]);
}
