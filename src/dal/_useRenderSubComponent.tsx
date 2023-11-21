import { useGetRowCanExpand } from './useGetRowCanExpand';
import { useMemo } from 'react';
import { createSubComponent } from '../components/Table/creators/createSubComponent';

/** @deprecated */
export function useRenderSubComponent(collectionName: string) {
    const { subComponentTabPanels, ...result } = useGetRowCanExpand(collectionName);
    const SubComponent = useMemo(() => createSubComponent(subComponentTabPanels), [subComponentTabPanels]);

    return {
        ...result,
        SubComponent
    };
}
