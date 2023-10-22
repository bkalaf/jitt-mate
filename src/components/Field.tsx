export function Field({ label, name, type, required, defaultValue }: { type?: React.HTMLInputTypeAttribute; label: string; name: string; required?: boolean; defaultValue?: string | number | boolean; }) {
    const id = [name, 'input'].join('-');
    const def = defaultValue == null ? {} : typeof defaultValue === 'boolean' ? { defaultChecked: defaultValue } : { defaultValue };
    return (
        <div className='flex flex-col'>
            <label className='flex text-lg font-semibold font-opensans' htmlFor={id}>
                {label}
            </label>
            <input id={id} type={type ?? 'text'} name={name} className='flex text-base font-opensans' required={required ?? false} {...def} />
        </div>
    );
}
