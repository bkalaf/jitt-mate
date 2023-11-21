import { ColumnDef, Row, Table, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useCollectionRoute } from '../../hooks/useCollectionRoute';
import { useCallback, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { CollectionViewProvider } from '../Providers/CollectionViewProvider';
import { DefaultTableBodyCell } from '../Table/Cells/DefaultTableBodyCell';
import { ReactTable } from '../Table/_ReactTable';
import { DefaultTableFooterCell } from '../Table/Cells/DefaultTableFooterCell';
import { DefaultTableHeaderCell } from '../Table/Cells/DefaultTableHeaderCell';
import { createPortal } from 'react-dom';
import { PaginationFooter } from '../Table/PaginationFooter';
import { compR } from '../../common/functions/composeR';
import { getRowIdFromIndex } from '../../schema/getRowId';
import { collectionToArray } from '../CollectionView';
import { useLog } from '../Contexts/useLogger';
import { createSubComponent } from '../Table/creators/createSubComponent';
import { is } from '../../dal/is';
import { useNestedColumnDefs } from '../../hooks/useNestedColumnDefs';
import { fuzzyFilter } from '../Table/fuzzy';
import { normalizeSchemaProperty } from '../../dal/normalizeSchemaProperty';
import { useCtor } from '../../routes/loaders/useCtor';

/** @deprecated */
export function CollectionPropertyView<T extends EntityBase, TValue>({ parentTable, row, propertyName }: { row: Row<T>; parentTable: Table<T>; propertyName: keyof T & string }) {
    const Ctor = useCtor(objectType);
    const { objectType: $collType, type: $listType } = normalizeSchemaProperty(parentTable.options.meta?.schema.properties[propertyName] ?? '');
    const log = useLog('view');
    log(`COLLECTION PROPERTY VIEW for ${propertyName ?? ''}`);
    log(`COLLECTION TYPE: `.concat($collType ?? ''));
    log(`LIST TYPE: `.concat($listType ?? ''));
    const collectionName = useCollectionRoute();
    const { columns, getRowCanExpand, schema, subComponentTabPanels, visibility: columnVisibility } = useNestedColumnDefs<T>($collType ?? '');

    const data = useMemo(() => collectionToArray(row.original[propertyName] as DBList<TValue> | DBDictionary<TValue> | DBSet<TValue>), [propertyName, row]);
    const getRowId = getRowIdFromIndex;
    const table = useReactTable<[string, TValue]>({
        data,
        columns: columns as ColumnDef<[string, TValue], any>[],
        defaultColumn: {
            cell: DefaultTableBodyCell<[string, TValue]>,
            footer: DefaultTableFooterCell<[string, TValue]>,
            header: DefaultTableHeaderCell<[string, TValue]>
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugAll: true,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        globalFilterFn: fuzzyFilter,
        getRowId,
        getRowCanExpand,
        meta: {
            collectionName: collectionName,
            scope: is.realmType.primitive($collType ?? '') ? 'list' : 'links',
            schema: schema.schema,
            objectType: [$listType, $collType] as any
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
    const [children, setChildren] = useState<JSX.Element | null>(null);

    // const onInsert = useLoadInsertForm(collectionName, table);
    return (
        <CollectionViewProvider param={collectionName}>
            <div className='flex flex-col'>
                <div className='flex items-center justify-start w-full space-x-3'>
                    
                    {/* <InsertRecordButton table={table} onInsert={onInsert} />
            <DeleteSelectionButton table={table} /> */}
                </div>
                <ReactTable setChildren={setChildren} getId={getRowId as any} table={table as any} SubComponent={SubComponent} />
                {portal.current}
            </div>
        </CollectionViewProvider>
    );
}
