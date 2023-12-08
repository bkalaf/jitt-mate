import { toProperFromCamel } from '../../common/text/toProperCase';
import { RHFM_ListControl } from './Controls/RHFM_ListControl';
import { DBSetDetailCell } from './DBSetDetailCell';
import { Path } from 'react-hook-form-mui';
import { MRT_ColumnDef } from 'material-react-table';
import { IRealmObject } from '../../dal/types';

export function dataStructureMeta<T extends IRealmObject<T>, TListOf, TName extends Path<T>>(name: TName,
    labelProperty: (keyof TListOf & string) | undefined,
    objectType: string,
    ofTypeKind: DataTypeKind,
    listObjectType: RealmObjects | RealmPrimitives,
    listType: ListTypeKind,
    opts: { header?: string; }) {
    return {
        header: opts.header ?? toProperFromCamel(name),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Cell: DBSetDetailCell<Entity<TListOf>, T>(({ payload }) => (ofTypeKind === 'primitive' ? (payload?.toString() as any) : (payload[labelProperty as keyof Entity<TListOf>] as string))),
        Edit: RHFM_ListControl<T, TName, Entity<TListOf>>({
            name: name,
            objectType: objectType,
            listObjectType: listObjectType,
            header: opts.header ?? toProperFromCamel(name),
            labelPropertyName: labelProperty,
            listType: listType,
            ofTypeKind: ofTypeKind,
            deleteItemMode: listType === 'dictionary' ? 'key' : 'index',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ItemElement: (props: { data: Entity<TListOf> }) => <span>{ofTypeKind === 'primitive' ? (props.data as any) : (props.data[labelProperty as keyof Entity<TListOf>] as string)}</span>
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as MRT_ColumnDef<T, any>;
}
