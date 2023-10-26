import { BSON } from 'realm';

export function getRowId<T extends { _id: BSON.ObjectId }>(originalRow: T) {
    // console.log(`getRowId`, originalRow);
    const str = originalRow._id;
    return str == null ? '' : str instanceof BSON.ObjectId ? str.toHexString() : str;
}
