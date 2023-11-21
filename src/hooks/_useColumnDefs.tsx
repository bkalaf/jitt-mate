import { ColumnDef } from '@tanstack/table-core';
import { useCollectionRoute } from './useCollectionRoute';
import { useMemo } from 'react';
import { SortingState, createColumnHelper } from '@tanstack/react-table';
import { EditRowCell, EditSaveRowCell } from '../components/Table/Cells/EditRowCell';
import Realm from 'realm';
import { ExpandRowCell } from '../components/Table/Cells/ExpandRowCell';
import $$schema from '../dal';
import { useGetRowCanExpand } from '../dal/useGetRowCanExpand';
import { DeleteRowCell } from '../components/Table/Cells/DeleteRowCell';
import { useOptionalCollectionRoute } from './useOptionalCollectionRoute';
import { RowSelectCell } from '../components/Table/Cells/RowSelectCell';
import { is } from '../dal/is';

/** @deprecated */
export function useColumnDefs<T extends EntityBase>(collectionFor?: string) {
    const helper = useMemo(() => createColumnHelper<T>(), []);
    const collectionName = useOptionalCollectionRoute(collectionFor);
    if (collectionName == null) throw new Error('no collectionName');
    const schema = ($$schema as any as EntityConstructor<T>[]).find((x) => x.schema.name === collectionName);
    if (schema == null) throw new Error('no schema');
    const sorting: SortingState = (schema.defaultSort ?? []).map((descr: Realm.SortDescriptor) => ({
        id: is.string(descr) ? descr : descr[0],
        desc: is.string(descr) ? false : descr[1] ?? false
    }));
    const { getRowCanExpand, subComponentTabPanels, visibility } = useGetRowCanExpand(collectionName);
    const columns: ColumnDef<T>[] = useMemo(
        () => [
            helper.display({
                id: 'selectRow',
                header: '',
                maxSize: 15,
                footer: '',
                cell: RowSelectCell
            }),
            ...(getRowCanExpand()
                ? [
                      helper.display({
                          id: 'expandRow',
                          cell: ExpandRowCell,
                          header: '',
                          maxSize: 15,
                          footer: ''
                      })
                  ]
                : []),
            helper.display({
                id: 'editRow',
                cell: EditSaveRowCell,
                header: '',
                maxSize: 15,
                footer: ''
            }),
            helper.display({
                id: 'deleteRow',
                cell: DeleteRowCell,
                header: '',
                maxSize: 15,
                footer: ''
            }),
            ...((schema?.columns as any)() ?? [])
        ],
        [getRowCanExpand, helper, schema?.columns]
    );
    console.log(`COLUMNS`, columns);
    return {
        columns,
        getRowCanExpand,
        subComponentTabPanels,
        visibility: {},
        schema,
        sorting
    };
}
