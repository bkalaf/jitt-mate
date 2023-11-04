import Realm, { BSON } from 'realm';
import { $db } from './db';
import { IClassifier, IMercariSubSubCategory, IHashTag } from './types';
import { ApparelGroups } from './enums/apparelGroups';
import { ApparelTypes } from './enums/apparelType';
import { Genders } from './enums/genders';
import { ItemGroups } from './enums/itemGroups';
import { LegTypes } from './enums/legTypes';
import { SizingTypes } from './enums/sizingTypes';
import { SleeveTypes } from './enums/sleeveTypes';
import { TopAdornments } from './enums/topAdornments';
import { checkTransaction } from '../util/checkTransaction';
import { createColumnHelper } from '@tanstack/react-table';
import { Def } from './Def';
import { HashTag } from './HashTag';
import { toClassifierName } from './toClassifierName';
import { gatherReport } from './gatherReport';

type GatherReturn = {
    subSubCategoryId?: string | undefined;
    apparelType?: Optional<keyof ApparelTypes>;
    apparelGroup?: Optional<keyof ApparelGroups>;
    itemGroup?: Optional<keyof ItemGroups>;
    legType?: Optional<keyof LegTypes>;
    topAdornment?: Optional<keyof TopAdornments>;
    sleeveType?: Optional<keyof SleeveTypes>;
    sizingType?: Optional<keyof SizingTypes>;
    customItemFields?: string | undefined;
    gender?: Optional<keyof Genders>;
    categoryId?: string | undefined;
    subCategoryId?: string | undefined;
    categoryName?: string | undefined;
    subCategoryName?: string | undefined;
    subSubCategoryName?: string | undefined;
    isMediaMail?: boolean | undefined;
    hashTags?: IHashTag[] | undefined;
};

export const helper = createColumnHelper<IClassifier>();
export class Classifier extends Realm.Object<IClassifier> implements IClassifier {
    get athletic(): Optional<string> {
        return this.isAthletic ? 'athletic' : undefined;
    }
    shipWeightPercent: Optional<number>;
    update<T>(this: T, realm: Realm): T {
        const $this = this as IClassifier;
        const name = toClassifierName($this);
        const func = () => {
            $this.name = name;
            HashTag.update(realm, ...$this.hashTags.values());
        };
        checkTransaction(realm)(func);
        return this;
    }
    gather(this: IClassifier) {
        const { hashTags: parentHashTags, customItemFields, ...remain } = { ...this.mercariSubSubCategory?.gather() };
        const gathered = {
            ...remain,
            hashTags: Array.from([...(parentHashTags ?? []), ...this.hashTags.values()]),
            apparelType: this.apparelType,
            apparelGroup: this.apparelGroup,
            itemGroup: this.itemGroup,
            topAdornment: this.topAdornment,
            sizingType: this.sizingType,
            sleeveType: this.sleeveType,
            legType: this.legType,
            athletic: this.athletic,
            customItemFields: customItemFields ?? []
        };
        return gatherReport('classifier', gathered);
    }
    name = '';
    isAthletic = false;
    mercariSubSubCategory: OptObj<IMercariSubSubCategory>;
    gender: Optional<keyof Genders>;
    apparelType: Optional<keyof ApparelTypes>;
    legType: Optional<keyof LegTypes>;
    apparelGroup: Optional<keyof ApparelGroups>;
    itemGroup: Optional<keyof ItemGroups>;
    hashTags: DBSet<IHashTag> = [] as any;
    topAdornment: Optional<keyof TopAdornments>;
    sleeveType: Optional<keyof SleeveTypes>;
    sizingType: Optional<keyof SizingTypes>;
    get isMediaMail(): boolean {
        return (this.itemGroup ?? this.gather().itemGroup) === 'media';
    }
    _id: BSON.ObjectId = new BSON.ObjectId();

    static schema: Realm.ObjectSchema = {
        name: $db.classifier(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            mercariSubSubCategory: $db.mercariSubSubCategory.opt,
            apparelType: $db.string.opt,
            gender: $db.string.opt,
            legType: $db.string.opt,
            apparelGroup: $db.string.opt,
            itemGroup: $db.string.opt,
            hashTags: $db.hashTag.set,
            topAdornment: $db.string.opt,
            isAthletic: $db.bool.false,
            sleeveType: $db.string.opt,
            sizingType: $db.string.opt,
            shipWeightPercent: { type: $db.float() as any, optional: true }
        }
    };
    static labelProperty: keyof IClassifier = 'name';
    static defaultSort: Realm.SortDescriptor[] = ['name'];
    static columns: DefinedColumns = [
        Def.OID(helper),
        Def.ctor<IClassifier>('name').$$(helper),
        Def.ctor<IClassifier>('mercariSubSubCategory').asLookup().$$(helper),
        Def.ctor('isAtheltic').checkbox().$$(helper),
        Def.ctor<IClassifier>('apparelType').asEnum(ApparelTypes).$$(helper),
        Def.ctor<IClassifier>('legType').asEnum(LegTypes).$$(helper),
        Def.ctor<IClassifier>('itemGroup').asEnum(ItemGroups).$$(helper),
        Def.ctor<IClassifier>('apparelGroup').asEnum(ApparelGroups).$$(helper),
        Def.ctor<IClassifier>('itemGroup').asEnum(ItemGroups).$$(helper),
        Def.ctor<IClassifier>('topAdornment').asEnum(TopAdornments).$$(helper),
        Def.ctor<IClassifier>('sleeveType').asEnum(SleeveTypes).$$(helper),
        Def.ctor<IClassifier>('sizingType').asEnum(SizingTypes).$$(helper),
        Def.ctor('shipWeightPercent').percentage(0.1).$$(helper),
        Def.ctor('gender').asEnum(Genders, 'description').readonly().$$(helper)
    ];

    // get $sizeMap(): (value?: SizeKeys) => ISizeEntry | undefined {
    //     const result = AllSizeMap[this.$sizingType] as Record<string, ISizeEntry>;
    //     return (value?: SizeKeys) => value != null ? result[value] : undefined;
    // }
}
