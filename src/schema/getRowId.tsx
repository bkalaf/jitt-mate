import { fromOID } from '../dal/fromOID';
import { is } from '../dal/is';

export function getRowIdFromOID<T extends EntityBase>(originalRow: T) {
    // console.log(`getRowId`, originalRow);
    const str = originalRow._id;
    return fromOID(str)
}
export function getRowIdFromIndex<T>(originalRow: [number | string, T]) {
    return is.string(originalRow[0]) ? originalRow[0] : originalRow[0].toFixed(0)
}
