import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { randomString } from '../../util/randomString';
import { ignore } from '../../common/functions/ignore';
import { useToasterContext } from '../../hooks/useToasterContext';
import { konst } from '../../common/functions/konst';
import { IFormContext } from './FormContext';
import { fromString } from './fromString';
import { retrieveValue } from './retrieveValue';
import { combineEvents } from './combineEvents';
import { runIf } from './runIf';
import { identity } from '../../common/functions/identity';
import { useLogger } from './useLogger';
import { is, $tagIs } from '../../dal/is';

export function useProvideFormContext<T, TResultant = void>(resultant?: (x: TResultant) => void): IFormContext<T, TResultant> {
    const formID = useMemo(() => randomString(24), []);
    console.log(`formID`, formID);
    const [data, setData] = useState<T>({} as T);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const memoized = useRef<T | null>(null);
    const [dirtyProperties, setDirtyProperties] = useState<string[]>([]);
    const appendDirty = useCallback((name: string) => {
        setDirtyProperties((prev) => {
            if (prev.includes(name)) return prev;
            return [...prev, name];
        });
    }, []);
    const clearDirty = useCallback(() => setDirtyProperties([]), []);
    const memoize = useCallback(() => {
        memoized.current = data;
        clearDirty();
    }, [clearDirty, data]);
    const isFormDirty = useCallback(() => dirtyProperties.length > 0, [dirtyProperties.length]);
    const isFieldDirty = useCallback(
        <TKey extends keyof T>(key: TKey & string) => {
            return () => dirtyProperties.includes(key);
        },
        [dirtyProperties]
    );
    const clearErrors = useCallback(() => setErrors({}), []);
    const hasErrors = useCallback(() => Object.getOwnPropertyNames(errors).length > 0, [errors]);
    const setError = useCallback((name: string, message: string | string[]) => {
        setErrors((prev) => {
            const current = prev[name] ?? [];
            return { ...prev, [name]: [...current, ...(is.string(message) ? [message] : message)] };
        });
    }, []);
    const getValue = useCallback(
        <TKey extends keyof T>(name: TKey) => {
            return () => data[name];
        },
        [data]
    );
    const setInitialValue = useCallback(
        <TKey extends keyof T>(name: TKey) =>
            (value: T[TKey]) => {
                setData((prev) => {
                    return { ...prev, [name]: value };
                });
                setTimeout(() => memoize(), 150);
            },
        [memoize]
    );
    const manualSetValue = useCallback(
        <TKey extends keyof T>(name: TKey & string, transform: (x: any) => any = identity) =>
            (value: T[TKey]) => {
                setData(prev => ({ ...prev, [name]: transform(value) }))
            },
        []
    );
    const setValue = useCallback(
        <TElement extends HTMLInputElement | HTMLSelectElement | HTMLTemplateElement, TKey extends keyof T>(
                name: TKey & string,
                datatype: RealmTypes,
                transform: (x: any) => any = identity,
                ...validators: Validator<T[TKey] | undefined>[]
            ) =>
            (ev: React.ChangeEvent<TElement>) => {
                const el = $tagIs.input(ev.target) ? ev.target : $tagIs.select(ev.target) ? ev.target : $tagIs.textarea(ev.target) ? ev.target : null;
                const type: DataElementType = (
                    $tagIs.input(ev.target) ? (ev.target as HTMLInputElement).type : $tagIs.textarea(ev.target) ? 'text' : $tagIs.select(ev.target) ? 'select' : undefined
                ) as DataElementType;
                if (el == null) {
                    console.error(`el`, el);
                    throw new Error('el null');
                }
                if (type == null) {
                    console.error(`el`, type, el);
                    throw new Error('type null');
                }
                const unconvertedValue = retrieveValue(type, el);
                const value = Array.isArray(unconvertedValue) ? unconvertedValue.map(fromString(datatype)) : is.bool(unconvertedValue) ? unconvertedValue : fromString(datatype)(unconvertedValue);
                // const validity = el.validity.valid;
                // const setErrorMessage = el.setCustomValidity;
                const results = validators.map((f) => f(value as T[TKey]));
                if (results.every((x) => x.type === 'valid')) {
                    // setErrorMessage('');
                } else {
                    setError(name, (results.filter((x) => x.type === 'invalid') as Invalid[]).map((x) => x.message).filter((x) => x != null) as string[]);
                }
                // setErrorMessage((results.filter(x => x.type === 'invalid') as Invalid[]).map(x => x.message).join('\n'));
                setData((prev) => {
                    const current = Object.getOwnPropertyNames(prev).includes(name) ? prev[name] : undefined;
                    if (current === value) return prev;
                    appendDirty(name);
                    return { ...prev, [name]: is.string(value) ? value.length > 1 ? transform(value) : null : transform(value) };
                });
            },
        [appendDirty, setError]
    );
    const getError = useCallback(
        (name: string): (() => string | undefined) =>
            () =>
                errors[name]?.join('\n'),
        [errors]
    );
    const { createSuccessToast, catcher } = useToasterContext();
    const logger = useLogger();
    const handleSubmit = useCallback(
        (submitter: FormSubmitterFunctions<T, TResultant>, toMessage?: (x: TResultant) => string, onSuccess?: (x: TResultant) => void, onFailure?: (err: Error) => void) =>
            async (ev: React.FormEvent<HTMLFormElement>) => {
                ev.preventDefault();
                ev.stopPropagation();
                logger(`onSubmit: data | `.concat(JSON.stringify(data, null, '\t')), 'data')
                if (hasErrors()) {
                    console.error(`HAS ERRORS`, errors);
                    throw new Error('cannot submit form - errors exist');
                }
                console.log(`formEvent`, ev);
                console.log(`formData`, Object.fromEntries(new FormData(ev.target as HTMLFormElement).entries()));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const $onFailure = combineEvents(catcher, onFailure ?? ignore);
                const toToast = (res: TResultant) => {
                    createSuccessToast((toMessage ?? konst('Operation was a success.'))(res), 'SUCCESS');
                };
                const $onSuccess = combineEvents(toToast, combineEvents(resultant ?? ignore, onSuccess ?? ignore));

                try {
                    const result = submitter(data, dirtyProperties);
                    if (result instanceof Promise) {
                        const r = await result;
                        runIf($onSuccess)(r);
                    } else {
                        runIf($onSuccess)(result);
                    }
                } catch (error) {
                    logger(JSON.stringify(error, null, '\t'), 'error');
                    runIf($onFailure)(error as Error);
                    throw error;
                }
            },
        [catcher, createSuccessToast, data, dirtyProperties, errors, hasErrors, logger, resultant]
    );
    const onReset = useCallback(
        (ev: React.SyntheticEvent<HTMLElement, Event>) => {
            ev.preventDefault();
            ev.stopPropagation();
            clearErrors();
            if (memoized.current != null) setData(memoized.current);
            clearDirty();
        },
        [clearDirty, clearErrors]
    );
    return {
        onReset,
        manualSetValue,
        memoize,
        formID,
        data,
        handleSubmit,
        getError,
        setValue,
        getValue,
        hasErrors,
        clearErrors,
        errors,
        setError,
        onClose: resultant,
        setInitialValue,
        isFormDirty,
        isFieldDirty
    };
}
