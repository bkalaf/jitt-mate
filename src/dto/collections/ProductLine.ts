import { $db } from '../../dal/db';
import Realm, { BSON } from 'realm';
import { IBrand, IHashTag, IProductLine } from '../../dal/types';
import { $$queryClient } from '../../components/App';

export class ProductLine extends Realm.Object<IProductLine> implements IProductLine {
    brand: OptionalEntity<IBrand>;
    name = '';
    _id: OID = new BSON.ObjectId();

    update(this: Entity<IProductLine>): Entity<IProductLine> {
        this.brand?.update();
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
    hashTags!: DBSet<Entity<IHashTag>>;
    get allHashTags(): Entity<IHashTag>[] {
        return [];
    }
    static schema: Realm.ObjectSchema = {
        name: 'productLine',
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string(),
            brand: $db.brand.opt
        }
    };
}
