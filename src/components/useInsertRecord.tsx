import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useCollectionRoute } from '../hooks/useCollectionRoute';
import { checkTransaction } from '../util/checkTransaction';
import { useLocalRealm } from '../routes/loaders/useLocalRealm';
import { useInvalidator } from './useInvalidator';
import Realm from 'realm';
import { useSpinnerContext } from './Contexts/useSpinnerContext';

export function useInsertRecord<T>(objectType?: string) {
    const { setSpinner } = useSpinnerContext();
    const submitter = useCallback((db: Realm, collectionName: string) => {
        return (args: { payload: T }) => {
            let result: RealmObj<T> | undefined;
            const func = () => {
                result = db.create<T>(collectionName, args.payload);
            };
            checkTransaction(db)(func);
            if (result == null) throw new Error('no result');
            return Promise.resolve(result);
        };
    }, []);
    const db = useLocalRealm();
    const collectionName = useCollectionRoute(objectType);
    const { onSuccess } = useInvalidator(collectionName);
    const { mutate } = useMutation({
        mutationFn: setSpinner(submitter(db, collectionName)),
        onSuccess
    });
    return mutate;
}
