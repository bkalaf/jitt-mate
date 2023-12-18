import { ApparelDetails } from './../embedded/ApparelDetails';
import { Colors } from '../../dal/enums/colors';
import { Countries } from '../../dal/enums/countries';
import { DimensionKeys, IApparelDetails, IBarcode, IBrand, IClassifier, IDimensions, IHashTag, IMaterialComposition, IProduct, IProductLine, IProductTaxonomy } from '../../dal/types';
import { BSON } from 'realm';
import { $$queryClient } from '../../components/App';
import { $db } from '../../dal/db';
import { HashTag } from './HashTag';
import { taxonUpdater } from '../updaters/taxonUpdater';
import * as Realm from 'realm';
import { $initialCollection } from '../../components/Table/creators/$initialCollection';
import { checkTransaction } from '../../util/checkTransaction';
import { mergeProductTaxonomy } from '../embedded/mergeProductTaxonomy';

export class Product extends Realm.Object<IProduct> implements IProduct {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setImmediate(() =>
            Promise.resolve(this.update()).then(() => {
                $$queryClient
                    .invalidateQueries({
                        queryKey: [$db.product()]
                    })
                    .then(() => {
                        $$queryClient.refetchQueries({
                            queryKey: [$db.product()]
                        });
                    });
            })
        );
    }
    get summaryName(): string {
        return [this.effectiveBrandName, this.effectiveTaxon?.name, this.descriptiveText].filter(x => x != null).join('-');
    }
    _id!: BSON.ObjectId;
    apparelDetails: OptionalEntity<IApparelDetails>;
    brand: OptionalEntity<IBrand>;
    circa: Optional<string>;
    classifier: OptionalEntity<IClassifier>;
    color: Optional<keyof Colors>;
    descriptiveText: Optional<string>;
    dimensions: IDimensions & DBDictionary<number> = {} as any;
    features: DBList<string> = [] as any;
    flags: DBSet<'isAthletic' | 'isDecorative' | 'isGraphic' | 'isRare' | 'isVintage' | 'isCollectible' | 'isDiscontinued' | 'isMediaMail' | 'isMissingTags'> = [] as any;
    folder!: BSON.UUID;
    hashTags: DBSet<Entity<IHashTag>> = [] as any;
    materials: DBDictionary<IMaterialComposition> = {} as any;
    modelNo: Optional<string>;
    notes: Optional<string>;
    origin: Optional<keyof Countries>;
    static schema: Realm.ObjectSchema = {
        name: $db.product(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            apparelDetails: $db.apparelDetails.opt,
            brand: $db.brand.opt,
            circa: $db.string.opt,
            classifier: $db.classifier.opt,
            color: $db.string.opt,
            descriptiveText: $db.string.opt,
            dimensions: $db.float.dictionary,
            features: $db.string.list,
            flags: $db.string.set,
            folder: $db.uuid,
            hashTags: $db.hashTag.set,
            materials: $db.materialComposition.dictionary,
            modelNo: $db.string.opt,
            notes: $db.string.opt,
            origin: $db.string.opt,
            productLine: $db.productLine.opt,
            shipWeightPercent: $db.float.opt,
            styleNo: $db.string.opt,
            taxon: $db.productTaxonomy.opt,
            upcs: $db.barcode.list
        }
    };

    productLine: OptionalEntity<IProductLine>;
    shipWeightPercent: Optional<number>;
    styleNo: Optional<string>;
    taxon: OptionalEntity<IProductTaxonomy>;
    upcs: DBList<Entity<IBarcode>> = [] as any;
    get allHashTags(): Entity<IHashTag>[] {
        return [];
    }
    get isNoBrand(): boolean {
        return this.effectiveBrand == null;
    }
    get effectiveShipWeightPercent(): Optional<number> {
        return this.shipWeightPercent ?? this.classifier?.effectiveShipWeightPercent;
    }
    get effectiveBrand(): OptionalEntity<IBrand> {
        if (this.productLine) {
            return this.productLine.brand;
        }
        return this.brand;
    }
    get effectiveMercariBrandName(): Optional<string> {
        return this.effectiveBrand?.mercariBrand?.name;
    }
    get effectiveBrandName(): Optional<string> {
        return this.effectiveBrand?.name;
    }
    get effectiveBrandFolder(): Optional<string> {
        return this.effectiveBrand?.folder ?? 'no-brand';
    }
    get effectiveCategoryID(): Optional<string> {
        return this.classifier?.mercariSubSubCategory?.parent?.parent?.id;
    }
    get effectiveSubCategoryID(): Optional<string> {
        return this.classifier?.mercariSubSubCategory?.parent?.id;
    }
    get effectiveSubSubCategoryID(): Optional<string> {
        return this.classifier?.mercariSubSubCategory?.id;
    }
    get effectiveTaxon(): OptionalEntity<IProductTaxonomy> {
        return this.taxon;
    }
    static updateTaxon(product: IProduct) {
        taxonUpdater.bind(product)();
        const merged = mergeProductTaxonomy(product.taxon, product.classifier?.taxon);
        if (merged) {
            product.taxon = merged as any;
        }
        return product;
    }
    update(this: Entity<IProduct>): Entity<IProduct> {
        if (this._id == null) this._id = new BSON.ObjectId();
        if (this.apparelDetails == null) {
            $initialCollection['apparelDetails']().then((ad) => (this.apparelDetails = ad as any));
        }
        if (this.folder == null) this.folder = new BSON.UUID();
        if (this.dimensions == null) this.dimensions = {} as any;
        if (this.features == null) this.features = [] as any;
        if (this.flags == null) this.flags = [] as any;
        if (this.materials == null) {
            $initialCollection['materialComposition']().then((mc) => (this.materials = mc as any));
        }
        if (this.upcs == null) this.upcs = [] as any;
        if (this.upcs) this.upcs.forEach((x) => x.update());
        if (this.hashTags == null) this.hashTags = [] as any;
        if (this.hashTags) HashTag.pruneList(this.hashTags);
        taxonUpdater.bind(this)();
        const merged = mergeProductTaxonomy(this.taxon, this.classifier?.taxon);
        if (merged) {
            this.taxon = merged as any;
        }
        return this;
    }
}
