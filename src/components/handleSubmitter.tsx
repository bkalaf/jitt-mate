import { catchError } from './catchError';
import { ignore } from '../common/functions/ignore';
import { findAncestor } from '../util/findAncestor';

export function handleSubmitter<T, U>(func: (x: T) => void | U | Promise<U>, onSuccess?: (x?: U) => void, onFailure: (x?: unknown) => void = catchError) {
    return function (e: React.SyntheticEvent) {
        console.log(`handleSubmitter`, e);
        e.preventDefault();
        e.stopPropagation();
        const formEl = findAncestor((x: HTMLElement) => x.tagName.toUpperCase() === 'FORM', 'form')(e.target as HTMLElement) as HTMLFormElement;
        const fd = Object.fromEntries(new FormData(formEl));
        const result = func(fd as T);
        if (result instanceof Promise) {
            result.then((x) => (onSuccess ? onSuccess(x) : ignore())).catch(onFailure);
        } else {
            onSuccess ? (result != null ? onSuccess(result as U) : ignore()) : ignore();
        }
        return;
    };
}
