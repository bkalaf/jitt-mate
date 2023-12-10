import { DBDictionaryDetailCell } from './DBDictionaryDetailCell';
import { Path } from 'react-hook-form-mui';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { toHeader } from './toHeader';
import { JITTMultiControl } from './Controls/JITTDataStructureControl';
import { getProperty } from '../Contexts/getProperty';

export function dictionaryMeta<T extends MRT_RowData, TListOf, TName extends Path<T>, TPropertyName extends Path<TListOf> | undefined>(
    name: TName,
    labelProperty: TPropertyName | React.FunctionComponent<{ data: TListOf }>,
    objectType: RealmObjects,
    ofObjectType: RealmObjects | RealmPrimitives,
    opts: { header?: string }
) {
    const ItemComponent: React.FunctionComponent<{ data: TListOf }> =
        typeof labelProperty === 'string'
            ? ({ data }: { data: TListOf }) => <span className='whitespace-pre'>{data ? (getProperty(labelProperty)(data) as string).toString() : null}</span>
            : typeof labelProperty === 'function'
            ? labelProperty as any
            : () => null;
    return {
        header: toHeader(opts, name),
        Cell: DBDictionaryDetailCell(ItemComponent),
        Edit: JITTMultiControl<T, TName, TListOf, TPropertyName>({
            name,
            listType: 'dictionary',
            objectType,
            ofObjectType,
            header: toHeader(opts, name),
            labelPropertyName: labelProperty != null && typeof labelProperty === 'string' ? labelProperty : undefined,
            ItemElement: ItemComponent
        })
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
    } as MRT_ColumnDef<T, any>;
}
