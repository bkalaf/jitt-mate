export function listObjectTypeToInputType(lot: RealmPrimitives | RealmObjects | 'object'): React.HTMLInputTypeAttribute | undefined {
    switch (lot) {
        case 'string':
        case 'objectId':
        case 'uuid':
            return 'text';
        case 'int':
        case 'double':
        case 'float':
        case 'decimal128':
            return 'number';
        case 'bool':
            return 'checkbox';
        case 'date':
            return 'datetime-local';
        case 'data':
            return 'file';
        case 'object':
        default:
            return undefined;
    }
}
