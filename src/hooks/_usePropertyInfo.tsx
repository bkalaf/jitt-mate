import { Column, ColumnDef, Table } from '@tanstack/react-table';
import { useColumnMeta } from './_useColumnMeta';
import { useLogger } from '../components/Contexts/useLogger';
import { is } from '../dal/is';
import { normalizeSchemaProperty } from '../dal/normalizeSchemaProperty';
import { konst } from '../common/functions/konst';

/** @deprecated */
export function usePropertyInfo<T>(table: Table<T>, column: Column<T, any> | ColumnDef<T, any>, expectedType: RealmTypes) {
    const fieldName = 'columnDef' in column ? (column.columnDef as any).accessorKey ?? column.columnDef.id : column.id;
    const logger = useLogger();
    if (fieldName == null) {
        console.error('no fieldname', column);
        throw new Error('cannot find fieldName');
    }
    const lookup = fieldName.split('.').reverse()[0];
    logger(`LOOKUP: ${lookup}`, 'data');
    const {
        type,
        objectType,
        optional,
        default: defaultValue,
        property,
        indexed
    } = {
        ...{ type: undefined, objectType: undefined, optional: false, default: undefined, indexed: false, property: undefined },
        ...(lookup != null
            ? Object.getOwnPropertyNames(table.options.meta?.schema.properties).includes(lookup)
                ? normalizeSchemaProperty(table.options.meta?.schema.properties[lookup ?? ''] ?? '')
                : {}
            : {})
    };

    const {
        datatype,
        defaultValue: defaultValue2,
        enumMap,
        lookupProperty,
        labelProperty,
        readonly,
        required: req2,
        validators,
        objectType: ot,
        inputType,
        colorMap,
        valuesGetter
    } = useColumnMeta(column);

    // const required = !(optional ?? true);
    // const required2 = req2 ?? false;

    return {
        inputType,
        datatype,
        lookupProperty,
        defaultValue: defaultValue2 != null ? (is.func(defaultValue2) ? defaultValue : defaultValue2) : defaultValue,
        fieldName,
        required: req2 ?? false,
        initializer: is.func(defaultValue2) ? defaultValue2 : undefined,
        type,
        objectType,
        property,
        toEnumMap: enumMap ? konst(enumMap) : valuesGetter,
        labelProperty,
        colorMap,
        readonly,
        ot,
        validators
    };
}
