import Realm, { BSON } from 'realm';
import { $db } from './db';
import { IHashTag, IMercariBrand } from './types';
import { addDefaultHash } from './addDefaultHash';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Def } from './Def';
import { checkTransaction } from '../util/checkTransaction';
import { findHashTag } from './findHashTag';
import { is } from './is';
import { HashTag } from './HashTag';

const helper = createColumnHelper<IMercariBrand>();
export class MercariBrand extends Realm.Object<IMercariBrand> implements IMercariBrand {
    update<T>(this: T, realm: Realm): T {
        const $this = this as IMercariBrand;
        const hashTags = findHashTag(realm)($this.name);
        if (hashTags.length > 0) {
            const func = () => {
                if (is.dbSet($this.hashTags)) {
                    $this.hashTags.add(hashTags[0]);
                } else {
                    $this.hashTags = [hashTags[0]] as any;
                }
                HashTag.update(realm, ...$this.hashTags.values());
            };
            checkTransaction(realm)(func);
        }
        return this;
    }
    gather(this: IMercariBrand): { mercariBrandName: string; hashTags: IHashTag[] } {
        const result = {
            hashTags: Array.from(this.hashTags.values()),
            mercariBrandName: this.name
        };
        console.log(`MercariBrand.gather`, result);
        return result;
    }

    hashTags!: DBSet<IHashTag>;
    _id: BSON.ObjectId = new BSON.ObjectId();
    name = '';

    static schema: Realm.ObjectSchema = {
        name: $db.mercariBrand(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            hashTags: $db.hashTag.set
        }
    };
    static labelProperty: keyof IMercariBrand = 'name';
    static defaultSort: Realm.SortDescriptor[] = [
        'name'
    ]
    static columns: DefinedColumns = [
        Def.OID(helper),
        Def.ctor('name').required().max(100).$$(helper)
    ];
}
