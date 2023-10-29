import React, { useMemo } from 'react';
import { FormContext, IFormContext } from './FormContext';
import { useProvideFormContext } from './useProvideFormContext';
import { createPortal } from 'react-dom';

export type FormContextProvider<T, TResultant> = React.Context<IFormContext<T, TResultant>>;

export function FormProvider<T, TResultant>({
    children,
    submit,
    toMessage,
    onSuccess,
    onFailure,
    resultant
}: {
    children: Children;
    submit: FormSubmitterFunctions<T, TResultant>;
    toMessage?: (x: TResultant) => string;
    onSuccess?: (x: TResultant) => void;
    onFailure?: (err: Error) => void;
    resultant?: (x: TResultant) => void;
}) {
    const FormContext2: FormContextProvider<T, TResultant> = FormContext as any;
    const context = useProvideFormContext<T, TResultant>(resultant);
    const onSubmit = useMemo(() => context.handleSubmit(submit, toMessage, onSuccess, onFailure), [context, onFailure, onSuccess, submit, toMessage]);
    const el = document.getElementById('form-root')!;
    return (
        <FormContext2.Provider value={context}>
            {children}
            {createPortal(<form id={context.formID} onSubmit={onSubmit} onReset={context.onReset} className='contents'></form>, el)}
        </FormContext2.Provider>
    );
}
