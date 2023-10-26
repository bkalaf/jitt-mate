import * as Realm from 'realm';

export function checkTransaction(realm: Realm) {
    return function (func: () => void) {
        if (realm.isInTransaction) {
            return func();
        }
        return realm.write(func);
    };
}
