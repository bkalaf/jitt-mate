import { Klass } from './../../../dist/dal/enums/taxa.d';
import Realm, { BSON, SortDescriptor } from 'realm';
import { $db } from '../../dal/db';
import { IHashTag, IMercariCategory, IMercariSubCategory, IProductTaxonomy } from '../../dal/types';
import { ApparelGroups } from '../../dal/enums/apparelGroups';
import { ApparelTypes } from '../../dal/enums/apparelType';
import { ItemGroups } from '../../dal/enums/itemGroups';
import { $css } from '../../dal/$css';
import { createColumnHelper } from '@tanstack/react-table';
import { gatherReport } from '../../dal/gatherReport';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { defineColumnsDecorator, staticColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';
import { updateImmediatelyAfterConstruction } from '../../decorators/class/updateImmediatelyAfterConstruction';
import { labelledByDecorator } from '../../decorators/class/labelledByDecorator';
import { defaultSortDecorator } from '../../decorators/class/defaultSortDecorator';
import { META } from '../../dal/types/META';
import { $$ } from '../../common/comparator/areRealmObjectsEqual';
import { $$ctor, $$embedded, withHeaderDecorator, asLookupObjectDecorator, $$object } from '../../decorators/field/baseMetaDecorator';
import { MercariCategory } from './MercariCategory';
import { wrapDistinctArrayAccessorDecorator } from '../../decorators/accessor/distinctArray';
import { withLabelPropertyDecorator } from '../../schema/decorators/labelProperty';
import { prependText } from '../../dal/prependText';
import { defineCalculatedField } from '../../decorators/field/defineCalculatedField';
import { recalculateDecorator } from '../../decorators/method/recalculateDecorator';
import { realmCollectionDecorator } from './realmCollectionDecorator';
import { basicListDecorator, basicLookupDecorator } from './basicTextboxDecorator';

@realmCollectionDecorator('name', 'parent.name', 'name')
export class MercariSubCategory extends Realm.Object<IMercariSubCategory> implements IMercariSubCategory {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setTimeout(this.update, 500);
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
        this.taxon?.update();
        console.log('post update', this);
        return this;
    }
    get effectiveShipWeightPercent(): Optional<number> {
        return this.shipWeightPercent ?? this.parent?.effectiveShipWeightPercent;
    }
    get effectiveTaxon(): OptionalEntity<IProductTaxonomy> {
        return this.taxon ?? this.parent?.effectiveTaxon;
    }
    @wrapDistinctArrayAccessorDecorator('name')
    @basicListDecorator('hashTag')
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
    @META.col.oid
    _id: BSON.ObjectId = new BSON.ObjectId();

    @META.col.name
    name = '';

    @META.col.categoryID
    id = '';

    @basicLookupDecorator(MercariCategory, 'name')
    parent: OptionalEntity<IMercariCategory>;

    @META.col.hashTags
    hashTags: DBSet<Entity<IHashTag>> = [] as any;

    @META.col.shipWeightPercent
    shipWeightPercent: Optional<number>;

    @META.col.taxon
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
