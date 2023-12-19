import { DBDictionaryDetailCell } from '../DBDictionaryDetailCell';
import { Path } from 'react-hook-form-mui';
import { MRT_RowData } from 'material-react-table';
import { toHeader } from '../toHeader';
import { JITTMultiControl } from '../Controls/JITTDataStructureControl';
import { getProperty } from '../../Contexts/getProperty';

export function dictionaryDefinition<T extends MRT_RowData, TListOf, TName extends Path<T>, TPropertyName extends (Path<TListOf> & string) | undefined>(
    name: TName,
    opts: { header?: string; labelProperty: TPropertyName | React.FunctionComponent<{ data: TListOf }>; objectType: RealmObjects; ofObjectType: RealmObjects | RealmPrimitives },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    const ItemComponent: React.FunctionComponent<{ data: TListOf }> =
        typeof opts.labelProperty === 'string'
            ? ({ data }: { data: TListOf }) => <span className='whitespace-pre'>{data ? (getProperty(opts.labelProperty as any)(data) as string).toString() : null}</span>
            : typeof opts.labelProperty === 'function'
            ? (opts.labelProperty as any)
            : () => null;
    return {
        accessorKey: name,
        header: toHeader(opts, name),
        Cell: DBDictionaryDetailCell(ItemComponent),
        Edit: JITTMultiControl<T, TListOf, TPropertyName>(
            {
                listType: 'dictionary',
                objectType: opts.objectType,
                ofObjectType: opts.ofObjectType,
                labelPropertyName: opts.labelProperty != null && typeof opts.labelProperty === 'string' ? opts.labelProperty : undefined,
                ItemElement: ItemComponent
            },
            initialDisable,
            ...dependencies
        )
        // Edit: RHFM_ListControl<T, TName & Path<T>, Entity<TListOf>>({
        //     name: name as any,
        //     objectType: objectType,
        //     listObjectType: listObjectType,
        //     header: toHeader(opts, name),
        //     listType: 'dictionary',
        //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     ItemElement: typeof labelProperty === 'function' ? labelProperty as any : undefined,
        //     labelPropertyName: typeof labelProperty === 'string' ? labelProperty as any : undefined
        // })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as DefinedMRTColumn<T>
}
