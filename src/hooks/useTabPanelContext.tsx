import { useProvidedContext } from './useProvidedContext';
import { TabPanelContext } from '../components/contexts/TabPanelContext';

export function useTabPanelContext() {
    return useProvidedContext(TabPanelContext);
}
