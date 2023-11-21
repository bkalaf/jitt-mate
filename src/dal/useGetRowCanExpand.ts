import { useCallback, useMemo } from 'react';
import { useFieldInfos } from './_useFieldInfos';

export function useGetRowCanExpand(objectType: string) {
    const { containsType, ofType } = useFieldInfos(objectType);
    const getRowCanExpand = useCallback(() => {
        return containsType('list', 'dictionary', 'set');
    }, [containsType]);
    const subComponentTabPanels = useMemo(() => ofType('list', 'dictionary', 'set'), [ofType]);
    console.log(`subCompontentTabPanels`, subComponentTabPanels);
    const visibility = useMemo(() => {
        return Object.fromEntries(subComponentTabPanels.map(([propertyName]) => [propertyName, false]));
    }, [subComponentTabPanels]);
    return {
        getRowCanExpand,
        subComponentTabPanels,
        visibility
    };
}
