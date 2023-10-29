import { useCallback, useMemo, useState } from 'react';
import { ToastElement } from '../components/Toaster/ToastElement';
import { IToasterContext, Toast, ToastType } from '../components/Contexts/ToasterContext';
import { randomString } from '../util/randomString';

export function useProvideToasterContext(): IToasterContext {
    const [toasts, setToasts] = useState<React.ReactNode[]>([]);
    const appendToast = useCallback((toast: Toast) => {
        setToasts((prev) => [...prev, <ToastElement key={randomString(24)} {...toast} />]);
    }, []);
    const prune = useCallback(() => setToasts((prev) => (prev.some((x) => x == null) ? prev.filter((x) => x != null) : prev)), []);
    const createToast = useCallback(
        (message: string, toastType: ToastType = 'info', title?: string) => {
            appendToast({ message, title, toastType, prune });
        },
        [appendToast, prune]
    );
    const shortCut = useCallback(
        (toastType: ToastType) => {
            return (message: string, title?: string) => createToast(message, toastType, title);
        },
        [createToast]
    );
    const createInfoToast = useMemo(() => shortCut('info'), [shortCut]);
    const createSuccessToast = useMemo(() => shortCut('success'), [shortCut]);
    const createErrorToast = useMemo(() => shortCut('error'), [shortCut]);
    const createFailureToast = useMemo(() => shortCut('failure'), [shortCut]);
    const catcher = useCallback((err: unknown) => {
        console.error(err);
        const { message, name } = err as Error;
        createFailureToast(message, name);
    }, [createFailureToast])
    return {
        toasts,
        catcher,
        createToast,
        createInfoToast,
        createSuccessToast,
        createFailureToast,
        createErrorToast
    };
}
