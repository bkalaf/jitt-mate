import { distinctBy } from './distinctBy';

export function distinct<T>(arr: T[]): T[] {
    return distinctBy<T>((x) => (y) => x === y)(arr);
}
