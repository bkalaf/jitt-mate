import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IClassifier, IMercariSubSubCategory, IHashTag, IProductTaxonomy } from '../../dal/types';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { surroundText } from '../../common/text/surroundText';
import { HashTag } from './HashTag';
import { $$queryClient } from '../../components/$$queryClient';
import { effective } from './effective';
import { distinctBy } from '../../common/array/distinctBy';
import { fromOID } from '../../dal/fromOID';

export class Classifier extends Realm.Object<IClassifier> implements IClassifier {
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
        const newName = Classifier.generateName(this);
        if (newName != null && newName.length > 0) {
            this.name = newName;
        }
        return this;
    }
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
    static generateName(classifier: IClassifier) {
        const { family, genus, kingdom, phylum, klass, order, species } = classifier.taxon ?? {};
        const extra = classifier.shortname ? surroundText(' (')(')')(classifier.shortname) : '';
        return [kingdom, phylum, klass, order, family, genus, species, classifier.isAthletic ? 'athletic' : undefined]
            .filter((x) => x != null && x.length > 0)
            .join('-')
            .concat(extra);
    }
    get effectiveFamily() {
        return effective<IProductTaxonomy, string>('family', this.taxon, this.mercariSubSubCategory?.taxon);
    }
    get effectiveKingdom() {
        return effective<IProductTaxonomy, string>('kingdom', this.taxon, this.mercariSubSubCategory?.taxon);
    }
    get effectivePhylum() {
        return effective<IProductTaxonomy, string>('phylum', this.taxon, this.mercariSubSubCategory?.taxon);
    }
    get effectiveKlass() {
        return effective<IProductTaxonomy, string>('klass', this.taxon, this.mercariSubSubCategory?.taxon);
    }
    get effectiveOrder() {
        return effective<IProductTaxonomy, string>('order', this.taxon, this.mercariSubSubCategory?.taxon);
    }
    get effectiveSpecies() {
        return effective<IProductTaxonomy, string>('species', this.taxon, this.mercariSubSubCategory?.taxon);
    }
    get effectiveGenus() {
        return effective<IProductTaxonomy, string>('genus', this.taxon, this.mercariSubSubCategory?.taxon);
    }
    get effectiveShipWeightPercent() {
        return this.shipWeightPercent ?? this.mercariSubSubCategory?.effectiveShipWeightPercent;
    }
    get isAthletic() {
        return this.checkTaxa('athletic');
    }
    get isGraphic() {
        return this.checkTaxa('graphic');
    }
    get isMediaMail() {
        return this.checkTaxa('media') && ['books', 'videos', 'audio'].some(this.checkTaxa);
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
    get effectiveHashTags(): Entity<IHashTag>[] {
        return distinctBy<Entity<IHashTag>>((x) => (y) => fromOID(x._id) === fromOID(y._id))([...(this.mercariSubSubCategory?.effectiveHashTags ?? []), ...this.hashTags.values()]);
    }
    checkTaxa(item: string) {
        return [this.effectiveKingdom, this.effectivePhylum, this.effectiveKlass, this.effectiveOrder, this.effectiveFamily, this.effectiveGenus, this.effectiveSpecies, this?.shortname].includes(
            item
        );
    }
    _id: BSON.ObjectId = new BSON.ObjectId();
    hashTags!: DBSet<Entity<IHashTag>>;
    mercariSubSubCategory: OptionalEntity<IMercariSubSubCategory>;
    name = '';
    notes: Optional<string>;
    shipWeightPercent: Optional<number>;
    shortname: Optional<string>;
    taxon: Optional<Entity<IProductTaxonomy>>;
    static schema: Realm.ObjectSchema = {
        name: $db.classifier(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            hashTags: $db.hashTag.set,
            mercariSubSubCategory: $db.mercariSubSubCategory.opt,
            name: $db.string.empty,
            notes: $db.string.opt,
            shipWeightPercent: { type: $db.float() as any, optional: true },
            shortname: $db.string.opt,
            taxon: $db.productTaxonomy.opt
        }
    };
}
