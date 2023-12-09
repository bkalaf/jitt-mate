import { RHFM_ListControl } from './Controls/RHFM_ListControl';
import { DBDictionaryDetailCell } from './DBDictionaryDetailCell';
import { Path } from 'react-hook-form-mui';
import { MRT_ColumnDef, MRT_RowData, MRT_TopToolbar } from 'material-react-table';
import { toHeader } from './toHeader';

export function dictionaryMeta<T extends MRT_RowData, TListOf, TName extends keyof T & string, TPropertyName extends keyof TListOf & string>(
    name: TName,
    labelProperty: TPropertyName | React.FunctionComponent<{ payload: TListOf }>,
    objectType: string,
    listObjectType: RealmObjects | RealmPrimitives,
    opts: { header?: string }
) {
    const ItemComponent: React.FunctionComponent<{ payload: TListOf }> =
        typeof labelProperty === 'string' ? ({ payload }: { payload: TListOf }) => <span className='whitespace-pre'>{payload ? (payload[labelProperty as keyof TListOf] as string).toString() : null}</span> : labelProperty;
    return {
        header: toHeader(opts, name),
        Cell: DBDictionaryDetailCell(ItemComponent),       
        Edit: RHFM_ListControl<T, TName & Path<T>, Entity<TListOf>>({
            name: name as any,
            objectType: objectType,
            listObjectType: listObjectType,
            header: toHeader(opts, name),
            listType: 'dictionary',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ItemElement: ItemComponent as any,
            labelPropertyName: typeof labelProperty === 'string' ? labelProperty : undefined
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as MRT_ColumnDef<T, any>;
}
