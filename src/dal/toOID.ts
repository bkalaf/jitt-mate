import { BSON } from 'realm';
import { is } from './is';


export function toOID(oid?: string | BSON.ObjectId) {
    return oid == null ? undefined : is.objectId(oid) ? oid : new BSON.ObjectId(oid);
}
export function toNotNullOID(oid: string | BSON.ObjectId) {
    return is.objectId(oid) ? oid : new BSON.ObjectId(oid);
}
