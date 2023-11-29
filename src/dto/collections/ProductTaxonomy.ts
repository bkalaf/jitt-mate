/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ///<reference path="./../../global.d.ts" />
import Realm from 'realm';
import { IProductTaxonomy } from '../../dal/types';
import { $db } from '../../dal/db';
import { realmCollectionDecorator } from '../../decorators/class/realmCollectionDecorator';
import { taxonomy } from '../../dal/enums/taxa';
import { staticColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';
import { darken, lighten, styled } from '@mui/material';
import { is } from '../../dal/is';
import { MRT_Row, MRT_TableInstance } from 'material-react-table';
import { charRange } from '../../common/array/charRange';
import { $families, $genuses, $kingdoms, $klasses, $orders, $phlyums } from '../../enums/kpcofgs';
import { checkTransaction } from '../../util/checkTransaction';
import { $$queryClient } from '../../components/App';

@realmCollectionDecorator('kingdom')
export class ProductTaxonomy extends Realm.Object<IProductTaxonomy> implements IProductTaxonomy {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        checkTransaction(realm)(() => {
            if (this.lock == null) this.lock = false;
        })
        setImmediate(() =>
            Promise.resolve(this.update()).then(() => {
                $$queryClient
                    .invalidateQueries({
                        queryKey: [ProductTaxonomy.schema.name]
                    })
                    .then(() => {
                        $$queryClient.refetchQueries({
                            queryKey: [ProductTaxonomy.schema.name]
                        });
                    });
            })
        );    
    }

    static lookupEnumMap(...values: (string | undefined)[]) {
        const [$kingdom, $phylum, $klass, $order, $family, $genus, $species] = [...values, ...[undefined, undefined, undefined, undefined, undefined, undefined]];
        const $taxonomy = taxonomy as any as Record<string, Record<string, Record<string, Record<string, Record<string, Record<string, string>>>>>>;
        return Object.fromEntries(
            Object.entries(
                $kingdom != null && $kingdom.length > 0
                    ? $phylum != null && $phylum.length > 0
                        ? $klass != null && $klass.length > 0
                            ? $order != null && $order.length > 0
                                ? $family != null && $family.length > 0
                                    ? $genus != null && $genus.length > 0
                                        ? $species != null && $species.length > 0
                                            ? {}
                                            : $taxonomy[$kingdom][$phylum][$klass][$order][$family][$genus]
                                        : $taxonomy[$kingdom][$phylum][$klass][$order][$family]
                                    : $taxonomy[$kingdom][$phylum][$klass][$order]
                                : $taxonomy[$kingdom][$phylum][$klass]
                            : $taxonomy[$kingdom][$phylum]
                        : $taxonomy[$kingdom]
                    : taxonomy
            ).map(([k, v]) => [k, v != null ? (typeof v === 'function' ? v() : v) : undefined] as [string, string])
        );
    }
    kingdom: Optional<string>;
    phylum: Optional<string>;
    klass: Optional<string>;
    order: Optional<string>;
    family: Optional<string>;
    genus: Optional<string>;
    species: Optional<string>;
    name: Optional<string>;
    lock: Optional<boolean> = false;
    update() {
        if (this.lock == null) this.lock = false;
        this.kingdom = this.kingdom?.length === 0 ? undefined : this.kingdom;
        this.phylum = this.phylum?.length === 0 ? undefined : this.phylum;
        this.klass = this.klass?.length === 0 ? undefined : this.klass;
        this.order = this.order?.length === 0 ? undefined : this.order;
        this.family = this.family?.length === 0 ? undefined : this.family;
        this.genus = this.genus?.length === 0 ? undefined : this.genus;
        this.species = this.species?.length === 0 ? undefined : this.species;
        this.name = [this.kingdom, this.phylum, this.klass, this.order, this.family, this.genus, this.species].filter((x) => x != null && x.length > 0).join('-');
        return this;
    }
    static schema: Realm.ObjectSchema = {
        name: $db.productTaxonomy(),
        embedded: true,
        properties: {
            kingdom: $db.string.opt,
            phylum: $db.string.opt,
            klass: $db.string.opt,
            order: $db.string.opt,
            family: $db.string.opt,
            genus: $db.string.opt,
            species: $db.string.opt,
            name: $db.string.opt,
            lock: { type: 'bool', optional: false, default: false }
        }
    };

    @staticColumnsDecorator
    static columns(...prefixes: string[]): DefinedColumns {
        return [];
    }
}

