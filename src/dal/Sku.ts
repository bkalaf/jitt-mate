import Realm, { BSON } from 'realm';
import { $db } from './db';
import { IBarcode, IBrand, IHashTag, ILocationSegment, IProduct, IProductImage, IProductTaxonomy, IScan, ISku } from './types';
import { colorToName } from './enums/colors';
import { wrapInTransactionDecorator } from './transaction';
import { Scan } from '../dto/embedded/Scan';
import { ItemConditions } from './enums/itemConditions';

export class Sku extends Realm.Object<ISku> implements ISku {
    get effective(): {
        brand: OptionalEntity<IBrand>;
        mercariBrandName: Optional<string>;
        isNoBrand: boolean;
        brandName: Optional<string>;
        brandFolder: Optional<string>;
        productFolder: Optional<string>;
        skuFolder: Optional<string>;
        taxon: OptionalEntity<IProductTaxonomy>;
        shipWeightPercent: Optional<number>;
        hashTags: string[];
        categoryID: Optional<string>;
        subCategoryID: Optional<string>;
        subSubCategoryID: Optional<string>;
        conditionID: Optional<string>;
        colorID: Optional<string>;
        // productImages: string[];
        productUPCS: string[];
        sku: OptionalEntity<IBarcode>;
        weightGrams: number;
        // shipWeightGrams: number;
        // shipWeightPounds: [number, number];
    } {
        return {
            brand: this.product?.effectiveBrand,
            mercariBrandName: this.product?.effectiveMercariBrandName,
            brandName: this.product?.effectiveBrandName,
            brandFolder: this.product?.effectiveBrandFolder,
            productFolder: this.product?.folder?.toHexString(true),
            skuFolder: this.barcode?.scanValue,
            taxon: this.product?.effectiveTaxon,
            shipWeightPercent: this.shipWeightPercent ?? this.product?.shipWeightPercent,
            hashTags: this.allHashTags
                .sort((a, b) => {
                    return a['$maxCount'] < b['$maxCount'] ? 1 : a['$maxCount'] > b['$maxCount'] ? -1 : 0;
                })
                .slice(0, this.allHashTags.length < 5 ? this.allHashTags.length : 5)
                .map((x) => x.name),
            categoryID: this.product?.effectiveCategoryID,
            subCategoryID: this.product?.effectiveSubCategoryID,
            subSubCategoryID: this.product?.effectiveSubSubCategoryID,
            conditionID: ItemConditions[this.condition]?.selector,
            colorID: this.product?.color ? colorToName[this.product.color] : undefined,
            productUPCS: this.product?.upcs.map((x) => x.scanValue) ?? [],
            sku: this.barcode,
            weightGrams: this.product?.dimensions['weightGrams'] ? this.product?.dimensions['weightGrams'] : 0,
            isNoBrand: this.product?.isNoBrand ?? true
            // productImages: this.productImages.map((x) => x.effectivePath) ?? []
        };
    }
    _barcode: Optional<string>;
    product: OptionalEntity<IProduct>;
    price!: number;
    condition!: 'new' | 'likeNew' | 'good' | 'fair' | 'poor' | 'parts';
    defects!: DBList<string>;
    skuPrinted!: boolean;
    scans!: DBList<IScan>;
    shipWeightPercent: Optional<number>;
    productImages!: DBBacklink<IProductImage>;

    @wrapInTransactionDecorator()
    appendScan(fixture?: ILocationSegment | undefined, shelf?: ILocationSegment | undefined, bin?: ILocationSegment | undefined): Entity<ISku> {
        const next = Scan.ctor(fixture, shelf, bin);
        if (this.scans != null) {
            this.scans.push(next);
        }
        return this;
    }
    _id: BSON.ObjectId = new BSON.ObjectId();
    get summaryName(): string {
        return this.product?.summaryName ?? '';
    }
    @wrapInTransactionDecorator()
    update() {
        if (this.hashTags == null) this.hashTags = [] as any;
        if (this.defects == null) this.defects = [] as any;
        if (this.condition == null) this.condition = 'good';
        if (this.scans == null) this.scans = [] as any;
        if (this.price == null) this.price = 0;
        if (this.upcs == null) this.upcs = [] as any;
        if (this.skuPrinted == null) this.skuPrinted = false;
        return this;
    }
    hashTags!: DBSet<Entity<IHashTag>>;
    get allHashTags(): Entity<IHashTag>[] {
        return [];
    }
    upcs!: DBList<Entity<IBarcode>>;
    get barcode(): OptionalEntity<IBarcode> {
        return this.upcs.length > 0 ? this.upcs[0] : undefined;
    }

    static schema: Realm.ObjectSchema = {
        name: $db.sku(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            upcs: $db.barcode.list,
            product: $db.product.opt,
            price: $db.float.zero,
            condition: { type: 'string', optional: true, default: 'good' },
            defects: $db.string.list,
            skuPrinted: $db.bool.false,
            scans: $db.scan.list,
            shipWeightPercent: { type: $db.float() as any, optional: true },
            productImages: { type: 'linkingObjects', objectType: 'productImage', property: 'sku' }
        }
    };
}
