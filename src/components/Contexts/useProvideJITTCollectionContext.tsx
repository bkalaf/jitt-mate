import { useToggler } from '../../hooks/useToggler';

export function useProvideJITTCollectionContext() {
    const [matchFromStart, toggleMatchFromStart] = useToggler(false);
    return {
        matchFromStart,
        toggleMatchFromStart
    };
}
