import { useCallback } from 'react';
import Realm from 'realm';
import { checkTransaction } from '../util/checkTransaction';
import { useLocalRealm } from '../routes/loaders/useLocalRealm';
import { useInvalidator } from './useInvalidator';
import { useMutation } from '@tanstack/react-query';
import { toOID } from '../dal/toOID';

export function useDeleteMany(collectionName: string) {
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
    const { onSuccess } = useInvalidator(collectionName);
    const { mutate } = useMutation({
        mutationFn: submitter(db, collectionName),
        onSuccess
    });
    return mutate;
}
