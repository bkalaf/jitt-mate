// ///<reference path="./../../global.d.ts" />
(Symbol as any).metadata ??= Symbol('Symbol.metadata');
import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IHashTag, IMercariCategory, IProductTaxonomy } from '../../dal/types';
import { ItemGroups } from '../../dal/enums/itemGroups';
import { Genders } from '../../dal/enums/genders';
import { META } from '../../dal/types/META';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { recalculateDecorator } from '../../decorators/method/recalculateDecorator';
import { defineCalculatedField } from '../../decorators/field/defineCalculatedField';
import { prependText } from '../../dal/prependText';
import { realmCollectionDecorator } from './realmCollectionDecorator';
import { staticColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';

@realmCollectionDecorator('name', 'name')
export class MercariCategory extends Realm.Object<IMercariCategory> implements IMercariCategory {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setTimeout(this.update, 500);
    }

    get effectiveShipWeightPercent(): Optional<number> {
        return this.shipWeightPercent;
    }
    get effectiveTaxon(): Optional<Entity<IProductTaxonomy>> {
        return this.taxon;
    }
    get allHashTags(): Entity<IHashTag>[] {
        return Array.from(this.hashTags.toJSON()) as any
    }
    gender: Optional<keyof Genders>;
    itemGroup: Optional<keyof ItemGroups>;

    @wrapInTransactionDecorator()
    update() {
        this.taxon?.update();
        if (!this.id.startsWith('#')) {
            this.id = prependText('#')(this.id);
        }
        return this;
    }

    @META.col.oid
    _id: BSON.ObjectId = new BSON.ObjectId();

    @META.col.name
    name = '';

    @META.col.categoryID
    id = '';

    @META.col.hashTags
    hashTags: DBSet<Entity<IHashTag>> = [] as any;

    @META.col.shipWeightPercent
    shipWeightPercent: Optional<number>;

    @META.col.taxon
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

    @staticColumnsDecorator
    static columns(...prefixes: string[]): DefinedColumns {
        return [];
    }
}
console.log('COLUMNS');
console.log((MercariCategory as any).columns(), null, '\t');

console.log('** METADATA **');
console.log(MercariCategory[Symbol.metadata]);
console.log(JSON.stringify((MercariCategory as any).columns(), null, '\t'));
