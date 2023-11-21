import { Column, Row, Table } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { usePropertyInfo } from '../../../hooks/_usePropertyInfo';
import { useFormContext } from '../../Contexts/useFormContext';
import { identity } from '../../../common/functions/identity';
import { ControlLabel } from './ControlLabel';

export function DropdownSelect<T>({ noLabel, table, column, initialValue, row }: { table: Table<T>; column: Column<T, any>; initialValue?: string; noLabel?: boolean; row: Row<T> }) {
    const { datatype, fieldName, initializer, defaultValue, readonly, required, validators, toEnumMap } = usePropertyInfo(table, column, 'enum');
    const { data, setValue, getValue, hasErrors, getError, formID, setInitialValue } = useFormContext();
    const onChange = useMemo(() => setValue(fieldName, datatype, identity, ...(validators ?? [])), [datatype, fieldName, setValue, validators]);
    const value = useMemo(() => getValue(fieldName), [fieldName, getValue]);
    const selectId = `${fieldName}-input`;
    const labelId = `${fieldName}-select-label`;
    const enumMap = useMemo(() => toEnumMap(data), [data, toEnumMap])
    useEffect(() => {
        setInitialValue(fieldName)(initialValue ?? defaultValue ?? (initializer ? initializer() : ''));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className='flex flex-col w-full'>
            <ControlLabel column={column} labelID={labelId} inputID={selectId} renderCondition={!noLabel} table={table} />
            <select
                id={selectId}
                name={fieldName}
                form={formID}
                className='flex w-full h-full p-1 text-base font-normal text-black border border-black font-raleway bg-zinc-400'
                value={value()}
                onChange={onChange}
                required={false}
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
