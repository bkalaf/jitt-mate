import { IMercariSubSubCategory, OptObj, IMercariSubCategory, $db, Opt } from './db';
import Realm, { BSON } from 'realm';


export class MercariSubSubCategory extends Realm.Object<IMercariSubSubCategory> implements IMercariSubSubCategory {
    hash: Opt<string>;
    _id: BSON.ObjectId = new BSON.ObjectId();
    name: string = '';
    id: string = '';
    parent: OptObj<IMercariSubCategory>;
    fullname: string = '';
    
    static schema: Realm.ObjectSchema = {
        name: $db.mercariSubSubCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            id: $db.string.empty,
            parent: $db.mercariSubCategory.opt,
            fullname: $db.string.opt,
            hash: $db.string.opt
        }
    };
}
