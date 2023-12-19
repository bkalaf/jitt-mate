import { MRT_ColumnFiltersState, MRT_ColumnSizingState, MRT_DensityState, MRT_SortingState, MRT_VisibilityState } from 'material-react-table';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocalForageContext } from './useLocalForageContext';
import { useParams } from 'react-router-dom';
import { PaginationState } from '@tanstack/react-table';
import { useLoggingState } from './useLoggingState';

const arrayCompare = function <T>(a?: T[], b?: T[]) {
    if (a?.length !== b?.length) return false;
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    return a.every((a2) => {
        if (typeof a2 === 'object') {
            return b.some((b2) => (typeof b2 === 'object' ? objectCompare(a2 as AnyObject, b2 as AnyObject) : false));
        }
        return b.includes(a2);
    });
};
const objectCompare = function <T extends AnyObject>(a?: T, b?: T) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    const akeys = Object.getOwnPropertyNames(a);
    const bkeys = Object.getOwnPropertyNames(b);
    const keysOk = akeys.length === bkeys.length && akeys.every((a2) => bkeys.includes(a2));
    return keysOk ? akeys.every((a2) => a[a2] === b[a2]) : false;
};
const stringCompare = function (a?: string, b?: string) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    return a.localeCompare(b) === 0;
};
const boolCompare = function (a?: boolean, b?: boolean) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    return a === b;
};
const numberCompare = function (a?: number, b?: number) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    return a === b;
};

