import { ColumnDef } from '@tanstack/table-core';
import { useCollectionRoute } from '../hooks/useCollectionRoute';
import { useMemo } from 'react';
import $$schema from '../dto';
import { CellContext, ColumnHelper } from '@tanstack/react-table';
import { EditRowCell } from './Table/Cells/EditRowCell';
import Realm from 'realm';
import { ExpandRowCell } from './Table/Cells/ExpandRowCell';
import { useGetRowCanExpand } from '../dto/useGetRowCanExpand';

export function useColumnDefs<T extends EntityBase>(helper: ColumnHelper<T>) {
    const collectionName = useCollectionRoute();
    const cols = useMemo(() => ($$schema as any as { schema: Realm.ObjectSchema; columns: ColumnDef<T, any>[] }[]).find((x) => x.schema.name === collectionName)?.columns ?? [], [collectionName]);
    const { getRowCanExpand } = useGetRowCanExpand(collectionName);
    return useMemo(
        () => [
            ...(getRowCanExpand()
                ? [
                      helper.display({
                          id: 'expandRow',
                          cell: ExpandRowCell,
                          header: 'Expand'
                      })
                  ]
                : []),
            helper.display({
                id: 'editRow',
                cell: EditRowCell,
                header: 'Edit'
            }),
            ...cols
        ],
        [cols, helper]
    );
}
