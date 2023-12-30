
export function ofEnum<T extends string>(enumMap: EnumMap<T>) {
    return function (value?: T | undefined) {
        return value == null ? undefined : enumMap[value];
    };
}
