import { IDependency } from './Controls/RHFM_Depends';

export function toDependency(key: string, value: string): IDependency {
    return ['enable', key, (x) => x === value];
}
