/* eslint-disable @typescript-eslint/no-explicit-any */
import { MRT_Row, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFullScreenButton, createRow } from 'material-react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoltLightning, faDumpsterFire, faFilterSlash, faFilters, faLink, faMagnifyingGlass, faMagnifyingGlassMinus, faRedoAlt, faSquarePlus } from '@fortawesome/pro-solid-svg-icons';
import { IconButton } from '@mui/material';
import { useCallback } from 'react';
import { BSON } from 'mongodb';
import { is } from '../../../dal/is';
import { useReflectionContext } from '../../Contexts/useReflectionContext';
import { RelationshipTableMRT } from '../../Views/RelationshipTableMRT';
import { useToggler } from '../../../hooks/useToggler';
import { usePersistedState } from '../../../hooks/usePersistedState';
import { RHFM_IconButton } from './RHFM_IconButton';

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
        const disableInsertDelete = !outerProps.getCanInsertDelete();
        const { getIsEmbedded } = useReflectionContext();
        const enableLink = outerProps.objectType != null && !(getIsEmbedded(outerProps.objectType) || is.realmType.primitive(outerProps.objectType));
        const [open,, setOpen, setClosed] = useToggler(false);

        return (
            <>
                {!enableLink && (
                    <IconButton color='info' className='flex' title='Insert a new record.' onClick={onClickInsert} disabled={disableInsertDelete}>
                        <FontAwesomeIcon icon={faSquarePlus} className='inline-block object-cover' />
                    </IconButton>
                )}
                {enableLink && (
                    <>
                        <IconButton color='secondary' className='flex' title='Link records' onClick={setOpen}>
                            <FontAwesomeIcon icon={faLink} className='inline-block object-cover' />
                        </IconButton>
                        <RelationshipTableMRT
                            type={outerProps.type}
                            objectType={outerProps.objectType}
                            propertyName={outerProps.propertyName}
                            parentRow={outerProps.parentRow}
                            open={open}
                            setClosed={setClosed}
                        />
                    </>
                )}
                <IconButton color='warning' className='flex' title='Update a record' onClick={() => outerProps.onClickLightning(props.table)} disabled={noRowsSelected}>
                    <FontAwesomeIcon icon={faBoltLightning} className='inline-block object-cover' />
                </IconButton>
                <IconButton color='error' className='flex' title='Delete selection' onClick={() => outerProps.onClickDumpsterFire(props.table)} disabled={disableInsertDelete || noRowsSelected}>
                    <FontAwesomeIcon icon={faDumpsterFire} className='inline-block object-cover' />
                </IconButton>
                <IconButton color='secondary' className='flex' title='Reset saved table state' onClick={outerProps.resetState}>
                    <FontAwesomeIcon icon={faRedoAlt} className='inline-block object-cover' />
                </IconButton>
                <RHFM_IconButton color='secondary' title='Toggle column filters' icon={showColumnFilters ? faFilterSlash : faFilters} onClick={toggleShowColumnFilters} />
                {/* <MRT_ToggleFiltersButton table={props.table} /> */}
                <MRT_ShowHideColumnsButton table={props.table} />
                <MRT_ToggleDensePaddingButton table={props.table} />
                <MRT_ToggleFullScreenButton table={props.table} />
                {/* <MRT_ToggleGlobalFilterButton table={props.table} /> */}
                <RHFM_IconButton color='secondary' title='Toggle global filter' icon={showGlobalFilter ? faMagnifyingGlassMinus : faMagnifyingGlass} onClick={toggleShowGlobalFilter} />
            </>
        );
    }
    return RenderToolbarInternalActions;
}
