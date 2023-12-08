import { RHFM_TextControl } from '../../Controls/RHFM_TextControl';
import React from 'react';

export function stringMeta(opts: { propertyName: string; header: string; maxLength?: number; minLength?: number; pattern?: RegExp; readOnly?: boolean; required?: boolean; type?: React.HTMLInputTypeAttribute; }) {
    return ({
        header: opts.header,
        enableEditing: !(opts.readOnly ?? false),
        Edit: RHFM_TextControl(opts.propertyName, opts.header, opts.maxLength, opts.minLength, opts.pattern, opts.required, opts.readOnly, opts.type),
        muiTableHeadCellProps: {
            'aria-required': opts.required ?? false
        }
    });
}
