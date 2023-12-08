import { IMercariSubSubCategory } from '../../dal/types';

export type BoolProperties<T extends AnyObject> = { [P in keyof T]: T[P] extends boolean ? P : never }[keyof T];
export type DBListProperties<T extends AnyObject> = { [P in keyof T]: T[P] extends DBList<infer R> ? P : never }[keyof T];
export type DBDictionaryProperties<T extends AnyObject> = { [P in keyof T]: T[P] extends DBDictionary<infer R> ? P : T[P] extends Optional<DBDictionary<infer R>> ? P : never }[keyof T];
export type DBSetProperties<T extends AnyObject> = { [P in keyof T]: T[P] extends DBSet<infer R> ? P : never }[keyof T];
// export type B1 = BoolProperties<IClassifier>;

export type DBListOrSetProperties<T extends AnyObject> = DBListProperties<T> | DBSetProperties<T>;
export function boolDefaultUpdater<T extends AnyObject>(this: T, properties: BoolProperties<T>[]) {
    properties.forEach((prop) => {
        if (this[prop] == null) {
            this[prop] = false as T[BoolProperties<T>];
        }
    });
}

type DBLORS1 = DBListOrSetProperties<IMercariSubSubCategory>;


