import Realm, { BSON, SortDescriptor } from 'realm';
import { $db } from './db';
import { IHashTag, IMercariCategory, IMercariSubCategory } from './types';
import { ApparelGroups } from './enums/apparelGroups';
import { ApparelTypes } from './enums/apparelType';
import { ItemGroups } from './enums/itemGroups';
import { $css } from './$css';
import { createColumnHelper } from '@tanstack/react-table';
import { checkTransaction } from '../util/checkTransaction';
import { HashTag } from './HashTag';
import { Def } from './Def';

export const helper = createColumnHelper<IMercariSubCategory>();
export class MercariSubCategory extends Realm.Object<IMercariSubCategory> implements IMercariSubCategory {
    shipWeightPercent: Optional<number>;
    gather(this: IMercariSubCategory) {
        const { hashTags: parentHashTags, gender, shipWeightPercent, categoryId, itemGroup, categoryName } = { ...this.parent?.gather() };
        const gathered = {
            itemGroup: this.itemGroup ?? itemGroup,
            hashTags: Array.from([...(parentHashTags ?? []), ...this.hashTags.values()]),
            subCategoryId: this.$selector,
            apparelType: this.apparelType,
            apparelGroup: this.apparelGroup,
            gender,
            categoryId,
            categoryName,
            subCategoryName: this.name,
            shipWeightPercent: this.shipWeightPercent ?? shipWeightPercent
        };
        return gathered;
    }

    get $selector(): string {
        return $css.id(this.id);
    }
    name = '';
    id = '';
    parent: OptObj<IMercariCategory>;
    apparelType: Optional<keyof ApparelTypes>;
    apparelGroup: Optional<keyof ApparelGroups>;
    itemGroup: Optional<keyof ItemGroups>;
    hashTags: DBSet<IHashTag> = [] as any;
    _id: BSON.ObjectId = new BSON.ObjectId();
    update(this: IMercariSubCategory, realm: Realm): IMercariSubCategory {
        const result = this.parent?.gather.bind(this.parent)() ?? {};
        const { itemGroup } = result;
        const func = () => {
            this.itemGroup = itemGroup;
            HashTag.update(realm, ...this.hashTags.values());
        };
        checkTransaction(realm)(func);
        return this;
    }
    // _id: BSON.ObjectId = new BSON.ObjectId();
    // name = '';
    // id = '';
    // parent: OptObj<IMercariCategory>;
    // apparelType: Optional<ApparelTypeKeys>;
    // apparelGroup: Optional<ApparelGroupKeys>;
    // itemGroup: Optional<ItemGroupKeys>;
    static schema: Realm.ObjectSchema = {
        name: $db.mercariSubCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            id: $db.string.empty,
            parent: $db.mercariCategory.opt,
            apparelType: $db.string.opt,
            apparelGroup: $db.string.opt,
            itemGroup: $db.string.opt,
            hashTags: $db.hashTag.set,
            shipWeightPercent: { type: $db.float() as any, default: 0.3, optional: true }
        }
    };
    static labelProperty: keyof IMercariSubCategory = 'name';
    static defaultSort: SortDescriptor[] = ['parent.name', 'name'];
    static columns: DefinedColumns = [
        Def.OID(helper),
        Def.ctor('fullname').readonly().required().$$(helper),
        Def.ctor('name').required().max(50).$$(helper),
        Def.ctor('id').required().max(30).$$(helper),
        Def.ctor('parent').asLookup('mercariSubCategory').$$(helper),
        Def.ctor('apparelType').asEnum(ApparelTypes).$$(helper),
        Def.ctor('apparelGroup').asEnum(ApparelGroups).$$(helper),
        Def.ctor('itemGroup').asEnum(ItemGroups).$$(helper),
        Def.ctor('shipWeightPercent').percentage(0, 1).defaultValue(0.3).$$(helper)
    ];
}
