import { useCallback } from 'react';
import { useCtor } from '../routes/loaders/useCtor';

export function useCreateDropdownOption<T>(objectType: string, getId: (x: T) => string) {
    const { labelProperty } = useCtor(objectType);
    return useCallback(
        (obj: RealmObj<T> | null, ix?: number) => {
            if (obj == null) return null;
            return {
                key: ix,
                label: obj[labelProperty as keyof T],
                value: getId(obj),
                obj
            };
        },
        [getId, labelProperty]
    );
}
