import { useCallback } from 'react';
import { useCtor } from '../routes/loaders/useCtor';

export function useCreateDropdownOption<T extends EntityBase>(objectType: string) {
    const { labelProperty } = useCtor<T>(objectType);
    return useCallback(
        (obj: RealmObj<T> | null, ix?: number) => {
            if (obj == null) return null;
            return {
                key: ix,
                label: obj[labelProperty as keyof T],
                value: obj._id.toHexString(),
                obj
            };
        },
        [labelProperty]
    );
}
