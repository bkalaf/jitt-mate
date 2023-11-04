import { createColumnHelper } from '@tanstack/react-table';
import { $db } from './db';
import { Countries } from './enums/countries';
import { Provinces } from './enums/provinces';
import { IAddress } from './types';
import { Def } from './Def';

const helper = createColumnHelper<IAddress>();
export class Address extends Realm.Object<Address> implements IAddress {
    line1: Optional<string>;
    line2: Optional<string>;
    city: Optional<string>;
    province: Optional<keyof Provinces>;
    postalCode: Optional<string>;
    country?: Optional<keyof Countries>;
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
    static defaultSort: Realm.SortDescriptor[] = ['country', 'province', 'city'];

    static columns: DefinedColumns = [
        Def.ctor('line1').max(100).$$(helper),
        Def.ctor('line2').max(100).$$(helper),
        Def.ctor('city').max(50).$$(helper),
        Def.ctor('province').asEnum(Provinces).$$(helper),
        Def.ctor('country').asEnum(Countries).$$(helper),
        Def.ctor('postalCode')
            .pattern(/^[0-9]{5}(-?[0-9]{4})?$|^[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVXY]-?[0-9][ABCEGHJKLMNPRSTVXY][0-9]$/)
            .$$(helper)
    ];
    static embeddedColumns: (x?: string) => DefinedColumns = (x?: string) => [
Def.ctor([x, 'line1'].filter(x => x != null).join('.')).displayName('Line 1').max(100).$$(helper),
        Def.ctor([x, 'line2'].filter(x => x != null).join('.')).displayName('Line 2').max(100).$$(helper),
        Def.ctor([x, 'city'].filter(x => x != null).join('.')).displayName('City').max(50).$$(helper),
        Def.ctor([x, 'province'].filter(x => x != null).join('.')).displayName('Province').asEnum(Provinces).$$(helper),
        Def.ctor([x, 'country'].filter(x => x != null).join('.')).displayName('Country').asEnum(Countries).$$(helper),
        Def.ctor([x, 'postalCode'].filter(x => x != null).join('.'))
            .displayName('Postal Code').pattern(/^[0-9]{5}(-?[0-9]{4})?$|^[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVXY]-?[0-9][ABCEGHJKLMNPRSTVXY][0-9]$/)
            .$$(helper)
    ]
}
