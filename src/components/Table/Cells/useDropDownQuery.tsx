import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../../../routes/loaders/useLocalRealm';
import { useFindAll } from '../../../routes/loaders/useFindAll';
import { useCreateDropdownOption } from '../../../hoooks/useCreateDropdownOption';

export function useDropDownQuery<T>(objectType: string, getId: (x: T) => string): [boolean, DropDownOptionInfo<T>[] | undefined] {
    const db = useLocalRealm();
    const toOption = useCreateDropdownOption<T>(objectType, getId);
    const queryModify = useFindAll<RealmObj<T>>(objectType);
    const { data, isLoading } = useQuery({
        queryKey: [objectType, 'dropdown'],
        queryFn: () => {
            const objs = db.objects<T>(objectType ?? '');
            const result = queryModify(objs)
                .map(toOption)
                .filter((x) => x != null) as DropDownOptionInfo<T>[];
            return Promise.resolve(result);
        }
    });
    return [isLoading, data];
}
