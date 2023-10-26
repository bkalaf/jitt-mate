import { distinctBy } from './distinctBy';

export function distinct<T>(arr: T[]) {
    return distinctBy((x) => (y) => x === y)(arr);
}
