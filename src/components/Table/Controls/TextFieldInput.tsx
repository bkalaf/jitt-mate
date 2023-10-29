import { Column, ColumnDef, Header, Table, flexRender } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { usePropertyInfo } from '../Cells/usePropertyInfo';
import { useFormContext } from '../../Contexts/useFormContext';
import { render } from '../Cells/render';
import { identity } from '../../../common/functions/identity';

export function TextFieldInput<T>(props: { expected?: RealmTypes, table: Table<T>; column: Column<T, any>; initialValue?: string; noLabel?: boolean }) {
    const { table, column, initialValue, noLabel } = props;
    const { fieldName, defaultValue, initializer, readonly, required, datatype, validators, inputType } = usePropertyInfo(table, column, props.expected ?? 'string');
    const { setValue, getValue, hasErrors, getError, formID, setInitialValue } = useFormContext();
    const onChange = useMemo(() => setValue(fieldName, datatype, identity, ...(validators ?? [])), [datatype, fieldName, setValue, validators]);
    const value = useMemo(() => getValue(fieldName), [fieldName, getValue]);
    const inputId = `${fieldName}-input`;
    const labelId = `${fieldName}-input-label`;

    useEffect(() => {
        setInitialValue(fieldName)(initialValue ?? defaultValue ?? (initializer ? initializer() : ''));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className='flex flex-col w-full'>
            {!noLabel && (
                <label id={labelId} htmlFor={inputId}>
                    {render(column.columnDef.header, { column })}
                </label>
            )}
            <input
                id={inputId}
                aria-labelledby={labelId}
                type={inputType ?? 'text'}
                name={fieldName}
                className='flex w-full h-full p-1 text-base font-normal font-raleway'
                value={value()}
                onChange={onChange}
                required={required}
                readOnly={readonly}
                form={formID}
            />
        </div>
    );
}
