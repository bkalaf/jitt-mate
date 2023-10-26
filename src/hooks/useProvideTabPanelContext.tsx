import { useCallback, useState } from 'react';
import { ITabPanelContext } from '../components/contexts/TabPanelContext';

function toIsCurrent(func: StateSetter<string | undefined>, predicate: Predicate<string | undefined>, key?: string | undefined) {
    return {
        isCurrent: () => predicate(key),
        setCurrent: () => func(key)
    }
}
export function useProvideTabPanelContext(): ITabPanelContext {
    const [currentTab, setCurrentTab] = useState<string | undefined>();
    const isCurrentTab = useCallback(
        (key?: string) => {
            return currentTab === key;
        },
        [currentTab]
    );
    const actions = useCallback((key?: string) => {
        return toIsCurrent(setCurrentTab, isCurrentTab, key);
    }, [isCurrentTab]);
    return {
        currentTab,
        setCurrentTab,
        isCurrentTab,
        actions
    };
}
