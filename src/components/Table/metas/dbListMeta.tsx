import { RHFMListControl } from '../MRTListControl';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { FieldValues, UseFormReturn } from 'react-hook-form-mui';
import React from 'react';
import { DBListDetailCell } from '../DBListDetailCell';

export function dbListMeta<T extends FieldValues>(name: string,
    objectType: string,
    opts: {
        parentObjectType?: string;
        header?: string;
        ItemComponent: ({ payload }: { payload: T; }) => string;
    }) {
    return {
        header: opts.header ?? toProperFromCamel(name),
        Cell: DBListDetailCell<T>(opts.ItemComponent) as any,
        Edit: RHFMListControl<T, any>({
            ItemComponent: opts.ItemComponent,
            objectType: objectType as RealmObjects | RealmPrimitives,
            parentObjectType: (opts.parentObjectType ?? 'brand') as RealmObjects,
            propertyName: name
        }) as any
    };
}
