import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { checkTransaction } from '../util/checkTransaction';
import Realm from 'realm';
import { useSpinnerContext } from '../components/Contexts/useSpinnerContext';
import { useLocalRealm } from '../routes/loaders/useLocalRealm';
import { useInvalidator } from './useInvalidator';
import { toNotNullOID } from '../dal/toOID';

export function useUpdateRecord<T extends EntityBase>(objectType?: string) {
    const { setSpinner } = useSpinnerContext();
    const db = useLocalRealm();
    const { onSuccess } = useInvalidator(objectType ?? '');
    const submitter = useCallback(
        (db: Realm, collectionName: string) => (args: { payload: Partial<T> & AnyObject; dirtyProperties: string[]; id: OID }) => {
            const func = () => {
                const obj: (RealmObj<T> & T) | null = db.objectForPrimaryKey<T>(collectionName, toNotNullOID(args.id) as T[keyof T]);
                if (obj == null) {
                    console.error(`no object from id`, args.id);
                    throw new Error('could not find obj');
                }
                args.dirtyProperties.forEach((name) => {
                    const n = name as keyof typeof obj;
                    obj[n] = Object.getOwnPropertyNames(args.payload).includes(name) ? args.payload[name] : undefined;
                });
            };
            checkTransaction(db)(func);
            return Promise.resolve();
        },
        []
    );
    const { mutate } = useMutation({
        mutationFn: setSpinner(submitter(db, objectType ?? '')),
        onSuccess
    });
    return mutate;
}
