import { ColumnDef } from '@tanstack/table-core';
import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DeleteRowCell, EditRowCell } from '../components/Table/Cells/EditRowCell';
import Realm from 'realm';
import { ExpandRowCell, RowSelectCell } from '../components/Table/Cells/ExpandRowCell';
import { toProperFromCamel } from '../common/text/toProperCase';
import $$schema from '../dal';
import { useGetRowCanExpand } from '../dal/useGetRowCanExpand';


export function useNestedColumnDefs<T extends EntityBase>(collectionFor: string) {
    const helper = useMemo(() => createColumnHelper<T>(), []);
    const schema = ($$schema as any as { schema: Realm.ObjectSchema; columns: ColumnDef<T, any>[]; }[]).find((x) => x.schema.name === collectionFor);
    if (schema == null) throw new Error('no schema');
    const { getRowCanExpand, subComponentTabPanels, visibility } = useGetRowCanExpand(collectionFor);
    const columns: ColumnDef<T>[] = useMemo(
        () => [
            helper.display({
                id: 'selectRow',
                header: 'Select',
                maxSize: 30,
                cell: RowSelectCell
            }),
            ...(getRowCanExpand()
                ? [
                    helper.display({
                        id: 'expandRow',
                        cell: ExpandRowCell,
                        header: 'Expand',
                        maxSize: 30
                    })
                ]
                : []),
            helper.display({
                id: 'editRow',
                cell: EditRowCell,
                header: 'Edit',
                maxSize: 30
            }),
            helper.display({
                id: 'deleteRow',
                cell: DeleteRowCell,
                header: 'Delete',
                maxSize: 30
            }),
            ...(schema?.columns ?? [])
        ],
        [getRowCanExpand, helper, schema?.columns]
    );
    const keyedColumns = useMemo(
        () => [{ accessorKey: '0', meta: { datatype: 'string', required: true }, header: 'Key/Index' } as ColumnDef<any, any>].concat(
            ...(columns.map((x) => ({
                ...x,
                ...((x as any).accessorKey != null ? { header: toProperFromCamel((x as any).accessorKey), accessorKey: ['1', (x as any).accessorKey].join('.') } : {})
            })) as ColumnDef<any, any>[])
        ),
        [columns]
    );
    return {
        columns: keyedColumns,
        getRowCanExpand,
        subComponentTabPanels,
        visibility,
        schema
    };
}
