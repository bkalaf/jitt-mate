import { useCallback } from 'react';
import { useCtor } from './useCtor';


export function useFindAll<T>(objectType: string) {
    const { defaultFilters, defaultSort } = useCtor(objectType);
    const toSort = useCallback((results: Realm.Results<T>): Realm.Results<T> => {
        return defaultSort == null ? results : results.sorted(defaultSort);
    }, [defaultSort]);
    const toFilter = useCallback((results: Realm.Results<T>): Realm.Results<T> => {
        if (defaultFilters == null) return results;
        const text = defaultFilters.map(x => x[0]).join(' && ');
        const args = defaultFilters.map(x => x[1]).reduce((pv, cv) => [...pv, ...cv], []);
        return defaultFilters == null ? results : results.filtered(text, ...args);
    }, [defaultFilters]);
    return useCallback((results: Realm.Results<T>): Realm.Results<T> => {
        return toSort(toFilter(results));
    }, [toFilter, toSort]);
}
