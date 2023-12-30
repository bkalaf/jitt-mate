import { createContext } from 'react';
import { useProvideJITTCollectionContext } from './useProvideJITTCollectionContext';

export type IJITTCollectionContext = {
    matchFromStart: boolean;
    toggleMatchFromStart: () => void;
};

export const JITTCollectionContext = createContext<IJITTCollectionContext | undefined>(undefined);
JITTCollectionContext.displayName = 'JITTCollectionContext';

export function JITTCollectionContextProvider({ children }: { children: Children }) {
    const context = useProvideJITTCollectionContext();
    return <JITTCollectionContext.Provider value={context}>{children}</JITTCollectionContext.Provider>;
}

