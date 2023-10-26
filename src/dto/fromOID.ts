import { BSON } from 'realm';
import { is } from './is';


export function fromOID(oid?: string | BSON.ObjectId) {
    return oid == null ? '' : is.objectId(oid) ? oid.toHexString() : oid;
}
