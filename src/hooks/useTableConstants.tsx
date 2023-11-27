import { MRT_RowData, MRT_TableOptions } from 'material-react-table';
import { useMemo } from 'react';
import { ColumnResizeMode } from '@tanstack/react-table';


export function useTableConstants<T extends MRT_RowData>() {
    return useMemo(
        () =>
            ({
                autoResetAll: false,
                autoResetExpanded: false,
                autoResetPageIndex: false,
                columnResizeMode: 'onEnd' as ColumnResizeMode,
                createDisplayMode: 'modal' as MRT_TableOptions<T>['createDisplayMode'],
                editDisplayMode: 'modal' as MRT_TableOptions<T>['editDisplayMode'],
                enableColumnFilters: true,
                enableColumnOrdering: true,
                enableColumnResizing: true,
                enableRowSelection: true,
                enableStickyFooter: true,
                enableStickyHeader: true,
                enableRowActions: true,
                layoutMode: 'grid' as MRT_TableOptions<T>['layoutMode'],
                muiPaginationProps: {
                    rowsPerPageOptions: [15, 25, 50, 100, 250, 500, 1000, 2500]
                },
                muiTableBodyRowProps: {
                    className: 'odd:bg-neutral-300 even:bg-cyan-300 aria-selected:bg-yellow-500 aria-selected:scale-105'
                },
                muiTableHeadCellProps: {
                    className: 'aria-required:text-red-500 aria-required:after:content-["_(*)"] aria-required:after:text-red-500 aria-required:text-lg aria-required:after:font-extrabold whitespace-nowrap'
                },
                positionToolbarAlertBanner: 'bottom' as MRT_TableOptions<T>['positionToolbarAlertBanner'],
                columnFilterDisplayMode: 'popover' as MRT_TableOptions<T>['columnFilterDisplayMode']
            } as any as MRT_TableOptions<T>),
        []
    );
}
