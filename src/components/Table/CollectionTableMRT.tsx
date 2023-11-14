/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    MRT_ColumnDef,
    MRT_EditCellTextField,
    MRT_Row,
    MRT_RowData,
    MRT_TableInstance,
    MRT_TableOptions,
    MaterialReactTable,
    createMRTColumnHelper,
    useMaterialReactTable
} from 'material-react-table';
import { konst } from '../../common/functions/konst';
import { useCollectionRoute } from '../../hooks/useCollectionRoute';
import { useFetchAll } from '../../hooks/useFetchData';
import { useCtor } from '../../routes/loaders/useCtor';
import { IMercariCategory, IProductTaxonomy } from '../../dal/types';
import { fromOID } from '../../dal/fromOID';
import { OIDTableCell } from './Cells/OIDTableCell';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faPenFancy, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { Box, IconButton, MenuItem, Popover, TextFieldProps } from '@mui/material';
import { useCallback, useMemo, useRef } from 'react';
import { useToggler } from '../../hooks/useToggler';
import { createSubComponent } from '../../dal/createSubComponent';
import { OuterTaxonomyComboBox, ProductTaxonomy } from '../../dto/collections/ProductTaxonomy';
import { taxonomy } from '../../dal/enums/taxa';
import { getProperty } from '../Contexts/setProperty';
import { useGetRowCanExpand } from '../../dal/useGetRowCanExpand';
import { Row } from '@tanstack/react-table';
import { ignore } from '../../common/functions/ignore';
import { useDeleteOne } from '../Contexts/useDeleteOne';
import { useDeleteMany } from '../../hooks/useDeleteMany';
import { createRenderToolbarInternalActions } from './creators/createRenderToolbarInternalActions';

