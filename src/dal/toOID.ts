import { BSON } from 'realm';
import { is } from './is';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toOID(oid?: string | BSON.ObjectId | Record<string, any>): BSON.ObjectId | undefined {
    // console.info(`oid`, oid);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return oid == null ? undefined : is.objectId(oid) ? oid : is.string(oid) ? new BSON.ObjectId(oid) : is.object(oid) ? Object.keys(oid).includes('_id') ? toOID((oid as any)._id) : undefined : undefined;
}
export function toNotNullOID(oid: string | BSON.ObjectId) {
    return is.objectId(oid) ? oid : new BSON.ObjectId(oid);
}
