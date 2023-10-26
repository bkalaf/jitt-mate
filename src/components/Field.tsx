import { useCallback, useMemo, useRef, useState } from 'react';
import { $cn } from '../util/$cn';
import { useToggler } from '../hooks/useToggler';

export function Field({
    label,
    name,
    type,
    required,
    defaultValue,
    valueProperty
}: {
    type?: React.HTMLInputTypeAttribute;
    label: string;
    name: string;
    required?: boolean;
    defaultValue?: string | number | boolean;
    valueProperty: 'checked' | 'value';
}) {
    const id = [name, 'input'].join('-');
    const def = defaultValue == null ? {} : typeof defaultValue === 'boolean' ? { defaultChecked: defaultValue } : { defaultValue };
    const ref = useRef<HTMLInputElement | null>();
    const inputProps = useMemo(() => {
        return $cn({}, {  }, );
    }, []);
    const [errorMessage, setErrorMessage] = useState<string>(' ');
    const hasError = useCallback(() => errorMessage != null, [errorMessage]);
    const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        const {
            validity: { valid },
            validationMessage
        } = ev.target;
        if (valid) setErrorMessage(null);
        else setErrorMessage(validationMessage);
    }, []);
    return (
        <div className='flex flex-col mt-5'>
            <label htmlFor={id} className='flex w-full text-xl font-bold font-pala-dark indent-2'>
                {label}
            </label>
            <input ref={ref} id={id} type={type ?? 'text'} name={name} onChange={onChange} required={required ?? false} {...def} className='hidden px-2 py-1 text-lg border border-black rounded-lg font-pala-dark indent-2 peer-not-hover:hidden peer-hover:flex default:text-red-500' />
            {hasError && <small className='flex items-center justify-start w-auto text-lg text-red-500 font-pala-dark'>{errorMessage}</small>}
        </div>
    );
}
