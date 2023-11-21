import { OptObj, $db } from '../../dal/db';
import Realm, { BSON } from 'realm';
import { normalizeStringForFS } from '../../common/fs/normalizeStringForFS';
import { IBrand, IHashTag, IMercariBrand } from '../../dal/types';
import { ObjectId } from 'mongodb';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { addDefaultHashTags } from './addDefaultHashTags';

export class Brand extends Realm.Object<IBrand> implements IBrand {
    get mercariBrandName(): Optional<string> {
        return this.mercariBrand?.name;
    }
    @wrapInTransactionDecorator()
    update() {
        this.folder = normalizeStringForFS('-')(this.name);
        addDefaultHashTags(this);
        return this;
    }
    hashTags: DBSet<Entity<IHashTag>> = [] as any;
    allHashTags: Entity<IHashTag>[] = [] as any;
    name = '';
    mercariBrand: OptObj<IMercariBrand>;
    website: Optional<string>;
    folder = '';
    parent: OptObj<IBrand>;
    _id: ObjectId = new BSON.ObjectId();
    // update() {
    //     const func = () => {
    //         this.folder = normalizeStringForFS('-')(this.name);
    //         // addDefaultHashTags(this);
    //     };
    //     // checkTransaction(realm)(func);
    //     return this;
    // }
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setTimeout(this.update, 500);
    }
    static schema: Realm.ObjectSchema = {
        name: $db.brand(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            mercariBrand: $db.mercariBrand.opt,
            website: $db.string.opt,
            folder: $db.string.opt,
            hashTags: $db.hashTag.set,
            parent: $db.brand.opt
        }
    };
    static labelProperty: keyof IBrand = 'name';
    static defaultSort: Realm.SortDescriptor[] = ['name'];
    // static columns: DefinedColumns = [
    //     Def.OID(helper),
    //     Def.ctor('name').required().max(100).$$(helper),
    //     Def.ctor('mercariBrand').asLookup().labelBy('name').$$(helper),
    //     Def.ctor('website').url().max(150).$$(helper),
    //     Def.ctor('folder').validator().$$(helper),
    //     Def.ctor('parent').asLookup('brand').labelBy('name').$$(helper),
    //     Def.ctor('hashTags').list('hashTag').$(helper)
    // ];
}
