import { useProvidedContext } from '../../../hooks/useProvidedContext';
import { OnBlurContext } from './OnBlurContext';

export function useOnBlurContext() {
    return useProvidedContext(OnBlurContext);
}
