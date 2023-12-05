import { MRTListControl } from './MRTListControl';
import { toProperFromCamel } from '../../common/text/toProperCase';
import { FieldValues, UseFormReturn } from 'react-hook-form-mui';
import React from 'react';
import { DBListDetailCell } from './DBListDetailCell';

export function dbListMeta<T extends FieldValues>(name: string,
    objectType: string,
    opts: {
        header?: string;
        ItemComponent: ({ payload }: { payload: T; }) => string;
        convertPayload: (x: any) => T;
        editControls: React.FunctionComponent<{ context: UseFormReturn<T, any, undefined>; }>;
        init: () => Promise<T>;
    }) {
    return {
        header: opts.header ?? toProperFromCamel(name),
        Cell: DBListDetailCell(opts.ItemComponent) as any,
        Edit: MRTListControl(name, objectType, opts.ItemComponent, opts.convertPayload, opts.editControls, opts.init) as any
    };
}
