import Realm, { BSON } from 'realm';
import { $db } from './db';
import { IHashTag, IMercariBrand } from './types';
import { addDefaultHash } from './addDefaultHash';

export class MercariBrand extends Realm.Object<IMercariBrand> implements IMercariBrand {
    gather(this: IMercariBrand): { mercariBrandName?: string; hashTags: IHashTag[] } {
        const result = {
            hashTags: Array.from(this.hashTags.values()),
            mercariBrandName: this.name
        };
        console.log(`MercariBrand.gather`, result);
        return result;
    }
    update: (this: IMercariBrand, realm: Realm) => IMercariBrand = addDefaultHash<IMercariBrand>('name').bind(this);
    // gather(): AttributeObject {
    //     return {
    //         hashTags: Array.from(this.hashTags.values()),
    //         mercariBrandName: this.name
    //     };
    // }
    // $gather(): AttributeObject {
    //     return {
    //         hashTags: Array.from(this.hashTags.values()),
    //         mercariBrandName: this.name
    //     };
    // }
    hashTags!: DBSet<IHashTag>;
    _id: BSON.ObjectId = new BSON.ObjectId();
    name = '';

    static schema: Realm.ObjectSchema = {
        name: $db.mercariBrand(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            hashTags: $db.hashTag.set
        }
    };
}
