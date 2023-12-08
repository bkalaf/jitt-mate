import { MRT_Row, MRT_RowData, MRT_TableInstance } from 'material-react-table';
import { useCallback, useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { IRealmEntity } from '../dal/types';
import { usePersistedState } from './usePersistedState';
import { useReflectionContext } from '../components/Contexts/useReflectionContext';
import { createRenderToolbarInternalActions } from '../components/Table/creators/createRenderToolbarInternalActions';
import { konst } from '../common/functions/konst';
import { createRenderRowActions } from '../components/Table/creators/createRenderRowActions';
import { useTableConstants } from './useTableConstants';
import { createRenderEditRowDialogContentRHF } from '../components/Table/creators/createRenderEditRowDialogContent';
import { useDefaultColumn } from './useDefaultColumn';
import { TableTypeObject, tableType } from './tableType';
import { AlertColor } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ConvertToRealmFunction, createRenderCreateRowDialogContentRHF } from '../components/Table/creators/createRenderCreateRowDialogContent';
import { useLocalRealm } from '../routes/loaders/useLocalRealm';
import { ipcRenderer } from 'electron';
import { updateRecord } from './updateRecord';
import { createDetailSubComponent } from '../components/Table/creators/createDetailSubComponent';
import { $convertToRealm } from '../components/Table/creators/$convertToRealm';
import { useOnSave } from './useOnBlur';

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
    const convertTo = useMemo(() => $convertToRealm[collection as keyof typeof $convertToRealm] as any as ConvertToRealmFunction<T>, [collection]);
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
            isLink ?? false ? tableType.collection({ collection: objectType ?? ('' as any), objectType: '', parentRow: undefined as any, propertyName: '' }) : { columns, queryFn, queryKey, getRowId },
        [columns, getRowId, isLink, objectType, queryFn, queryKey]
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
        mutateAsync: insertAsync,
        isPending: isInsertPending,
        isError: isInsertError
    } = useMutation({
        mutationFn: insert,
        ...invalidator
    });
    const {
        mutateAsync: editAsync,
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
    const enableRowNumbers = type != null && (type === 'set' || type === 'list');
    const { getFieldInfos } = useReflectionContext();
    const fieldInfos = useMemo(() => getFieldInfos(collection), [collection, getFieldInfos]);
    const getRowCanExpand = useMemo(() => toGetRowCanExpand(fieldInfos), [fieldInfos, toGetRowCanExpand]);
    const renderDetailPanel = (createDetailSubComponent ?? konst(konst(<></>)))(fieldInfos);
    const renderToolbarInternalActions = createRenderToolbarInternalActions({ onClickDumpsterFire, resetState, onClickLightning, getCanInsertDelete, objectType, propertyName, parentRow, type, state, handlers });
    const renderRowActions = createRenderRowActions({ getCanInsertDelete, deleteOne: deleteSync });
    const onCreatingRowSave = (props: MRT_TableOptionFunctionParams<T, 'onCreatingRowSave'>) => {
        insertAsync(
            { values: convertTo(props.values as any) as T },
            {
                onSuccess: props.exitCreatingMode
            }
        );
    };
    // const onEditingRowSave = (props: MRT_TableOptionFunctionParams<T, 'onEditingRowSave'>) => {
    //     console.group('onEditingRowSave');
    //     console.log(`props.values`, props.values);
    //     const result = convertTo(props.values as any) as T;
    //     console.log(`result`, result);
    //     editAsync(convertTo(props.values as any) as T, {
    //         onSuccess: props.exitEditingMode
    //     });
    //     console.groupEnd();
    // };
    // const onCreatingRowCancel = (props: MRT_TableOptionFunctionParams<T, 'onCreatingRowCancel'>) => {
    //     const func = async () => {
    //         const token = await (ipcRenderer.invoke('confirm-cancel') as Promise<number>);
    //         if (token === 0) {
    //             return 
    //         }
    //     }
    //     ipcRenderer.invoke('confirm-cancel').then((response) => {
    //         console.log(`ipcRenderer.invoke`, response);
    //         if (response === 0) props.table.setCreatingRow(null);
    //     });
    // };
    // const onEditingRowCancel = (props: MRT_TableOptionFunctionParams<T, 'onEditingRowCancel'>) => {
    //     ipcRenderer.invoke('confirm-cancel').then((response) => {
    //         if (response === 0) props.table.setEditingRow(null);
    //     });
    // };
    const constants = useTableConstants();
    const defaultColumn = useDefaultColumn<T>();
    return {
        dataUpdatedAt,
        options: {
            ...constants,
            renderDetailPanel,
            renderToolbarInternalActions,
            renderRowActions,
            renderCreateRowDialogContent: createRenderCreateRowDialogContentRHF(collection, insertAsync),
            renderEditRowDialogContent: createRenderEditRowDialogContentRHF(collection),
            data: data ?? [],
            enableRowNumbers,
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
        },
        invalidator
    };
}
