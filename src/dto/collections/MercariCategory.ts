/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ///<reference path="./../../global.d.ts" />
(Symbol as any).metadata ??= Symbol('Symbol.metadata');
import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IHashTag, IMercariCategory, IProductTaxonomy } from '../../dal/types';
import { ItemGroups } from '../../dal/enums/itemGroups';
import { Genders } from '../../dal/enums/genders';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { $$queryClient } from '../../components/App';
import { listDefaultUpdater } from '../updaters/listDefaultUpdater';
import { categorySelectorUpdater } from '../updaters/categorySelectorUpdater';
import { hashTaggedUpdater } from '../updaters/hashTaggedUpdater';
import { taxonUpdater } from '../updaters/taxonUpdater';
import { mergeProductTaxonomy } from '../embedded/mergeProductTaxonomy';

export class MercariCategory extends Realm.Object<IMercariCategory> implements IMercariCategory {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setImmediate(() =>
            Promise.resolve(this.update()).then(() => {
                $$queryClient
                    .invalidateQueries({
                        queryKey: [MercariCategory.schema.name]
                    })
                    .then(() => {
                        $$queryClient.refetchQueries({
                            queryKey: [MercariCategory.schema.name]
                        });
                    });
            })
        );
    }

    get effectiveShipWeightPercent(): Optional<number> {
        return this.shipWeightPercent;
    }
    get effectiveTaxon(): Optional<Entity<IProductTaxonomy>> {
        return this.taxon;
    }
    get allHashTags(): Entity<IHashTag>[] {
        return Array.from(this.hashTags.toJSON()) as any;
    }
    gender: Optional<keyof Genders>;
    itemGroup: Optional<keyof ItemGroups>;

    @wrapInTransactionDecorator()
    update() {
        const lu = listDefaultUpdater<IMercariCategory>;
        lu.bind(this)(['hashTags']);
        taxonUpdater.bind(this)();
        categorySelectorUpdater.bind(this)();
        hashTaggedUpdater.bind(this)();
        return this;
    }

    _id: BSON.ObjectId = new BSON.ObjectId();
    name = '';
    id = '';
    hashTags: DBSet<Entity<IHashTag>> = [] as any;
    shipWeightPercent: Optional<number>;
    taxon: OptionalEntity<IProductTaxonomy>;

    static schema: Realm.ObjectSchema = {
        name: $db.mercariCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            id: $db.string.empty,
            gender: $db.string.opt,
            itemGroup: $db.string.opt,
            hashTags: $db.hashTag.set,
            shipWeightPercent: { type: $db.float() as any, optional: true },
            taxon: $db.productTaxonomy.opt
        }
    };

}
