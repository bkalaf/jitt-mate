import { TextFieldElement, useFormContext } from 'react-hook-form-mui';
import { useOnBlurContext } from '../creators/useOnBlurContext';

export const RHFM_TextControl = (
    name: string,
    header: string,
    maxLength?: number,
    minLength?: number,
    pattern?: RegExp,
    required = false,
    readOnly = false,
    type: React.HTMLInputTypeAttribute = 'text'
) =>
    function MRT_TextControl() {
        // const patternSlice = pattern?.toString().length ?? 2 - 2;
        const context = useFormContext();
        if (context == null) throw new Error('no context');
        // console.log('context', context);
        const onBlur = useOnBlurContext();
        return (
            <TextFieldElement
                control={context.control}
                onBlur={onBlur(name)}
                name={name}
                inputProps={{ readOnly }}
                type={type}
                margin='dense'
                label={header}
                required={required}
                aria-readonly={readOnly}
                validation={{
                    required: required ?? false ? 'This field is required.' : undefined,
                    maxLength: maxLength
                        ? {
                              value: maxLength,
                              message: `This field has a maximum length of ${maxLength} characters.`
                          }
                        : undefined,
                    minLength: minLength
                        ? {
                              value: minLength,
                              message: `This field has a minimum length of ${minLength} characters.`
                          }
                        : undefined,
                    pattern: pattern
                        ? {
                              value: pattern,
                              message: 'Current value does not conform to the specified pattern for this field.'
                          }
                        : undefined
                }}
            />
        );
        // control={context.control} />;
    };

