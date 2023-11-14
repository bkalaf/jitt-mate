import React, { useCallback, useContext, useMemo, useState } from 'react';
import { identity } from '../../../common/functions/identity';
import { FormContext } from '../../Contexts/FormContext';
import { randomString } from '../../../util/randomString';
import { $tagIs } from '../../../dal/is';

export function usePossibleFormContext(datatype: RealmTypes, $formID?: string, transform?: (x: any) => any, ...validators: Validator<any>[]) {
    const context = useContext(FormContext);
    const formID = context?.formID ?? $formID ?? randomString(24);
    const hasErrors = useMemo(() => context?.hasErrors ?? (() => !((document.getElementById(formID) as HTMLFormElement).checkValidity() ?? false)), [context?.hasErrors, formID]);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [dirtyColumns, setDirtyColumns] = useState<string[]>([]);
    const appendColumn = useCallback((colName: string) => {
        setDirtyColumns((prev) => (prev.includes(colName) ? prev : [...prev, colName]));
    }, []);
    const setValue = useCallback(() => {
        return (ev: React.ChangeEvent<HTMLInputElement>) => {
            const name = ev.target.name ?? '';
            if (context) {
                context.setValue(name, datatype, transform ?? identity, ...validators);
            } else {
                setFormData((prev) => ({ ...prev, [name]: ev.target.value }));
                appendColumn(name);
            }
        };
    }, [appendColumn, context, datatype, transform, validators]);
    const getValue = useCallback(
        (name: string) => () => {
            if (context) {
                return context.getValue(name)();
            }
            const form = document.getElementById(formID) as HTMLFormElement;
            if (form == null) return undefined;
            console.error(`formID`, formID);
            const fd = new FormData(form);
            const obj = Object.fromEntries(fd.entries());
            return obj[name];
        },
        [context, formID]
    );
    const getError = useCallback(
        (name: string) => () => {
            if (context) {
                return context.getError(name)() ?? '';
            }
            const form = document.getElementById(formID) as HTMLFormElement;
            const el = Array.from(form.elements).find((x) => ($tagIs.input(x) || $tagIs.select(x) || $tagIs.textarea(x) ? x.name === name : false));
            if (el) {
                const El = el as DataControlElements;
                return El.validationMessage ?? '';
            }
            return '';
        },
        [context, formID]
    );
    const setInitialValue = useCallback(
        (name: string) => {
            return (defaultValue: any): void => {
                if (context) {
                    return context.setInitialValue(name)(defaultValue);
                }
                const form = document.getElementById(formID) as HTMLFormElement;
                const el = Array.from(form.elements).find((x) => ($tagIs.input(x) || $tagIs.select(x) || $tagIs.textarea(x) ? x.name === name : false));
                if (el) {
                    const El = el as DataControlElements;
                    if (defaultValue != null && typeof defaultValue === 'boolean') {
                        (El as HTMLInputElement).checked = defaultValue;
                        return;
                    }
                    if ($tagIs.select(El)) {
                        const option = Array.from(El.options).find((x) => x.value === defaultValue);
                        if (option) {
                            option.selected = true;
                            return;
                        }
                        return;
                    }
                    return (El.value = defaultValue);
                }
                return;
            };
        },
        [context, formID]
    );
    const handleSubmit = useCallback(
        (submitter: FormSubmitterFunctions<AnyObject, void>) => {
            if (context) {
                return context.handleSubmit(submitter);
            }
            return (ev: React.FormEvent) => {
                const form = $tagIs.form(ev.target as HTMLElement) ? (ev.target as HTMLFormElement) : ((ev.target as HTMLButtonElement).form as HTMLFormElement);
                submitter(Object.fromEntries(Object.entries(new FormData(form))), dirtyColumns);
            };
        },
        [context, dirtyColumns]
    );
    return {
        formID,
        setValue,
        getValue,
        getError,
        setInitialValue,
        hasErrors,
        handleSubmit
    };
}
