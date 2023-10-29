import Realm, { BSON, PropertySchema, PropertyTypeName } from 'realm';
import { $db } from './db';
import { ICustomItemField, IHashTag, IMercariSubCategory, IMercariSubSubCategory } from './types';
import { ApparelGroups } from './enums/apparelGroups';
import { ApparelTypes } from './enums/apparelType';
import { ItemGroups } from './enums/itemGroups';
import { LegTypes } from './enums/legTypes';
import { SizingTypes } from './enums/sizingTypes';
import { SleeveTypes } from './enums/sleeveTypes';
import { TopAdornments } from './enums/topAdornments';
import { $css } from './$css';
import { checkTransaction } from '../util/checkTransaction';
import { createColumnHelper } from '@tanstack/react-table';
import { cleanup, is } from './is';
import { HashTag } from './HashTag';
import { Def } from './Def';


const ifList = (s: string): string | PropertySchema => (is.realmType.list(s) ? { type: 'list', objectType: cleanup(s) } : s);
const ifOpt = (s: string): string | PropertySchema => (is.realmType.optional(s) ? { type: cleanup(s) as Realm.PropertyTypeName, optional: true } : s);
const ifDictionary = (s: string): string | PropertySchema => (is.realmType.dictionary(s) ? { type: 'dictionary', objectType: cleanup(s) } : s);
const ifSet = (s: string): string | PropertySchema => (is.realmType.set(s) ? { type: 'set', objectType: cleanup(s) } : s);
const ifPrimitive = (s: string): PropertySchema | string => is.realmType.primitive(s) ? { type: s as PropertyTypeName, optional: false } : s;

const handleIf = (func: (s: string) => string | PropertySchema) => (item: string | PropertySchema) => is.string(item) ? func(item) : item;

export function normalizeSchemaProperty(sp: string | PropertySchema): PropertySchema {
    const result = [ifOpt, ifList, ifDictionary, ifSet, ifPrimitive].map(handleIf).reduce((pv, cv) => cv(pv), sp);
    if (is.string(result)) throw new Error(`could not normalize: ${sp}`);
    return result as PropertySchema;
}
const helper = createColumnHelper<IMercariSubSubCategory>();
export class MercariSubSubCategory extends Realm.Object<IMercariSubSubCategory> implements IMercariSubSubCategory {
    shipWeightPercent: Optional<number>;
    gather(this: IMercariSubSubCategory) {
        const { hashTags: parentHashTags, apparelGroup, apparelType, itemGroup, categoryId, subCategoryId, gender, shipWeightPercent, categoryName, subCategoryName } = { ...this.parent?.gather() };
        return {
            categoryId,
            subCategoryId,
            subSubCategoryId: this.$selector,
            apparelGroup: this.apparelGroup ?? apparelGroup,
            apparelType: this.apparelType ?? apparelType,
            itemGroup: this.itemGroup ?? itemGroup,
            legType: this.legType,
            gender,
            sizingType: this.sizingType,
            sleeveType: this.sleeveType,
            topAdornment: this.topAdornment,
            customItemFields: Array.from(this.customItemFields),
            hashTags: Array.from([...(parentHashTags ?? []), ...this.hashTags.values()]),
            categoryName,
            subCategoryName,
            subSubCategoryName: this.name,
            shipWeightPercent: this.shipWeightPercent ?? shipWeightPercent
        };
    }
    name = '';
    id = '';
    parent: OptObj<IMercariSubCategory>;
    fullname = '';
    hashTags: DBSet<IHashTag> = [] as any;
    apparelType: Optional<keyof ApparelTypes>;
    apparelGroup: Optional<keyof ApparelGroups>;
    itemGroup: Optional<keyof ItemGroups>;
    legType: Optional<keyof LegTypes>;
    topAdornment: Optional<keyof TopAdornments>;
    sleeveType: Optional<keyof SleeveTypes>;
    sizingType: Optional<keyof SizingTypes>;
    customItemFields: DBList<ICustomItemField> = [] as any;
    get $selector(): string {
        return $css.id(this.id);
    }
    _id: BSON.ObjectId = new BSON.ObjectId();
    update(this: IMercariSubSubCategory, realm: Realm): IMercariSubSubCategory {
        const { categoryName, subCategoryName, subSubCategoryName } = this.gather();
        const fullname = [categoryName, subCategoryName, subSubCategoryName].join('::');
        const func = () => {
            this.fullname = fullname;
            HashTag.update(realm, ...this.hashTags.values());
        };
        checkTransaction(realm)(func);
        return this;
    }

    static schema: Realm.ObjectSchema = {
        name: $db.mercariSubSubCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            id: $db.string.empty,
            parent: $db.mercariSubCategory.opt,
            apparelType: $db.string.opt,
            apparelGroup: $db.string.opt,
            itemGroup: $db.string.opt,
            fullname: $db.string.opt,
            hashTags: $db.hashTag.set,
            legType: $db.string.opt,
            topAdornment: $db.string.opt,
            sleeveType: $db.string.opt,
            sizingType: $db.string.opt,
            customItemFields: $db.customItemField.list,
            shipWeightPercent: { type: $db.float() as any, default: 0.3 }
        }
    };
    static labelProperty: keyof IMercariSubSubCategory = 'fullname';
    static defaultSort: Realm.SortDescriptor[] = ['fullname'];
    static columns: DefinedColumns = [
        Def.OID(helper),
        Def.ctor('fullname').readonly().required().$$(helper),
        Def.ctor('name').required().max(50).$$(helper),
        Def.ctor('id').required().max(30).$$(helper),
        Def.ctor('parent.parent.name').readonly().displayName('Category').$$(helper),
        Def.ctor('parent').asLookup('mercariSubCategory').$$(helper),
        Def.ctor('apparelType').asEnum(ApparelTypes).$$(helper),
        Def.ctor('apparelGroup').asEnum(ApparelGroups).$$(helper),
        Def.ctor('itemGroup').asEnum(ItemGroups).$$(helper),
        Def.ctor('legType').asEnum(LegTypes).$$(helper),
        Def.ctor('topAdornment').asEnum(TopAdornments).$$(helper),
        Def.ctor('sleeveType').asEnum(SleeveTypes).$$(helper),
        Def.ctor('sizingType').asEnum(SizingTypes).$$(helper),
        Def.ctor('shipWeightPercent').percentage(0, 1).defaultValue(0.3).$$(helper)
    ];
}
