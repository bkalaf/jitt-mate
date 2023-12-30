import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IHashTag, IMercariCategory, IProductTaxonomy } from '../../dal/types';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { prependText } from '../../common/text/prependText';
import { HashTag } from './HashTag';
import { $$queryClient } from '../../components/$$queryClient';
import { effective } from './effective';

export class MercariCategory extends Realm.Object<IMercariCategory> implements IMercariCategory {
    @wrapInTransactionDecorator()
    update() {
        if (this.hashTags == null) this.hashTags = [] as any;
        if (this.taxon == null) this.taxon = { lock: false } as any;
        if (this.taxon != null && this.taxon.update != null) {
            this.taxon =    this.taxon.update();
        }
        if (!this.id.startsWith('#')) {
            this.id = prependText('#')(this.id);
        }
        if (this.hashTags) {
            HashTag.pruneList(this.hashTags);
        }
        return this;
    }
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
    get effectiveHashTags(): Entity<IHashTag>[] {
        return Array.from(new Set(this.hashTags.values()).values());
    }
    get effectiveFamily() {
        return effective<IProductTaxonomy, string>('family', this.taxon);
    }
    get effectiveKingdom() {
        return effective<IProductTaxonomy, string>('kingdom', this.taxon);
    }
    get effectivePhylum() {
        return effective<IProductTaxonomy, string>('phylum', this.taxon);
    }
    get effectiveKlass() {
        return effective<IProductTaxonomy, string>('klass', this.taxon);
    }
    get effectiveOrder() {
        return effective<IProductTaxonomy, string>('order', this.taxon);
    }
    get effectiveGenus() {
        return effective<IProductTaxonomy, string>('genus', this.taxon);
    }
    get effectiveSpecies() {
        return effective<IProductTaxonomy, string>('species', this.taxon);
    }

    _id: BSON.ObjectId = new BSON.ObjectId();
    hashTags: DBSet<Entity<IHashTag>> = [] as any;
    id = '';
    name = '';
    shipWeightPercent: Optional<number>;
    taxon: OptionalEntity<IProductTaxonomy>;
    static schema: Realm.ObjectSchema = {
        name: $db.mercariCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            hashTags: $db.hashTag.set,
            id: $db.string.empty,
            name: $db.string.empty,
            shipWeightPercent: { type: $db.float() as any, optional: true },
            taxon: $db.productTaxonomy.opt
        }
    };
}
