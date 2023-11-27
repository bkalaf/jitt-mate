import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@mui/material';
import { AutocompleteElement } from 'react-hook-form-mui';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../../routes/loaders/useLocalRealm';
import { fromOID } from '../../dal/fromOID';

export function MRTLookupControl<T extends AnyObject>(objectType: string, name: string, label: string, itemValue: string, itemKey = '_ID') {
    return function MRT_LookupControl() {
        const db = useLocalRealm();
        const { data, isLoading } = useQuery({
            queryKey: [objectType, 'dropdown'],
            queryFn: () => {
                return Promise.resolve(
                    (
                        db.objects<T>(objectType).map((x) => ({
                            entity: x,
                            label: x[itemValue] as string,
                            value: itemKey === 'ID' ? fromOID(x['_id']) : x[itemKey] as string
                        })) ?? []
                    ).sort((a, b) => a.label.localeCompare(b.label))
                );
            }
        });
        return (
            <AutocompleteElement
                name={name}
                label={label}
                loading={isLoading}
                options={data ?? []}
                loadingIndicator={
                    <Icon color='warning'>
                        <FontAwesomeIcon spin icon={faSpinner} className='block object-scale-down' />
                    </Icon>
                }
            />
        );
    };
}
