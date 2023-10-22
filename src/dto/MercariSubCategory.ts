import Realm, { BSON } from 'realm';
import { Types } from 'realm';
import { IMercariSubCategory, OptObj, IMercariCategory, IMercariSubSubCategory, $db } from './db';


export class MercariSubCategory extends Realm.Object<IMercariSubCategory> implements IMercariSubCategory {
    _id: BSON.ObjectId = new BSON.ObjectId();
    name: string = '';
    id: string = '';
    parent: OptObj<IMercariCategory>;
    // childs: Types.LinkingObjects<IMercariSubSubCategory, 'parent'> | undefined;

    static schema: Realm.ObjectSchema = {
        name: $db.mercariSubCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            id: $db.string.empty,
            parent: $db.mercariCategory.opt
            // childs: $db.backlink('mercariSubSubCategory', 'parent')
        }
    };
}
