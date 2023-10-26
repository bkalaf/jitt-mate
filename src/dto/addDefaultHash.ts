import Realm from 'realm';
import { IHashTag } from './types';
import { checkTransaction } from '../util/checkTransaction';
import { findHashTag } from './findHashTag';
import { is } from './is';
import { ignore } from '../common/functions/ignore';

export function addDefaultHash<T extends { hashTags: DBSet<IHashTag> }>(property: keyof T & string, updater: (item: T, realm: Realm) => void = ignore) {
    return function (this: T, realm: Realm): T {
        const hashTags = findHashTag(realm)(this[property] as string);
        if (hashTags.length > 0) {
            const func = () => {
                if (is.dbSet(this.hashTags)) {
                    this.hashTags.add(hashTags[0]);
                } else {
                    this.hashTags = [hashTags[0]] as any;
                }
                updater(this, realm);
            };
            checkTransaction(realm)(func);
        }
        return this;
    };
}
