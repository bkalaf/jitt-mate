import { MRT_ColumnFiltersState, MRT_ColumnSizingState, MRT_DensityState, MRT_SortingState, MRT_VisibilityState } from 'material-react-table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalForageContext } from './useLocalForageContext';
import { useParams } from 'react-router-dom';
import { PaginationState } from '@tanstack/react-table';

export function usePersistedState(collectionOverride?: string) {
    const loadedCollections = useRef<string[]>([]);
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>({});
    const [density, setDensity] = useState<MRT_DensityState>('compact');
    const [globalFilter, setGlobalFilter] = useState<string | undefined>(undefined);
    const [showGlobalFilter, setShowGlobalFilter] = useState(false);
    const [showColumnFilters, setShowColumnFilters] = useState(false);
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [columnSizing, setColumnSizing] = useState<MRT_ColumnSizingState>({});
    const [pageSize, setPageSize] = useState<number>(100);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const setPagination = useCallback(
        (pagination: PaginationState | ((x: PaginationState) => PaginationState)) => {
            setPageIndex((prevPageIndex) => {
                let result = 0;
                setPageSize((prevPageSize) => {
                    const { pageIndex: nextPageIndex, pageSize: nextPageSize } = typeof pagination === 'function' ? pagination({ pageIndex: prevPageIndex, pageSize: prevPageSize }) : pagination;
                    result = nextPageIndex;
                    return nextPageSize;
                });
                return result;
            });
        },
        []
    );
    const route = useParams<{ collection: string }>().collection;
    const collection = collectionOverride ?? route ?? 'n/a';
    const keys = useMemo(
        () => ({
            columnFilters: ['mrt_column_filters', collection].join('_'),
            columnVisibility: ['mrt_column_visibility', collection].join('_'),
            density: ['mrt_density_state', collection].join('_'),
            sorting: ['mrt_column_sorting', collection].join('_'),
            globalFilter: ['mrt_global_filter', collection].join('_'),
            showGlobalFiler: ['mrt_show_global_filter', collection].join('_'),
            showColumnFilters: ['mrt_show_column_filters', collection].join('_'),
            columnSizing: ['mt_column_sizing', collection].join('_'),
            pageSize: ['mrt_page_size', collection].join('_')
        }),
        [collection]
    );

    const isFirstRender = useCallback(() => !loadedCollections.current.includes(collection), [collection]);
    const { forager } = useLocalForageContext();
    useEffect(() => {
        async function getter() {
            const columnFilters = (await forager.getItem<MRT_ColumnFiltersState>(keys.columnFilters)) ?? [];
            const columnVisibility = (await forager.getItem<MRT_VisibilityState>(keys.columnVisibility)) ?? {};
            const density = (await forager.getItem<MRT_DensityState>(keys.density)) ?? 'compact';
            const globalFilter = (await forager.getItem<string | undefined>(keys.globalFilter)) ?? undefined;
            const showGlobalFilter = (await forager.getItem<boolean>(keys.showGlobalFiler)) ?? false;
            const showColumnFilters = (await forager.getItem<boolean>(keys.showColumnFilters)) ?? false;
            const sorting = (await forager.getItem<MRT_SortingState>(keys.sorting)) ?? [];
            const columnSizing = (await forager.getItem<MRT_ColumnSizingState>(keys.columnSizing)) ?? {};
            const pageSize = (await forager.getItem<number>(keys.pageSize)) ?? 100;
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
        getter()
            .then(() => (loadedCollections.current = [...loadedCollections.current, collection]))
            .finally(() => console.error(`LOCALFORAGER: settings loaded for ${collection}`));
    }, [collection, forager, keys.columnFilters, keys.columnSizing, keys.columnVisibility, keys.density, keys.globalFilter, keys.pageSize, keys.showColumnFilters, keys.showGlobalFiler, keys.sorting]);
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
