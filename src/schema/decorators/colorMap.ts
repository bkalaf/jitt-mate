import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';


export function colorMap(colorMap: Record<string, string>) {
    return wrappedSetMetadata('colorMap', colorMap);
}
