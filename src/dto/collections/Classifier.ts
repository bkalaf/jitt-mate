/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ///< reference path="./../../global.d.ts" />
import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IClassifier, IMercariSubSubCategory, IHashTag, IProductTaxonomy } from '../../dal/types';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { wrapDistinctArrayAccessorDecorator } from '../../decorators/accessor/distinctArray';
import {
    withAutoIDDecorator,
    withHeaderDecorator,
    withInputElementDecorator,
    withImmutable,
    $$string,
    withTextTypeInputDecorator,
    asListDecorator,
    baseMetaDecorator,
    $$accessorFnDBListDecorator,
    $$autoAccessorKey
} from '../../decorators/field/baseMetaDecorator';
import { strategy } from '../../dal/types/wrappedSetMetadata';
import { realmCollectionDecorator } from '../../decorators/class/realmCollectionDecorator';
import { staticColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';
import { surroundText } from '../../dal/surroundText';

@realmCollectionDecorator('name', 'name')
export class Classifier extends Realm.Object<IClassifier> implements IClassifier {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setTimeout(this.update, 500);
    }

    get effectiveShipWeightPercent(): Optional<number> {
        return this.mercariSubSubCategory?.effectiveShipWeightPercent ?? this.shipWeightPercent;
    }

    get effectiveTaxon(): OptionalEntity<IProductTaxonomy> {
        return this.mercariSubSubCategory?.effectiveTaxon ?? this.taxon;
    }
    static generateTitle(brandText: string, attributeText: string, descriptiveText?: string) {
        return '';
    }
    static generateName(classifier: IClassifier) {
        const { family, genus, kingdom, phylum, klass, order, species } = classifier.taxon ?? {};
        const extra = classifier.shortname ? surroundText(' (')(')')(classifier.shortname) : '';
        return [kingdom, phylum, klass, order, family, genus, species]
            .filter((x) => x != null && x.length > 0)
            .join('-')
            .concat(extra);
    }
    get categoryID(): Optional<string> {
        return this.mercariSubSubCategory?.categoryID;
    }
    get subCategoryID(): Optional<string> {
        return this.mercariSubSubCategory?.subCategoryID;
    }
    get subSubCategoryID(): Optional<string> {
        return this.mercariSubSubCategory?.id;
    }
    get allHashTags(): Entity<IHashTag>[] {
        return [...(this.mercariSubSubCategory?.allHashTags ?? []), ...Array.from(this.hashTags.values() ?? [])];
    }

    get athletic(): Optional<string> {
        return this.isAthletic ? 'athletic' : undefined;
    }

    @wrapInTransactionDecorator()
    update() {
        // const $this = this as IClassifier;
        // const name = toClassifierName($this);
        // const func = () => {
        //     // $this.name = name;
        //     // HashTag.update(realm, ...$this.hashTags.values());
        // };
        // checkTransaction(realm)(func);
        if (this.mercariSubSubCategory) {
            [
                this.mercariSubSubCategory.taxon?.kingdom,
                this.mercariSubSubCategory.taxon?.phylum,
                this.mercariSubSubCategory.taxon?.klass,
                this.mercariSubSubCategory.taxon?.order,
                this.mercariSubSubCategory.taxon?.family,
                this.mercariSubSubCategory.taxon?.genus,
                this.mercariSubSubCategory.taxon?.species
            ]
                .filter((x) => x != null && x.length > 0)
                .forEach((value, ix) => {
                    if (!(this.taxon?.lock ?? false)) {
                        if (this.taxon == null) this.taxon = {} as any;
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
                    }
                });
        }
        this.taxon?.update();
        this.name = this.taxon?.name ?? '';
        return this;
    }
    _id: BSON.ObjectId = new BSON.ObjectId();
    taxon: Optional<Entity<IProductTaxonomy>>;
    shipWeightPercent: Optional<number>;
    name = '';
    shortname: Optional<string>;
    isAthletic = false;
    mercariSubSubCategory: OptionalEntity<IMercariSubSubCategory>;
    hashTags!: DBSet<Entity<IHashTag>>;

    get isMediaMail(): boolean {
        return this.taxon?.kingdom === 'media';
    }

    static schema: Realm.ObjectSchema = {
        name: $db.classifier(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            name: $db.string.empty,
            mercariSubSubCategory: $db.mercariSubSubCategory.opt,
            apparelType: $db.string.opt,
            gender: $db.string.opt,
            legType: $db.string.opt,
            apparelGroup: $db.string.opt,
            itemGroup: $db.string.opt,
            hashTags: $db.hashTag.set,
            topAdornment: $db.string.opt,
            isAthletic: $db.bool.false,
            sleeveType: $db.string.opt,
            sizingType: $db.string.opt,
            taxon: $db.productTaxonomy.opt,
            shortname: $db.string.opt,
            shipWeightPercent: { type: $db.float() as any, optional: true }
        }
    };

    @staticColumnsDecorator
    static columns(...prefixes: string[]): DefinedColumns {
        return [];
    }
}
