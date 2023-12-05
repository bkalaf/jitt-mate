import { DBListOrSetProperties } from './boolDefaultUpdater';


export function listDefaultUpdater<T extends AnyObject>(this: T, properties: DBListOrSetProperties<T>[]) {
    properties.forEach((prop) => {
        if (this[prop] == null) {
            this[prop] = [] as any;
        }
    });
}
