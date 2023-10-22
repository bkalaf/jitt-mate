import Realm, { BSON } from 'realm';
import { $db, ILocationSegment, LocationKind, LocationLabelColor, LocationTypeKeys, Opt } from './db';

export class LocationSegment extends Realm.Object<LocationSegment> implements ILocationSegment {
    _id: BSON.ObjectId = new BSON.ObjectId();
    barcode = '';
    name = '';
    type: LocationTypeKeys = 'bin';
    color: Opt<LocationLabelColor>;
    notes: Opt<string>;
    kind: Opt<LocationKind>;

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
    }
}