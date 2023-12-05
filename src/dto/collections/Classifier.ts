/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ///< reference path="./../../global.d.ts" />
import Realm, { BSON } from 'realm';
import { $db } from '../../dal/db';
import { IClassifier, IMercariSubSubCategory, IHashTag, IProductTaxonomy } from '../../dal/types';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { realmCollectionDecorator } from '../../decorators/class/realmCollectionDecorator';
import { surroundText } from '../../common/text/surroundText';
import { $$queryClient } from '../../components/App';
import { parentedUpdate } from '../updaters/parentedUpdate';
import { boolDefaultUpdater } from '../updaters/boolDefaultUpdater';
import { hashTaggedUpdater } from '../updaters/hashTaggedUpdater';
import { taxonUpdater } from '../updaters/taxonUpdater';

@realmCollectionDecorator('name', 'name')
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
        const pu = parentedUpdate<'mercariSubSubCategory', IMercariSubSubCategory, IClassifier>;
        taxonUpdater.bind(this, pu.bind(this, 'mercariSubSubCategory'))();
        hashTaggedUpdater.bind(this)();
        const bd = boolDefaultUpdater<IClassifier>;
        bd.bind(this)(['isAthletic']);
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
