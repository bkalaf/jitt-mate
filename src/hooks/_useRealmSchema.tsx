import { useMemo } from 'react';
import { useCtor } from '../routes/loaders/useCtor';

export function useRealmSchema(objectType: string) {
    const Ctor = useCtor(objectType);
    return useMemo(() => Ctor.schema, [Ctor.schema]);
}
