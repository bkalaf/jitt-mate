import { distinct } from '../common/array/distinct';
import { partitionBy } from '../common/array/partitionBy';

export function $cn<T extends Props>(props: T, flags: Record<string, boolean>, ...classes: string[]): T {
    const { className, ...remain } = props;
    const cnArray = className != null ? [className, ...classes] : classes;
    const cns = distinct(
        cnArray
            .filter((x) => x != null && x.length > 0)
            .map((x) => x.split(' '))
            .reduce((pv, cv) => [...pv, ...cv], [])
    ).map((s) => [s, true] as [string, boolean]);
    const [left, right] = partitionBy<[string, boolean]>((x) => x[1])([...cns, ...Object.entries(flags)]);
    const result = new Set(left.map((x) => x[0]));
    right.map((x) => x[0]).forEach((x) => result.delete(x));
    return { ...remain, className: result.size === 0 ? undefined : Array.from(result.values()).join(' ') } as T;
}
