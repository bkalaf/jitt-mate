/* eslint-disable @typescript-eslint/no-explicit-any */
import { OptObj, $db } from '../../dal/db';
import Realm, { BSON } from 'realm';
import { normalizeStringForFS } from '../../common/fs/normalizeStringForFS';
import { IBrand, IHashTag, IMercariBrand } from '../../dal/types';
import { ObjectId } from 'mongodb';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { $$queryClient } from '../../components/App';

export class Brand extends Realm.Object<IBrand> implements IBrand {
    get mercariBrandName(): Optional<string> {
        return this.mercariBrand?.name;
    }
    @wrapInTransactionDecorator()
    update() {
        if (this.hashTags == null) this.hashTags = [] as any;
        this.folder = normalizeStringForFS('-')(this.name);
        return this;
    }
    hashTags: DBSet<Entity<IHashTag>> = [] as any;
    get allHashTags(): Entity<IHashTag>[] {
        return [...this.hashTags.values(), ...this.parent?.allHashTags ?? [], ...this.mercariBrand?.hashTags ?? []]
    }
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
        setImmediate(() =>
            Promise.resolve(this.update()).then(() => {
                $$queryClient
                    .invalidateQueries({
                        queryKey: [Brand.schema.name]
                    })
                    .then(() => {
                        $$queryClient.refetchQueries({
                            queryKey: [Brand.schema.name]
                        });
                    });
            })
        );  
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



