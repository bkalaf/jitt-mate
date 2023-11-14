import { convertToLookup } from '../../dal/enums/convertToLookup';
import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';
import { outputFormatter } from './outputFormatter';

export function enumMap(enumMap: EnumMap<string, string>) {
    return wrappedSetMetadata('enumMap', enumMap);
}
export function lookupEnumMap($enumMap: EnumMap<string, string>, extraProperty?: string) {
    return outputFormatter((x?: string) => (convertToLookup($enumMap, extraProperty as any) as (s?: string) => string)(x));
}


