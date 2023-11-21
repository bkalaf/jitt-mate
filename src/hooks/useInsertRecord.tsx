import { useCallback } from 'react';
import { MutateOptions, MutationStatus, useMutation } from '@tanstack/react-query';
import { useCollectionRoute } from './useCollectionRoute';
import { checkTransaction } from '../util/checkTransaction';
import { useLocalRealm } from '../routes/loaders/useLocalRealm';
import { useInvalidator } from './useInvalidator';
import Realm from 'realm';
import { IRealmEntity } from '../dal/types';
import { catchError } from '../components/catchError';
import { useNavigate } from 'react-router';

export function useInsertRecord<T extends IRealmEntity<T>>(
    objectType?: string
): [execute: (payload: T, opts?: MutateOptions<Awaited<Entity<T>>, Error, { payload: T }, unknown>) => void, isError: boolean, isPending: boolean, status: MutationStatus] {
    const submitter = useCallback((db: Realm, collectionName: string) => {
        return (args: { payload: T }) => {
            let result: Entity<T> | undefined;
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
    const navigate = useNavigate();
    const { mutate, isError, isPending, status } = useMutation({
        mutationFn: submitter(db, collectionName),
        onSuccess: onSuccess,
        onError: err => {
            catchError(err);
            navigate('/');
        }
    });
    const execute = useCallback(
        (...params: [T, Parameters<typeof mutate>[1]]) => {
            console.log(`params`, params);
            mutate({ payload: params[0] }, params[1]);
        },
        [mutate]
    );
    return [execute, isError, isPending, status];
}
