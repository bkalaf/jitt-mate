import { DBSetDetailCell } from '../DBSetDetailCell';
import { Path } from 'react-hook-form-mui';
import { MRT_ColumnDef } from 'material-react-table';
import { IRealmObject } from '../../../dal/types';
import { toHeader } from '../toHeader';
import { JITTMultiControl } from '../Controls/JITTDataStructureControl';
import { getProperty } from '../../Contexts/getProperty';

export const listDefinition = function <T extends IRealmObject<T>, TListOf, TName extends Path<T>>(
    name: TName,
    opts: { header?: string; labelProperty: (Path<TListOf> & string) | React.FunctionComponent<{ data: TListOf }>; objectType: RealmObjects; ofObjectType: RealmObjects | RealmPrimitives },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    const ItemComponent: React.FunctionComponent<{ data: TListOf }> =
        typeof opts.labelProperty === 'string'
            ? ({ data }: { data: TListOf }) => <span className='whitespace-pre'>{data ? (getProperty(opts.labelProperty as string)(data) as string) : null}</span>
            : typeof opts.labelProperty === 'function'
            ? opts.labelProperty
            : () => null;
    return {
        accessorKey: name,
        header: toHeader(opts, name),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Cell: DBSetDetailCell<Entity<TListOf>, T>(ItemComponent as any),
        Edit: JITTMultiControl<T, TListOf, TName & Path<TListOf>>(
            {
                listType: 'list',
                objectType: opts.objectType,
                ofObjectType: opts.ofObjectType,
                labelPropertyName: opts.labelProperty != null && typeof opts.labelProperty === 'string' ? opts.labelProperty as any: undefined,
                ItemElement: ItemComponent
            },
            initialDisable,
            ...dependencies
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as MRT_ColumnDef<T, any>;
};
