/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteElement, FieldValues, Path, UseFormReturn, useFormContext } from 'react-hook-form-mui';
import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../../../routes/loaders/useLocalRealm';
import { useDependencies } from '../../../hooks/useDependencies';
import { MRT_ColumnDef, MRT_Row, MRT_RowData } from 'material-react-table';
import { getProperty } from '../../Contexts/getProperty';
import { is } from '../../../dal/is';
import { checkTransaction } from '../../../util/checkTransaction';
import { createFilterOptions } from '@mui/material';
import { toNotNullOID } from '../../../dal/toOID';

// creatingRow: MRT_Row<T> | null, setCreatingRow: MRT_TableInstance<T>['setCreatingRow']
export function updateDictionary<T extends MRT_RowData, TValue>(db: Realm, collection: RealmObjects, propertyName: string, formContext: UseFormReturn, creatingRow: MRT_Row<T> | null) {
    return function ({ _id, key, value }: { _id: OID; key: string; value: TValue | undefined }) {
        if (creatingRow) {
            if (typeof creatingRow === 'boolean') return Promise.reject(new Error('creating row is a boolean'));
            const dictionary = formContext.watch(propertyName);
            formContext.setValue(propertyName, { ...(dictionary ?? {}), [key]: value });
            // const { _valuesCache } = creatingRow;
            // const dictionary = (_valuesCache[propertyName] as Record<string, TValue> | undefined) ??  {};
            // setCreatingRow({ ...creatingRow, _valuesCache: { ..._valuesCache, [propertyName]: { ...dictionary, [key]: value }}});
            return Promise.resolve();
        }
        const obj = db.objectForPrimaryKey<T>(collection, toNotNullOID(_id) as T[keyof T]);
        if (obj == null) {
            return Promise.reject(new Error(`cannot find obj ${_id.toString()}`));
        }
        const dictionary = (obj[propertyName] as DBDictionary<TValue> | Record<string, TValue> | undefined) ?? {};
        if (is.dbDictionary(dictionary)) {
            checkTransaction(db)(() => (value == null ? dictionary.remove(key) : (dictionary[key] = value)));
            return Promise.resolve();
        }
        checkTransaction(db)(() => (value == null ? delete (dictionary ?? {})[key] : { ...(dictionary ?? {}), [key]: value }));
        return Promise.resolve();
    };
}
export function JITTLookupControl<T extends MRT_RowData, TLookup extends EntityBase>(
    {
        objectType,
        labelPropertyName,
        onChange
    }: { objectType: RealmObjects; labelPropertyName: Path<TLookup>; onChange?: (formContext: UseFormReturn<FieldValues>, db: Realm) => (ev: React.ChangeEvent, newValue: any) => void },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    return function MRT_LookupControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        console.log('lookupprops', props);
        const db = useLocalRealm();
        const { data, isLoading } = useQuery({
            queryKey: [objectType, 'dropdown'],
            queryFn: () => {
                return Promise.resolve(
                    Array.from(db.objects<TLookup>(objectType) ?? []).sort((a, b) => {
                        return a[labelPropertyName as keyof TLookup] < b[labelPropertyName as keyof TLookup]
                            ? -1
                            : a[labelPropertyName as keyof TLookup] > b[labelPropertyName as keyof TLookup]
                            ? 1
                            : 0;
                    })
                    // .map((x) => ({
                    //     entity: x,
                    //     label: x[itemValue] as string,
                    //     value: (x as any)._id.toHexString()
                    // })) ?? []
                );
            }
        });
        const { classes, disabled, onBlur, ...spread } = useDependencies(props, initialDisable, ...dependencies);
        const formContext = useFormContext();
        return (
            <AutocompleteElement
                loading={isLoading}
                options={data ?? []}
                name={spread.name}
                label={spread.label}
                control={spread.control}
                autocompleteProps={{
                    getOptionLabel: (option: T) => getProperty(labelPropertyName)(option) ?? '',
                    isOptionEqualToValue: (option: T, value: T) => {
                        return option._id.toHexString() === value._id.toHexString();
                    },
                    filterOptions: createFilterOptions({
                        ignoreCase: true,
                        ignoreAccents: true,
                        limit: 50,
                        trim: true,
                        matchFrom: 'any'
                    }),
                    onChange: (ev, newValue) => {
                        onBlur({ ...ev, target: { value: newValue } } as any);
                        if (onChange) {
                            onChange(formContext, db)(ev, newValue);
                        }
                    },
                    disabled,
                    classes
                }}
            />
        );
    };
}
