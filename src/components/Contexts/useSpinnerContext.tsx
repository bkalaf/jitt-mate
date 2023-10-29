import { useProvidedContext } from '../../hooks/useProvidedContext';
import { SpinnerContext } from './SpinnerContext';


export function useSpinnerContext() {
    return useProvidedContext(SpinnerContext);
}
