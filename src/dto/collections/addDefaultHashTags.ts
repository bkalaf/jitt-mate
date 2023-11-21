import { IHashTagged } from '../../dal/types';
import { findHashTag } from '../../dal/findHashTag';
import { is } from '../../dal/is';


export function addDefaultHashTags(item: IHashTagged & { name: string; }) {
    const realm = window.$$store;
    if (realm == null) throw new Error('null realm');
    const hashTags = findHashTag(realm)(item.name);
    const toEntry = hashTags.filter((x) => !item.hashTags.has(x));
    if (toEntry.length > 0) {
        if (is.dbSet(item.hashTags)) {
            item.hashTags.add(toEntry[0]);
        } else {
            item.hashTags = [hashTags[0]] as any;
        }
    }
}
