import { $db } from '../../dal/db';
import { ShippingVersionsKeys } from '../../dal/enums/shippingVersions';
import { ISellingPrice, IShippingService, ISku } from '../../dal/types';
import { ShippingService } from './ShippingService';

export class SellingPrice extends Realm.Object<ISellingPrice> implements ISellingPrice {
    static ctor(sku: ISku, maxWeightLbs: number, itemPrice: number, shippingPayor: 'buyer' | 'seller' = 'buyer', version: ShippingVersionsKeys = '09252023', floorPrice?: number) {
        const result = {
            itemPrice,
            floorPrice,
            shippingDetails: ShippingService.ctor(sku, maxWeightLbs, version),
            shippingPayor,
            taxChargedToBuyer: 0
        }
        return result;
    }
    static schema: Realm.ObjectSchema = {
        name: $db.sellingPrice(),
        embedded: true,
        properties: {
            itemPrice: $db.float.opt,
            floorPrice: $db.float.opt,
            shippingService: $db.shippingService.opt,
            shippingPayor: { type: 'string', optional: false, default: 'buyer' },
            taxChargedToBuyer: { type: 'float', optional: false, default: 0 }
        }
    };
    itemPrice = 20;
    floorPrice: Optional<number>;
    shippingService!: IShippingService;
    shippingPayor: 'buyer' | 'seller' = 'buyer';
    taxChargedToBuyer = 0;

    get sellingFee(): number {
        return parseFloat((this.itemPrice * 0.1).toFixed(2));
    }
    get processingFee(): number {
        const percent = 0.029 * this.totalPrice;
        const fixed = 0.5;
        return parseFloat((percent + fixed).toFixed(2));
    }
    get isUsingSmaringPricing(): boolean {
        return this.floorPrice != null;
    }
    get totalPrice(): number {
        return this.itemPrice + (this.shippingService?.shippingFee ?? 0);
    }
    get youMadePrice(): number {
        return this.itemPrice - this.processingFee - this.sellingFee;
    }
}


