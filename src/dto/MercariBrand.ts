import Realm, { BSON } from 'realm';
import { IMercariBrand, $db } from './db';

export class MercariBrand extends Realm.Object<IMercariBrand> implements IMercariBrand {
    _id: BSON.ObjectId = new BSON.ObjectId();
    name: string = '';

    static schema: Realm.ObjectSchema = {
        name: $db.mercariBrand(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty
        }
    };
}
