import { useCallback, useState } from 'react';

export const comp = (x: unknown, y: unknown) => x === y;

export function useLoggingState<T>(initial?: T | (() => T), name?: string, comparator: (x?: T, y?: T) => boolean = comp): ReturnType<typeof useState<T>> {
    if (initial == null) throw new Error('no initial');
    const [state, _setState] = useState<T>(initial != null ? (typeof initial !== 'function' ? initial : (initial as () => T)()) : initial);
    const setState = useCallback((prev?: React.SetStateAction<T | undefined>) => {
        _setState((p) => {
            // console.group('setState');
            // console.log(`prev`, prev, `p`, p);
            if (prev == null) {
                // console.log(`state update: ${name}: aborting`);
                // console.groupEnd();
                return p;
            }
            const next: T | undefined = typeof prev !== 'function' ? prev : (prev as (x?: T) => T)(p);
            if (comparator(next, p)) {
                // console.log(`state update: ${name}: equality match - returning old value`);
                // console.groupEnd();
                return p;
            }
            // console.log(`state update: ${name}`, p, next);
            // console.groupEnd();
            return next;
        });
    }, [comparator]);
    return [state, setState];
}
