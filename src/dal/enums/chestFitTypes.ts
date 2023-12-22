import { Path } from 'react-hook-form-mui';
import { mapObject } from './mapObject';
import { getProperty } from '../../components/Contexts/getProperty';

export const ChestFitLookup = {
    R: {
        abbrev: 'R',
        text: 'regular'
    },
    L: {
        abbrev: 'L',
        text: 'long'
    },
    S: {
        abbrev: 'S',
        text: 'short'
    }
}
export function createFromLookup<T extends AnyObject, TValue, TKey extends string>(obj: Record<TKey, T>, ...keys: Path<T>[]) {
    return keys.map(k => mapObject(obj)((o: T) => getProperty(k)(o) as TValue)) as Record<TKey, TValue>[]
}

export type ChestFitTypesKey = keyof typeof ChestFitLookup;
export const [ChestFitAbbrevs, ChestFitTypes] = createFromLookup<{ abbrev: string, text: string },string, ChestFitTypesKey>(ChestFitLookup, 'abbrev', 'text');