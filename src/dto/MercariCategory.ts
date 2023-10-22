import Realm, { BSON } from 'realm';
import { Types } from 'realm';
import { IMercariCategory, IMercariSubCategory, $db } from './db';

export class MercariCategory extends Realm.Object<IMercariCategory> implements IMercariCategory {
    _id: BSON.ObjectId = new BSON.ObjectId();
    name: string = '';
    id: string = '';
    // childs: Types.LinkingObjects<IMercariSubCategory, 'parent'> | undefined;

    static schema: Realm.ObjectSchema = {
        name: $db.mercariCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            id: $db.string.empty
            // childs: $db.backlink('mercariSubCategory', 'parent')
        }
    };

}
