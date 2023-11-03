import { createContext, useCallback, useMemo, useState } from 'react';
import { randomString } from '../../util/randomString';
import { createPortal } from 'react-dom';
import { Overlay } from './Overlay';

export type OverlayState = 'showing' | 'shown' | 'hiding' | 'hidden';

export type IOverlayContext = {
    state: OverlayState;
    cycleState: () => void;
    popFrame: () => void;
    pushFrame: <TProps>(el: React.FunctionComponent<TProps>, props: TProps) => void;
    children: JSX.Element[];
};

export const OverlayContext = createContext<IOverlayContext | undefined>(undefined);

function cycleOverlayState(current: OverlayState): OverlayState {
    switch (current) {
        case 'hidden':
            return 'showing';
        case 'showing':
            return 'shown';
        case 'shown':
            return 'hiding';
        case 'hiding':
            return 'hidden';
    }
}
export function useProvideOverlayContext(): IOverlayContext {
    const [state, setState] = useState<OverlayState>('hidden');
    const cycleState = useCallback(() => setState(cycleOverlayState), []);
    const [children, setChildren] = useState<JSX.Element[]>([]);
    const popFrame = useCallback(() => {
        setChildren((prev) => {
            if (prev.length === 0) return prev;
            const [head, ...tail] = prev;
            return tail;
        });
    }, []);
    const pushFrame = useCallback(function <TProps>(El: React.FunctionComponent<TProps>, props: TProps) {
        setChildren((prev) => [
            <div key={randomString(24)} className='hidden overflow-auto first:flex'>
                <El {...props as any} />
            </div>,
            ...prev
        ]);
    }, []);
    return {
        state,
        cycleState,
        popFrame,
        pushFrame,
        children
    };
}

export function OverlayContextProvider({ children }: { children?: Children }) {
    const context = useProvideOverlayContext();
    const el = useMemo(() => document.getElementById('modal-root'), []);
    if (el == null) throw new Error('no modal root');
    return (
        <OverlayContext.Provider value={context}>
            {children}
            {createPortal(<Overlay />, el)}
        </OverlayContext.Provider>
    );
}
