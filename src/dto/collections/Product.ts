import { ColorsInfos, aliasesToMainColors } from '../../dal/enums/colors';
import { Countries } from '../../dal/enums/countries';
import { IApparelDetails, IBarcode, IBrand, IClassifier, IDimensions, IDraft, IHashTag, IMaterialComposition, IProduct, IProductLine, IProductTaxonomy } from '../../dal/types';
import { BSON } from 'realm';
import { $$queryClient } from '../../components/App';
import { $db } from '../../dal/db';
import { HashTag } from './HashTag';
import * as Realm from 'realm';
import { $initialCollection } from '../../components/Table/creators/$initialCollection';
import { mergeProductTaxonomy } from '../../util/mergeProductTaxonomy';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { Genders } from '../../dal/enums/genders';
import { SleeveTypes } from '../../dal/enums/sleeveTypes';
import { NecklineTypes } from '../../dal/enums/necklineTypes';
import { BacklineTypes } from '../../dal/enums/backlineTypes';
import { WaistTypes } from '../../dal/enums/waistTypes';
import { LegTypes } from '../../dal/enums/legTypes';
import { CollarTypes } from '../../dal/enums/collarTypes';
import { CuffTypes } from '../../dal/enums/cuffTypes';
import { TopAdornments } from '../../dal/enums/topAdornments';
import { ApparelTypes } from '../../dal/enums/apparelType';

export function ofEnum<T extends string>(enumMap: EnumMap<T>) {
    return function(value?: T | undefined) {
        return value == null ? undefined : enumMap[value];
    }
}
export function getAllLinkedFields(draft: IDraft) {
    const { sku } = draft;
    const { product, barcode: primarySKU, defects, condition, price, upcs: allSKUS } = sku;
    if (primarySKU == null) throw new Error('no barcode-sku');
    const { rawValue: barcodeSKUvalue } = primarySKU;
    if (product == null) throw new Error('no product');
    const { productLine, allHashTags: hashTags, effectiveCategoryID: categoryId, effectiveSubCategoryID: subCategoryId, effectiveSubSubCategoryID: subSubCategoryId, effectiveShipWeightPercent: shipWeightPercent, apparelDetails, circa, color, descriptiveText, features, flags, dimensions, origin, notes, modelNo, materials, upcs: productBarcodes, classifier, folder: productFolder } = product;
    if (classifier == null) throw new Error('no classifier');
    const { taxon, name: classifierName } = classifier;
    if (taxon == null) throw new Error('no taxon');
    const { apparelType, bookType, backlineType, cuffType, collarType, chestFitType, gender, gameRating, movieRating, frontType, itemGroup, legType, mediaType, size, sleeveType, necklineType, topAdornment, waistType, videoType } = taxon;
    const { diameterInches, lengthInches, widthInches, heightInches, weightGrams, runtimeMin, volumeFlOz } = dimensions.toJSON() as IDimensions;
    const brand = productLine != null ? productLine.brand : product.brand;
    const { name: brandName, mercariBrand, folder: brandFolder } = brand ?? { name: 'no-brand' };
    const { name: mercariBrandName } = mercariBrand ?? {}
    const apparelShortDescr = [
        ofEnum(Genders)(gender),
        ofEnum(aliasesToMainColors)(color),
        ofEnum(SleeveTypes)(sleeveType),
        ofEnum(NecklineTypes)(necklineType),
        ofEnum(BacklineTypes)(backlineType),
        ofEnum(WaistTypes)(waistType),
        ofEnum(LegTypes)(legType),
        ofEnum(CollarTypes)(collarType),
        ofEnum(CuffTypes)(cuffType),
        ofEnum(TopAdornments)(topAdornment),
        descriptiveText,
        ofEnum(ApparelTypes)(apparelType)
    ].filter(x => x != null).join(' ');
}
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
    color: Optional<keyof typeof ColorsInfos>;
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
        return Array.from(new Set([...this.hashTags.values(), ...(this.brand?.allHashTags ?? []), ...(this.productLine?.allHashTags ?? []), ...(this.classifier?.allHashTags ?? [])]).values()).sort((a, b) => a.$maxCount > b.$maxCount ? -1 : a.$maxCount < b.$maxCount ? 1 : 0);
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
    @wrapInTransactionDecorator()
    update() {
        console.group('Product.update')
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
        if (this.taxon == null) this.taxon = { lock: false } as any;
        if (this.taxon != null && this.taxon.update != null) {
            this.taxon = this.taxon.update();
        }
        const merged = mergeProductTaxonomy(this.taxon, this.classifier?.taxon);
        if (merged) {
            this.taxon = merged as any;
        }
        this.hashTags = this.allHashTags as any;
        console.groupEnd();
        return this;
    }
}
