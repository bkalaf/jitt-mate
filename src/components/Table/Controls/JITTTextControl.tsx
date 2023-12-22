/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextFieldElement } from 'react-hook-form-mui';
import { useDependencies } from '../../../hooks/useDependencies';
import { MRT_ColumnDef } from 'material-react-table';

export const JITTTextControl = (
    { type, readOnly, required, maxLength, minLength, pattern, patternMsg }: { maxLength?: number; minLength?: number; pattern?: RegExp; patternMsg?: string; required?: boolean; readOnly?: boolean; type?: React.HTMLInputTypeAttribute } = {},
    initialDisable = false,
    ...dependencies: IDependency[]
) =>
    function MRT_TextControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const spread = useDependencies(props, initialDisable ?? false, ...dependencies);
        return (
            <TextFieldElement
                inputProps={{ readOnly: readOnly ?? false }}
                type={type ?? 'text'}
                margin='dense'
                required={required ?? false}
                aria-readonly={readOnly ?? false}
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
                              message: patternMsg ?? 'Current value does not conform to the specified pattern for this field.'
                          }
                        : undefined
                }}
                {...spread}
            />
        );
    };
