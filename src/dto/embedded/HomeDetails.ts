import { $db } from '../../dal/db';
import { IHomeDetails, IProduct, ISku } from '../../dal/types';
import { IBatteryPowered, IHomeEnums } from '../../dal/types/enumTypes';

export class BatteryPowered extends Realm.Object<IBatteryPowered> implements IBatteryPowered {
    qty = 0;
    batteryType = 'AA';
    static schema: Realm.ObjectSchema = {
        name: $db.batteryPowered(),
        embedded: true,
        properties: {
            qty: $db.int.zero,
            batteryType: $db.string.opt
        }
    }
}
export class HomeDetails extends Realm.Object<IHomeDetails> implements IHomeDetails, IHomeEnums {
    batteries: IBatteryPowered;
    testedOn: Optional<Date>;
    getProduct: OptionalEntity<IProduct>;
    getSku: OptionalEntity<ISku>;
    titleGenerator(sku: ISku, extraCharacters?: boolean | undefined, showMetric?: boolean | undefined, ignoreCap?: boolean | undefined): string {
        throw new Error('Method not implemented.');
    }
    narrativeGenerator(sku: ISku, extraCharacters?: boolean | undefined, showMetric?: boolean | undefined, ignoreCap?: boolean | undefined): string {
        throw new Error('Method not implemented.');
    }
    update(this: Entity<IHomeEnums>): Entity<IHomeEnums> {
        return this;
    }

}