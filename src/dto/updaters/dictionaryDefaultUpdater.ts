import { DBDictionaryProperties } from './boolDefaultUpdater';


export function dictionaryDefaultUpdater<T extends AnyObject>(this: T, properties: DBDictionaryProperties<T>[]) {
    properties.forEach((prop) => {
        if (this[prop] == null) {
            this[prop] = {} as any;
        }
    });
}
