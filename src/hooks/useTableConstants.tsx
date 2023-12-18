import { MRT_RowData, MRT_TableOptions } from 'material-react-table';
import { useMemo } from 'react';
import { ColumnResizeMode } from '@tanstack/react-table';
import { TableRowProps } from '@mui/material';

export function useTableConstants<T extends MRT_RowData>() {
    return useMemo(
        () =>
            ({
                // sortingFns: {
                //     sortBarcode: (rowA, rowB, columnId) => {}
                // },
                autoResetAll: false,
                autoResetExpanded: false,
                autoResetPageIndex: false,
                debugAll: true,
                columnResizeMode: 'onEnd' as ColumnResizeMode,
                createDisplayMode: 'modal' as MRT_TableOptions<T>['createDisplayMode'],
                editDisplayMode: 'modal' as MRT_TableOptions<T>['editDisplayMode'],
                paginationDisplayMode: 'pages' as const,
                positionPagination: 'both' as const,
                enableColumnFilters: true,
                enableColumnOrdering: true,
                enableColumnResizing: true,
                positionGlobalFilter: 'left' as const,
                selectAllMode: 'page' as const,
                enableRowSelection: true,
                enableStickyFooter: true,
                enableStickyHeader: true,
                enableRowActions: true,
                layoutMode: 'grid' as MRT_TableOptions<T>['layoutMode'],
                muiPaginationProps: {
                    rowsPerPageOptions: [15, 25, 50, 100, 250, 500, 1000, 2500]
                },
                muiTableBodyRowProps: (params: Parameters<Extract<Exclude<MRT_TableOptions<any>['muiTableBodyRowProps'], undefined>, (...args: any[]) => any>>[0]) =>
                    ({
                        className: 'odd:bg-zinc-300 aria-selected:bg-rose-500 ring ring-transparent hover:ring-rose-500',
                        classes: {
                            root: 'odd:bg-zinc-300 aria-selected:bg-rose-500 ring ring-transparent hover:ring-rose-500',
                            selected: 'ring ring-red-500'
                        },
                        'aria-selected': Object.keys(params.table.getSelectedRowModel().rowsById).includes(params.row.id)
                        // Object.entries(params.table.getState().rowSelection).filter(([k, v]) => v).map(([k]) => k).includes(params.row.id)
                    } as TableRowProps),
                muiTableBodyCellProps: {
                    className: 'bg-inherit whitespace-pre'
                },
                muiTableHeadCellProps: (params: Parameters<Extract<Exclude<MRT_TableOptions<any>['muiTableHeadCellProps'], undefined>, (...args: any[]) => any>>[0]) => ({
                    'aria-sort': params.column.getIsSorted() ? params.column.getIsSorted() : undefined,
                    'data-column-type': params.column.columnDef.columnDefType,
                    classes: {
                        root: 'aria-required:text-red-500 aria-required:after:text-red-500 aria-required:text-lg aria-required:after:font-extrabold whitespace-nowrap aria-asc:bg-rose-300 aria-desc:bg-indigo-300 data-is-group-column:bg-sky-600 data-is-group-column:text-white'
                    }
                }),
                positionToolbarAlertBanner: 'bottom' as MRT_TableOptions<T>['positionToolbarAlertBanner'],
                columnFilterDisplayMode: 'subheader' as MRT_TableOptions<T>['columnFilterDisplayMode'],
                muiTopToolbarProps: {
                    sx: {
                        display: 'flex',
                        justifyContent: 'start'
                    }
                } as MRT_TableOptions<T>['muiTopToolbarProps']
            } as any as MRT_TableOptions<T>),
        []
    );
}
