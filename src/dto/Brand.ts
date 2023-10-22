import { checkTransaction } from '../util/checkTransaction';
import { IBrand, OptObj, IMercariBrand, Opt, $db } from './db';
import Realm, { BSON } from 'realm';
import { normalizeStringForFS } from '../common/fs/normalizeStringForFS';

export class Brand extends Realm.Object<IBrand> implements IBrand {
    hash: Opt<string>;
    _id: BSON.ObjectId = new BSON.ObjectId();
    name = '';
    mercariBrand: OptObj<IMercariBrand>;
    website: Opt<string>;
    folder: Opt<string>;

    static schema: Realm.ObjectSchema = {
        name: $db.brand(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            mercariBrand: $db.mercariBrand.opt,
            website: $db.string.opt,
            folder: $db.string.opt,
            hash: $db.string.opt
        }
    };
    init(realm: Realm) {
        const func = () => {
            this.folder = normalizeStringForFS('-')(this.name.toLowerCase());
            this.hash = normalizeStringForFS('')(this.name.toLowerCase());
        }
        checkTransaction(realm)(func);
    }
}

export function updateFolder(realm: Realm) {
    return function(brand: Realm.Object<IBrand> & IBrand) {
        const { name } = brand;
        const newFolder = normalizeStringForFS('-')(name);
        console.log(`newFolder: ${newFolder}`);
        realm.write(() => {
            brand.folder = newFolder;
        })
    }
}