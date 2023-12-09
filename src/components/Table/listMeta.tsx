import { RHFM_ListControl } from './Controls/RHFM_ListControl';
import { DBSetDetailCell } from './DBSetDetailCell';
import { Path } from 'react-hook-form-mui';
import { MRT_ColumnDef } from 'material-react-table';
import { IRealmObject } from '../../dal/types';
import { is } from '../../dal/is';
import { toHeader } from './toHeader';


export const listMeta = function <T extends IRealmObject<T>, TListOf, TName extends Path<T>>(
    name: TName,
    labelProperty: (keyof TListOf & string) | undefined,
    objectType: string,
    listObjectType: RealmObjects | RealmPrimitives,
    opts: { header?: string; }
) {
    return {
        header: toHeader(opts, name),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Cell: DBSetDetailCell<Entity<TListOf>, T>(({ payload }) => is.realmType.primitive(listObjectType) ? (payload?.toString() as any) : (payload[labelProperty as keyof Entity<TListOf>] as string)
        ),
        Edit: RHFM_ListControl<T, TName, Entity<TListOf>>({
            name: name,
            objectType: objectType,
            listObjectType: listObjectType,
            header: toHeader(opts, name),
            labelPropertyName: labelProperty,
            listType: 'list',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ItemElement: (props: { data: Entity<TListOf>; }) => (
                <span>{is.realmType.primitive(listObjectType) ? (props.data as any) : (props.data[labelProperty as keyof Entity<TListOf>] as string)}</span>
            )
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as MRT_ColumnDef<T, any>;
};
