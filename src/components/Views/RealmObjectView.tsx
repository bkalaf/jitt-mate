import {
    getCoreRowModel,
    getExpandedRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getGroupedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import { useCollectionRoute } from '../../hooks/useCollectionRoute';
import { useCallback, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useColumnDefs } from '../../hooks/useColumnDefs';
import { CollectionViewProvider } from '../Providers/CollectionViewProvider';
import { DefaultTableBodyCell } from '../Table/Cells/DefaultTableBodyCell';
import { ReactTable } from '../Table/ReactTable';
import { DefaultTableFooterCell } from '../Table/Cells/DefaultTableFooterCell';
import { DefaultTableHeaderCell } from '../Table/Cells/DefaultTableHeaderCell';
import { createPortal } from 'react-dom';
import { PaginationFooter } from '../Table/PaginationFooter';
import { compR } from '../../common/functions/composeR';
import { useLoadInsertForm } from '../../hooks/useLoadInsertForm';
import { DeleteSelectionButton } from './commands/DeleteSelectionButton';
import { InsertRecordButton } from './commands/InsertRecordButton';
import { useFetchAll } from '../useFetchData';
import { getRowIdFromOID } from '../../schema/getRowId';
import { createSubComponent } from '../../dal/createSubComponent';
import { fuzzyFilter } from '../Table/fuzzy';
import { ClearSelectionButton } from './commands/ClearSelectionButton';
import { RunUpdateButton } from './commands/RunUpdateButton';
import { ToggleFilteringButton } from './commands/ToggleFilteringButton';

export function RealmObjectView<T extends EntityBase>() {
    const collectionName = useCollectionRoute();
    const { columns, getRowCanExpand, schema, subComponentTabPanels, visibility: columnVisibility, sorting } = useColumnDefs<T>(collectionName);
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
        getExpandedRowModel: getExpandedRowModel(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getGroupedRowModel: getGroupedRowModel(),
        enableMultiSort: true,
        enableColumnFilters: true,
        debugAll: true,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        globalFilterFn: fuzzyFilter,
        getRowId,
        getRowCanExpand,        
        meta: {
            collectionName: collectionName,
            scope: 'top-level',
            schema: schema.schema
        },
        initialState: {
            columnVisibility,
            sorting,
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

    const onInsert = useLoadInsertForm(collectionName, table as any, getRowId);
    const [children, setChildren] = useState<JSX.Element | null>(null);
    return (
        <CollectionViewProvider param={collectionName}>
            <div className='flex flex-col'>
                <div className='flex items-center justify-start w-full space-x-3'>
                    <InsertRecordButton table={table} onInsert={onInsert} />
                    <DeleteSelectionButton table={table} />
                    <ClearSelectionButton table={table} />
                    <RunUpdateButton table={table} />
                    <ToggleFilteringButton table={table} />
                    {children}
                </div>
                <ReactTable getId={getRowId} table={table} SubComponent={SubComponent} setChildren={setChildren} />
                {portal.current}
            </div>
        </CollectionViewProvider>
    );
}
