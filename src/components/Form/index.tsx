import Button from '@mui/material/Button';
import { FieldErrors, FormContainer, useForm } from 'react-hook-form-mui';

type StrictControl = {
    multi_select: string[];
    name: string;
    auto: string;
    auto_multi: string[];
    select: string;
    switch: boolean;
    checkbox: string[];
    check: boolean;
    date: string;
    radio: string;
    password: string;
    password_repeat: string;
};

export function Form<T extends AnyObject>({
    defaultValues,
    children,
    onInvalid,
    onValid
}: {
    children: Children;
    defaultValues: () => Promise<T>;
    onValid: (data: T, event?: React.BaseSyntheticEvent) => unknown;
    onInvalid: (errors: FieldErrors<T>, event?: React.BaseSyntheticEvent) => void;
}) {
    return (
        <FormContainer defaultValues={defaultValues} onSuccess={onValid} onError={onInvalid}>
            {children}
        </FormContainer>
    );
}