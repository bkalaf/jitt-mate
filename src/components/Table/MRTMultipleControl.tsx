import { AutocompleteElement, useController, useFormContext } from 'react-hook-form-mui';
import { useLocalRealm } from '../../routes/loaders/useLocalRealm';
import { toOID } from '../../dal/toOID';
import { useQuery } from '@tanstack/react-query';

export function SingleSelectElement<T extends EntityBase>(name: string, objectType: string, header: string, labelProperty: string) {
    function SingleSelectInnerElement() {
        const db = useLocalRealm();
        const { data: options, isLoading } = useQuery({
            queryKey: [objectType],
            queryFn: () => {
                return Promise.resolve(
                    Array.from(db.objects<T>(objectType).sorted([labelProperty]))
                    // .map((obj) => ({
                    //     label: obj[labelProperty],
                    //     value: toNotNullOID(obj._id as any as OID).toHexString()
                    // }))
                );
            }
        });
        const context = useFormContext();
        const { field } = useController<T>({
            name: 'value' as any,
            control: context.control as any
        });
        return (
            <AutocompleteElement
                options={options ?? []}
                loading={isLoading}
                name={field.name}
                label={header}
                textFieldProps={{
                    inputRef: field.ref                    
                }}
                autocompleteProps={{
                    getOptionLabel: (option: T) => option[labelProperty as keyof T] as string,
                    isOptionEqualToValue: (option: T, value: T) => {
                        return toOID(option._id)?.toHexString() === toOID(value._id)?.toHexString();
                    },
                    value: field.value,
                    onChange: (ev, newValue) => {
                        console.error(`newValue`, newValue);
                        alert(JSON.stringify(newValue));
                        field.onChange(ev);
                    },
                    onBlur: field.onBlur
                }}
            />
        );
    }
    return SingleSelectInnerElement;
}
