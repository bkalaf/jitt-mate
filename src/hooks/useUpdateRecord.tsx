import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { checkTransaction } from '../util/checkTransaction';
import Realm from 'realm';
import { useSpinnerContext } from '../components/Contexts/useSpinnerContext';
import { useLocalRealm } from '../routes/loaders/useLocalRealm';
import { useInvalidator } from './useInvalidator';
import { toNotNullOID } from '../dal/toOID';
import { getProperty } from '../components/Contexts/setProperty';

export function useUpdateRecord<T extends EntityBase>(objectType?: string) {
    const { setSpinner } = useSpinnerContext();
    const db = useLocalRealm();
    const { onSuccess } = useInvalidator(objectType ?? '');
    const submitter = useCallback(
        (db: Realm, collectionName: string) => (args: { payload: Partial<T> & AnyObject; id: OID }) => {
            const func = () => {
                const obj: (Entity<T> & T) | null = db.objectForPrimaryKey<T>(collectionName, toNotNullOID(args.id) as T[keyof T]);
                if (obj == null) {
                    console.error(`no object from id`, args.id);
                    throw new Error('could not find obj');
                }
                // args.dirtyProperties.forEach((name) => {
                //     console.log(`setting:`, name, args.payload);
                //     const n = name as keyof typeof obj;
                //     obj[n] = getProperty(name)(args.payload);
                // });
                console.log(objectType, args.payload, Realm.UpdateMode.Modified)
                db.create(objectType ?? '', args.payload, Realm.UpdateMode.Modified);
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
