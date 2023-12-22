import { createContext } from 'react';
import { useProvidedContext } from '../../hooks/useProvidedContext';

export type INestedEntityContext = string[];

export const NestedEntityContext = createContext<string[]>([]);
NestedEntityContext.displayName = 'NestedEntityContext';

export function useNestedEntityContext() {
    return useProvidedContext(NestedEntityContext);
}

export function useProvideNestedEntityContext(segment: string) {
    const current = useNestedEntityContext();
    const next = [...current, segment];
    return next;
}

export function NestedEntityProvider({ children, segment }: { children?: Children, segment: string }) {
    const context = useProvideNestedEntityContext(segment);
    return <NestedEntityContext.Provider value={context}>
        {children}
    </NestedEntityContext.Provider>
}