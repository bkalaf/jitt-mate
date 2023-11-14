import { Row, Table, useReactTable } from '@tanstack/react-table';
import { TabPanelProvider } from '../components/TabPanelProvider';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';
import { IProduct, IProductTaxonomy } from './types';
import { useCallback, useMemo, useState } from 'react';
import { useTabPanelContext } from '../hooks/useTabPanelContext';
import { MRT_ColumnDef, MRT_TableOptions, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { collections } from '../components/Table/CollectionTableMRT';
import { fromOID } from './fromOID';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { $$queryClient } from '../components/App';
import { useUpdateRecord } from '../hooks/useUpdateRecord';
import { toOID } from './toOID';
import { catchError } from '../components/catchError';

// props: { row: Row<T>, table: Table<T> }

export function createSubComponent<T extends EntityBase>(infos: FieldInfo[]) {
    const Result = function ({ row, collectionName, includeTaxonomy, table }: { table: Table<T>; row: Row<T>; collectionName: string; includeTaxonomy: boolean }) {
        return (
            <QueryClientProvider client={$$queryClient}>
                <TabPanelProvider>
                    <section className='flex flex-col w-full h-full'>
                        <nav className='grid justify-start w-full grid-cols-10 p-2' role='tablist' aria-label='SubComponent Tabs'>
                            {includeTaxonomy && <Tab key={-1} propertyName='taxon' objectType='productTaxonomy' type='object' />}
                            {infos.map(([propertyName, type, objectType], ix) => (
                                <Tab key={ix} propertyName={propertyName} objectType={objectType ?? ''} type={type} />
                            ))}
                        </nav>
                        <div className='flex flex-grow w-full h-full'>
                            {includeTaxonomy && <TaxonomyPanel from={collectionName} parentRow={row.original as any} />}
                            {/* {infos.map(([propertyName, type, objectType], ix) => (
                            <TabPanel<T, any, any, any> key={ix} propertyName={propertyName} objectType={objectType ?? ''} collectionName={collectionName} type={type} parentRow={row} table={table} />
                        ))} */}
                        </div>
                    </section>
                </TabPanelProvider>
            </QueryClientProvider>
        );
    };
    Result.displayName = 'SubComponent';
    return Result;
}

export function Panel(props: { propertyName: string; objectType: RealmObjects; parentRow: Row<{ taxon: IProductTaxonomy }> }) {
    const { actions } = useTabPanelContext();
    const { isCurrent } = useMemo(() => actions(props.propertyName), [actions, props.propertyName]);
    const id = `${props.propertyName}-tab`;
    const controlsId = `${id}panel`;
    const table = useMaterialReactTable({
        data: [props.parentRow.original[props.propertyName as keyof typeof props.parentRow.original]] as any[],
        columns: collections[props.objectType as keyof typeof collections].columns() as any[]
    });
    return <div className='flex flex-grow w-full h-full aria-not-current:hidden' role='tabpanel' aria-labelledby={id} id={controlsId} aria-current={isCurrent()}></div>;
}

export function TaxonomyPanel(props: { from: string; parentRow: { taxon: IProductTaxonomy } }) {
    console.log('props', props);
    const { actions } = useTabPanelContext();
    const { isCurrent } = useMemo(() => actions('taxon'), [actions]);
    const id = `taxon-tab`;
    const controlsId = `${id}panel`;
    const columns = useMemo(() => collections['productTaxonomy' as keyof typeof collections].columns() as MRT_ColumnDef<IProductTaxonomy>[], []);
    const { data } = useQuery({
        queryKey: ['productTaxonomy', props.from, fromOID((props.parentRow as any)._id)],
        queryFn: () => Promise.resolve([props.parentRow.taxon ?? {}])
    });
    const update = useUpdateRecord(props.from);

    const onEditingRowSave = useCallback((saveProps: Parameters<Exclude<MRT_TableOptions<any>['onEditingRowSave'], undefined>>[0]) => {
        update(
            { id: toOID((props.parentRow as any)._id)!, payload: { ...props.parentRow.toJSON(), taxon: saveProps.values } },
            {
                onSuccess: saveProps.exitEditingMode,
                onError: catchError
            }
        );
    }, [props.parentRow, update]);
    const table = useMaterialReactTable<IProductTaxonomy>({
        // data: [p.parentRow.original[p.propertyName as keyof typeof p.parentRow.original]] as any[],
        data: data ?? [],
        columns,
        muiTableHeadCellProps: {
            style: {
                fontSize: '0.95rem',
                fontWeight: 700,
                whiteSpace: 'nowrap'
            }
        },
        muiTableBodyCellProps: {
            style: {
                fontSize: '0.85rem',
                whiteSpace: 'nowrap'
            }
        },
        enableRowSelection: true,
        enableColumnResizing: true,
        enableColumnOrdering: true,
        enableColumnFilters: true,
        enableColumnDragging: false,
        enableEditing: true,
        editDisplayMode: 'modal',
        layoutMode: 'grid-no-grow',
        onEditingRowSave: onEditingRowSave as any,
        getRowId: (x, ix) => ix.toFixed(0)
    });
    console.log(table);

    return (
        <div className='flex flex-grow w-full h-full aria-not-current:hidden' role='tabpanel' aria-labelledby={id} id={controlsId} aria-current={isCurrent()}>
            <MaterialReactTable table={table} />
        </div>
    );
}
