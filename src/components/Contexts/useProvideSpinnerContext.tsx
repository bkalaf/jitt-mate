import { useCallback, useRef } from 'react';
import { useToggler } from '../../hooks/useToggler';
import { ISpinnerContext } from './SpinnerContext';
import { useLogger } from './useLogger';

export function useProvideSpinnerContext(): ISpinnerContext {
    const [isBlocked, , setWaiting, setNotWaiting] = useToggler(false);
    const isWaiting = useCallback(() => isBlocked, [isBlocked]);
    const canceller = useRef<(() => void) | null>(null);
    const token = useRef<Promise<any> | null>();
    const logger = useLogger();
    const setSpinner = useCallback(
        <T extends AnyArray, U = void>(action: (...args: T) => Promise<U>, func?: () => void) => {
            return async (...args: T) => {
                try {
                    if (func != null) canceller.current = func;
                    logger('staring op: '.concat(action.name), 'db');
                    setWaiting();
                    token.current = action(...args);
                    await token.current;
                    logger('ending op: '.concat(action.name), 'db');
                    setNotWaiting();
                    canceller.current = null;
                } catch (error) {
                    logger(JSON.stringify(error, null, '\t'), 'error');
                    throw error;
                }
                return await token.current;
            };
        },
        [logger, setNotWaiting, setWaiting]
    );
    const cancelWaiting = useCallback(() => {
        if (canceller.current) canceller.current();
        canceller.current = null;
        token.current = null;
        setNotWaiting();
    }, [setNotWaiting]);
    const isCancellable = useCallback(() => {
        return canceller.current != null;
    }, []);
    return {
        setSpinner,
        cancelWaiting,
        isWaiting,
        setWaiting,
        setNotWaiting,
        isCancellable
    };
}
