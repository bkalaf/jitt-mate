import { OptObj, $db } from './db';
import Realm, { BSON } from 'realm';
import { normalizeStringForFS } from '../common/fs/normalizeStringForFS';
import { IBrand, IHashTag, IMercariBrand } from './types';
import { ObjectId } from 'mongodb';
import { addDefaultHash } from './addDefaultHash';
import { findHashTag } from './findHashTag';
import { is } from './is';
import { checkTransaction } from '../util/checkTransaction';
import { Def } from './Def';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { HashTag } from './HashTag';

const updateFunction = function (item: IBrand, realm: Realm) {
    item.folder = normalizeStringForFS('-')(item.name.toLowerCase());
    const hashTags = findHashTag(realm)(item.name);
    const toEntry = hashTags.filter((x) => !item.hashTags.has(x));
    if (toEntry.length > 0) {
        if (is.dbSet(item.hashTags)) {
            item.hashTags.add(toEntry[0]);
        } else {
            item.hashTags = [hashTags[0]] as any;
        }
    }
};
const helper = createColumnHelper<IBrand>();
export class Brand extends Realm.Object<IBrand> implements IBrand {
    gather(this: IBrand) {
        const { mercariBrandName, hashTags: gatheredHashTags } = { mercariBrandName: undefined, hashTags: [], ...this.mercariBrand?.gather() };
        const { hashTags: parentHashTags } = { hashTags: [], ...this.parent?.gather() };
        const result = {
            brandName: this.name,
            brandFolder: this.folder,
            mercariBrandName,
            hashTags: Array.from([...this.hashTags, ...parentHashTags, ...gatheredHashTags])
        };
        return result;
    }
    name = '';
    mercariBrand: OptObj<IMercariBrand>;
    website: Optional<string>;
    folder = '';
    parent: OptObj<IBrand>;
    hashTags!: DBSet<IHashTag>;
    _id: ObjectId = new BSON.ObjectId();
    update<T>(this: T, realm: Realm): T {
        const $this = this as IBrand;
        addDefaultHash<IBrand>('name', updateFunction).bind($this);
        const func = () => {
            $this.folder = normalizeStringForFS('-')($this.name);
            HashTag.update(realm, ...$this.hashTags.values());
        };
        checkTransaction(realm)(func);
        return this;
    }

    static schema: Realm.ObjectSchema = {
        name: $db.brand(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            mercariBrand: $db.mercariBrand.opt,
            website: $db.string.opt,
            folder: $db.string.opt,
            hashTags: $db.hashTag.list,
            parent: $db.brand.opt
        }
    };
    static labelProperty: keyof IBrand = 'name';
    static defaultSort: Realm.SortDescriptor[] = ['name'];
    static columns: DefinedColumns = [
        Def.OID(helper),
        Def.ctor('name').required().max(100).$$(helper),
        Def.ctor('mercariBrand').asLookup().labelBy('name').$$(helper),
        Def.ctor('website').url().max(150).$$(helper),
        Def.ctor('folder').validator().$$(helper),
        Def.ctor('parent').asLookup('brand').labelBy('name').$$(helper),
        Def.ctor('hashTags').list('hashTag').$(helper)
    ];
}

