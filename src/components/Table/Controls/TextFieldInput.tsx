import { Column, Table, flexRender } from '@tanstack/react-table';
import React, { useEffect, useMemo } from 'react';
import { usePropertyInfo } from '../../../hooks/_usePropertyInfo';
import { useFormContext } from '../../Contexts/useFormContext';
import { identity } from '../../../common/functions/identity';

export function TextFieldInput<T>(
    props: { expected?: RealmTypes; table: Table<T>; column: Column<T, any>; initialValue?: string; noLabel?: boolean; type?: React.HTMLInputTypeAttribute } & Partial<
        React.InputHTMLAttributes<HTMLInputElement>
    >
) {
    const { table, column, initialValue, noLabel, type, name, ...remain } = props;
    const { fieldName, defaultValue, initializer, readonly, required, datatype, validators, inputType } = usePropertyInfo(table, column, props.expected ?? 'string');
    const { setValue, getValue, hasErrors, getError, formID, setInitialValue } = useFormContext();
    const onChange = useMemo(() => setValue(fieldName, datatype, identity, ...(validators ?? [])), [datatype, fieldName, setValue, validators]);
    const value = useMemo(() => getValue(fieldName), [fieldName, getValue]);
    const inputId = `${fieldName}-input`;
    const labelId = `${fieldName}-input-label`;

    useEffect(() => {
        setInitialValue(fieldName)(initialValue ?? defaultValue ?? (initializer ? initializer() : null));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className='flex flex-col w-full'>
            {!noLabel && (
                <label id={labelId} htmlFor={inputId}>
                    {flexRender(
                        column.columnDef.header,
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        table
                            .getFlatHeaders()
                            .find((x: any) => x.column.columnDef.accessorKey ?? x.column.columnDef.id === (column.columnDef as any).accessorKey ?? column.columnDef.id)!
                            .getContext()
                    )}
                </label>
            )}
            <input
                id={inputId}
                aria-labelledby={labelId}
                type={inputType ?? type ?? 'text'}
                name={fieldName}
                className='flex w-full h-full p-1 text-base font-normal font-raleway'
                value={value() ?? ''}
                onChange={onChange}
                required={required}
                readOnly={readonly}
                form={formID}
            />
        </div>
    );
}
