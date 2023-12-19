import { useProvidedContext } from './useProvidedContext';
import { OnBlurContext } from '../components/Table/creators/OnBlurContext';

export function useOnBlurContext() {
    return useProvidedContext(OnBlurContext);
}
