import { $db } from '../../dal/db';
import { ShippingVersionsKeys, ShippingVersionsInfos } from '../../dal/enums/shippingVersions';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { IShippingService, ISku } from '../../dal/types';

export class ShippingService extends Realm.Object<IShippingService> implements IShippingService {
    @wrapInTransactionDecorator()
    update() {
        if (this.carrier == null) {
            const shippingInfo = ShippingVersionsInfos[this.versionDate].find((x) => x.max >= (this.maxWeightLbs ?? 0) && x.min <= (this.maxWeightLbs ?? 0));
            console.log(`shippingService found`, this, shippingInfo);
            const info = this.isMediaMail ? shippingInfo?.['media-mail'] : shippingInfo?.standard;
            if (info == null) throw new Error('carrier not found');
            const { carrier, id, price } = info;
            this.carrier = carrier;
            this.carrierId = id;
            this.shippingFee = price;
        }
        return this;
    }
    static ctor(sku: ISku, maxWeightLbs = 0, versionDate: ShippingVersionsKeys = '09252023') {
        const shippingInfo = ShippingVersionsInfos[versionDate].find((x) => x.max >= (maxWeightLbs ?? 0) && x.min <= (maxWeightLbs ?? 0));
        console.log(`shippingService found`, this, shippingInfo);

        const isMediaMail = sku?.product?.taxon?.family === 'media'      ;  
        const info = isMediaMail ? shippingInfo?.['media-mail'] : shippingInfo?.standard;
        if (info == null) throw new Error('carrier not found');
        const { carrier, id, price } = info;
        const result = {
            versionDate,
            maxWeightLbs,
            isMediaMail,
            carrier,
            carrierId: id,
            shippingFee: price
        };
        return result;
    }
    static schema: Realm.ObjectSchema = {
        name: $db.shippingService(),
        embedded: true,
        properties: {
            versionDate: $db.string.req,
            maxWeightLbs: $db.float.opt,
            carrier: $db.string.opt,
            carrierId: $db.int.opt,
            shippingFee: $db.float.opt,
            isMediaMail: { type: 'bool', optional: true, default: false }
        }
    };
    versionDate: ShippingVersionsKeys = '09252023';
    maxWeightLbs: Optional<number>;
    carrier: Optional<string>;
    carrierId: Optional<number>;
    shippingFee: Optional<number>;
    isMediaMail = false;
}
