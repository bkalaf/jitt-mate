import { ColumnDef, Row, filterFns, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useCollectionRoute } from '../../hooks/useCollectionRoute';
import { useCallback, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { CollectionViewProvider } from '../Providers/CollectionViewProvider';
import { DefaultTableBodyCell } from '../Table/Cells/DefaultTableBodyCell';
import { ReactTable } from '../Table/ReactTable';
import { DefaultTableFooterCell } from '../Table/Cells/DefaultTableFooterCell';
import { DefaultTableHeaderCell } from '../Table/Cells/DefaultTableHeaderCell';
import { createPortal } from 'react-dom';
import { PaginationFooter } from '../Table/PaginationFooter';
import { compR } from '../../common/functions/composeR';
import { getRowIdFromOID } from '../../schema/getRowId';
import { useLog } from '../Contexts/useLogger';
import { createSubComponent } from '../../dal/createSubComponent';
import { is } from '../../dal/is';
import { useNestedColumnDefs } from '../../hooks/useNestedColumnDefs';
import { useOverlayContext } from '../Contexts/useOverlayContext';
import { useFetchAll } from '../../hooks/useFetchData';
import { faBoltLightning } from '@fortawesome/pro-solid-svg-icons';
import { Button } from '../Buttons/Button';
import { useLocalRealm } from '../../routes/loaders/useLocalRealm';
import { fromOID } from '../../dal/fromOID';
import { checkTransaction } from '../../util/checkTransaction';
import { useColumnDefs } from '../../hooks/useColumnDefs';
import { fuzzyFilter } from '../Table/fuzzy';
import { toOID } from '../../dal/toOID';
import { useInvalidator } from '../../hooks/useInvalidator';


export function RelationshipView<T extends EntityBase, TValue>({ original, listType, property, listOf, masterCollection, masterRow }: { listType: string; listOf: string; property: string; original: RealmCollections<T>; masterCollection: string; masterRow: Row<T> }) {
    const { popFrame } = useOverlayContext();
    const log = useLog('view');
    log(`COLLECTION PROPERTY VIEW for ${property ?? ''}`);
    log(`COLLECTION TYPE: `.concat(listOf ?? ''));
    log(`LIST TYPE: `.concat(listType ?? ''));
    const { columns, getRowCanExpand, schema, subComponentTabPanels, visibility: columnVisibility } = useColumnDefs<T>(listOf ?? '');

    const data = useFetchAll<T>(listOf);
    const getRowId = getRowIdFromOID;
    const table = useReactTable<T>({
        data,
        columns: columns as ColumnDef<T, any>[],
        defaultColumn: {
            cell: DefaultTableBodyCell<T>,
            footer: DefaultTableFooterCell<T>,
            header: DefaultTableHeaderCell<T>
        },
        filterFns: {
            fuzzy: fuzzyFilter
        },
        globalFilterFn: filterFns.includesString,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugAll: true,
        getRowId,
        getRowCanExpand,
        meta: {
            collectionName: listOf,
            scope: is.realmType.primitive(listOf ?? '') ? 'list' : 'links',
            schema: schema.schema,
            objectType: [listType, listOf] as any
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
    }, [listOf, table]);

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
                    page={page} />,
                el
            );
        }
    }, [canNotGoBackward, canNotGoForward, firstPage, lastPage, maxPage, maxPageIndex, nextPage, onSizeChange, page, pageIndex, pageSize, previousPage, setPage, table]);
    const db = useLocalRealm();
    const invalidate = useInvalidator(masterCollection)
    const onClick = useCallback(() => {
        const func = () => {
            switch (listType) {
                case 'list': {
                    const selected = Object.entries(table.getState().rowSelection).filter(x => x[1]).map(x => x[0]);
                    const objs = selected.map(x => db.objectForPrimaryKey<EntityBase>(listOf, toOID(x)!)) as any as RealmObj<T>[];
                    const list = original as DBList<T>;
                    list.push(...objs);
                    break;
                }
                case 'dictionary': {
                    const selected = Object.entries(table.getState().rowSelection).filter(x => x[1]).map(x => x[0]);
                    const objs = selected.map(x => [x[0], db.objectForPrimaryKey<T>(listOf, toOID(x[1])! as T[keyof T] )] as [string, RealmObj<T & EntityBase>]);
                    const list = original as DBDictionary<T>;
                    objs.forEach(([k, v]) => list.set({ [k]: v }));
                    break;
                }
                case 'set': {
                    const selected = Object.entries(table.getState().rowSelection)
                        .filter((x) => x[1])
                        .map((x) => x[0]);
                    const objs = selected.map((x) => db.objectForPrimaryKey<EntityBase>(listOf, toOID(x)!)) as any as RealmObj<T>[];
                    const list = original as DBSet<T>;
                    objs.forEach(x => list.add(x));
                    break;
                }
                default:
                    break;
            }
        };
        checkTransaction(db)(func);
        masterRow.toggleExpanded();
        invalidate.onSuccess();
        popFrame();
    }, [db, invalidate, listOf, listType, masterRow, original, popFrame, table]);
    // const onInsert = useLoadInsertForm(collectionName, table);
    const style = useMemo((): React.CSSProperties => ({ maxHeight: window.innerHeight }), []);
    const [children, setChildren] = useState<JSX.Element | null>(null);

    return (
        <CollectionViewProvider param={listOf}>
            <div className='flex flex-col overflow-auto' style={style}>
                <div className='sticky top-0 flex items-center justify-start w-full space-x-3'>
                    <Button icon={faBoltLightning} onClick={onClick} />
                    {children}
                </div>
                <ReactTable setChildren={setChildren} getId={getRowId} table={table} SubComponent={SubComponent} />
                {portal.current}
            </div>
        </CollectionViewProvider>
    );
}
