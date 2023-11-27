import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TextFieldElementProps } from 'react-hook-form-mui';

export function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [debounce, onChange, value]);

    return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}

export function DebouncedTextFieldElement({
    name,
    onChange,
    value: initial,
    debounce: delay,
    ...rest
}: {
    name: string;
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & Partial<TextFieldElementProps>) {
    const [internalValue, setInternalValue] = useState(initial);
    useEffect(() => {
        setInternalValue(initial);
    }, [initial]);
    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(internalValue);
        }, delay);
        return () => clearTimeout(timeout);
    }, [delay, internalValue, onChange]);
    return (
        <TextField
            name={name}
            value={internalValue}
            onChange={(event) => {
                setInternalValue(event.target.value);
            }}
            {...rest}
        />
    );
}
