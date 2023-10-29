import { Column, ColumnDef, Table } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from '../../Contexts/useFormContext';
import { usePropertyInfo } from '../Cells/usePropertyInfo';
import { render } from '../Cells/render';
import { composeR } from '../../../common/functions/composeR';
import { useDropDownQuery } from '../Cells/useDropDownQuery';
import { Button } from '../../Buttons/Button';
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons';
import { useLoadInsertForm } from '../Cells/useLoadInsertForm';
import { ControlLabel } from '../Cells/TextFieldInput';

export function LookupDatalist<T>({ noLabel, table, column, initialValue, getId }: { table: Table<T>; column: Column<T, any>; initialValue?: string; noLabel?: boolean; getId: (x: T) => string }) {
    const { datatype, fieldName, initializer, defaultValue, readonly, required, validators, objectType, ot, labelProperty } = usePropertyInfo(table, column, 'object');
    const { setValue, getValue, hasErrors, getError, manualSetValue, formID, setInitialValue } = useFormContext();

    const extract = useCallback((x: T & AnyObject): string => x[labelProperty ?? ''], [labelProperty]);
    const value = useMemo(() => composeR(getValue(fieldName), extract) as () => string, [extract, fieldName, getValue]);
    const [hasBeenLoaded, options] = useDropDownQuery<T>(objectType ?? ot ?? '', getId);
    const selectId = `${fieldName}-input`;
    const labelId = `${fieldName}-select-label`;
    const listId = `${fieldName}-datalist`;
    const lookupMap = useMemo(() => Object.fromEntries((options ?? []).map(({ value, obj }) => [value, obj] as [string, RealmObj<T>])), [options]);
    const onChange = useMemo(() => setValue(fieldName, datatype, (x: string) => lookupMap[x], ...(validators ?? [])), [datatype, fieldName, lookupMap, setValue, validators]);
    const onInsert = useLoadInsertForm(objectType ?? '', table, getId, manualSetValue(fieldName, x => lookupMap[x]));
    useEffect(() => {
        setInitialValue(fieldName)(initialValue ?? defaultValue ?? (initializer ? initializer() : ''));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className='flex flex-col w-full'>
            <datalist id={listId}>
                {!hasBeenLoaded && <option key={-1} value='' label='DATA LOADING' />}
                {hasBeenLoaded && <option key={-1} value='' label='Choose...' />}
                {hasBeenLoaded && (options ?? []).map(({ label, value }, ix) => <option key={ix} value={value} label={label} />)}
            </datalist>
            <ControlLabel column={column} labelID={labelId} inputID={selectId} renderCondition={!noLabel} />
            <div className='flex flex-row'>
                <input
                    className='flex w-full h-full p-1 text-base font-normal text-white border border-black font-raleway bg-zinc-400'
                    form={formID}
                    id={selectId}
                    aria-labelledby={labelId}
                    list={listId}
                    value={value()}
                    onChange={onChange}
                    readOnly={readonly}
                    required={required}
                />
                <Button icon={faPlusCircle} onClick={onInsert} type='button' iconSize='sm' />
            </div>
        </div>
    );
}
