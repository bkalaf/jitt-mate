import { Table, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useCollectionRoute } from '../hooks/useCollectionRoute';
import { useCallback, useLayoutEffect, useMemo, useReducer, useRef } from 'react';
import { useColumnDefs } from '../hooks/useColumnDefs';
import { CollectionViewProvider } from './Providers/CollectionViewProvider';
import { DefaultTableBodyCell } from './Table/Cells/DefaultTableBodyCell';
import { ReactTable } from './Table/ReactTable';
import { DefaultTableFooterCell } from './Table/Cells/DefaultTableFooterCell';
import { DefaultTableHeaderCell } from './Table/Cells/DefaultTableHeaderCell';
import { createPortal } from 'react-dom';
import { PaginationFooter } from './Table/PaginationFooter';
import { compR } from '../common/functions/composeR';
import { useLoadInsertForm } from './Table/Cells/useLoadInsertForm';
import { DeleteSelectionButton } from './DeleteSelectionButton';
import { InsertRecordButton } from './InsertRecordButton';
import { useFetchAll } from './useFetchData';
import { getRowIdFromOID } from '../schema/getRowId';
import { createSubComponent } from '../dal/createSubComponent';
import { is } from '../dal/is';

export type PaginationButtonProps = [() => boolean, () => void];

export function addIndex<T>(arr: T[]) {
    return arr.map((x, ix) => [ix, x] as [number, T]);
}
export function collectionToArray<TValue>(coll: DBList<TValue> | DBDictionary<TValue> | DBSet<TValue>) {
    if (is.dbDictionary(coll)) return Object.entries(coll);
    if (is.dbList(coll)) return addIndex<TValue>(Array.from(coll.values())).map(([k, v]) => [k.toFixed(0), v] as [string, TValue]);
    if (is.dbSet(coll)) return addIndex<TValue>(Array.from(coll.values())).map(([k, v]) => [k.toFixed(0), v] as [string, TValue]);
    return [];
}
export function RealmObjectView<T extends EntityBase>() {
    const collectionName = useCollectionRoute();
    const { columns, getRowCanExpand, schema, subComponentTabPanels, visibility: columnVisibility } = useColumnDefs<T>(collectionName);
    const data = useFetchAll<T>(collectionName);
    const getRowId = getRowIdFromOID;
    const table = useReactTable<T>({
        data,
        columns,
        defaultColumn: {
            cell: DefaultTableBodyCell,
            footer: DefaultTableFooterCell,
            header: DefaultTableHeaderCell
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugAll: true,
        getRowId,
        getRowCanExpand,
        meta: {
            collectionName: collectionName,
            scope: 'top-level',
            schema: schema.schema
        },
        initialState: {
            columnVisibility,
            pagination: {
                pageIndex: 0,
                pageSize: 25
            }
        }
    });
    useLayoutEffect(() => {
        table.resetPageIndex();
        table.resetPageSize();
    }, [collectionName, table]);

    const rerender = useReducer(() => ({}), {})[1];
    const delayedRerender = useCallback(() => {
        setTimeout(rerender, 400);
    }, [rerender]);
    const portal = useRef<React.ReactPortal | null>(null);
    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const maxPage = table.getPageCount();
    const page = pageIndex + 1;
    const maxPageIndex = maxPage - 1;
    const previousPage = compR<void, void>(table.previousPage)(delayedRerender);
    const nextPage = compR<void, void>(table.nextPage)(delayedRerender);
    const canNotGoForward = !table.getCanNextPage();
    const canNotGoBackward = !table.getCanPreviousPage();
    const onSizeChange = useCallback(
        (ev: React.ChangeEvent<HTMLSelectElement>) => {
            table.setPageSize(parseInt(ev.target.selectedOptions[0].value, 10));
            delayedRerender();
        },
        [delayedRerender, table]
    );
    const setPage = compR(table.setPageIndex)(delayedRerender);
    const firstPage = useCallback(() => compR(table.setPageIndex)(delayedRerender)(0), [delayedRerender, table.setPageIndex]);
    const lastPage = useCallback(() => compR(table.setPageIndex)(delayedRerender)(table.getPageCount() - 1), [delayedRerender, table]);
    const SubComponent = useMemo(() => createSubComponent(subComponentTabPanels), [subComponentTabPanels]);
    useLayoutEffect(() => {
        const el = document.getElementById('pagination-root');
        if (el != null) {
            portal.current = createPortal(
                <PaginationFooter
                    setPage={setPage}
                    firstPage={firstPage}
                    lastPage={lastPage}
                    onSizeChange={onSizeChange}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    maxPage={maxPage}
                    maxPageIndex={maxPageIndex}
                    canNotGoBackward={canNotGoBackward}
                    canNotGoForward={canNotGoForward}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    page={page}
                />,
                el
            );
        }
    }, [canNotGoBackward, canNotGoForward, firstPage, lastPage, maxPage, maxPageIndex, nextPage, onSizeChange, page, pageIndex, pageSize, previousPage, setPage, table]);

    const onInsert = useLoadInsertForm(collectionName, table, getRowId);
    return (
        <CollectionViewProvider param={collectionName}>
            <div className='flex items-center justify-start w-full space-x-3'>
                <InsertRecordButton table={table} onInsert={onInsert} />
                <DeleteSelectionButton table={table} />
            </div>
            <ReactTable getId={getRowId} table={table} SubComponent={SubComponent} />
            {portal.current}
        </CollectionViewProvider>
    );
}
