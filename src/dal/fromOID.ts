import { BSON } from 'realm';
import { is } from '../common/is';

export function fromOID(oid?: string | BSON.ObjectId): string {
    return oid == null ? '' : is.objectId(oid) ? oid.toHexString() : oid;
}
