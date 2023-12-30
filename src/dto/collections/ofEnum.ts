import * as Config from './../../config.json';

export function ofEnum<T extends string>(enumMap: EnumMap<T>) {
    return function (value?: T | undefined) {
        return value == null ? undefined : enumMap[value];
    };
}

export function getEnum(type: string) {
    return (item?: string) => (item == null ? undefined : Object.fromEntries(Object.entries((Config.enums as any)[type] ?? {}).map(([k, v]) => [k, (v as any).text] as [string, string]))[item]);
}
