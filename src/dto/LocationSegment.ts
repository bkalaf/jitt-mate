import Realm, { BSON } from 'realm';
import { $db } from './db';
import { ILocationSegment } from './types';
import { checkTransaction } from '../util/checkTransaction';

export class LocationSegment extends Realm.Object<LocationSegment> implements ILocationSegment {
    $update(realm: Realm): ILocationSegment {
        const func = () => {
            this.barcode = this.barcode.padStart(12, '0');
        }
        checkTransaction(realm)(func);
        return this;
    }
    _id: BSON.ObjectId = new BSON.ObjectId();
    barcode = '';
    name = '';
    type: LocationTypeKeys = 'bin';
    color: Optional<LocationLabelColor>;
    notes: Optional<string>;
    kind: Optional<LocationKind>;

    static schema: Realm.ObjectSchema = {
        name: $db.locationSegment(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            barcode: $db.string.empty,
            name: $db.string.empty,
            type: $db.string.empty,
            color: $db.string.opt,
            notes: $db.string.opt,
            kind: $db.string.opt
        }
    };
}
