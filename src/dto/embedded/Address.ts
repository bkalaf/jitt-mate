import { $db } from '../../dal/db';
import { Countries } from '../../dal/enums/countries';
import { Provinces } from '../../dal/enums/provinces';
import { IAddress } from '../../dal/types';

export class Address extends Realm.Object<Address> implements IAddress {
    line1: Optional<string>;
    line2: Optional<string>;
    city: Optional<string>;
    province: Optional<keyof Provinces>;
    postalCode: Optional<string>;
    country?: Optional<keyof Countries>;
    get output(): string {
        return [[this.line1, this.line2].filter(x => x != null).join('\n'), [this.cityState, this.country, this.postalCode].filter(x => x!= null).join(',')].join('\n');
    }
    get streetOnly(): Optional<string> {
        return this.line1 == null ? undefined : this.line1.split(' ').slice(1).join(' ');
    }
    get cityState(): Optional<string> {
        return this.city != null && this.province != null ? [this.city, this.province].join(', ') : undefined;
    }
    static schema: Realm.ObjectSchema = {
        name: $db.address(),
        embedded: true,
        properties: {
            line1: $db.string.opt,
            line2: $db.string.opt,
            city: $db.string.opt,
            province: $db.string.opt,
            country: $db.string.opt,
            postalCode: $db.string.opt
        }
    };
}
