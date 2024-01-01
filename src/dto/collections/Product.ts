import { ColorsInfos } from '../../dal/enums/colors';
import { IApparelDetails, IApparelProperties, IAttachment, IBarcode, IBrand, IClassifier, IDecorDetails, IDimensions, IHashTag, ILinkedItem, IMaterialComposition, IMediaProperties, IProduct, IProductLine, IProductTaxonomy } from '../../dal/types';
import { BSON } from 'realm';
import { $db } from '../../dal/db';
import { HashTag } from './HashTag';
import * as Realm from 'realm';
import { $initialCollection } from '../../components/Table/creators/$initialCollection';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { $$queryClient } from '../../components/$$queryClient';
import { IApparelEnums, IMediaEnums } from '../../dal/types/enumTypes';
import { distinctBy } from '../../common/array/distinctBy';
import { fromOID } from '../../dal/fromOID';

// export function getAllLinkedFields(draft: IDraft) {
//     const { sku } = draft;
//     const { product, barcode: primarySKU, defects, condition, price, upcs: allSKUS } = sku;
//     if (primarySKU == null) throw new Error('no barcode-sku');
//     const { rawValue: barcodeSKUvalue } = primarySKU;
//     if (product == null) throw new Error('no product');
//     const {
//         productLine,
//         effectiveHashTags: hashTags,
//         effectiveCategoryID: categoryId,
//         effectiveSubCategoryID: subCategoryId,
//         effectiveSubSubCategoryID: subSubCategoryId,
//         effectiveShipWeightPercent: shipWeightPercent,
//         apparelDetails,
//         circa,
//         color,
//         descriptiveText,
//         features,
//         flags,
//         dimensions,
//         origin,
//         notes,
//         modelNo,
//         materials,
//         upcs: productBarcodes,
//         classifier,
//         folder: productFolder
//     } = product;
//     if (classifier == null) throw new Error('no classifier');
//     const { taxon, name: classifierName } = classifier;
//     if (taxon == null) throw new Error('no taxon');
//     if (product.effectiveApparelDetails == null) throw new Error('no apparelDetails');
//     const {
//         apparelType,
//         backlineType,
//         cuffType,
//         collarType,
//         chestFitType,
//         gender,
//         frontType,
//         legType,
//         size,
//         sleeveType,
//         necklineType,
//         topAdornment,
//         waistType,
//     } = product.effectiveApparelDetails;
//     const { diameterInches, lengthInches, widthInches, heightInches, weightGrams, runtimeMin, volumeFlOz } = dimensions.toJSON() as IDimensions;
//     const brand = productLine != null ? productLine.brand : product.brand;
//     const { name: brandName, mercariBrand, folder: brandFolder } = brand ?? { name: 'no-brand' };
//     const { name: mercariBrandName } = mercariBrand ?? {};
//     const apparelShortDescr = [
//         ofEnum(GendersEnumMap)(gender),
//         ofEnum(AliasColorsMainColorMap)(color),
//         ofEnum(SleeveTypesEnumMap)(sleeveType),
//         ofEnum(NecklineTypesEnumMap)(necklineType),
//         ofEnum(BacklineTypesEnumMap)(backlineType),
//         ofEnum(WaistTypesEnumMap)(waistType),
//         ofEnum(LegTypesEnumMap)(legType),
//         ofEnum(CollarTypesEnumMap)(collarType),
//         ofEnum(CuffTypesEnumMap)(cuffType),
//         ofEnum(TopAdornmentsEnumMap)(topAdornment),
//         descriptiveText,
//         ofEnum(ApparelTypesInfos)(apparelType)
//     ]
//         .filter((x) => x != null)
//         .join(' ');
// }

