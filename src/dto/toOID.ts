import { BSON } from 'realm';
import { is } from './is';


export function toOID(oid?: string | BSON.ObjectId) {
    return oid == null ? undefined : is.objectId(oid) ? oid : new BSON.ObjectId(oid);
}
