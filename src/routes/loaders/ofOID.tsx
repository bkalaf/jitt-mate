import { BSON } from 'realm';

export function ofOID(oid?: string | BSON.ObjectId) {
    if (oid == null) return null;
    if (oid instanceof BSON.ObjectId) return oid.toHexString();
    return oid;
}
