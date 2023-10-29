import { useProvidedContext } from './useProvidedContext';
import { TabPanelContext } from '../components/Contexts/TabPanelContext';

export function useTabPanelContext() {
    return useProvidedContext(TabPanelContext);
}
