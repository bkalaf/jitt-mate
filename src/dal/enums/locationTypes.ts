export const LocationTypesObj = {
    fixture: { text: 'fixture', color: 'bg-indigo-600 text-white' },
    shelf: { text: 'shelf', color: 'bg-rose-600 text-white'},
    bin: { text: 'bin', color: 'bg-yellow-600 text-black'}
}

export const LocationTypes = objectMap(getAssoc<{ text: string }, 'text'>('text', ''))(LocationTypesObj);
export const LocationTypesColors = objectMap(getAssoc<{ color: string }, 'color'>('color', ''))(LocationTypesObj);


export type LocationTypes = typeof LocationTypes;
export type LocationTypesKey = keyof LocationTypes;

export function getAssoc<T, K extends keyof T & string>(key: K, def: T[K] | undefined = undefined) {
    return function(obj: T): T[K] {
        return Object.getOwnPropertyNames(obj).includes(key) ? obj[key] : def as any;
    }
}
export function objectMap<T, U>(func: (x: T) => U) {
    return function (obj: Record<string, T>) {
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]))
    }
}
export function toEnumMap(obj: Record<string, { text: string, color: string }>) {
    return [objectMap(getAssoc<{ text: string }, 'text'>('text', ''))(obj), objectMap(getAssoc<{ color: string }, 'color'>('color', ''))(obj)];
}