/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ///<reference path="./../../global.d.ts" />
import Realm from 'realm';
import { IProductTaxonomy } from '../../dal/types';
import { $db } from '../../dal/db';
import { taxonomy } from '../../dal/enums/taxa';
import { darken, lighten, styled } from '@mui/material';
import { is } from '../../common/is';
import { MRT_Row, MRT_TableInstance } from 'material-react-table';
import { $families, $genuses, $kingdoms, $klasses, $orders, $phlyums } from '../../enums/kpcofgs';
import { checkTransaction } from '../../util/checkTransaction';
import { BacklineTypesInfos, BacklineTypesKeys } from '../../dal/enums/backlineTypes';
import { BookTypesInfos, BookTypesKeys } from '../../dal/enums/bookTypes';
import { NecklineTypesInfos, NecklineTypesKeys } from '../../dal/enums/necklineTypes';
import { MovieRatingsInfos, MovieRatingsKeys } from '../../dal/enums/movieRating';
import { CollarTypesInfos, CollarTypesKeys } from '../../dal/enums/collarTypes';
import { CuffTypesInfos, CuffTypesKeys } from '../../dal/enums/cuffTypes';
import { FrontTypesInfos, FrontTypesKeys } from '../../dal/enums/frontTypes';
import { ItemGroupsInfos, ItemGroupsKeys } from '../../dal/enums/itemGroups';
import { LegTypesInfos, LegTypesKeys } from '../../dal/enums/legTypes';
import { SleeveTypesInfos, SleeveTypesKeys } from '../../dal/enums/sleeveTypes';
import { WaistTypesInfos, WaistTypesKeys } from '../../dal/enums/waistTypes';
import { $$queryClient } from '../../components/$$queryClient';
import { GendersInfos, GendersKeys } from '../../dal/enums/genders';
import { GameRatingsKeys } from '../../dal/enums/gameRating';
import { ApparelTypesKeys } from '../../dal/enums/apparelType';
import { ChestFitTypesKeys } from '../../dal/enums/chestFitTypes';
import { TopAdornmentsKeys } from '../../dal/enums/topAdornments';
import { MediaFormatTypesKeys } from '../../dal/enums/mediaFormatTypes';
import { VideoTypesKeys } from '../../dal/enums/videoTypes';
import { SizeGroupsKeys } from '../../enums/sizes';

export class ProductTaxonomy extends Realm.Object<IProductTaxonomy> implements IProductTaxonomy {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        checkTransaction(realm)(() => {
            if (this.lock == null) this.lock = false;
        });
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
    // gameRating: Optional<GameRatingsKeys>;
    // movieRating: Optional<MovieRatingsKeys>;
    // apparelType: Optional<ApparelTypesKeys>;
    // backlineType: Optional<BacklineTypesKeys>;
    // chestFitType: Optional<ChestFitTypesKeys>;
    // collarType: Optional<CollarTypesKeys>;
    // cuffType: Optional<CuffTypesKeys>;
    // frontType: Optional<FrontTypesKeys>;
    // gender: Optional<GendersKeys>;
    // itemGroup: Optional<ItemGroupsKeys>;
    // legType: Optional<LegTypesKeys>;
    // necklineType: Optional<NecklineTypesKeys>;
    // size: Optional<string>;
    // sizeGroup: Optional<SizeGroupsKeys>;
    // sleeveType: Optional<SleeveTypesKeys>;
    // topAdornment: Optional<TopAdornmentsKeys>;
    // waistType: Optional<WaistTypesKeys>;
    // bookType: Optional<BookTypesKeys>;
    // mediaFormatType: Optional<MediaFormatTypesKeys>;
    // videoType: Optional<VideoTypesKeys>;

    // static lookupEnumMap(...values: (string | undefined)[]) {
    //     const [$kingdom, $phylum, $klass, $order, $family, $genus, $species] = [...values, ...[undefined, undefined, undefined, undefined, undefined, undefined]];
    //     const $taxonomy = taxonomy as any as Record<string, Record<string, Record<string, Record<string, Record<string, Record<string, string>>>>>>;
    //     return Object.fromEntries(
    //         Object.entries(
    //             $kingdom != null && $kingdom.length > 0
    //                 ? $phylum != null && $phylum.length > 0
    //                     ? $klass != null && $klass.length > 0
    //                         ? $order != null && $order.length > 0
    //                             ? $family != null && $family.length > 0
    //                                 ? $genus != null && $genus.length > 0
    //                                     ? $species != null && $species.length > 0
    //                                         ? {}
    //                                         : $taxonomy[$kingdom][$phylum][$klass][$order][$family][$genus]
    //                                     : $taxonomy[$kingdom][$phylum][$klass][$order][$family]
    //                                 : $taxonomy[$kingdom][$phylum][$klass][$order]
    //                             : $taxonomy[$kingdom][$phylum][$klass]
    //                         : $taxonomy[$kingdom][$phylum]
    //                     : $taxonomy[$kingdom]
    //                 : taxonomy
    //         ).map(([k, v]) => [k, v != null ? (typeof v === 'function' ? v() : v) : undefined] as [string, string])
    //     );
    // }
    kingdom: Optional<string>;
    phylum: Optional<string>;
    klass: Optional<string>;
    order: Optional<string>;
    family: Optional<string>;
    genus: Optional<string>;
    species: Optional<string>;
    name: Optional<string>;
    lock: Optional<boolean> = false;
    get fullname(): string {
        return [this.kingdom, this.phylum, this.klass, this.order, this.family, this.genus, this.species].filter((x) => x != null).join('.');
    }
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
            lock: { type: 'bool', optional: false, default: false },
            // apparelType: $db.string.opt,
            // backlineType: $db.string.opt,
            // collarType: $db.string.opt,
            // cuffType: $db.string.opt,
            // frontType: $db.string.opt,
            // gender: $db.string.opt,
            // itemGroup: $db.string.opt,
            // legType: $db.string.opt,
            // necklineType: $db.string.opt,
            // size: $db.string.opt,
            // sizeGroup: $db.string.opt,
            // sleeveType: $db.string.opt,
            // topAdornment: $db.string.opt,
            // waistType: $db.string.opt,
            // bookType: $db.string.opt,
            // mediaType: $db.string.opt,
            // videoType: $db.string.opt
        }
    };
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
export const phylums = Object.entries(taxonomy)
    .map(([k, v]) => {
        return Object.keys(v).map((x) => [k, x] as [string, string]);
    })
    .reduce((pv, cv) => [...pv, ...cv], []);
export const klasses = Object.entries(taxonomy)
    .map(([k, v]) => {
        return Object.entries(v)
            .map(([k2, v2]) => (is.string(v2) ? [] : Object.keys(v2).map((x) => [k2, x] as [string, string])))
            .reduce((pv, cv) => [...pv, ...cv], []);
    })
    .reduce((pv, cv) => [...pv, ...cv], []);

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
