import { ItemConditions } from './enums/itemConditions';
import Realm, { BSON } from 'realm';
import { $db } from './db';
import {
    SizeKeys} from '../enums/importNecklineType';
import { IBarcode, ILocationSegment, IProduct, IProductImage, IScan, ISku } from './types';
import { ISizeEntry } from '../enums/sizes';
import { Scan } from './TScan';
import { Def } from './Def';
import { createColumnHelper } from '@tanstack/react-table';
import { runInTransaction } from './runInTransaction';

const helper = createColumnHelper<ISku>();
export class Sku extends Realm.Object<ISku> implements ISku {
    _barcode: Optional<string>;
    update<T>(this: T, realm: Realm): T {
        return runInTransaction<ISku>(this as ISku, realm, (o: ISku) => {
            // o.sku = o.sku.padStart(12, '0');
        }) as T;
    }
    productImages: DBBacklink<IProductImage> = [] as any;
    markForPrinting(realm: Realm): ISku {
        return runInTransaction(this, realm, (o) => (o.skuPrinted = false));
    }
    unmarkForPrinting(realm: Realm): ISku {
        return runInTransaction(this, realm, (o) => (o.skuPrinted = true));
    }
    appendScan(realm: Realm, fixture?: ILocationSegment | undefined, shelf?: ILocationSegment | undefined, bin?: ILocationSegment | undefined): ISku {
        const scan: IScan = Scan.ctor(fixture, shelf, bin);
        return runInTransaction(this, realm, (o) => o.scans.push(scan));
    }

    _id: BSON.ObjectId = new BSON.ObjectId();
    sku: Optional<IBarcode>
    product: OptObj<IProduct>;
    price = 0;
    condition: ConditionKeys = 3;
    defects: string[] = [];
    skuPrinted = false;
    scans: DBList<IScan> = [] as any;

    // $init(realm: Realm): ISku {
    //     checkTransaction(realm)(() => {
    //         this.sku = this.sku.padStart(12, '0');
    //     });
    //     return this;
    // }

    static schema: Realm.ObjectSchema = {
        name: $db.sku(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            sku: $db.barcode.opt,
            product: $db.product.opt,
            price: $db.float.zero,
            condition: $db.int.two,
            defects: $db.string.list,
            skuPrinted: $db.bool.false,
            scans: $db.scan.list,
            productImages: $db.backlink($db.productImage(), 'sku'),
            _barcode: $db.string.opt,
            shipWeightPercent: { type: $db.float() as any, optional: true }
        }
    };
    static labelProperty: keyof ISku = 'sku';
    static defaultSort: Realm.SortDescriptor[] = ['sku'];
    static columns: DefinedColumns = [
        Def.OID(helper),
        Def.ctor('sku').barcode().$$(helper),
        Def.ctor('product').asLookup().$$(helper),
        Def.ctor('price').dollar().$$(helper),
        Def.ctor('condition').asEnum(ItemConditions).$$(helper),
        Def.ctor('defects').list('string').$$(helper),
        Def.ctor('scans').list('scan').$$(helper),
        Def.ctor('productImages').backlink('productImage').$$(helper)
    ];
}

export const sizeName = (sizeMap: (value?: SizeKeys) => ISizeEntry) => (value?: SizeKeys) => value != null ? sizeMap(value).name : undefined;

const sizeSelector = (sizeMap: (value?: SizeKeys) => ISizeEntry) => (value?: SizeKeys) => value != null ? sizeMap(value).selector : undefined;
