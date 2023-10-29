import { useCallback } from 'react';
import Realm from 'realm';
import { checkTransaction } from '../util/checkTransaction';
import { useCollectionRoute } from './useCollectionRoute';
import { useLocalRealm } from '../routes/loaders/useLocalRealm';
import { useInvalidator } from '../components/useInvalidator';
import { useMutation } from '@tanstack/react-query';
import { toOID } from '../dal/toOID';

export function useDeleteMany() {
    const submitter = useCallback((db: Realm, collectionName: string) => {
        return (args: { payload: OID[] }) => {
            const func = () => {
                const objs = args.payload.map(toOID).map((x) => db.objectForPrimaryKey(collectionName, x));
                db.delete(objs);
            };
            checkTransaction(db)(func);
            return Promise.resolve();
        };
    }, []);
    const db = useLocalRealm();
    const collectionName = useCollectionRoute();
    const { onSuccess } = useInvalidator(collectionName);
    const { mutate } = useMutation({
        mutationFn: submitter(db, collectionName),
        onSuccess
    });
    return mutate;
}