const helper = createMRTColumnHelper<IMercariCategory>();
const productTaxonomyHelper = createMRTColumnHelper<IProductTaxonomy>();
export function OIDCell(props: Parameters<Exclude<MRT_ColumnDef<IMercariCategory, any>['Cell'], undefined>>[0]) {
    const value = props.renderedCellValue;
    return (
        <>
            <span className='flex w-4 h-4 bg-transparent border border-sky-500 text-slate-700' title={value as string}>
                <FontAwesomeIcon icon={faKey} className='block object-fill' />
            </span>
        </>
    );
}
export const collections = {
    productTaxonomy: {
        columns: (...pre: string[]): MRT_ColumnDef<IProductTaxonomy, any>[] => [
            productTaxonomyHelper.accessor((row) => row.kingdom ?? '', {
                header: 'Kingdom',
                editVariant: 'select',
                id: 'kingdom',
                Cell: (props) => {
                    const value = props.renderedCellValue;
                    console.log(`cell value`, value);
                    return value ?? '';
                },
                Edit: OuterTaxonomyComboBox({ label: 'Kingdom', name: 'kingdom', creatable: () => Promise.resolve() }) as any
            }),
            productTaxonomyHelper.accessor((row) => row.phylum ?? '', {
                header: 'Phlyum',
                id: 'phylum',
                Cell: (props) => {
                    const value = props.renderedCellValue;
                    console.log(`cell value`, value);
                    return value ?? '';
                },
                editVariant: 'select',
                Edit: OuterTaxonomyComboBox<any>({ label: 'Phlyum', name: 'phylum', creatable: () => Promise.resolve() }) as any
            }),
            productTaxonomyHelper.accessor((row) => row.klass ?? '', {
                header: 'Class',
                editVariant: 'select',
                id: 'klass',
                Cell: (props) => {
                    const value = props.renderedCellValue;
                    console.log(`cell value`, value);
                    return value ?? '';
                },
                Edit: OuterTaxonomyComboBox<any>({ label: 'Class', name: 'klass', creatable: () => Promise.resolve() }) as any
            }),
            productTaxonomyHelper.accessor((row) => row.order ?? '', {
                header: 'Order',
                editVariant: 'select',
                id: 'order',
                Cell: (props) => {
                    const value = props.renderedCellValue;
                    console.log(`cell value`, value);
                    return value ?? '';
                },
                Edit: OuterTaxonomyComboBox<any>({ label: 'Order', name: 'order', creatable: () => Promise.resolve() }) as any
            }),
            productTaxonomyHelper.accessor((row) => row.family ?? '', {
                header: 'Family',
                editVariant: 'select',
                id: 'family',
                Cell: (props) => {
                    const value = props.renderedCellValue;
                    console.log(`cell value`, value);
                    return value ?? '';
                },
                Edit: OuterTaxonomyComboBox<any>({ label: 'Family', name: 'family', creatable: () => Promise.resolve() }) as any
            })
        ]
    },
    mercariCategory: {
        columns: (...pre: string[]): MRT_ColumnDef<IMercariCategory, any>[] => [
            {
                id: '_id',
                accessorFn: (row) => fromOID(row._id),
                header: 'OID',
                Cell: OIDCell,
                enableEditing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                maxSize: 100,
                muiTableBodyCellProps: { style: { justifyContent: 'center' } }
            },
            helper.accessor('name', {
                header: 'Name',
                muiEditTextFieldProps: (props) => ({
                    required: true,
                    maxLength: 50
                }),
                maxSize: 280
            }),
            helper.accessor('id', {
                header: 'Selector',
                muiEditTextFieldProps: (props) => ({
                    required: true,
                    maxLength: 30
                }),
                maxSize: 200
            }),
            helper.accessor((row) => row.hashTags.size, {
                id: 'hashTags',
                header: 'Hash Tags',
                enableEditing: false,
                enableColumnFilter: false,
                maxSize: 200
            }),
            helper.accessor('shipWeightPercent', {
                header: 'Ship Wght %',
                enableColumnActions: false,
                enableColumnDragging: false,
                maxSize: 200,
                Cell: (props) => {
                    const value = props.row.original.shipWeightPercent;
                    return value ? (value * 100).toFixed(2).concat('%') : null;
                }
            })
            // helper.group({
            //     header: 'Taxon',
            //     muiTableHeadCellProps: { className: 'bg-indigo-700 text-white' },
            //     columns: [
            //         helper.accessor('taxon.kingdom', {
            //             header: 'Kingdom',
            //             editVariant: 'select',
            //             editSelectOptions: ['apparel', 'media']
            //         }),
            //         helper.accessor('taxon.phylum', {
            //             header: 'Phylum',
            //             editVariant: 'select',
            //             muiEditTextFieldProps: (props) => {
            //                 setTimeout(
            //                     () =>
            //                         (document.querySelector('input[name="taxon.kingdom"]') as HTMLInputElement).addEventListener('change', (ev) => {
            //                             const el = document.querySelector('input[name="taxon.phylum"]') as HTMLInputElement;
            //                             const value = el.value;
            //                             el.value = '';
            //                             setTimeout(() => (el.value = value), 100);
            //                         }),
            //                     750
            //                 );
            //                 return {
            //                     children: Object.entries(
            //                         taxonomy[(props.table.getState().editingRow ?? props.table.getState().creatingRow)!._valuesCache['taxon.kingdom'] as keyof typeof taxonomy] ?? {}
            //                     ).map(([phylum, x]) => {
            //                         return (
            //                             <MenuItem
            //                                 key={phylum}
            //                                 value={phylum}
            //                                 sx={{
            //                                     alignItems: 'center',
            //                                     display: 'flex',
            //                                     gap: '0.5rem',
            //                                     m: 0
            //                                 }}>
            //                                 {phylum}
            //                             </MenuItem>
            //                         );
            //                     })
            //                 };
            //             }
            //         }),
            //         helper.accessor('taxon.klass', {
            //             header: 'Class',
            //             editVariant: 'select',
            //             muiEditTextFieldProps: (props) => {
            //                 alert(
            //                     getProperty(
            //                         [
            //                             (props.table.getState().editingRow ?? props.table.getState().creatingRow)!._valuesCache['taxon.kingdom'],
            //                             (props.table.getState().editingRow ?? props.table.getState().creatingRow)!._valuesCache['taxon.phylum']
            //                         ].join('.')
            //                     )(taxonomy)
            //                 );
            //                 setTimeout(
            //                     () =>
            //                         (document.querySelector('input[name="taxon.phylum"]') as HTMLInputElement).addEventListener('change', (ev) => {
            //                             const el = document.querySelector('input[name="taxon.klass"]') as HTMLInputElement;
            //                             const value = el.value;
            //                             el.value = '';
            //                             el.blur();
            //                             el.dataset.phylum =
            //                                 (props.table.getState().editingRow ?? props.table.getState().creatingRow)!._valuesCache['taxon.phylum']?.length ?? 0 > 0
            //                                     ? (props.table.getState().editingRow ?? props.table.getState().creatingRow)!._valuesCache['taxon.phylum']
            //                                     : '';
            //                             setTimeout(() => (el.value = value), 100);
            //                         }),
            //                     750
            //                 );
            //                 return {
            //                     children:
            //                         (props.table.getState().editingRow ?? props.table.getState().creatingRow)!._valuesCache['taxon.phylum']?.length ?? 0 > 0 ? (
            //                             Object.entries(
            //                                 getProperty(
            //                                     [
            //                                         (props.table.getState().editingRow ?? props.table.getState().creatingRow)!._valuesCache['taxon.kingdom'],
            //                                         (props.table.getState().editingRow ?? props.table.getState().creatingRow)!._valuesCache['taxon.phylum']
            //                                     ].join('.')
            //                                 )(taxonomy)
            //                             ).map(([klass, x]) => {
            //                                 return (
            //                                     <MenuItem
            //                                         key={klass}
            //                                         value={klass}
            //                                         sx={{
            //                                             alignItems: 'center',
            //                                             display: 'flex',
            //                                             gap: '0.5rem',
            //                                             m: 0
            //                                         }}>
            //                                         {klass}
            //                                     </MenuItem>
            //                                 );
            //                             })
            //                         ) : (
            //                             <></>
            //                         )
            //                 };
            //             }
            //         }),
            //         helper.accessor('taxon.order', {
            //             header: 'Order'
            //         }),
            //         helper.accessor('taxon.family', {
            //             header: 'Family'
            //         }),
            //         helper.accessor('taxon.genus', {
            //             header: 'Genus'
            //         }),
            //         helper.accessor('taxon.species', {
            //             header: 'Species'
            //         })
            //     ]
            // })
        ],
        detailPanel: (props: Parameters<Exclude<MRT_TableOptions<IMercariCategory>['renderDetailPanel'], undefined>>[0]) => {
            return <></>;
        }
    }
};