export class Product extends Realm.Object<IProduct> implements IProduct {
    attachments!: DBDictionary<IAttachment>;
    compatibleWith!: DBList<string>;
    links!: DBDictionary<ILinkedItem>;
    get effectiveCategoryName(): Optional<string> {
        return this.classifier?.mercariSubSubCategory?.parent?.parent?.name;
    }
    get effectiveSubCategoryName(): Optional<string>{
        return this.classifier?.mercariSubSubCategory?.parent?.name;
    }
    get effectiveSubSubCategoryName(): Optional<string>{
        return this.classifier?.mercariSubSubCategory?.name;
    }
    get effectiveMediaDetails(): Optional<Partial<IMediaEnums & IMediaProperties>> {
        return undefined;
    }
    materials!: DBDictionary<IMaterialComposition>;
    styleNo: Optional<string>;
    get barcode() {
        return (this.upcs?.length ?? 0) > 0 ? this.upcs[0] : undefined;
    }
    get effectiveDiscriminator() {
        const result = this.checkTaxa('apparel') ? 'apparel' : this.checkTaxa('media') ? 'media' : this.checkTaxa('bags') ? 'bags' : this.checkTaxa('jewelry') ? 'jewelry' : this.checkTaxa('decor') ? 'decor' : undefined;
        return result ?? 'unknown';
    }
    get isDecorative() {
        return this.flags.has('decorative');
    }
    @wrapInTransactionDecorator()
    update() {
        console.group('Product.update');
        if (this._id == null) this._id = new BSON.ObjectId();
        if (this.apparelDetails == null) {
            $initialCollection['apparelDetails']().then((ad) => (this.apparelDetails = ad as any));
        }
        if (this.decorDetails == null) {
            this.decorDetails = {} as any;
        }
        if (this.attachments == null) this.attachments = {} as any;
        if (this.compatibleWith == null) this.compatibleWith = [] as any;
        if (this.links == null) this.links = {} as any;
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
        // const merged = mergeProductTaxonomy(this.taxon, this.classifier?.taxon);
        // if (merged) {
        //     this.taxon = merged as any;
        // }
        this.hashTags = this.effectiveHashTags as any;
        console.groupEnd();
        return this;
    }
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
    checkTaxa(...items: string[]) {
        return [this.effectiveKingdom, this.effectivePhylum, this.effectiveKlass, this.effectiveOrder, this.effectiveFamily, this.effectiveGenus, this.effectiveSpecies].some((x) =>
            items.includes(x ?? '')
        );
    }
    get effectiveApparelDetails(): Optional<IApparelEnums> {
        const result: IApparelEnums = {
            apparelType: [this.effectiveKingdom, this.effectivePhylum, this.effectiveKlass, this.effectiveOrder, this.effectiveFamily, this.effectiveGenus, this.effectiveSpecies]
                .filter((x) => x != null)
                .reverse()[0] as any,
            backlineType: undefined,
            collarType: undefined,
            cuffType: undefined,
            chestFitType: undefined,
            frontType: undefined,
            gender: undefined,
            legType: undefined,
            necklineType: undefined,
            size: this.apparelDetails.size,
            sizeGroup:
                this.checkTaxa('womens') && this.checkTaxa('pull-over', 'jacket', 'button-front')
                    ? 'women-letter'
                    : this.checkTaxa('womens') && this.checkTaxa('dresses', 'bottoms')
                    ? 'women-dresses'
                    : this.checkTaxa('womens') && this.checkTaxa('footwear')
                    ? 'women-footwear'
                    : this.checkTaxa('mens') && this.checkTaxa('footwear')
                    ? 'men-footwear'
                    : this.checkTaxa('mens') && this.checkTaxa('blazer', 'sports-coat', 'suits')
                    ? 'men-suits'
                    : undefined,
            sleeveType: this.apparelDetails?.sleeveType,
            topAdornment: undefined,
            waistType: this.apparelDetails?.waistType
        };
        return result;
    }

    get summaryName(): string {
        switch (this.effectiveDiscriminator) {
            case 'apparel':
                return this.apparelDetails.getSku ? this.apparelDetails.titleGenerator(this.apparelDetails.getSku) : 'unknown'
            case 'decor': 
                return this.decorDetails?.getSku ? this.decorDetails?.titleGenerator(this.decorDetails?.getSku) : 'unknown';
            case 'media':
            case 'bags':
            case 'jewelry':
            case 'unknown':
                return 'unknown';
        }
    }
    get effectiveHashTags(): Entity<IHashTag>[] {
        return distinctBy<Entity<IHashTag>>((x) => (y) => fromOID(x._id) === fromOID(y._id))([...(this.classifier?.effectiveHashTags ?? []), ...(this.productLine?.effectiveHashTags ?? []), ...(this.brand?.effectiveHashTags ?? []), ...this.hashTags.values()]).sort((a, b) => a.$maxCount < b.$maxCount ? -1 : a.$maxCount > b.$maxCount ? 1 : 0);
    }
    get isNoBrand(): boolean {
        return this.effectiveBrand == null;
    }
    get effectiveShipWeightPercent(): Optional<number> {
        return this.shipWeightPercent ?? this.classifier?.effectiveShipWeightPercent;
    }
    get effectiveBrand(): OptionalEntity<IBrand> {
        return this.productLine ? this.productLine?.brand : this.brand;
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
    get effectiveKingdom(): Optional<string> {
        return this.taxon?.kingdom ?? this.classifier?.taxon?.kingdom;
    }
    get effectivePhylum(): Optional<string> {
        return this.taxon?.phylum ?? this.classifier?.taxon?.phylum;
    }
    get effectiveKlass(): Optional<string> {
        return this.taxon?.klass ?? this.classifier?.taxon?.klass;
    }
    get effectiveOrder(): Optional<string> {
        return this.taxon?.order ?? this.classifier?.taxon?.order;
    }
    get effectiveFamily(): Optional<string> {
        return this.taxon?.family ?? this.classifier?.taxon?.family;
    }
    get effectiveGenus(): Optional<string> {
        return this.taxon?.genus ?? this.classifier?.taxon?.genus;
    }
    get effectiveSpecies(): Optional<string> {
        return this.taxon?.species ?? this.classifier?.taxon?.species;
    }
    _id!: BSON.ObjectId;
    apparelDetails!: IApparelDetails & IApparelProperties & IApparelEnums;
    brand: OptionalEntity<IBrand>;
    circa: Optional<string>;
    classifier: OptionalEntity<IClassifier>;
    color: Optional<keyof typeof ColorsInfos>;
    decorDetails: OptionalEntity<IDecorDetails>;
    descriptiveText: Optional<string>;
    dimensions: IDimensions & DBDictionary<number> = {} as any;
    features: DBList<string> = [] as any;
    flags: DBSet<string> = [] as any;
    folder!: BSON.UUID;
    hashTags: DBSet<Entity<IHashTag>> = [] as any;
    // materials: DBDictionary<IMaterialComposition> = {} as any;
    modelNo: Optional<string>;
    notes: Optional<string>;
    origin: Optional<string>;
    productLine: OptionalEntity<IProductLine>;
    shipWeightPercent: Optional<number>;
    taxon: OptionalEntity<IProductTaxonomy>;
    upcs: DBList<Entity<IBarcode>> = [] as any;
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
            decorDetails: $db.decorDetails.opt,
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
}
