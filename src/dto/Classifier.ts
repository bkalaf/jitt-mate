import Realm, { Types, BSON } from 'realm';
import { IClassifier, OptObj, IMercariSubSubCategory, $db, IMercariCategory, IMercariSubCategory, Opt } from './db';
import { ApparelTypeKeys, GenderKeys, ItemGroupKeys, LegTypeKeys, SizeKeys } from '../enums/importNecklineType';
import { ApparelGroupKeys, ISizeEntry, importAllSizes } from '../enums/sizes';


export class Classifier extends Realm.Object<IClassifier> implements IClassifier {
    hash: string[] = [];
    itemGroup: Opt<ItemGroupKeys>;
    apparelGroup: Opt<ApparelGroupKeys>;
    getImportSize(): (value?: SizeKeys | undefined) => ISizeEntry | undefined {
        if (this.apparelGroup == null) return (value?: string) => undefined;
        return importAllSizes(this.apparelGroup, this.gender ?? 'U');
    }
    mediaMail = false;
    _id: BSON.ObjectId = new BSON.ObjectId();
    name = '';
    mercariSubSubCategory: OptObj<IMercariSubSubCategory>;
    parent: OptObj<IClassifier>;
    // childs: Types.LinkingObjects<IClassifier, 'parent'> | undefined;
    apparelType: Opt<ApparelTypeKeys>;
    gender: Opt<GenderKeys>;
    legType: Opt<LegTypeKeys>;

    static schema: Realm.ObjectSchema = {
        name: $db.classifier(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            mercariSubSubCategory: $db.mercariSubSubCategory.opt,
            parent: $db.classifier.opt,
            // childs: $db.backlink($db.classifier(), 'parent'),
            apparelType: $db.string.opt,
            gender: $db.string.opt,
            mediaMail: $db.bool.false,
            legType: $db.string.opt,
            apparelGroup: $db.string.opt,
            itemGroup: $db.string.opt,
            hash: $db.string.list
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

}
