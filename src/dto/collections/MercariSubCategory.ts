/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IHashTag, IMercariCategory, IMercariSubCategory, IProductTaxonomy } from '../../dal/types';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { HashTag } from './HashTag';
import { $$queryClient } from '../../components/$$queryClient';
import { effective } from './effective';
import { distinctBy } from '../../common/array/distinctBy';
import { fromOID } from '../../dal/fromOID';

export class MercariSubCategory extends Realm.Object<IMercariSubCategory> implements IMercariSubCategory {
    @wrapInTransactionDecorator()
    update() {
        if (this.hashTags) {
            HashTag.pruneList(this.hashTags);
        }
        if (this.taxon == null) this.taxon = { lock: false } as any;

        if ('parent' in this) {
            const parent = this.parent;
            if (parent != null) {
                const target = parent.taxon ?? ({ lock: false } as IProductTaxonomy);
                if (target != null && !target.lock) {
                    const values = [parent.taxon?.kingdom, parent.taxon?.phylum, parent.taxon?.klass, parent.taxon?.order, parent.taxon?.family, parent.taxon?.genus, parent.taxon?.species].filter(
                        (x) => x != null
                    ) as string[];
                    const setters = [
                        (value: string) => (target.kingdom = value),
                        (value: string) => (target.phylum = value),
                        (value: string) => (target.klass = value),
                        (value: string) => (target.order = value),
                        (value: string) => (target.family = value),
                        (value: string) => (target.genus = value),
                        (value: string) => (target.species = value)
                    ];
                    for (let index = 0; index < values.length; index++) {
                        const currentValue = values[index];
                        setters[index](currentValue);
                    }
                }
            }
        }
        if (this.taxon != null && this.taxon.update != null) {
            this.taxon = this.taxon.update();
        }
        // const merged = mergeProductTaxonomy(this.taxon, this.parent?.taxon);
        // if (merged) {
        //     this.taxon = merged as any;
        // }
        return this;
    }
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
    get fullname(): string {
        return [this.parent?.name, this.name].filter((x) => x != null).join('::');
    }
    get effectiveShipWeightPercent(): Optional<number> {
        return this.shipWeightPercent ?? this.parent?.effectiveShipWeightPercent;
    }
    get effectiveHashTags(): Entity<IHashTag>[] {
        return distinctBy<Entity<IHashTag>>((x) => (y) => fromOID(x._id) === fromOID(y._id))([...(this.parent?.effectiveHashTags ?? []), ...this.hashTags.values()]);
    }
    get effectiveFamily() {
        return effective<IProductTaxonomy, string>('family', this.taxon, this.parent?.taxon);
    }
    get effectiveKingdom() {
        return effective<IProductTaxonomy, string>('kingdom', this.taxon, this.parent?.taxon);
    }
    get effectivePhylum() {
        return effective<IProductTaxonomy, string>('phylum', this.taxon, this.parent?.taxon);
    }
    get effectiveKlass() {
        return effective<IProductTaxonomy, string>('klass', this.taxon, this.parent?.taxon);
    }
    get effectiveOrder() {
        return effective<IProductTaxonomy, string>('order', this.taxon, this.parent?.taxon);
    }
    get effectiveGenus() {
        return effective<IProductTaxonomy, string>('genus', this.taxon, this.parent?.taxon);
    }
    get effectiveSpecies() {
        return effective<IProductTaxonomy, string>('species', this.taxon, this.parent?.taxon);
    }
    _id: BSON.ObjectId = new BSON.ObjectId();
    hashTags: DBSet<Entity<IHashTag>> = [] as any;
    id = '';
    name = '';
    parent: OptionalEntity<IMercariCategory>;
    shipWeightPercent: Optional<number>;
    taxon: OptionalEntity<IProductTaxonomy>;
    static schema: Realm.ObjectSchema = {
        name: $db.mercariSubCategory(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            hashTags: $db.hashTag.set,
            id: $db.string.empty,
            name: $db.string.empty,
            parent: $db.mercariCategory.opt,
            shipWeightPercent: { type: $db.float() as any, optional: true },
            taxon: $db.productTaxonomy.opt
        }
    };
}
