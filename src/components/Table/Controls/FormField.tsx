import React from 'react';
import { getDefaultPropertyNameFromDefaultType } from './getDefaultPropertyNameFromDefaultType';
import { FormInputControl } from './FormInputControl';

export type IFormFieldProps = {
    label?: string;
    hideLabel?: boolean;
    valueProperty: 'value' | 'checked' | 'selectedOptions';
    datatype: RealmTypes;
    tagName: 'input' | 'select';
    formID?: string;
} & Partial<React.InputHTMLAttributes<HTMLInputElement>>;

export function FormField(props: IFormFieldProps) {
    const { tagName, label, name, formID, valueProperty, type, hideLabel, defaultValue, datatype } = props;
    const defaultObject = getDefaultPropertyNameFromDefaultType(defaultValue);
    // const { formID, getValue, setValue, setInitialValue, getError, hasErrors, handleSubmit} = usePossibleFormContext(datatype);
    return tagName === 'input' ? <FormInputControl datatype={datatype} orientation='vertical' name={name ?? ''} hideLabel={hideLabel} displayName={label} type={type} {...defaultObject} formID={formID} /> : <></>;
}
