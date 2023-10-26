import Realm, { Types, BSON } from 'realm';
import { ApparelTypeKeys, GenderKeys, ItemGroupKeys, LegTypeKeys, SizeKeys, SizingTypeKeys, SleeveTypeKeys, TopAdornmentKeys } from '../enums/importNecklineType';
import { ApparelGroupKeys, ISizeEntry } from '../enums/sizes';
import { $db } from './db';
import { IClassifier, IMercariSubSubCategory, IMercariCategory, IMercariSubCategory, IHashTag } from './types';
import AllSizeMap from './../enums/sizing-map.json';
import { $$ } from '../common/comparator/areRealmObjectsEqual';

export class Classifier extends Realm.Object<IClassifier> implements IClassifier {
    _id: BSON.ObjectId = new BSON.ObjectId();
    name = '';
    mercariSubSubCategory: OptObj<IMercariSubSubCategory>;
    gender: Optional<GenderKeys>;
    apparelType: Optional<ApparelTypeKeys>;
    legType: Optional<LegTypeKeys>;
    apparelGroup: Optional<ApparelGroupKeys>;
    itemGroup: Optional<ItemGroupKeys>;
    hashTags: DBSet<IHashTag>;
    topAdornment: Optional<TopAdornmentKeys>;
    sleeveType: Optional<SleeveTypeKeys>;
    sizingType: Optional<SizingTypeKeys>;
    
    static schema: Realm.ObjectSchema = {
        name: $db.classifier(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            mercariSubSubCategory: $db.mercariSubSubCategory.opt,
            parent: $db.classifier.opt,
            apparelType: $db.string.opt,
            gender: $db.string.opt,
            legType: $db.string.opt,
            apparelGroup: $db.string.opt,
            itemGroup: $db.string.opt,
            hashTags: $db.hashTag.set,
            topAdornment: $db.string.opt,
            sleeveType: $db.string.opt,
            sizingType: $db.string.opt
        }
    };
    getCategory(): IMercariCategory {
        const result = this.getSubCategory().parent;
        if (result == null) throw new Error('category is null');
        return result;
    }
    getSubCategory(): IMercariSubCategory {
        const result = this.getSubSubCategory().parent;
        if (result == null) throw new Error('subCategory is null');
        return result;
    }
    getSubSubCategory(): IMercariSubSubCategory {
        if (this.mercariSubSubCategory == null) throw new Error('subSubCategory is null');
        return this.mercariSubSubCategory;
    }

    get isMediaMail(): boolean {
        return this.$itemGroup === 'media';
    }
    get $categoryId(): string {
        return this.mercariSubSubCategory.$categoryId;
    }
    get $subCategoryId(): string {
        return this.mercariSubSubCategory.$subCategoryId;
    }
    get $subSubCategoryId(): string {
        return this.mercariSubSubCategory.id;
    }
    get $gender(): Optional<GenderKeys> {
        return this.gender ?? this.mercariSubSubCategory.$gender;
    }
    get $apparelType(): Optional<ApparelTypeKeys> {
        return this.apparelType ?? this.mercariSubSubCategory.$apparelType;
    }
    get $legType(): Optional<LegTypeKeys> {
        return this.legType ?? this.mercariSubSubCategory.$legType;
    }
    get $apparelGroup(): Optional<ApparelGroupKeys> {
        return this.apparelGroup ?? this.mercariSubSubCategory.$apparelGroup;
    }
    get $itemGroup(): Optional<ItemGroupKeys> {
        return this.itemGroup ?? this.mercariSubSubCategory.$itemGroup;
    }
    get $hashTags(): IHashTag[] {
        const thisTags = Array.from(this.hashTags.values());
        const parentTags = this.mercariSubSubCategory?.$hashTags;
        return $$.realmObject.distinct([...thisTags, ...parentTags]) as IHashTag[];
    }
    get $topAdornment(): Optional<TopAdornmentKeys> {
        return this.topAdornment ?? this.mercariSubSubCategory.$topAdornment;
    }
    get $sleeveType(): Optional<SleeveTypeKeys> {
        return this.sleeveType ?? this.mercariSubSubCategory.$sleeveType;
    }
    get $sizingType(): Optional<SizingTypeKeys> {
        return this.sizingType ?? this.mercariSubSubCategory.sizingType;
    }
    get $sizeMap(): (value?: SizeKeys) => ISizeEntry | undefined {
        const result = AllSizeMap[this.$sizingType] as Record<string, ISizeEntry>;
        return (value?: SizeKeys) => value != null ? result[value] : undefined;
    }

}
