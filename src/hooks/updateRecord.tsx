import { checkTransaction } from '../util/checkTransaction';
import { $$queryClient } from '../components/App';
import * as Realm from 'realm';

export function updateRecord(collection: string, db: Realm) {
    return async function (values: any) {
        const func = () => {
            db.create(collection, values, Realm.UpdateMode.Modified);
        };
        try {
            checkTransaction(db)(func);
            await $$queryClient.invalidateQueries({ queryKey: [collection] });
            await $$queryClient.refetchQueries({ queryKey: [collection] });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
}
