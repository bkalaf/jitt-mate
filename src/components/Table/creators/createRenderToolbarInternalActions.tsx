/* eslint-disable @typescript-eslint/no-explicit-any */
import { MRT_Row, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFullScreenButton, createRow } from 'material-react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoltLightning, faDumpsterFire, faFilterSlash, faFilters, faLeftRight, faLeftToLine, faMagnifyingGlass, faMagnifyingGlassMinus, faRedoAlt, faSquarePlus } from '@fortawesome/pro-solid-svg-icons';
import { IconButton } from '@mui/material';
import { useCallback } from 'react';
import { BSON } from 'mongodb';
import { is } from '../../../common/is';
import { useReflectionContext } from '../../../hooks/useReflectionContext';
import { usePersistedState } from '../../../hooks/usePersistedState';
import { JITTIconButton } from '../JITTIconButton';
import { pullNextUPC } from './pullNextUPC';

export const $pullNext = {
    sku: pullNextUPC('sku'),
    fixture: pullNextUPC('fixture'),
    bin: pullNextUPC('bin')
};

export function createRenderToolbarInternalActions<T extends AnyObject>(outerProps: {
    defaultObject?: Partial<T>;
    resetState: () => void;
    onClickLightning: (table: MRT_TableOptionFunctionParams<T, 'renderToolbarInternalActions'>['table']) => void;
    onClickDumpsterFire: (table: MRT_TableOptionFunctionParams<T, 'renderToolbarInternalActions'>['table']) => void;
    getCanInsertDelete: () => boolean;
    objectType?: string;
    propertyName?: string;
    parentRow?: MRT_Row<any>;
    type?: 'list' | 'dictionary' | 'set' | 'object';
    state: ReturnType<typeof usePersistedState>['state'];
    handlers: ReturnType<typeof usePersistedState>['handlers'];
    matchFromStart: boolean;
    toggleMatchFromStart: () => void;
}) {
    const { showColumnFilters, showGlobalFilter } = outerProps.state;
    const { onShowColumnFiltersChange, onShowGlobalFilterChange } = outerProps.handlers;
    const toggleShowColumnFilters = () => {
        onShowColumnFiltersChange((prev) => !prev);
    };
    const toggleShowGlobalFilter = () => {
        onShowGlobalFilterChange((prev) => !prev);
    };
    function RenderToolbarInternalActions(props: MRT_TableOptionFunctionParams<T, 'renderToolbarInternalActions'>) {
        const onClickInsert = useCallback(
            () => props.table.setCreatingRow(createRow(props.table, (outerProps.defaultObject as T) ?? ({ _id: new BSON.ObjectId() } as any as T) ?? true)),
            [props.table]
        );
        const noRowsSelected = !props.table.getIsSomeRowsSelected() && !props.table.getIsAllRowsSelected();
        // const db = useLocalRealm();
        const disableInsertDelete = !outerProps.getCanInsertDelete();
        const { getIsEmbedded } = useReflectionContext();
        const enableLink = outerProps.objectType != null && !(getIsEmbedded(outerProps.objectType) || is.realmType.primitive(outerProps.objectType));
        // const onClick_pullUPC = useCallback((key: keyof typeof Config.barcodes['prefix'], table: MRT_TableInstance<IUPC>, formContext: UseFormReturn<FieldValues>) => {
        //     return () => {
        //         const incrFunc = pullNextUPC(key);
        //         const func = () => {
        //             const barcode = incrFunc() as Entity<IBarcode>;
        //             console.log(`next barcode`, barcode);
        //             if (table.getState().creatingRow != null) {
        //                 formContext.setValue('upcs', [barcode]);
        //             } else if (table.getState().editingRow != null) {
        //                 row.original.upcs.push(barcode);
        //             }                    
        //         };
        //         checkTransaction(db)(func);
        //     }
        // }, [db]);
        // const onClick_pullUPC_disabled = useCallback((row: MRT_Row<IUPC>, table: MRT_TableInstance<IUPC>, formContext: UseFormReturn<FieldValues>) => {
        //     return () => table.getState().creatingRow != null ? ((formContext.getValues()?.upcs ?? [])?.length ?? 0) > 0 : table.getState().editingRow != null ? (row.original?.upcs?.length ?? 0) > 0 : false
        // }, []);
        return (
            <>
                {!enableLink && (
                    <IconButton color='info' className='flex' title='Insert a new record.' onClick={onClickInsert} disabled={disableInsertDelete}>
                        <FontAwesomeIcon icon={faSquarePlus} className='inline-block object-cover' />
                    </IconButton>
                )}

                <JITTIconButton title='Create draft' color='primary' onClick={ignore} type='button' Icon={faDraft} />

                <IconButton color='warning' className='flex' title='Update a record' onClick={() => outerProps.onClickLightning(props.table)} disabled={noRowsSelected}>
                    <FontAwesomeIcon icon={faBoltLightning} className='inline-block object-cover' />
                </IconButton>
                <IconButton color='error' className='flex' title='Delete selection' onClick={() => outerProps.onClickDumpsterFire(props.table)} disabled={disableInsertDelete || noRowsSelected}>
                    <FontAwesomeIcon icon={faDumpsterFire} className='inline-block object-cover' />
                </IconButton>
                <IconButton color='secondary' className='flex' title='Reset saved table state' onClick={outerProps.resetState}>
                    <FontAwesomeIcon icon={faRedoAlt} className='inline-block object-cover' />
                </IconButton>
                <JITTIconButton
                    title='Toggle column filters'
                    Icon={showColumnFilters ? faFilterSlash : faFilters}
                    color={showColumnFilters ? 'error' : 'secondary'}
                    onClick={toggleShowColumnFilters}
                    type='button'
                />
                <JITTIconButton 
                    title='Toggle matching location'
                    Icon={outerProps.matchFromStart ? faLeftRight : faLeftToLine} 
                    color='caution'
                    onClick={outerProps.toggleMatchFromStart}
                    type='button'
                />
                <MRT_ShowHideColumnsButton table={props.table} />
                <MRT_ToggleDensePaddingButton table={props.table} />
                <MRT_ToggleFullScreenButton table={props.table} />
                <JITTIconButton
                    color={showGlobalFilter ? 'error' : 'secondary'}
                    Icon={showGlobalFilter ? faMagnifyingGlassMinus : faMagnifyingGlass}
                    onClick={toggleShowGlobalFilter}
                    title='Toggle showing global filter.'
                />
            </>
        );
    }
    return RenderToolbarInternalActions;
}
