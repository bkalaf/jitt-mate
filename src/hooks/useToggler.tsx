import { useCallback, useState } from 'react';


export function useToggler(initial = false): [
    state: boolean,
    toggler: () => void,
    on: () => void,
    off: () => void
] {
    const [state, setState] = useState<boolean>(initial);
    const toggle = useCallback(() => setState(prev => !prev), []);
    const on = useCallback(() => setState(true), []);
    const off = useCallback(() => setState(false), []);
    return [state, toggle, on, off];
}
