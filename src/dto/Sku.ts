import Realm, { BSON } from 'realm';
import * as Colors from './../enums/colors.json';
import { ISku, OptObj, IProduct, $db, IProductImage, IScan } from './db';
import { ApparelTypeKeys, GenderKeys } from '../enums/importNecklineType';
import { checkTransaction } from '../util/checkTransaction';

export class Sku extends Realm.Object<ISku> implements ISku {
    get lastLocation(): IScan | undefined {
        if (this.scans.length === 0) return undefined;
        return this.scans[0];
    }
    addScan(realm: Realm, scan: IScan): ISku {
        const func = () => {
            if (this.scans == null) {
                this.scans = [{ ...scan, timestamp: new Date(Date.now()) }] as any;
                console.log(`this.scans null`)
            } else {
                if (this.lastLocation == null) {
                    const num = this.scans.unshift({ ...scan, timestamp: new Date(Date.now()) })
                    console.log(`unshift ${num}`)
                } else {
                    const { fixture, shelf, bin } = this.lastLocation;
                    if (fixture?._id.toHexString() === scan.fixture?._id.toHexString() && shelf?._id.toHexString() === scan.shelf?._id.toHexString() && bin?._id.toHexString() === scan.bin?._id.toHexString()) {
                        console.log('DUPLICATE SCAN - SKIPPING...');
                    } else {
                        const num = this.scans.unshift({ ...scan, timestamp: new Date(Date.now()) });
                        console.log(`unshift: ${num}`)
                    }
                }
                
            }
        }
        checkTransaction(realm)(func);
        return this;
    }
    scans!: Realm.Types.List<IScan>;
    get productImages(): IProductImage[] {
        return Array.from(this.linkingObjects<IProductImage>($db.productImage(), 'sku'));
    }
    skuPrinted = false;
    defects: string[] = [];
    mercariBrandName(): string | undefined {
        return this.isNoBrand() ? undefined : this.product?.brand?.mercariBrand?.name;
    }
    shippingService(): 'media-mail' | 'standard' {
        return this.isMediaMail() ? 'media-mail' : 'standard';
    }
    carrier(): [price: number, carrier: string, carrierId: number] {
        const lookup = [
            { min: 0, max: 0.25, 'media-mail': { price: 4.3, carrier: 'USPS Media Mail', id: 1635 }, standard: { price: 4.3, carrier: 'USPS Ground Advantage', id: 1581 } },
            { min: 0.25, max: 0.5, 'media-mail': { price: 4.3, carrier: 'USPS Media Mail', id: 1635 }, standard: { price: 4.99, carrier: 'USPS Ground Advantage', id: 1582 } },
            { min: 0.5, max: 1, 'media-mail': { price: 4.3, carrier: 'USPS Media Mail', id: 1635 }, standard: { price: 7.4, carrier: 'USPS Ground Advantage', id: 1583 } },
            { min: 1, max: 2, 'media-mail': { price: 5, carrier: 'USPS Media Mail', id: 1636 }, standard: { price: 7.99, carrier: 'UPS SurePost', id: 1661 } },
            { min: 2, max: 3, 'media-mail': { price: 5.7, carrier: 'USPS Media Mail', id: 1637 }, standard: { price: 7.99, carrier: 'UPS SurePost', id: 1662 } },
            { min: 3, max: 4, 'media-mail': { price: 6.4, carrier: 'USPS Media Mail', id: 1638 }, standard: { price: 10.59, carrier: 'UPS SurePost', id: 1663 } },
            { min: 4, max: 5, 'media-mail': { price: 7.1, carrier: 'USPS Media Mail', id: 1639 }, standard: { price: 10.99, carrier: 'FedEx Ground Economy', id: 1580 } },
            { min: 5, max: 6, 'media-mail': { price: 8.65, carrier: 'USPS Media Mail', id: 1640 }, standard: { price: 13.5, carrier: 'UPS Ground', id: 1610 } },
            { min: 6, max: 7, 'media-mail': { price: 9.35, carrier: 'USPS Media Mail', id: 1641 }, standard: { price: 13.5, carrier: 'UPS Ground', id: 1611 } },
            { min: 7, max: 8, 'media-mail': { price: 10.05, carrier: 'USPS Media Mail', id: 1642 }, standard: { price: 14, carrier: 'UPS Ground', id: 1612 } },
            { min: 8, max: 9, 'media-mail': { price: 10.75, carrier: 'USPS Media Mail', id: 1643 }, standard: { price: 14, carrier: 'UPS Ground', id: 1613 } },
            { min: 9, max: 10, 'media-mail': { price: 11.45, carrier: 'USPS Media Mail', id: 1644 }, standard: { price: 17.25, carrier: 'UPS Ground', id: 1614 } },
            { min: 10, max: 11, 'media-mail': { price: 14.35, carrier: 'USPS Media Mail', id: 1645 }, standard: { price: 17.25, carrier: 'UPS Ground', id: 1615 } },
            { min: 11, max: 12, 'media-mail': { price: 15.05, carrier: 'USPS Media Mail', id: 1646 }, standard: { price: 17.25, carrier: 'UPS Ground', id: 1616 } },
            { min: 12, max: 13, 'media-mail': { price: 15.75, carrier: 'USPS Media Mail', id: 1647 }, standard: { price: 20, carrier: 'UPS Ground', id: 1617 } },
            { min: 13, max: 14, 'media-mail': { price: 16.45, carrier: 'USPS Media Mail', id: 1648 }, standard: { price: 20, carrier: 'UPS Ground', id: 1618 } },
            { min: 14, max: 15, 'media-mail': { price: 16.45, carrier: 'USPS Media Mail', id: 1649 }, standard: { price: 25, carrier: 'FedEx Home', id: 1565 } },
            { min: 15, max: 16, 'media-mail': { price: 17.15, carrier: 'USPS Media Mail', id: 1650 }, standard: { price: 28, carrier: 'FedEx Home', id: 1566 } },
            { min: 16, max: 17, 'media-mail': { price: 17.85, carrier: 'USPS Media Mail', id: 1651 }, standard: { price: 28, carrier: 'FedEx Home', id: 1567 } },
            { min: 17, max: 18, 'media-mail': { price: 18.55, carrier: 'USPS Media Mail', id: 1652 }, standard: { price: 28, carrier: 'FedEx Home', id: 1568 } },
            { min: 18, max: 19, 'media-mail': { price: 19.25, carrier: 'USPS Media Mail', id: 1653 }, standard: { price: 28, carrier: 'FedEx Home', id: 1569 } },
            { min: 19, max: 20, 'media-mail': { price: 19.95, carrier: 'USPS Media Mail', id: 1654 }, standard: { price: 30, carrier: 'UPS Ground', id: 1624 } },
            { min: 20, max: 30, standard: { price: 35, carrier: 'UPS Ground', id: 1625 } },
            { min: 30, max: 40, standard: { price: 60, carrier: 'UPS Ground', id: 1626 } },
            {
                min: 40, max: 50, standard: { price: 85, carrier: 'UPS Ground', id: 1627 }
            }
        ];
        const weightObj = this.weight();
        const weight = (weightObj.lb ?? 0) + ((weightObj.oz ?? 0) / 16);
        const result = lookup.filter(x => x.min <= weight).filter(x => x.max >= weight);
        console.log('carrier result');
        console.log(result);
        if (result.length === 0) throw new Error('no shipping');
        const service = result[0];
        const svc = service[this.shippingService()]!;
        return [svc?.price, svc?.carrier, svc.id];
    }
    isMediaMail(): boolean {
        if (this.product == null || this.product.classifier == null) return false;
        return this.product.classifier.mediaMail;
    }
    color(): string | undefined {
        if (this.product == null || this.product.color == null) return undefined;
        const baseColor = this.product.color;
        const mercariColor = Colors[baseColor];
        const lookup = {
            black: 'itemColorId-1',
            grey: 'itemColorId-2',
            white: 'itemColorId-3',
            beige: 'itemColorId-4',
            red: 'itemColorId-5',
            pink: 'itemColorId-6',
            purple: 'itemColorId-7',
            blue: 'itemColorId-8',
            green: 'itemColorId-9',
            yellow: 'itemColorId-10',
            orange: 'itemColorId-11',
            brown: 'itemColorId-12',
            gold: 'itemColorId-13',
            silver: 'itemColorId-14'
        };
        return lookup[mercariColor as keyof typeof lookup];
    }
    weight(): { lb?: number | undefined; oz?: number | undefined; } {
        if (this.product == null || this.product.weightG == null) {
            throw new Error('no weight');
        }
        const grams = this.product.weightG;
        const english = grams / 453.6;
        const shipWeight = english * 1.3;
        const pounds = Math.floor(shipWeight);
        const ounces = shipWeight - pounds;
        const ozs = Math.ceil(ounces * 16);
        const lb = ozs === 16 ? pounds + 1 : pounds;
        const oz = ozs === 16 ? 0 : ozs;
        return lb === 0 ? { oz } : { lb, oz };
    }
    dims(): { length?: number; width?: number; height?: number; } | undefined {
        if (this.product == null) {
            throw new Error('no product');
        }
        const { heightIn, widthIn, lengthIn } = this.product;
        if (heightIn == null && widthIn == null && lengthIn == null) return undefined;
        const result: Record<string, number> = {};
        if (lengthIn != null) result.length = lengthIn;
        if (widthIn != null) result.width = widthIn;
        if (heightIn != null) result.height = heightIn;
        return result;
    }
    apparelType(): ApparelTypeKeys | undefined {
        if (this.product == null || this.product.classifier == null) {
            throw new Error('no classifier');
        }
        return this.product.classifier.apparelType;
    }
    gender(): GenderKeys | undefined {
        if (this.product == null || this.product.classifier == null) {
            throw new Error('no classifier');
        }
        return this.product.classifier.gender;
    }
    isNoBrand(): boolean {
        return this.product?.brand == null || this.product.brand.mercariBrand == null;
    }
    brandName(): string {
        return this.product?.brand?.name ?? '-';
    }
    categoryId(): string {
        if (this.product == null || this.product.classifier == null) throw new Error('no classifier');
        return `#${this.product.classifier.getCategory().id}`;
    }
    subCategoryId(): string {
        if (this.product == null || this.product.classifier == null) throw new Error('no classifier');
        return `#${this.product.classifier.getSubCategory().id}`;
    }
    subSubCategoryId(): string {
        if (this.product == null || this.product.classifier == null) throw new Error('no classifier');
        return `#${this.product.classifier.getSubSubCategory().id}`;
    }
    _id: BSON.ObjectId = new BSON.ObjectId();
    sku = '';
    product: OptObj<IProduct>;
    price = 0;
    condition: 1 | 2 | 3 | 4 | 5 = 2;

    static schema: Realm.ObjectSchema = {
        name: $db.sku(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            sku: $db.string.req,
            product: $db.product.opt,
            price: $db.float.zero,
            condition: $db.int.two,
            defects: $db.string.list,
            skuPrinted: $db.bool.false,
            scans: $db.scan.list
        }
    };

}