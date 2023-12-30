/* eslint-disable @typescript-eslint/no-explicit-any */
import { OptObj, $db } from '../../dal/db';
import Realm, { BSON } from 'realm';
import { normalizeStringForFS } from '../../common/fs/normalizeStringForFS';
import { IBrand, IHashTag, IMercariBrand } from '../../dal/types';
import { ObjectId } from 'mongodb';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { $$queryClient } from '../../components/$$queryClient';

export class Brand extends Realm.Object<IBrand> implements IBrand {
    @wrapInTransactionDecorator()
    update() {
        if (this.hashTags == null) this.hashTags = [] as any;
        this.folder = normalizeStringForFS('-')(this.name);
        return this;
    }
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
    get mercariBrandName(): Optional<string> {
        return this.mercariBrand?.name;
    }

    get effectiveHashTags(): Entity<IHashTag>[] {
        return Array.from(new Set([...(this.parent?.effectiveHashTags ?? []), ...Array.from(this.hashTags.values())]).values());
      
    }
    hashTags: DBSet<Entity<IHashTag>> = [] as any;
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

    static schema: Realm.ObjectSchema = {
        name: $db.brand(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            folder: $db.string.opt,
            hashTags: $db.hashTag.set,
            mercariBrand: $db.mercariBrand.opt,
            name: $db.string.empty,
            parent: $db.brand.opt,
            website: $db.string.opt
        }
    };
}



