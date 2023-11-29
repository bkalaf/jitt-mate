import { TextFieldElement, useFormContext } from 'react-hook-form-mui';

export const MRTTextControl = (name: string, header: string, maxLength?: number, minLength?: number, pattern?: RegExp, required = false, readOnly = false, type: React.HTMLInputTypeAttribute = 'text') =>
    function MRT_TextControl() {
        const patternSlice = pattern?.toString().length ?? 2 - 2;
        const context = useFormContext();
        console.log('context', context);
        return <TextFieldElement name={name} inputProps={{ maxLength, minLength, pattern: pattern?.toString().slice(1, patternSlice), readOnly }} type={type} margin='dense' label={header} required={required} aria-readonly={readOnly} control={context.control}/>;
    };


