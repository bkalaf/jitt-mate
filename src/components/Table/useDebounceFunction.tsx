import { useCallback, useRef, useState } from 'react';


export function useDebounceFunction<TArguments extends AnyArray, TReturnValue>(func: (...args: TArguments) => TReturnValue, delay = 400, ...initialArguments: TArguments) {
    const [debouncedValue, setDebouncedValue] = useState<TReturnValue>(func(...initialArguments));
    const token = useRef<NodeJS.Timeout | undefined>();
    const debouncedFunction = useCallback((...args: TArguments) => {
        if (token.current) {
            clearTimeout(token.current);
        }
        token.current = setTimeout(() => setDebouncedValue(func(...args)), delay);
        return debouncedValue;
    }, [debouncedValue, delay, func]);
    return debouncedFunction;
}
