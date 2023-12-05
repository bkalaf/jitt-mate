import { toProperFromCamel } from '../../common/text/toProperCase';
import { RHFM_ListControl } from './Controls/RHFM_ListControl';
import React from 'react';
import { DBSetDetailCell } from './DBSetDetailCell';
import { Path } from 'react-hook-form-mui';

export function dataStructureMeta<T extends EntityBase, TListOf, TName extends Path<T>>(name: TName,
    labelProperty: keyof TListOf & string,
    objectType: string,
    ofTypeKind: DataTypeKind,
    listObjectType: RealmObjects | RealmPrimitives,
    listType: ListTypeKind,
    opts: { header?: string; }) {
    return {
        header: opts.header ?? toProperFromCamel(name),
        Cell: DBSetDetailCell<Entity<TListOf>, T>(({ payload }) => payload[labelProperty] as string),
        Edit: RHFM_ListControl<T, TName, Entity<TListOf>>({
            name: name,
            objectType: objectType,
            listObjectType: listObjectType,
            header: opts.header ?? toProperFromCamel(name),
            labelPropertyName: labelProperty,
            listType: listType,
            ofTypeKind: ofTypeKind,
            deleteItemMode: listType === 'dictionary' ? 'key' : 'index',
            ItemElement: (props: { data: Entity<TListOf>; }) => <span>{props.data[labelProperty] as string}</span>
        })
    };
}
