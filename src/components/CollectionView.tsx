import {
    HeaderContext,
    Renderable,
    Table,
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import { useCollectionRoute } from '../hooks/useCollectionRoute';
import { useEffect, useMemo, useRef } from 'react';
import { usePagination } from './usePagination';
import { BSON } from 'realm';
import { useColumnDefs } from './useColumnDefs';
import { useDefaults } from './useDefaults';
import { useGetRowId } from '../schema/useGetRowId';
import { CollectionViewProvider } from './CollectionViewContext';
import { DefaultTableCell } from './Table/Cells/DefaultTableCell';
import { useQuery } from '@tanstack/react-query';
import { useRealmContext } from '../hooks/useRealmContext';
import { toProperFromCamel } from '../common/text/toProperCase';
import { useRenderSubComponent } from '../dto/useRenderSubComponent';
import { PaginationFooter } from './Table/PaginationFooter';
import { ReactTable } from './Table/ReactTable';

export function TableHead({ def, ctxt, table }: { def: Renderable<HeaderContext<any, unknown>>; ctxt: HeaderContext<any, unknown>; table: Table<any> }): JSX.Element {
    return <></>;
}

export type PaginationButtonProps = [() => boolean, () => void];

export function DefaultFooter<T extends { _id: BSON.ObjectId }>(p: HeaderContext<T, any>): JSX.Element {
    return <>{p.column.id}</>;
}
export function DefaultHeader<T extends { _id: BSON.ObjectId }>(p: HeaderContext<T, any>): JSX.Element {
    return <>{toProperFromCamel(p.column.id)}</>;
}
export function CollectionView<T extends { _id: BSON.ObjectId }>() {
    // const loaderData = useRouteLoaderData('collectionRoute') as any[];
    // const { data, pagination, pageCount, gotoFirstPage, gotoLastPage, gotoPreviousPage, gotoNextPage, initialState, setSpecificPage, setSpecificPageSize, setData } = usePagination<T>(0, 250);
    const columns = useColumnDefs<T>(createColumnHelper<T>());
    const handleResults = useDefaults<T>();
    const { db } = useRealmContext();
    const collectionName = useCollectionRoute();
    if (db == null) throw new Error('no db');
    const { data } = useQuery({ queryKey: [collectionName], queryFn: () => Promise.resolve(handleResults(db.objects<T>(collectionName ?? ''))) });
    const view = useMemo(() => (data == null ? [] : Array.from(data ?? [])), [data]);
    const getRowId = useGetRowId<T>();
    const { getRowCanExpand, visibility: columnVisibility } = useRenderSubComponent();
    const table = useReactTable<T>({
        data: view,
        columns,
        defaultColumn: {
            cell: DefaultTableCell,
            footer: DefaultFooter,
            header: DefaultHeader
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugAll: true,
        getRowId: getRowId,
        getRowCanExpand: getRowCanExpand,
        initialState: {
            columnVisibility, 
            pagination: {
                pageIndex: 0,
                pageSize: 25
            }
        }
        // initialState: {
        //     pagination: {
        //         pageIndex: 0,
        //         pageSize: 250
        //     }
        // }
    });    
    const memoized = useRef(collectionName);
    useEffect(() => {
        if (collectionName !== memoized.current) {
            table.resetPageIndex();
            table.resetPageSize();
        }
        memoized.current = collectionName;
    }, [collectionName, table])
    return (
        <CollectionViewProvider>
            <section className='flex flex-col w-full h-full'>
                <ReactTable table={table} />
                <PaginationFooter table={table} />
            </section>
        </CollectionViewProvider>
    );
}

