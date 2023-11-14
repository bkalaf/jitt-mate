import Realm from 'realm';
import { checkTransaction } from '../checkTransaction';

export function runInTransaction<T>(obj: T, realm: Realm, func: (obj: T) => void) {
    const func2 = () => {
        func(obj);
    };
    checkTransaction(realm)(func2);
    return obj;
}
