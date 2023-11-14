// ///<reference path="./../../global.d.ts" />
import Realm from 'realm';
import { IProductTaxonomy } from '../../dal/types';
import { $db } from '../../dal/db';
import { realmCollectionDecorator } from './realmCollectionDecorator';
import { basicEnumDecorator } from './basicEnumDecorator';
import { taxonomy } from '../../dal/enums/taxa';
import { staticColumnsDecorator } from '../../decorators/class/defineColumnsDecorator';
import { Autocomplete, AutocompleteProps, AutocompleteRenderGroupParams, CircularProgress, TextField, createFilterOptions, darken, lighten, styled } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { is } from '../../dal/is';
import { MRT_ColumnDef, MRT_Row, MRT_TableInstance } from 'material-react-table';
import { toProperFromCamel } from '../../common/text/toProperCase';
import { charRange } from '../../common/array/charRange';
import { useQuery } from '@tanstack/react-query';
import { fromOID } from '../../dal/fromOID';
import { useCollectionRoute } from '../../hooks/useCollectionRoute';
import { $families, $genuses, $kingdoms, $klasses, $orders, $phlyums } from '../../enums/kpcofgs';

export const colors = {
    red: 'bg-red-500 text-white',
    orange: 'bg-orange-600 text-white',
    yellow: 'bg-yellow-600 text-black',
    lime: 'bg-lime-500 text-black',
    green: 'bg-emerald-600 text-white',
    blue: 'bg-sky-500 text-white',
    cyan: 'bg-cyan-500 text-black',
    purple: 'bg-indigo-500 text-white',
    pink: 'bg-pink-700 text-white',
    rose: 'bg-rose-400 text-black',
    white: 'bg-white text-black',
    slate: 'bg-slate-600 text-white',
    black: 'bg-black text-white'
};
export const Kingdoms = {
    apparel: {
        text: 'apparel',
        color: colors.red
    },
    media: {
        text: 'media',
        color: colors.green
    }
};
export type Kingdoms = typeof Kingdoms;
export type KingdomKeys = keyof Kingdoms;

const toPhyla = (parent: KingdomKeys) => (text: string, color: keyof typeof colors) => ({
    parent,
    text,
    color: colors[color]
});
const $apparel = toPhyla('apparel');
const $media = toPhyla('media');

export const Phylums = {
    mens: $apparel('mens', 'red'),
    womens: $apparel('womens', 'cyan'),
    boys: $apparel('boys', 'yellow'),
    girls: $apparel('girls', 'pink'),

    books: $media('books', 'red'),
    videos: $media('videos', 'green'),
    audios: $media('audios', 'pink'),
    games: $media('games', 'blue')
};

export type Phylums = typeof Phylums;
export type PhylumKeys = keyof Phylums;
const toKlass = (parent: KingdomKeys) => (text: string, color: keyof typeof colors) => ({
    parent,
    text,
    color: colors[color]
});

@realmCollectionDecorator('kingdom')
export class ProductTaxonomy extends Realm.Object<IProductTaxonomy> implements IProductTaxonomy {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        setTimeout(this.update, 500);
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
    @basicEnumDecorator({
        valuesGetter: (x: IProductTaxonomy) => {
            console.log(`valuesGetter`, x);
            return ProductTaxonomy.lookupEnumMap();
        }
    })
    kingdom: Optional<KingdomKeys>;
    @basicEnumDecorator({ valuesGetter: (x: { taxon: IProductTaxonomy }) => ProductTaxonomy.lookupEnumMap(x.taxon?.kingdom) })
    phylum: Optional<string>;
    @basicEnumDecorator({ valuesGetter: (x: { taxon: IProductTaxonomy }) => ProductTaxonomy.lookupEnumMap(x.taxon?.kingdom, x.taxon?.phylum) })
    klass: Optional<string>;
    @basicEnumDecorator({ valuesGetter: (x: { taxon: IProductTaxonomy }) => ProductTaxonomy.lookupEnumMap(x.taxon?.kingdom, x.taxon?.phylum, x.taxon?.klass) })
    order: Optional<string>;
    @basicEnumDecorator({ valuesGetter: (x: { taxon: IProductTaxonomy }) => ProductTaxonomy.lookupEnumMap(x.taxon?.kingdom, x.taxon?.phylum, x.taxon?.klass, x.taxon?.order) })
    family: Optional<string>;
    @basicEnumDecorator({ valuesGetter: (x: { taxon: IProductTaxonomy }) => ProductTaxonomy.lookupEnumMap(x.taxon?.kingdom, x.taxon?.phylum, x.taxon?.klass, x.taxon?.order, x.taxon?.family) })
    genus: Optional<string>;
    @basicEnumDecorator({ valuesGetter: (x: { taxon: IProductTaxonomy }) => ProductTaxonomy.lookupEnumMap(x.taxon?.kingdom, x.taxon?.phylum, x.taxon?.klass, x.taxon?.order, x.taxon?.genus) })
    species: Optional<string>;

    update() {
        this.kingdom = this.kingdom?.length === 0 ? undefined : this.kingdom;
        this.phylum = this.phylum?.length === 0 ? undefined : this.phylum;
        this.klass = this.klass?.length === 0 ? undefined : this.klass;
        this.order = this.order?.length === 0 ? undefined : this.order;
        this.family = this.family?.length === 0 ? undefined : this.family;
        this.genus = this.genus?.length === 0 ? undefined : this.genus;
        this.species = this.species?.length === 0 ? undefined : this.species;
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
            species: $db.string.opt
        }
    };

    @staticColumnsDecorator
    static columns(...prefixes: string[]): DefinedColumns {
        return [];
    }
}

