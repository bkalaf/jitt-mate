import { kingdoms } from '../embedded/ProductTaxonomy';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IHashTag, IMercariCategory, IMercariSubCategory, IProductTaxonomy, IRealmEntity } from '../../dal/types';
import { ApparelGroups } from '../../dal/enums/apparelGroups';
import { ApparelTypes } from '../../dal/enums/apparelType';
import { ItemGroups } from '../../dal/enums/itemGroups';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { staticColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';
import { prependText } from '../../common/text/prependText';
import { $$queryClient } from '../../components/App';
import { HashTag } from './HashTag';
import { parentedUpdate } from '../updaters/parentedUpdate';
import { categorySelectorUpdater } from '../updaters/categorySelectorUpdater';
import { hashTaggedUpdater } from '../updaters/hashTaggedUpdater';
import { taxonUpdater } from '../updaters/taxonUpdater';
import { mergeProductTaxonomy } from '../embedded/mergeProductTaxonomy';

export class MercariSubCategory extends Realm.Object<IMercariSubCategory> implements IMercariSubCategory {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setImmediate(() =>
            Promise.resolve(this.update()).then(() => {
                $$queryClient
                    .invalidateQueries({
                        queryKey: [MercariSubCategory.schema.name]
                    })
                    .then(() => {
                        $$queryClient.refetchQueries({
                            queryKey: [MercariSubCategory.schema.name]
                        });
                    });
            })
        );
    }

    get categoryID(): Optional<string> {
        return this.parent?.id;
    }
    @wrapInTransactionDecorator()
    update() {
        const pu = parentedUpdate<'parent', IMercariCategory, IMercariSubCategory>;
        taxonUpdater.bind(this, pu.bind(this, 'parent'))();
        categorySelectorUpdater.bind(this)();
        hashTaggedUpdater.bind(this)();    
        const merged = mergeProductTaxonomy(this.taxon, this.parent?.taxon)
        if (merged) {
            this.taxon = merged as any;
        }
        return this;
    }
    get effectiveShipWeightPercent(): Optional<number> {
        return this.shipWeightPercent ?? this.parent?.effectiveShipWeightPercent;
    }
    get effectiveTaxon(): OptionalEntity<IProductTaxonomy> {
        return this.taxon ?? this.parent?.effectiveTaxon;
    }
    get allHashTags(): Entity<IHashTag>[] {
        return [...(this.parent?.allHashTags ?? []), ...Array.from(this.hashTags.values() ?? [])];
    }
    apparelType: Optional<keyof ApparelTypes>;
    apparelGroup: Optional<keyof ApparelGroups>;
    itemGroup: Optional<keyof ItemGroups>;
    // _id: BSON.ObjectId = new BSON.ObjectId();
    // name = '';
    // id = '';
    // parent: OptObj<IMercariCategory>;
    // apparelType: Optional<ApparelTypeKeys>;
    // apparelGroup: Optional<ApparelGroupKeys>;
    // itemGroup: Optional<ItemGroupKeys>;
    _id: BSON.ObjectId = new BSON.ObjectId();
    name = '';
    id = '';
    parent: OptionalEntity<IMercariCategory>;
    hashTags: DBSet<Entity<IHashTag>> = [] as any;
    shipWeightPercent: Optional<number>;
    taxon: OptionalEntity<IProductTaxonomy>;

    static schema: Realm.ObjectSchema = {
        name: $db.mercariSubCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            id: $db.string.empty,
            parent: $db.mercariCategory.opt,
            apparelType: $db.string.opt,
            apparelGroup: $db.string.opt,
            itemGroup: $db.string.opt,
            hashTags: $db.hashTag.set,
            shipWeightPercent: { type: $db.float() as any, optional: true },
            taxon: $db.productTaxonomy.opt
        }
    };

    @staticColumnsDecorator
    static columns(...prefixes: string[]): DefinedColumns {
        return [];
    }
}
