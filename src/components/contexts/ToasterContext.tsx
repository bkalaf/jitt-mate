import { createContext, useMemo, useRef } from 'react';
import { randomString } from '../../util/randomString';

export type ToastType = 'info' | 'success' | 'failure' | 'error';

export type Toast = {
    message: string;
    title?: string;
    toastType: ToastType;
    prune: () => void;
};
export const toastColors = {
    info: 'bg-cyan-500 text-black border-black',
    success: 'bg-lime-500 text-black border-white',
    failure: 'bg-orange-500 text-black border-white',
    error: 'bg-rose-500 text-black border-white'
};

export type IToasterContext = {
    createToast(message: string, toastType?: ToastType, title?: string): void;
    toasts: React.ReactNode[];
    createInfoToast(message: string, title?: string): void;
    createErrorToast(message: string, title?: string): void;
    createSuccessToast(message: string, title?: string): void;
    createFailureToast(message: string, title?: string): void;
};

export const ToasterContext = createContext<IToasterContext | undefined>(undefined);
ToasterContext.displayName = 'ToasterContext';

console.log(`random string: ${randomString(24)}`);
console.log(`random string: ${randomString(32)}`);
console.log(`random string: ${randomString(20)}`);

export type ToastStage = 'animating-in' | 'waiting' | 'animating-out' | 'expired';

export function cycleToastStage(current: ToastStage) {
    function inner() {
        switch (current) {
            case 'animating-in':
                return 'waiting';
            case 'animating-out':
                return 'expired';
            case 'expired':
                return 'expired';
            case 'waiting':
                return 'animating-out';
        }
    }
    const result = inner();
    return result;
}

