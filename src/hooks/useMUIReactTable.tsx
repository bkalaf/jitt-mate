import { MRT_Row, MRT_RowData, MRT_TableInstance, MRT_TableOptions } from 'material-react-table';
import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { IRealmEntity } from '../dal/types';
import { usePersistedState } from './usePersistedState';
import { useReflectionContext } from './useReflectionContext';
import { createRenderToolbarInternalActions } from '../components/Table/creators/createRenderToolbarInternalActions';
import { konst } from '../common/functions/konst';
import { createRenderRowActions } from '../components/Table/creators/createRenderRowActions';
import { useTableConstants } from './useTableConstants';
import { createRenderEditRowDialogContentRHF } from '../components/Table/creators/createRenderEditRowDialogContent';
import { useDefaultColumn } from './useDefaultColumn';
import { TableTypeObject, tableType } from './tableType';
import { AlertColor } from '@mui/material';
import { useParams } from 'react-router-dom';
import { createRenderCreateRowDialogContentRHF } from '../components/Table/creators/createRenderCreateRowDialogContent';
import { useLocalRealm } from './useLocalRealm';
import { updateRecord } from './updateRecord';
import { createDetailSubComponent } from '../components/Table/creators/createDetailSubComponent';
import { useToggler } from './useToggler';
import { useJITTCollectionContext } from '../components/Contexts/useJITTCollectionContext';
import { getFacetedUniqueValues } from '@tanstack/react-table';
export function useMUIReactTable<T extends MRT_RowData>({
    type,
    objectType,
    propertyName,
    parentRow,
    isLink
}: {
    type?: 'list' | 'dictionary' | 'set' | 'object';
    propertyName?: string;
    objectType?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentRow?: MRT_Row<any>;
    isLink?: boolean;
}) {
    const collectionRoute = useParams<{ collection: string }>().collection;
    const collection = objectType ?? collectionRoute ?? 'n/a';
    const db = useLocalRealm;
    const {
        deleteOne,
        insert,
        invalidator,
        columns,
        getCanInsertDelete,
        toGetRowCanExpand,
        getRowId,
        persistedName,
        queryFn,
        queryKey,
        // renderDetailPanel: toRenderDetailPanel
    } = useMemo(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        () => tableType[type ?? 'collection']({ collection: collectionRoute ?? '', objectType: objectType ?? '', propertyName: propertyName ?? '', parentRow: parentRow as any }) as TableTypeObject<T>,
        [collectionRoute, objectType, parentRow, propertyName, type]
    );
    const {
        queryFn: $queryFn,
        queryKey: $queryKey,
        getRowId: $getRowId,
        columns: $columns
    } = useMemo(
        () =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            isLink ?? false ? tableType.collection({ collection: collection ?? ('' as any), objectType: '', parentRow: undefined as any, propertyName: '' }) : { columns, queryFn, queryKey, getRowId },
        [collection, columns, getRowId, isLink, queryFn, queryKey]
    );
    const {
        data,
        dataUpdatedAt,
        isLoading: isQueryLoading,
        isError: isQueryErrored
    } = useQuery({
        queryKey: $queryKey,
        queryFn: $queryFn
    });
    const {
        isPending: isInsertPending,
        isError: isInsertError
    } = useMutation({
        mutationFn: insert,
        ...invalidator
    });
    const {
        isPending: isEditPending,
        isError: isEditError
    } = useMutation({
        mutationFn: updateRecord(collection, db())
    });
    const {
        mutateAsync: deleteAsync,
        mutate: deleteSync,
        isPending: isDeletePending,
        isError: isDeleteError
    } = useMutation({
        mutationFn: deleteOne,
        ...invalidator
    });
    const onClickDumpsterFire = (t: MRT_TableInstance<T>) => {
        const rows = t.getSelectedRowModel().rows;
        deleteAsync({ row: rows });
    };
    const onClickLightning = (t: MRT_TableInstance<T>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows = t.getSelectedRowModel().rows as any as MRT_Row<Entity<T> & IRealmEntity<T>>[];
        for (const item of rows) {
            item.original.update();
        }
        invalidator.onSuccess();
    };
    const isError = isDeleteError || isInsertError || isEditError || isQueryErrored;
    const isLoading = isDeletePending || isInsertPending || isEditPending || isQueryLoading;
    const { state, handlers, resetState } = usePersistedState(persistedName);
    const { getFieldInfos } = useReflectionContext();
    const fieldInfos = useMemo(() => getFieldInfos(collection), [collection, getFieldInfos]);
    const getRowCanExpand = useMemo(() => toGetRowCanExpand(fieldInfos), [fieldInfos, toGetRowCanExpand]);
    const renderDetailPanel = (createDetailSubComponent ?? konst(konst(<></>)))(fieldInfos);
    const { matchFromStart, toggleMatchFromStart } = useJITTCollectionContext();
    const renderRowActions = createRenderRowActions({ getCanInsertDelete, deleteOne: deleteSync });
    const constants = useTableConstants();
    const defaultColumn = useDefaultColumn<T>();
    const renderToolbarInternalActions = createRenderToolbarInternalActions({ onClickDumpsterFire, resetState, onClickLightning, getCanInsertDelete, objectType, propertyName, parentRow, type, state, handlers, matchFromStart, toggleMatchFromStart });
    return {
        dataUpdatedAt,
        options: {
            ...constants,
            renderDetailPanel,
            getFacetedUniqueValues: getFacetedUniqueValues(),
            renderToolbarInternalActions,
            renderRowActions,
            renderCreateRowDialogContent: createRenderCreateRowDialogContentRHF(collection),
            renderEditRowDialogContent: createRenderEditRowDialogContentRHF(collection),
            data: data ?? [],
            getRowId: $getRowId,
            getRowCanExpand,
            renderFallbackValue: null,
            columns: $columns,
            defaultColumn,
            ...handlers,
            state: {
                ...state,
                isLoading,
                showLoadingOverlay: isLoading,
                isSaving: isInsertPending || isEditPending,
                showAlertBanner: isError,
                showProgressBars: isLoading
            },
            
            muiToolbarAlertBannerProps: isError
                ? {
                      color: 'error' as AlertColor,
                      children: 'NETWORK ERROR - COLLECTION FAILED TO LOAD.'
                  }
                : undefined
        } as MRT_TableOptions<any>,
        invalidator
    };
}
