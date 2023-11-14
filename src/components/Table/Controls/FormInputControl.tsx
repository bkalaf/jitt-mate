import React from 'react';
import { $cn } from '../../../util/$cn';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { usePossibleFormContext } from './usePossibleFormContext';
import { FormControlLabel } from './FormControlLabel';
import { useControlID } from './useControlID';

export type IFormControlProps = ({
    orientation: 'horizontal' | 'vertical';
    displayName?: string;
    datatype: RealmTypes;
    name: string;
    hideLabel?: boolean;
    formID?: string;
} & Partial<React.InputHTMLAttributes<HTMLInputElement>>) &
    Partial<React.SelectHTMLAttributes<HTMLSelectElement>>;

export function FormInputControl(props: IFormControlProps) {
    const { orientation, formID: $formID, name, displayName, hideLabel, datatype, ...remain } = props;
    const { className, ...spread } = $cn(remain, { 'flex-col': orientation === 'vertical', 'flex-row': orientation === 'horizontal' }, 'flex mt-3');
    const [fieldID, controlID, labelID, feedbackID] = useControlID(name, 'input');
    const { formID, getValue, setValue, setInitialValue, getError, hasErrors, handleSubmit } = usePossibleFormContext(datatype, $formID);
    return (
        <div id={fieldID} className={className}>
            {!(hideLabel ?? false) && (
                <FormControlLabel controlID={controlID} labelID={labelID}>
                    {displayName ?? toProperFromCamel(name ?? '')}
                </FormControlLabel>
            )}
            <input form={formID} id={controlID} name={name} {...spread} value={getValue(name)()} onChange={setValue()} {...remain} />
        </div>
    );
}
