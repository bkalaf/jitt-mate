import Realm from 'realm';
import { $db } from './db';
import { IHashTag } from './types';
import { normalizeForHashTag } from './normalizeForHashTag';

export function findHashTag(realm: Realm) {
    return function (name: string) {
        const hash = normalizeForHashTag(name);
        const hashTags = realm.objects<IHashTag>($db.hashTag()).filtered('name == $0', hash);
        return hashTags;
    };
}
