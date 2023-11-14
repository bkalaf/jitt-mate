import React from 'react';

export type IFormControlLabelProps = {
    children?: string;
    labelID: string;
    controlID: string;
    isRequired?: boolean;
};

export function FormControlLabel(props: IFormControlLabelProps) {
    const { children, labelID, controlID, isRequired } = props;
    return (
        <label
            id={labelID}
            htmlFor={controlID}
            className='flex items-center justify-start w-full text-lg font-bold indent-2 font-fira-sans aria-required:text-amber-700 aria-required:font-bold aria-required:after:content-["_(*)"] aria-required:after:text-rose-500'
            aria-required={isRequired ?? false}>
            {children}
        </label>
    );
}
