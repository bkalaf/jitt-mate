import { createContext } from 'react';

export type ITabPanelContext = {
    currentTab: string | undefined;
    setCurrentTab: StateSetter<string | undefined>;
    isCurrentTab: (key?: string) => boolean;
    actions: (key?: string) => {
        isCurrent: () => boolean;
        setCurrent: () => void;
    }
};

export const TabPanelContext = createContext<ITabPanelContext | undefined>(undefined);
TabPanelContext.displayName = 'TabPanelContext';