export type IComboBoxProps<T extends AnyObject> = {
    // creatable?: (x: string) => Promise<void>;
    // options: ComboBoxOption[];
    // groupBy?: (opt: ComboBoxOption) => string;
    // getOptionLabel?: (opt: ComboBoxOption) => string;
    // renderGroup?: (params: AutocompleteRenderGroupParams) => ReactNode;
    // getOptionDisabled?: (opt: ComboBoxOption) => boolean;
    // filterSelectedOptions?: boolean;
    // filterOptions?: AutocompleteProps<ComboBoxOption, false, true, true>['filterOptions'];
    // renderOption?: AutocompleteProps<ComboBoxOption, false, true, true>['renderOption'];
    row: MRT_Row<T>;
    label: string;
    table: MRT_TableInstance<T>;
};
export type ITaxonomyComboBoxProps<T extends AnyObject> = IComboBoxProps<T> & {
    name: keyof IProductTaxonomy;
};

export const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.mode === 'light' ? lighten(theme.palette.primary.light, 0.85) : darken(theme.palette.primary.main, 0.8)
}));

export const GroupItems = styled('ul')({
    padding: 0
});
function sorter(a: [string, string], b: [string, string]) {
    const pSort = -b[0].localeCompare(a[0]);
    return pSort === 0 ? -b[1].localeCompare(a[1]) : pSort;
}
export const kingdoms = Object.keys(taxonomy);
console.log(kingdoms);
export const phylums = Object.entries(taxonomy)
    .map(([k, v]) => {
        return Object.keys(v).map((x) => [k, x] as [string, string]);
    })
    .reduce((pv, cv) => [...pv, ...cv], []);
console.log(phylums.sort(sorter));
export const klasses = Object.entries(taxonomy)
    .map(([k, v]) => {
        return Object.entries(v)
            .map(([k2, v2]) => (is.string(v2) ? [] : Object.keys(v2).map((x) => [k2, x] as [string, string])))
            .reduce((pv, cv) => [...pv, ...cv], []);
    })
    .reduce((pv, cv) => [...pv, ...cv], []);
console.log(klasses.sort(sorter));
console.log(
    Array.from(new Set(klasses.map((x) => x[1])).values())
        .sort((a, b) => -b.localeCompare(a))
        .filter((x) => x.split('').some((y) => charRange('A', 'Z').includes(y)))
);

export const order = Object.entries(taxonomy)
    .map(([k, v]) => {
        return Object.entries(v).map(([k2, v2]) =>
            is.string(v2)
                ? []
                : Object.entries(v2)
                      .map(([k3, v3]) => (is.string(v3) ? [] : Object.keys((v3 as any) ?? {}).map((x) => [k3, x] as [string, string])))
                      .reduce((pv, cv) => [...pv, ...cv], [])
        );
    })
    .reduce((pv, cv) => [...pv, ...cv], [])
    .reduce((pv, cv) => [...pv, ...cv], []);
console.log(order.sort(sorter));
console.log(
    Array.from(new Set(order.map((x) => x[1])).values())
        .sort((a, b) => -b.localeCompare(a))
        .filter((x) => x.split('').some((y) => charRange('A', 'Z').includes(y)))
);
export const family = Object.entries(taxonomy)
    .map(([k, v]) => {
        return Object.entries(v).map(([k2, v2]) =>
            is.string(v2)
                ? []
                : Object.entries(v2)
                      .map(([k3, v3]) =>
                          is.string(v3) ? [] : Object.entries((v3 as AnyObject) ?? {}).map(([k4, v4]) => (is.string(v4) ? [] : Object.keys(v4).map((x) => [k4, x] as [string, string])))
                      )
                      .reduce((pv, cv) => [...pv, ...cv], [])
        );
    })
    .reduce((pv, cv) => [...pv, ...cv], [])
    .reduce((pv, cv) => [...pv, ...cv], [])
    .reduce((pv, cv) => [...pv, ...cv], []);
