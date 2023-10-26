import { TabPanelContext } from './contexts/TabPanelContext';
import { useProvideTabPanelContext } from '../hooks/useProvideTabPanelContext';


export function TabPanelProvider({ children }: { children?: Children; }) {
    const context = useProvideTabPanelContext();
    return <TabPanelContext.Provider value={context}>
        {children}
    </TabPanelContext.Provider>;
}
