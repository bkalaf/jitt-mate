import React, { createContext } from 'react';
import { compR } from '../../common/functions/composeR';

export type IFormContext<T = AnyObject, TResultant = void> = {
    data: T;
    getValue: <TKey extends keyof T>(name: TKey) => () => T[TKey];
    manualSetValue: <TKey extends keyof T>(name: TKey & string, transform: (x: any) => any) => (value: T[TKey]) => void;
    setValue: <TElement extends HTMLInputElement | HTMLSelectElement | HTMLTemplateElement, TKey extends keyof T>(
        name: TKey & string,
        datatype: RealmTypes,
        transform: (x: any) => any,
        ...validators: Validator<T[TKey] | undefined>[]
    ) => (ev: React.ChangeEvent<TElement>) => void;
    handleSubmit: (
        submitter: FormSubmitterFunctions<T, TResultant>,
        toMessage?: (x: TResultant) => string,
        onSuccess?: (x: TResultant) => void,
        onFailure?: (err: Error) => void
    ) => (ev: React.FormEvent<HTMLFormElement>) => void;
    formID: string;
    errors: Record<string, string[]>;
    hasErrors: () => boolean;
    setError: (name: string, message: string | string[]) => void;
    clearErrors: () => void;
    getError: (name: string) => () => string | undefined;
    onClose?: (result: TResultant) => void;
    isFormDirty: () => boolean;
    isFieldDirty: <TKey extends keyof T>(key: TKey & string) => () => boolean; 
    setInitialValue: <TKey extends keyof T>(key: TKey) => (value: T[TKey]) => void;
    onReset: (ev: React.SyntheticEvent<HTMLElement, Event>) => void;
    memoize: () => void;
};

export const FormContext = createContext<IFormContext | undefined>(undefined);
FormContext.displayName = 'FormContext';


