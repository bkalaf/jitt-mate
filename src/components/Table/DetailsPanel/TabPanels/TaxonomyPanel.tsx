/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProductTaxonomy } from '../../../../dal/types';
import { useCallback } from 'react';
import { MRT_TableOptions, MaterialReactTable } from 'material-react-table';
import { fromOID } from '../../../../dal/fromOID';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUpdateRecord } from '../../../../hooks/useUpdateRecord';
import { toOID } from '../../../../dal/toOID';
import { catchError } from '../../../catchError';
import { flattenPayload } from '../../../../util/flattenPayload';
import { TabPanel } from '@mui/lab';

export function TaxonomyPanel(props: { from: string; parentRow: { taxon: IProductTaxonomy } }) {
    const { data, isLoading, isError } = useQuery({
        queryKey: [props.from, 'productTaxonomy', fromOID((props.parentRow as any)._id)],
        queryFn: () => Promise.resolve([props.parentRow.taxon ?? {}])
    });
    const update = useUpdateRecord<EntityBase & { taxon: IProductTaxonomy }>(props.from);
    const queryClient = useQueryClient();
    const onEditingRowSave = useCallback(
        (saveProps: Parameters<Exclude<MRT_TableOptions<any>['onEditingRowSave'], undefined>>[0]) => {
            update(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                { id: toOID((props.parentRow as any)._id)!, payload: { ...(props.parentRow as any as Realm.Object<any>).toJSON(), taxon: flattenPayload(saveProps.values) as any } },
                {
                    onSuccess: () => {
                        saveProps.exitEditingMode();
                        setTimeout(() => {
                            queryClient.invalidateQueries({ queryKey: [props.from, 'productTaxonomy', fromOID((props.parentRow as any)._id)] });
                            queryClient.refetchQueries({ queryKey: [props.from, 'productTaxonomy', fromOID((props.parentRow as any)._id)] });
                        }, 200);
                    },
                    onError: catchError
                }
            );
        },
        [props.from, props.parentRow, queryClient, update]
    );
    // const { state, ...options } = useStandardTableOptions<IProductTaxonomy>((data ?? []) as IProductTaxonomy[], isLoading, isError, ignore, { collection: 'productTaxonomy' });
    // const table = useMaterialReactTable<IProductTaxonomy>({
    //     ...options,
    //     onEditingRowSave: onEditingRowSave as any,
    //     getRowId: (_x: any, ix: number) => ix.toFixed(0),
    //     muiToolbarAlertBannerProps:
    //         isError || false
    //             ? {
    //                   color: 'error',
    //                   children: 'NETWORK ERROR - COLLECTION FAILED TO LOAD.'
    //               }
    //             : undefined,
    //     initialState: {
    //         density: 'compact',
    //         pagination: {
    //             pageIndex: 0,
    //             pageSize: 100
    //         }
    //     },
    //     state: {
    //         ...state,
    //         showAlertBanner: isError || false,
    //         showProgressBars: isLoading || false
    //     }
    // });
    // console.log(table);

    return (
        <div className='flex flex-grow w-full h-full'>
            <TabPanel value='taxon'>
                <MaterialReactTable table={table} />
            </TabPanel>
        </div>
    );
}