export type IComboBoxProps<T extends AnyObject> = {
    creatable?: (x: string) => Promise<void>;
    // options: ComboBoxOption[];
    // groupBy?: (opt: ComboBoxOption) => string;
    // getOptionLabel?: (opt: ComboBoxOption) => string;
    // renderGroup?: (params: AutocompleteRenderGroupParams) => ReactNode;
    // getOptionDisabled?: (opt: ComboBoxOption) => boolean;
    // filterSelectedOptions?: boolean;
    // filterOptions?: AutocompleteProps<ComboBoxOption, false, true, true>['filterOptions'];
    // renderOption?: AutocompleteProps<ComboBoxOption, false, true, true>['renderOption'];
    row: MRT_Row<AnyObject>;
    label: string;
    name: keyof IProductTaxonomy;
    table: MRT_TableInstance<AnyObject>;
};

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.mode === 'light' ? lighten(theme.palette.primary.light, 0.85) : darken(theme.palette.primary.main, 0.8)
}));

const GroupItems = styled('ul')({
    padding: 0
});
export function renderGroup(props: AutocompleteRenderGroupParams) {
    const { key, group, children } = props;
    return (
        <li key={key}>
            <GroupHeader>{toProperFromCamel(group)}</GroupHeader>
            <GroupItems>{children}</GroupItems>
        </li>
    );
}

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

function getOptionLabel(option: ComboBoxOption) {
    return is.string(option) ? option : option.label;
}
function groupBy(option: ComboBoxOption) {
    return is.string(option) ? 'n/a' : option.parent ?? 'n/a';
}
function getOptionDisabledTaxonomy(table: MRT_TableInstance<IProductTaxonomy>, row: MRT_Row<IProductTaxonomy>) {
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
const filterOpt = createFilterOptions<ComboBoxOption>({
    ignoreCase: true,
    ignoreAccents: true,
    matchFrom: 'start',
    stringify: (option) => (is.string(option) ? option : option.label)
});

function filterOptions(name: keyof IProductTaxonomy) {
    return function (...params: Parameters<Exclude<AutocompleteProps<ComboBoxOption, false, true, true>['filterOptions'], undefined>>) {
        const [options, state] = params;
        const { inputValue } = state;
        const isExisting = options.some((option) => inputValue === (is.string(option) ? option : option.label));
        const filters = filterOpt(options, state);
        if (inputValue !== '' && !isExisting) {
            filters.push({
                value: inputValue,
                node: getNode(name),
                parent: 'n/a',
                label: `Add "${inputValue}"`
            });
        }
        return filters;
    };
}

function isOptionEqualTo(left: ComboBoxOption, right: ComboBoxOption) {
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
export function OuterTaxonomyComboBox<T extends { taxon: IProductTaxonomy }>(outerProps: Pick<IComboBoxProps<T>, 'label' | 'name' | 'creatable'>) {
    function TaxonomyComboBox(props: Pick<IComboBoxProps<T>, 'row' | 'table'>) {
        const { creatable, label, row, name } = { ...props, ...outerProps };
        const { creatingRow, editingRow } = props.table.getState();
        const isCreating = creatingRow?.id === props.row.id;
        const isEditting = editingRow?.id === props.row.id;
        const [inputValue, setInputValue] = useState<ComboBoxOption | undefined>(undefined);
        const getOptionDisabled = useMemo(() => getOptionDisabledTaxonomy(props.table as any, props.row as any), [props.row, props.table]);
        const collectionName = useCollectionRoute();
        const data = ddOptions(name);
        const onChange = useCallback(
            (...params: Parameters<Exclude<AutocompleteProps<ComboBoxOption, false, true, true>['onChange'], undefined>>) => {
                console.log('ONCHANGE', ...params);
                const [event, value, reason, details] = params;
                if (typeof value === 'string') {
                    setInputValue({ value, label: toProperFromCamel(value), node: getNode(name), parent: undefined });
                } else if (value && (value as any).inputValue) {
                    setInputValue({ value: (value as any).inputValue, label: toProperFromCamel((value as any).inputValue), node: getNode(name), parent: undefined });
                } else {
                    setInputValue(value);
                    props.row._valuesCache[name as keyof typeof props.row._valuesCache] = value?.value ?? undefined;
                    if (isEditting) props.table.setEditingRow(props.row);
                    if (isCreating) props.table.setCreatingRow(props.row);
                }
            },
            [isCreating, isEditting, name, props]
        );
        const $filterOptions = useMemo(() => filterOptions(name), [name]);
        const isLoading = false;
        return (
            <Autocomplete<ComboBoxOption, false, true, true>
                options={data ?? []}
                value={inputValue}
                getOptionDisabled={getOptionDisabled}
                filterOptions={$filterOptions}
                filterSelectedOptions
                freeSolo
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={isOptionEqualTo}
                groupBy={groupBy}
                handleHomeEndKeys
                renderGroup={renderGroup}
                onChange={onChange}
                selectOnFocus
                className='font-open-sans'
                clearOnBlur
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        InputProps={{
                            ...params.InputProps,
                            name,
                            endAdornment: (
                                <>
                                    {isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }}
                    />
                )}
            />
        );
    }
    return TaxonomyComboBox as any as MRT_ColumnDef<{ taxon: IProductTaxonomy }>['Edit'];
}
