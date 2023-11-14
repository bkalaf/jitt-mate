import { Row } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../routes/loaders/useLocalRealm';
import { useLog } from '../components/Contexts/useLogger';
import { useMemo } from 'react';
import { identity } from '../common/functions/identity';
import { catchError } from '../components/catchError';
import { process } from '@electron/remote';

export function useFetchAll<T extends EntityBase>(collectionName: string) {
    const db = useLocalRealm();
    const log = useLog('db');
    const handleResults = identity;
    const { data } = useQuery({
        throwOnError: (error, query) => {
            catchError(error);
            console.error(query.queryKey);
            process.stdout.write(query.queryKey.join('\n').concat('\n'));
            log('QUERY ERROR');
            throw error;
        },
        queryKey: [collectionName],
        queryFn: () => Promise.resolve(handleResults(db.objects<T>(collectionName)))
    });
    return useMemo(() => Array.from(data ?? []), [data]);
}
// export function useFetchData<T extends EntityBase>($collectionName: string, row?: Row<T>, propertyName?: string) {
//     console.log(`useFetchData`, $collectionName, row, propertyName);
//     console.log(`row.orignal`, row?.original);
//     const func =
//         row == null
//             ? () => handleResults(db.objects<T>($collectionName ?? ''))
//             : () => {
//                   const result = db.objectForPrimaryKey<T & AnyObject>($collectionName, toOID(row.id ?? ''));
//                   if (result == null || result.length === 0) return [];
//                   log(JSON.stringify(result, null, '\t'));
//                   return Object.getOwnPropertyNames(result[0]).includes(propertyName ?? '') ? result[0][propertyName ?? ''] : [];
//               };
//     const { data } = useQuery({ queryKey: row == null ? [$collectionName] : [$collectionName, row.id, propertyName], queryFn: () => Promise.resolve(Array.from(func())) });
//     return data;
// }
