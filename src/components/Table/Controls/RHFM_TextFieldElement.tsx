import { TextFieldElement, useFormContext } from 'react-hook-form-mui';
import { useMemo } from 'react';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { $cn } from '../../../util/$cn';

export type RHFM_TextFieldElementProps = {
    header?: string;
    name: string;
    type?: React.HTMLInputTypeAttribute;
    required?: boolean;
    requiredMessage?: string;
    pattern?: RegExp;
    patternMessage?: string;
    minLength?: number;
    minLengthMessage?: string;
    maxLength?: number;
    maxLengthMessage?: string;
    min?: number;
    minMessage?: string;
    max?: number;
    maxMessage?: string;
    validators?: ([string, (value: any) => boolean])[]
};
export function RHFM_TextFieldElement({
    header,
    patternMessage,
    requiredMessage,
    minLengthMessage,
    maxLengthMessage,
    minMessage,
    maxMessage,
    validators,
    ...rest
}: RHFM_TextFieldElementProps) {
    function Inner_TextFieldElement() {
        const context = useFormContext();
        const { invalid, isDirty } = useMemo(() => context.getFieldState(rest.name), [context]);
        const InputProps = $cn({ className: 'text-base font-grandstander font-normal' }, { 'text-red-500 font-extrabold': invalid, 'text-fuchsia-500 font-extrabold italic': isDirty });
        return (
            <TextFieldElement
                label={header ?? toProperFromCamel(rest.name)}
                {...rest}
                FormHelperTextProps={{
                    className: 'text-base font-normal font-rubik'
                }}
                InputLabelProps={{
                    className: 'text-base font-normal font-rubik'
                }}
                InputProps={InputProps}
                validation={{
                    validate: Object.fromEntries(validators ?? []),
                    ...(rest.required ? { required: requiredMessage ?? 'This is a required field.' } : {}),
                    ...(rest.pattern
                        ? {
                              pattern: patternMessage
                                  ? {
                                        value: rest.pattern,
                                        message: patternMessage ?? 'This must adhere to a specified pattern. '
                                    }
                                  : rest.pattern
                          }
                        : {}),
                    ...(rest.minLength
                        ? {
                              minLength: minLengthMessage ? { value: rest.minLength, message: minLengthMessage } : rest.minLength
                          }
                        : {}),
                    ...(rest.maxLength
                        ? {
                              maxLength: maxLengthMessage ? { value: rest.maxLength, message: maxLengthMessage } : rest.maxLength
                          }
                        : {}),
                    ...(rest.min
                        ? {
                              min: minMessage ? { value: rest.min, message: minMessage } : rest.min
                          }
                        : {}),
                    ...(rest.max
                        ? {
                              max: maxMessage ? { value: rest.max, message: maxMessage } : rest.max
                          }
                        : {})
                }}
            />
        );
    }
    return Inner_TextFieldElement();
}
