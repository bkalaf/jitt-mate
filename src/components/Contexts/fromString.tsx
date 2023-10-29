import { BSON } from 'realm';
import { toOID } from '../../dal/toOID';

export function fromString(datatype: RealmTypes) {
    return (value?: string) => {
        if (value == null) return undefined;
        switch (datatype) {
            case 'string':
            case 'enum':
                return value;
            case 'int':
                return parseInt(value, 10);
            case 'float':
            case 'decimal128':
            case 'double':
                return parseFloat(value);
            case 'date':
                return new Date(Date.parse(value));
            case 'data': {
                const reader = new TextEncoder();
                return reader.encode(value).buffer;
            }
            case 'bool':
                return value.toLowerCase() === 'true' ? true : value.toLowerCase() === 'false' ? false : value;
            case 'uuid':
                return new BSON.UUID(value);
            case 'objectId':
                return toOID(value);
            case 'list':
            case 'dictionary':
            case 'set':
            case 'object':
                console.error('datatype', datatype, value);
                throw new Error(`cannot handle: ${value} from string.`);
        }
    };
}
