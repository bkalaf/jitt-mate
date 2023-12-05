import { RHFM_TextControl } from './Controls/RHFM_TextControl';
import React from 'react';

export function stringMeta(opts: { propertyName: string; header: string; maxLength?: number; minLength?: number; pattern?: RegExp; required?: boolean; type?: React.HTMLInputTypeAttribute; }) {
    return ({
        header: opts.header,
        meta: {
            valueIn: (x?: string | null) => x ?? '',
            valueOut: (x?: string) => (x == null || x.length === 0 ? null : x),
            defaultValue: ''
        },
        Edit: RHFM_TextControl(opts.propertyName, opts.header, opts.maxLength, opts.minLength, opts.pattern, opts.required, false, opts.type),
        muiTableHeadCellProps: {
            'aria-required': opts.required ?? false
        }
    });
}
