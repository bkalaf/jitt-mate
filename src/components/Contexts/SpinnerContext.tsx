import { createContext } from 'react';
import { useProvideSpinnerContext } from './useProvideSpinnerContext';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { useSpinnerContext } from './useSpinnerContext';

export type ISpinnerContext = {
    isWaiting: () => boolean;
    setWaiting: () => void;
    setNotWaiting: () => void;
    cancelWaiting: () => void;
    isCancellable: () => boolean;
    setSpinner: <T extends AnyArray, U = void>(action: (...args: T) => Promise<U>, func?: () => void) => (...args: T) => Promise<U>;
};

export const SpinnerContext = createContext<ISpinnerContext | undefined>(undefined);
SpinnerContext.displayName = 'SpinnerContext';

export function SpinnerProvider({ children }: { children: Children }) {
    const context = useProvideSpinnerContext();
    const el = document.getElementById('spinner-root');
    if (el == null) throw new Error('no element');
    return (
        <SpinnerContext.Provider value={context}>
            {children}
            {createPortal(<Spinner />, el)}
        </SpinnerContext.Provider>
    );
}

export function Spinner() {
    const { isWaiting } = useSpinnerContext();
    return (
        isWaiting() && (
            <div className='flex items-center justify-center w-4/5 border-2 border-white pointer-events-auto h-4/5 bg-white/20 rounded-xl'>
                <span className='inline-flex'>
                    <FontAwesomeIcon spin icon={faSpinner} className='block object-fill text-rose-500' size='6x' />
                </span>
            </div>
        )
    );
}
