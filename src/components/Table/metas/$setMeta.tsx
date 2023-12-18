import { DBSetDetailCell } from '../DBSetDetailCell';
import { Path } from 'react-hook-form-mui';
import { MRT_ColumnDef } from 'material-react-table';
import { IRealmObject } from '../../../dal/types';
import { toHeader } from '../toHeader';
import { JITTMultiControl } from '../Controls/JITTDataStructureControl';
import { getProperty } from '../../Contexts/getProperty';

export function setDefinition<T extends IRealmObject<T>, TListOf, TName extends Path<T>>(
    name: TName,
    objectType: RealmObjects,
    ofObjectType: RealmObjects | RealmPrimitives,
    labelProperty: Path<TListOf> | React.FunctionComponent<{ data: Entity<TListOf> }>,
    opts: { header?: string },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    const ItemComponent: React.FunctionComponent<{ data: Entity<TListOf> }> =
        typeof labelProperty === 'string'
            ? ({ data }: { data: Entity<TListOf> }) => <span className='whitespace-pre'>{data ? (getProperty(labelProperty)(data) as string).toString() : null}</span>
            : typeof labelProperty === 'function'
            ? labelProperty
            : () => null;
    const header = toHeader(opts, name);
    return {
        accessorKey: name,
        header,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Cell: DBSetDetailCell<Entity<TListOf>, T>(ItemComponent),
        Edit: JITTMultiControl<T, TName, TListOf, Path<TListOf> | undefined>(
            {
                listType: 'set',
                objectType,
                ofObjectType,
                labelPropertyName: labelProperty != null && typeof labelProperty === 'string' ? labelProperty : undefined,
                ItemElement: labelProperty != null && typeof labelProperty === 'function' ? (labelProperty as any) : undefined
            },
            initialDisable,
            ...dependencies
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as MRT_ColumnDef<T, any>;
}
