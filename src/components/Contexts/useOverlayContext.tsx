import { useProvidedContext } from '../../hooks/useProvidedContext';
import { OverlayContext } from './OverlayContext';


export function useOverlayContext() {
    return useProvidedContext(OverlayContext);
}
