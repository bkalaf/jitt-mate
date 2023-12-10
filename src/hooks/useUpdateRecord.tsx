import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkTransaction } from '../util/checkTransaction';
import Realm from 'realm';
import { useLocalRealm } from '../routes/loaders/useLocalRealm';
import { fromOID } from '../dal/fromOID';

export function useUpdateRecord<T extends EntityBase>(objectType?: string) {
    const db = useLocalRealm();
    const client = useQueryClient();
    const submitter = useCallback(
        (db: Realm) => (args: { payload: Partial<T> & AnyObject; id: OID }) => {
            let result;
            const func = () => {
                // args.dirtyProperties.forEach((name) => {
                //     console.log(`setting:`, name, args.payload);
                //     const n = name as keyof typeof obj;
                //     obj[n] = getProperty(name)(args.payload);
                // });
                console.log(objectType, args.payload, Realm.UpdateMode.Modified);
                result = db.create(objectType ?? '', args.payload, Realm.UpdateMode.Modified);
            };
            checkTransaction(db)(func);
            return Promise.resolve(result as any as Entity<T>);
        },
        [objectType]
    );
    const { mutate } = useMutation<Awaited<Entity<T>>, Error, { payload: Partial<T>; id: OID }, { previous: T[]; data: T }>({
        mutationFn: submitter(db),
        onSuccess: (data, variables) => {
            console.log(`updating: `, data);
            (data as any).update();
            client.cancelQueries({ queryKey: [objectType] });
            const previous = client.getQueryData([objectType]);
            client.setQueryData([objectType], (prev: any[]) =>
                prev.map((x) => {
                    const isEqual = Object.getOwnPropertyNames(data).includes('_id') ? fromOID(x?._id) === fromOID(data?._id) : Object.entries(data).every(([k, v]) => x[k] === v);
                    return isEqual ? data : x;
                })
            );

            return { previous, data };
        },
        onError: (err, d, context) => {
            client.setQueryData([objectType], context?.previous);
            console.error('ERROR');
            console.error(err);
            process.stdout.write(err.name.concat('\n'))
            process.stdout.write(err.message.concat('\n'));
            process.stdout.write((err.stack ?? '').concat('\n'));
            throw err;
        },
        onSettled: () => {
            client.invalidateQueries({ queryKey: [objectType ?? ''] });
            client.refetchQueries({ queryKey: [objectType ?? '']})
        }
    });
    return mutate;
}
