import { distinctBy } from '../array/distinctBy';
import { createComparable, createEqualTo } from './areRealmObjectsEqual';
import { toSortingFunction } from './toSortingFunction';

export function createMonads<T, U>(extract: (x: T) => U, comp: (x: U, y: U) => CompareResult = (x: any, y: any) => (x < y ? -1 : x > y ? 1 : 0)) {
    return {
        compareTo: createComparable(extract, comp),
        equalTo: createEqualTo(extract, comp),
        sort: toSortingFunction<T>()([extract, comp]),
        distinct: distinctBy<T>(createEqualTo(extract, comp))
    };
}
