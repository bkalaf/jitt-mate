import { Column, ColumnDef, Table } from '@tanstack/react-table';
import { useColumnMeta } from '../../../hooks/useColumnMeta';
import { useTableMeta } from './useTableMeta';
import { subExpected } from './subExpected';
import { useLogger } from '../../Contexts/useLogger';
import { normalizeSchemaProperty } from '../../../dal/TMercariSubSubCategory';
import { is } from '../../../dal/is';

export function usePropertyInfo<T>(table: Table<T>, column: Column<T, any> | ColumnDef<T, any>, expectedType: RealmTypes) {
    const fieldName = 'columnDef' in column ? (column.columnDef as any).accessorKey ?? column.columnDef.id : column.id;
    const logger = useLogger();
    if (fieldName == null) {
        console.error('no fieldname', column);
        throw new Error('cannot find fieldName');
    }
    const meta = useTableMeta(table);
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

    const { datatype, defaultValue: defaultValue2, enumMap, labelProperty, readonly, required: req2, validators, objectType: ot, inputType } = useColumnMeta(column);

    const required = !(optional ?? false);
    const required2 = req2 ?? false;

    if (subExpected(datatype) !== type) {
        logger(`TYPE MISMATCH: ${fieldName} expected: ${subExpected(expectedType)} received: ${type} ${objectType} ${property}`, 'schema');
    }
    if (datatype !== expectedType) logger(`TYPE MISMATCH: fieldname: ${fieldName} expected: ${expectedType} datatype: ${datatype} ${type} ${objectType} ${property}`, 'schema');
    if (required !== required2) logger(`TYPE MISMATCH: fieldname: ${fieldName} meta-required: ${required2} ObjectSchema: ${required}`, 'schema');
    if (ot !== objectType) logger(`OBJECT TYPE MISMATCH: ${objectType} ${ot}`, 'schema');

    return {
        inputType,
        datatype,
        defaultValue: defaultValue2 != null ? (is.func(defaultValue2) ? defaultValue : defaultValue2) : defaultValue,
        fieldName,
        required: required ?? required2,
        initializer: is.func(defaultValue2) ? defaultValue2 : undefined,
        type,
        objectType,
        property,
        enumMap,
        labelProperty,
        readonly,
        ot,
        validators
    };
}
