import { $db } from '../../dal/db';
import Realm, { BSON } from 'realm';
import { IBrand, IHashTag, IProductLine } from '../../dal/types';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { $$queryClient } from '../../components/$$queryClient';

export class ProductLine extends Realm.Object<IProductLine> implements IProductLine {
    @wrapInTransactionDecorator()
    update() {
        this.brand?.update();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.hashTags == null) this.hashTags = [] as any;
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setImmediate(() =>
            Promise.resolve(this.update()).then(() => {
                $$queryClient
                    .invalidateQueries({
                        queryKey: [$db.productLine()]
                    })
                    .then(() => {
                        $$queryClient.refetchQueries({
                            queryKey: [$db.productLine()]
                        });
                    });
            })
        );
    }
    get effectiveHashTags(): Entity<IHashTag>[] {
        return Array.from(new Set([...this.hashTags.values(), ...this.brand?.effectiveHashTags ?? []]).values())
    }
    brand: OptionalEntity<IBrand>;
    name = '';
    _id: OID = new BSON.ObjectId();
    hashTags!: DBSet<Entity<IHashTag>>;
    static schema: Realm.ObjectSchema = {
        name: 'productLine',
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string(),
            brand: $db.brand.opt,
            hashTags: $db.hashTag.set
        }
    };
}
