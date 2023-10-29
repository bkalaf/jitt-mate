import { Column, Table } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { usePropertyInfo } from '../Cells/usePropertyInfo';
import { useFormContext } from '../../Contexts/useFormContext';
import { identity } from '../../../common/functions/identity';
import { ControlLabel } from '../Cells/TextFieldInput';

export function DropdownSelect<T>({ noLabel, table, column, initialValue }: { table: Table<T>; column: Column<T, any>; initialValue?: string; noLabel?: boolean }) {
    const { datatype, fieldName, initializer, defaultValue, readonly, required, validators, enumMap } = usePropertyInfo(table, column, 'enum');
    const { setValue, getValue, hasErrors, getError, formID, setInitialValue } = useFormContext();
    const onChange = useMemo(() => setValue(fieldName, datatype, identity, ...(validators ?? [])), [datatype, fieldName, setValue, validators]);
    const value = useMemo(() => getValue(fieldName), [fieldName, getValue]);
    const selectId = `${fieldName}-input`;
    const labelId = `${fieldName}-select-label`;

    useEffect(() => {
        setInitialValue(fieldName)(initialValue ?? defaultValue ?? (initializer ? initializer() : ''));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className='flex flex-col w-full'>
            <ControlLabel column={column} labelID={labelId} inputID={selectId} renderCondition={!noLabel} />
            <select
                id={selectId}
                name={fieldName}
                form={formID}
                className='flex w-full h-full p-1 text-base font-normal text-black border border-black font-raleway bg-zinc-400'
                value={value()}
                onChange={onChange}
                required={required}
                aria-labelledby={selectId}
                aria-readonly={readonly}>
                <option key='def' value='' label='Choose...' />
                {Object.entries(enumMap ?? {}).map(([k, v]) => (
                    <option key={k} value={k} label={v ?? ''} />
                ))}
            </select>
        </div>
    );
}
