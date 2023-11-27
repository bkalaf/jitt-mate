/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IHashTag, IMercariCategory, IMercariSubCategory, IProductTaxonomy } from '../../dal/types';
import { ApparelGroups } from '../../dal/enums/apparelGroups';
import { ApparelTypes } from '../../dal/enums/apparelType';
import { ItemGroups } from '../../dal/enums/itemGroups';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { staticColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';
import { prependText } from '../../dal/prependText';
import { realmCollectionDecorator } from '../../decorators/class/realmCollectionDecorator';
import { $$queryClient } from '../../components/App';
import { HashTag } from './HashTag';

@realmCollectionDecorator('name', 'parent.name', 'name')
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

        console.log(`preupdate`, this);
        if (!this.id.startsWith('#')) {
            this.id = prependText('#')(this.id);
        }
        if (this.parent) {
            this.parent = this.parent.update();
        }
        if (this.hashTags) {
            HashTag.pruneList(this.hashTags);
        }
        if (this.parent && !(this.taxon?.lock ?? false)) {
            [this.parent.taxon?.kingdom, this.parent.taxon?.phylum, this.parent.taxon?.klass, this.parent.taxon?.order, this.parent.taxon?.family, this.parent.taxon?.genus, this.parent.taxon?.species].filter(x => x != null && x.length > 0).forEach((value, ix) => {
                if (this.taxon == null) this.taxon = {} as any;
                console.log(`updating`, value, ix);
                switch (ix) {
                    case 0:                        
                        (this.taxon as any).kingdom = value;
                        break;
                    case 1:
                        (this.taxon as any).phylum = value;
                        break;
                    case 2:
                        (this.taxon as any).klass = value;
                        break;
                    case 3:
                        (this.taxon as any).order = value;
                        break;
                    case 4:
                        (this.taxon as any).family = value;
                        break;
                    case 5:
                        (this.taxon as any).genus = value;
                        break;
                    case 6:
                        (this.taxon as any).species = value;
                        break;
                }
            })
            
        }
        this.taxon = this.taxon?.update() ?? {} as Entity<IProductTaxonomy>;
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