console.log(family.sort(sorter));
console.log(
    Array.from(new Set(family.map((x) => x[1])).values())
        .sort((a, b) => -b.localeCompare(a))
        .filter((x) => x.split('').some((y) => charRange('A', 'Z').includes(y)))
);

export const genus = Object.entries(taxonomy)
    .map(([k, v]) => {
        return Object.entries(v).map(([k2, v2]) =>
            is.string(v2)
                ? []
                : Object.entries(v2)
                      .map(([k3, v3]) =>
                          is.string(v3)
                              ? []
                              : Object.entries((v3 as AnyObject) ?? {}).map(([k4, v4]) =>
                                    is.string(v4) ? [] : Object.entries(v4).map(([k5, v5]) => (is.string(v5) ? [] : Object.keys((v5 as any) ?? {}).map((x) => [k5, x] as [string, string])))
                                )
                      )
                      .reduce((pv, cv) => [...pv, ...cv], [])
        );
    })
    .reduce((pv, cv) => [...pv, ...cv], [])
    .reduce((pv, cv) => [...pv, ...cv], [])
    .reduce((pv, cv) => [...pv, ...cv], [])
    .reduce((pv, cv) => [...pv, ...cv], []);
console.log(genus.sort(sorter));
console.log(
    Array.from(new Set(genus.map((x) => x[1])).values())
        .sort((a, b) => -b.localeCompare(a))
        .filter((x) => x.split('').some((y) => charRange('A', 'Z').includes(y)))
);

export function getOptionLabel(option: ComboBoxOption) {
    return is.string(option) ? option : option.label;
}
export function groupBy(option: ComboBoxOption) {
    return is.string(option) ? 'n/a' : option.parent ?? 'n/a';
}
export function getOptionDisabledTaxonomy(table: MRT_TableInstance<IProductTaxonomy>, row: MRT_Row<IProductTaxonomy>) {
    return function (option: ComboBoxOption) {
        if (is.string(option)) return false;
        const { editingRow, creatingRow } = table.getState();
        const compare = editingRow?.id === row.id ? editingRow : creatingRow;
        switch (option.node) {
            case 0:
                return false;
            case 1:
                return compare?._valuesCache.kingdom !== option.parent;
            case 2:
                return [compare?._valuesCache.kingdom, compare?._valuesCache.phylum].join('.').replaceAll('..', '.') !== option.parent;
            case 3:
                return [compare?._valuesCache.kingdom, compare?._valuesCache.phylum, compare?._valuesCache.klass].join('.').replaceAll('..', '.') !== option.parent;
            case 4:
                return [compare?._valuesCache.kingdom, compare?._valuesCache.phylum, compare?._valuesCache.klass, compare?._valuesCache.order].join('.').replaceAll('..', '.') !== option.parent;
            case 5:
                return (
                    [compare?._valuesCache.kingdom, compare?._valuesCache.phylum, compare?._valuesCache.klass, compare?._valuesCache.order, compare?._valuesCache.family]
                        .join('.')
                        .replaceAll('..', '.') !== option.parent
                );
            case 6:
                return compare?._valuesCache.genus !== option.parent;
            default:
                return true;
        }
    };
}
// const filterOpt = createFilterOptions<ComboBoxOption>({
//     ignoreCase: true,
//     ignoreAccents: true,
//     matchFrom: 'start',
//     stringify: (option) => (is.string(option) ? option : option.label)
// });

export function isOptionEqualTo(left: ComboBoxOption, right: ComboBoxOption) {
    return is.string(left) && is.string(right) ? left === right : is.string(left) || is.string(right) ? false : left.value === right.value && left.node === right.node;
}
export function getNode(name: keyof IProductTaxonomy) {
    switch (name) {
        case 'kingdom':
            return 0;
        case 'phylum':
            return 1;
        case 'klass':
            return 2;
        case 'order':
            return 3;
        case 'family':
            return 4;
        case 'genus':
            return 5;
        case 'species':
            return 6;
        default:
            return 0;
    }
}

export function ddOptions(name: keyof IProductTaxonomy) {
    switch (name) {
        case 'kingdom':
            return $kingdoms;
        case 'phylum':
            return $phlyums;
        case 'klass':
            return $klasses;
        case 'order':
            return $orders;
        case 'family':
            return $families;
        case 'genus':
            return $genuses;
        case 'species':
            return [];
        default:
            return [];
    }
}
