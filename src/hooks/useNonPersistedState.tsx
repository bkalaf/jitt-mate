import { MRT_ColumnFiltersState, MRT_ColumnSizingState, MRT_DensityState, MRT_SortingState, MRT_VisibilityState } from 'material-react-table';
import { useCallback, useState } from 'react';
import { ignore } from '../common/functions/ignore';
import { usePersistedState } from './usePersistedState';

export function useNonPersistedState(): ReturnType<typeof usePersistedState> {
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState | undefined>([]);
    const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState | undefined>({});
    const [density, setDensity] = useState<MRT_DensityState | undefined>('compact');
    const [globalFilter, setGlobalFilter] = useState<string | undefined>(undefined);
    const [showGlobalFilter, setShowGlobalFilter] = useState<boolean | undefined>(false);
    const [showColumnFilters, setShowColumnFilters] = useState<boolean | undefined>(false);
    const [sorting, setSorting] = useState<MRT_SortingState | undefined>([]);
    const [columnSizing, setColumnSizing] = useState<MRT_ColumnSizingState | undefined>({});

    const resetState = useCallback(() => {
        setColumnFilters([]);
        setColumnVisibility({});
        setDensity('compact');
        setGlobalFilter(undefined);
        setShowGlobalFilter(false);
        setShowColumnFilters(false);
        setSorting([]);
        setColumnSizing({});
    }, []);

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
                pageSize: 1,
                pageIndex: 0
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
            onPaginationChange: ignore
        }
    };
}
