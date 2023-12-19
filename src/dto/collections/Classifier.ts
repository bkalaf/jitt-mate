/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ///< reference path="./../../global.d.ts" />
import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IClassifier, IMercariSubSubCategory, IHashTag, IProductTaxonomy } from '../../dal/types';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { surroundText } from '../../common/text/surroundText';
import { $$queryClient } from '../../components/App';
import { mergeProductTaxonomy } from '../embedded/mergeProductTaxonomy';
import { HashTag } from './HashTag';

export class Classifier extends Realm.Object<IClassifier> implements IClassifier {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setImmediate(() =>
            Promise.resolve(this.update()).then(() => {
                $$queryClient
                    .invalidateQueries({
                        queryKey: [Classifier.schema.name]
                    })
                    .then(() => {
                        $$queryClient.refetchQueries({
                            queryKey: [Classifier.schema.name]
                        });
                    });
            })
        );
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
        return [kingdom, phylum, klass, order, family, genus, species, classifier.athletic]
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
        if (this.taxon == null) this.taxon = { lock: false } as any;
        if ('parent' in this) {
            const parent = this.mercariSubSubCategory;
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
        if (this.hashTags) {
            HashTag.pruneList(this.hashTags);
        }
        if (this.isAthletic == null) this.isAthletic = false;
        const merged = mergeProductTaxonomy(this.taxon, this.mercariSubSubCategory?.taxon);
        if (merged) {
            this.taxon = merged as any;
        }
        const newName = Classifier.generateName(this);
        if (newName != null && newName.length > 0) {
            this.name = newName;
        }

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
    notes: Optional<string>;
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
            shipWeightPercent: { type: $db.float() as any, optional: true },
            notes: $db.string.opt
        }
    };
}
