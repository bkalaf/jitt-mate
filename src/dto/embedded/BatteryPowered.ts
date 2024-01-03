import { $db } from '../../dal/db';
import { IBatteryPowered } from '../../dal/types/enumTypes';


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
    };
}
