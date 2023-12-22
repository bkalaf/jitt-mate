/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IHashTag, IMercariCategory, IMercariSubCategory, IProductTaxonomy } from '../../dal/types';
import { ApparelGroups } from '../../dal/enums/apparelGroups';
import { ApparelTypes } from '../../dal/enums/apparelType';
import { ItemGroups } from '../../dal/enums/itemGroups';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { $$queryClient } from '../../components/App';
import { mergeProductTaxonomy } from '../../util/mergeProductTaxonomy';
import { prependText } from '../../common/text/prependText';
import { HashTag } from './HashTag';

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
    get fullname(): string {
        return [this.parent?.name, this.name].filter((x) => x != null).join('::');
    }
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
        const merged = mergeProductTaxonomy(this.taxon, this.parent?.taxon);
        if (merged) {
            this.taxon = merged as any;
        }
        return this;
    }
    get effectiveShipWeightPercent(): Optional<number> {
        return this.shipWeightPercent ?? this.parent?.effectiveShipWeightPercent;
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
}
