import { IBinaryFile, IHomeDetails, IProduct, IRealmEntity, ISku } from '../../dal/types';
import { IBatteryPowered, IHomeEnums } from '../../dal/types/enumTypes';

export class HomeDetails extends Realm.Object<IHomeDetails> implements IHomeDetails, IHomeEnums {
    batteries: OptionalEntity<IBatteryPowered>;
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
