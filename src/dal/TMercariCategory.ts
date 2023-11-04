import Realm, { BSON, SortDescriptor } from 'realm';
import { $db } from './db';
import { IHashTag, IMercariCategory } from './types';
import { createColumnHelper } from '@tanstack/react-table';
import { $css } from './$css';
import { ItemGroups } from './enums/itemGroups';
import { Genders } from './enums/genders';
import { Def } from './Def';
import { HashTag } from './HashTag';
import { checkTransaction } from '../util/checkTransaction';
import { gatherReport } from './gatherReport';

const helper = createColumnHelper<IMercariCategory>();

export class MercariCategory extends Realm.Object<IMercariCategory> implements IMercariCategory {
    shipWeightPercent: Optional<number>;
    gender: Optional<keyof Genders>;
    itemGroup: Optional<keyof ItemGroups>;
    gather(this: IMercariCategory) {
        const result = {
            hashTags: Array.from(this.hashTags.values()),
            itemGroup: this.itemGroup,
            gender: this.gender,
            categoryId: this.$selector,
            categoryName: this.name,
            shipWeightPercent: this.shipWeightPercent
        };
        return gatherReport('mercariCategory', result);
    }
    get $selector(): string {
        return $css.id(this.id);
    }
    update<T>(this: T, realm: Realm): T {
        const $this = this as IMercariCategory;
        const func = () => {
            HashTag.update(realm, ...$this.hashTags.values());
        }
        checkTransaction(realm)(func);
        return this;
    }
    _id: BSON.ObjectId = new BSON.ObjectId();
    name = '';
    id = '';
    hashTags: DBSet<IHashTag> = [] as any;

    static labelProperty: keyof IMercariCategory = 'name';
    static defaultSort: SortDescriptor[] = ['name'];
    static schema: Realm.ObjectSchema = {
        name: $db.mercariCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            id: $db.string.empty,
            gender: $db.string.opt,
            itemGroup: $db.string.opt,
            hashTags: $db.hashTag.set,
            shipWeightPercent: { type: $db.float() as any, optional: true },
            family: $db.string.opt,
            order: $db.string.opt,
            genus: $db.string.opt
        }
    };
    static columns: DefinedColumns = [
        Def.OID(helper),
        Def.ctor('name').required().max(50).$$(helper),
        Def.ctor('id').required().max(30).$$(helper),
        Def.ctor('gender').asEnum(Genders, 'description').$$(helper),
        Def.ctor('itemGroup').asEnum(ItemGroups).$$(helper),
        Def.ctor('shipWeightPercent').percentage(0, 1).defaultValue(0.3).$$(helper)
    ];
}
