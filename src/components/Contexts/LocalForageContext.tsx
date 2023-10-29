import { createContext } from 'react';

export type SettingsValues = number | string | null | Record<string, number> | [string, unknown][] | string[] | boolean;

export type ILocalForageContext = {
    forager: LocalForage;
    getDefaultValue: (setting: keyof SettingsConfig) => SettingsValues;
    getValue: (key: 'page-size' | 'page-index' | 'max-page-index', coll?: string) => () => number;
    setValue: (key: 'page-size' | 'page-index' | 'max-page-index', coll?: string) => (value: number | Updater<number>) => void;
};

export const LocalForageContext = createContext<ILocalForageContext | undefined>(undefined);
LocalForageContext.displayName = 'LocalForageContext';

export type NumberSettingsKeys = 'page-size' | 'page-index' | 'max-page-index';
export type OptStringSettingsKeys = 'global-filter' | 'edittable-row';
export type NumberDictionarySettingsKeys = 'column-size';
export type StringListSettingsKeys = 'hidden-columns' | 'column-order' | 'rows-selected' | 'pinned-left' | 'pinned-right';
export type TupleSettingsKeys = 'filter' | 'sort';
export type SettingsStore = Record<TupleSettingsKeys, Record<string, Record<string, [string, unknown][]>>> &
    Record<NumberSettingsKeys, Record<string, number>> &
    Record<OptStringSettingsKeys, Record<string, string | null>> &
    Record<NumberDictionarySettingsKeys, Record<string, Record<string, number>>> &
    Record<StringListSettingsKeys, Record<string, string[]>>;
export type PartialSettingsStore = Partial<SettingsStore>;
export type SettingsConfig = { [P in TupleSettingsKeys]: [string, unknown][] } & { [P in NumberSettingsKeys]: number } & { [P in OptStringSettingsKeys]: string | null } & {
    [P in NumberDictionarySettingsKeys]: Record<string, number>;
} & { [P in StringListSettingsKeys]: string[] };