export type MRT_TableOptionFunctionParams<T extends AnyObject, K extends keyof MRT_TableOptions<T>> = Parameters<Exclude<MRT_TableOptions<T>[K], undefined>>[0];

export function renderRowActions() {
    function InnerRenderRowActions<T extends AnyObject>(props: MRT_TableOptionFunctionParams<T, 'renderRowActions'>) {
        const collectionName = useCollectionRoute();
        const deleteOne = useDeleteOne(collectionName);
        const onEditClick = useCallback(() => {
            props.table.setEditingRow(props.row);
        }, []);
        const onDeleteClick = useCallback(() => {
            deleteOne(props.row.id);
        }, []);
        return (
            <Box className='flex flex-nowrap gap-x-2'>
                <IconButton color='secondary' onClick={onEditClick} className='flex' title='Edit this row.'>
                    <FontAwesomeIcon icon={faPenFancy} className='w-5 h-5' />
                </IconButton>
                <IconButton color='error' onClick={onDeleteClick} className='flex' title='Delete this row.'>
                    <FontAwesomeIcon icon={faTrashCan} className='w-5 h-5' />
                </IconButton>
            </Box>
        );
    }
    return InnerRenderRowActions;
}

export function createRenderTopToolbar() {
    function RenderTopToolbar<T extends AnyObject>(props: MRT_TableOptionFunctionParams<T, 'renderTopToolbarCustomActions'>) {
        return <></>;
    }
}

export function createRenderCreateRowDialogContent() {
    function RenderCreateRowDialogContent<T extends AnyObject>(props: MRT_TableOptionFunctionParams<T, 'renderCreateRowDialogContent'>) {}
}
export function createRenderEditRowDialogContent() {
    function RenderEditRowDialogContent<T extends AnyObject>(props: MRT_TableOptionFunctionParams<T, 'renderEditRowDialogContent'>) {}
}

export function usePersistedState() {
    const isFirstRender = useRef(true);
    const [columnFilters, setColumnFilters] = 
}
export function CollectionTableMRT<T extends MRT_RowData & EntityBase>() {
    const collectionRoute = useCollectionRoute();
    const data = useFetchAll<T>(collectionRoute);
    const Ctor = useCtor(collectionRoute);
    const columns = useMemo(() => ((collections[collectionRoute as keyof typeof collections].columns as any) ?? konst([])).bind(Ctor)(), [Ctor, collectionRoute]);
    const { getRowCanExpand, subComponentTabPanels, visibility } = useGetRowCanExpand(collectionRoute);
    const DetailPanel = useMemo(
        () =>
            ({ row, table }: { row: MRT_Row<Entity<T>>; table: MRT_TableInstance<T> }) =>
                createSubComponent<T>(subComponentTabPanels)({ row, table, collectionName: collectionRoute, includeTaxonomy: true } as any),
        [collectionRoute, subComponentTabPanels]
    );
    const $renderRowActions = useMemo(() => renderRowActions(), []);
    const renderToolbarInternalActions = useMemo(() => createRenderToolbarInternalActions({}), []);
    const table = useMaterialReactTable({
        data,
        columns, // columns as MRT_ColumnDef<T, any>[],
        enableRowActions: true,
        renderRowActions: $renderRowActions,
        muiTableHeadCellProps: {
            className: 'font-raleway',
            style: {
                fontSize: '1.250rem',
                fontWeight: 700,
                whiteSpace: 'nowrap'
            }
        },
        muiTableBodyCellProps: {
            className: 'font-raleway',
            style: {
                fontSize: '1.05rem',
                whiteSpace: 'nowrap'
            }
        },
        enableRowSelection: true,
        enableColumnResizing: true,
        enableColumnOrdering: true,
        enableStickyFooter: true,
        enableStickyHeader: true,
        enableColumnFilters: true,
        enableColumnDragging: false,
        enableEditing: true,
        createDisplayMode: 'modal',
        editDisplayMode: 'row',
        layoutMode: 'grid-no-grow',
        renderDetailPanel: DetailPanel as any,
        renderToolbarInternalActions,
        initialState: {
            density: 'compact',
            pagination: {
                pageIndex: 0,
                pageSize: 150
            }
        }
    });

    return <MaterialReactTable table={table} />;
}