export function usePersistedState(collectionOverride?: string) {
    const loadedCollections = useRef<string[]>([]);
    const [columnFilters, setColumnFilters] = useLoggingState<MRT_ColumnFiltersState>([], 'columnFilters', arrayCompare);
    const [columnVisibility, setColumnVisibility] = useLoggingState<MRT_VisibilityState>({}, 'columnVisibility', objectCompare);
    const [density, setDensity] = useLoggingState<MRT_DensityState>('compact', 'density', stringCompare);
    const [globalFilter, setGlobalFilter] = useLoggingState<string | undefined>(() => undefined, 'globalFilter', stringCompare);
    const [showGlobalFilter, setShowGlobalFilter] = useLoggingState<boolean>(false, 'showGlobalFilter', boolCompare);
    const [showColumnFilters, setShowColumnFilters] = useLoggingState<boolean>(false, 'showColumnFilter', boolCompare);
    const [sorting, setSorting] = useLoggingState<MRT_SortingState>([], 'sorting', arrayCompare);
    const [columnSizing, setColumnSizing] = useLoggingState<MRT_ColumnSizingState>({}, 'columnSizing', objectCompare);
    const [pageSize, setPageSize] = useLoggingState<number>(15, 'pageSize', numberCompare);
    const [pageIndex, setPageIndex] = useLoggingState<number>(0, 'pageIndex', numberCompare);

    const setPagination = useCallback(
        (pagination: PaginationState | ((x: PaginationState) => PaginationState)) => {
            setPageIndex((prevPageIndex) => {
                let result = 0;
                setPageSize((prevPageSize) => {
                    const { pageIndex: nextPageIndex, pageSize: nextPageSize } =
                        typeof pagination !== 'function' ? pagination : pagination({ pageIndex: prevPageIndex ?? 0, pageSize: prevPageSize ?? 15 });
                    result = nextPageIndex;
                    return nextPageSize;
                });
                return result;
            });
        },
        [setPageIndex, setPageSize]
    );
    const route = useParams<{ collection: string }>().collection;
    const collection = collectionOverride ?? route ?? 'n/a';
    const keys = useMemo(
        () => ({
            columnFilters: ['mrt_column_filters', collection].reverse().join('_'),
            columnVisibility: ['mrt_column_visibility', collection].reverse().join('_'),
            density: ['mrt_density_state', collection].reverse().join('_'),
            sorting: ['mrt_column_sorting', collection].reverse().join('_'),
            globalFilter: ['mrt_global_filter', collection].reverse().join('_'),
            showGlobalFiler: ['mrt_show_global_filter', collection].reverse().join('_'),
            showColumnFilters: ['mrt_show_column_filters', collection].reverse().join('_'),
            columnSizing: ['mrt_column_sizing', collection].reverse().join('_'),
            pageSize: ['mrt_page_size', collection].reverse().join('_')
        }),
        [collection]
    );

    const isFirstRender = useCallback(() => !loadedCollections.current.includes(collection), [collection]);
    const { forager } = useLocalForageContext();
    useEffect(() => {
        async function getter() {
            const columnFilters = await forager.getItem<MRT_ColumnFiltersState>(keys.columnFilters);
            const columnVisibility = await forager.getItem<MRT_VisibilityState>(keys.columnVisibility);
            const density = await forager.getItem<MRT_DensityState>(keys.density);
            const globalFilter = await forager.getItem<string | undefined>(keys.globalFilter);
            const showGlobalFilter = await forager.getItem<boolean>(keys.showGlobalFiler);
            const showColumnFilters = await forager.getItem<boolean>(keys.showColumnFilters);
            const sorting = await forager.getItem<MRT_SortingState>(keys.sorting);
            const columnSizing = await forager.getItem<MRT_ColumnSizingState>(keys.columnSizing);
            const pageSize = await forager.getItem<number>(keys.pageSize);
            if (columnFilters) setColumnFilters(columnFilters);
            if (columnVisibility) setColumnVisibility(columnVisibility);
            if (density) setDensity(density);
            if (globalFilter) setGlobalFilter(globalFilter);
            if (showGlobalFilter) setShowGlobalFilter(showGlobalFilter);
            if (showColumnFilters) setShowColumnFilters(showColumnFilters);
            if (sorting) setSorting(sorting);
            if (columnSizing) setColumnSizing(columnSizing);
            if (pageSize) setPageSize(pageSize);
        }
        getter().then(() => {
            const loaded = new Set(...loadedCollections.current);
            loaded.add(collection);
            loadedCollections.current = Array.from(loaded.values());
        });
    }, [
        collection,
        forager,
        keys.columnFilters,
        keys.columnSizing,
        keys.columnVisibility,
        keys.density,
        keys.globalFilter,
        keys.pageSize,
        keys.showColumnFilters,
        keys.showGlobalFiler,
        keys.sorting,
        setColumnFilters,
        setColumnSizing,
        setColumnVisibility,
        setDensity,
        setGlobalFilter,
        setPageSize,
        setShowColumnFilters,
        setShowGlobalFilter,
        setSorting
    ]);
    useEffect(() => {
        if (isFirstRender()) return;
        forager.setItem(keys.columnFilters, columnFilters);
    }, [collection, columnFilters, forager, isFirstRender, keys.columnFilters]);
    useEffect(() => {
        if (isFirstRender()) return;
        forager.setItem(keys.columnVisibility, columnVisibility);
    }, [collection, columnVisibility, forager, isFirstRender, keys.columnVisibility]);
    useEffect(() => {
        if (isFirstRender()) return;
        forager.setItem(keys.density, density);
    }, [collection, density, forager, isFirstRender, keys.density]);
    useEffect(() => {
        if (isFirstRender()) return;
        forager.setItem(keys.globalFilter, globalFilter);
    }, [collection, forager, globalFilter, isFirstRender, keys.globalFilter]);
    useEffect(() => {
        if (isFirstRender()) return;
        forager.setItem(keys.showGlobalFiler, showGlobalFilter);
    }, [collection, forager, isFirstRender, keys.showGlobalFiler, showGlobalFilter]);
    useEffect(() => {
        if (isFirstRender()) return;
        forager.setItem(keys.showColumnFilters, showColumnFilters);
    }, [collection, forager, isFirstRender, keys.showColumnFilters, showColumnFilters]);
    useEffect(() => {
        if (isFirstRender()) return;
        forager.setItem(keys.sorting, sorting);
    }, [collection, forager, isFirstRender, keys.sorting, sorting]);
    useEffect(() => {
        if (isFirstRender()) return;
        forager.setItem(keys.columnSizing, columnSizing);
    }, [columnSizing, forager, isFirstRender, keys.columnSizing]);
    useEffect(() => {
        if (isFirstRender()) return;
        forager.setItem(keys.pageSize, pageSize);
    }, [forager, isFirstRender, keys.pageSize, pageSize]);
    const resetState = useCallback(() => {
        forager.setItem(keys.columnFilters, []);
        forager.setItem(keys.columnVisibility, {});
        forager.setItem(keys.density, 'compact');
        forager.setItem(keys.globalFilter, undefined);
        forager.setItem(keys.showGlobalFiler, false);
        forager.setItem(keys.showColumnFilters, false);
        forager.setItem(keys.sorting, []);
        forager.setItem(keys.columnSizing, {});
        forager.setItem(keys.pageSize, 100);
    }, [forager, keys.columnFilters, keys.columnSizing, keys.columnVisibility, keys.density, keys.globalFilter, keys.pageSize, keys.showColumnFilters, keys.showGlobalFiler, keys.sorting]);

    return {
        resetState,
        state: {
            columnFilters,
            columnVisibility,
            density,
            globalFilter,
            showColumnFilters,
            showGlobalFilter,
            sorting,
            columnSizing,
            pagination: {
                pageSize,
                pageIndex
            }
        },
        handlers: {
            onColumnSizingChange: setColumnSizing,
            onColumnFiltersChange: setColumnFilters,
            onColumnVisibilityChange: setColumnVisibility,
            onDensityChange: setDensity,
            onGlobalFilterChange: setGlobalFilter,
            onSortingChange: setSorting,
            onShowColumnFiltersChange: setShowColumnFilters,
            onShowGlobalFilterChange: setShowGlobalFilter,
            onPaginationChange: setPagination
        }
    };
}
