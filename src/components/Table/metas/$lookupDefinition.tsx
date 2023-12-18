import { FieldValues, Path, UseFormReturn } from 'react-hook-form-mui';
import { LookupCell } from '../Cells/LookupCell';
import { JITTLookupControl } from '../Controls/JITTLookupControl';
import { toHeader } from '../toHeader';

export function lookupDefinition<T extends AnyObject, TLookup extends EntityBase>(
    name: Path<T>,
    {
        objectType,
        labelPropertyName,
        onChange,
        ...opts
    }: {
        header?: string;
        objectType: RealmObjects;
        labelPropertyName: Path<TLookup>;
        onChange?: (formContext: UseFormReturn<FieldValues>, db: Realm) => (ev: React.ChangeEvent, newValue: any) => void;
    },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    const header = toHeader(opts, name);
    return {
        accessorKey: name,
        header: header,
        Cell: LookupCell<T, TLookup>(labelPropertyName),
        enableColumnFilter: false,
        Edit: JITTLookupControl<T, TLookup>({ objectType, labelPropertyName, onChange }, initialDisable ?? false, ...dependencies)
    } as DefinedMRTColumn<T>;
}
