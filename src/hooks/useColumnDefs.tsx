import { ColumnDef } from '@tanstack/table-core';
import { useCollectionRoute } from './useCollectionRoute';
import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DeleteRowCell, EditRowCell } from '../components/Table/Cells/EditRowCell';
import Realm from 'realm';
import { ExpandRowCell, RowSelectCell } from '../components/Table/Cells/ExpandRowCell';
import $$schema from '../dal';
import { useGetRowCanExpand } from '../dal/useGetRowCanExpand';

export function useColumnDefs<T extends EntityBase>(collectionFor: string) {
    const helper = useMemo(() => createColumnHelper<T>(), []);
    const collectionName = useCollectionRoute();
    const schema = ($$schema as any as { schema: Realm.ObjectSchema; columns: ColumnDef<T, any>[] }[]).find((x) => x.schema.name === collectionName)
    if (schema == null) throw new Error('no schema');
    const { getRowCanExpand, subComponentTabPanels, visibility } = useGetRowCanExpand(collectionName);
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
            ...schema?.columns ?? []
        ],
        [getRowCanExpand, helper, schema?.columns]
    );
    return { 
        columns,
        getRowCanExpand,
        subComponentTabPanels,
        visibility,
        schema
    }
}
