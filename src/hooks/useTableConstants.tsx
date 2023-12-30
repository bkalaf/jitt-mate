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
                enableRowNumbers: true,
                enableStickyHeader: true,
                enableRowActions: true,
                layoutMode: 'grid' as MRT_TableOptions<T>['layoutMode'],
                muiPaginationProps: {
                    rowsPerPageOptions: [15, 25, 50, 100, 250, 500, 1000, 2500]
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                muiTableBodyRowProps: (params: Parameters<Extract<Exclude<MRT_TableOptions<any>['muiTableBodyRowProps'], undefined>, (...args: any[]) => any>>[0]) =>
                    ({
                        // className: 'odd:bg-zinc-300 aria-selected:bg-rose-500 ring ring-transparent hover:ring-rose-500',
                        classes: {
                            root: 'border border-black divide-x divide-black data-row-even:bg-sky-200 data-row-even:text-black data-row-odd:bg-neutral-200 data-row-odd:text-black  hover:bg-yellow-400 data-row-odd:hover:bg-yellow-400 aria-selected:bg-rose-400'
                        },
                        'aria-selected': Object.keys(params.table.getSelectedRowModel().rowsById).includes(params.row.id),
                        'data-row': params.row.index % 2 === 0 ? 'even' : 'odd'
                        // Object.entries(params.table.getState().rowSelection).filter(([k, v]) => v).map(([k]) => k).includes(params.row.id)
                    } as TableRowProps),
                muiTableBodyCellProps: {
                    className: 'whitespace-pre divide divide-black border border-black',
                    sx: {
                        alignContent: 'center',
                        justifyContent: 'start',
                        backgroundColor: 'inherit'
                    }
                } as MRT_TableOptions<any>['muiTableBodyCellProps'],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                muiTableHeadCellProps: (params: Parameters<Extract<Exclude<MRT_TableOptions<any>['muiTableHeadCellProps'], undefined>, (...args: any[]) => any>>[0]) => ({
                    'aria-sort': params.column.getIsSorted() ? params.column.getIsSorted() : undefined,
                    'data-column-type': params.column.columnDef.columnDefType,
                    classes: {
                        root: 'aria-required:text-red-500 aria-required:after:text-red-500 aria-required:text-lg aria-required:after:font-extrabold whitespace-nowrap aria-asc:bg-rose-300 aria-desc:bg-indigo-300 data-is-group-column:bg-sky-600 data-is-group-column:text-white'
                    }
                }),
                positionToolbarAlertBanner: 'bottom' as MRT_TableOptions<T>['positionToolbarAlertBanner'],
                muiEditRowDialogProps: { maxWidth: 'lg' } as MRT_TableOptions<T>['muiEditRowDialogProps'],
                muiCreateRowModalProps: { maxWidth: 'lg' } as MRT_TableOptions<T>['muiCreateRowModalProps'],
                columnFilterDisplayMode: 'subheader' as MRT_TableOptions<T>['columnFilterDisplayMode'],
                muiTopToolbarProps: {
                    sx: {
                        display: 'flex',
                        justifyContent: 'start'
                    }
                } as MRT_TableOptions<T>['muiTopToolbarProps']
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any as MRT_TableOptions<T>),
        []
    );
}
