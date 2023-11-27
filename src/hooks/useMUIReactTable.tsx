import { MRT_Row, MRT_RowData, MRT_TableInstance } from 'material-react-table';
import { useMemo } from 'react';
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
import { is } from '../dal/is';
import { createRenderCreateRowDialogContentRHF } from '../components/Table/creators/createRenderCreateRowDialogContent';

export function tapOr<T, TArgs extends AnyArray>(funcOr?: T | ((...x: TArgs) => T)) {
    return (...args: TArgs) => (funcOr == null ? undefined : is.func<(...args: TArgs) => T>(funcOr) ? funcOr(...args) : (funcOr as T));
}
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
    const {
        deleteOne,
        edit,
        insert,
        invalidator,
        columns,
        getCanInsertDelete,
        toGetRowCanExpand,
        getRowId,
        persistedName,
        queryFn,
        queryKey,
        renderDetailPanel: toRenderDetailPanel
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
        mutationFn: edit,
        ...invalidator
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
    const getRowCanExpand = toGetRowCanExpand(fieldInfos);
    const renderDetailPanel = (toRenderDetailPanel ?? konst(konst(<></>)))(fieldInfos);
    const renderToolbarInternalActions = createRenderToolbarInternalActions({ onClickDumpsterFire, resetState, onClickLightning, getCanInsertDelete, objectType, propertyName, parentRow, type });
    const renderRowActions = createRenderRowActions({ getCanInsertDelete, deleteOne: deleteSync });
    const onCreatingRowSave = (props: MRT_TableOptionFunctionParams<T, 'onCreatingRowSave'>) => {
        insertAsync(
            { values: props.values as T },
            {
                onSuccess: () => {
                    console.error('exiting creating mode');
                    props.exitCreatingMode();
                }
            }
        );
    };
    const onEditingRowSave = (props: MRT_TableOptionFunctionParams<T, 'onEditingRowSave'>) => {
        editAsync(
            { values: props.values as T },
            {
                onSuccess: () => {
                    console.error('existing editing mode');
                    props.exitEditingMode();
                }
            }
        );
    };
    const onCreatingRowCancel = (props: MRT_TableOptionFunctionParams<T, 'onCreatingRowCancel'>) => {
        props.table.setCreatingRow(null);
    };
    const onEditingRowCancel = (props: MRT_TableOptionFunctionParams<T, 'onEditingRowCancel'>) => {
        props.table.setEditingRow(null);
    };
    const constants = useTableConstants();
    const defaultColumn = useDefaultColumn<T>();
    return {
        dataUpdatedAt,
        options: {
            ...constants,
            onEditingRowCancel,
            onEditingRowSave,
            onCreatingRowSave,
            onCreatingRowCancel,
            renderDetailPanel,
            renderToolbarInternalActions,
            renderRowActions,
            renderCreateRowDialogContent: createRenderCreateRowDialogContentRHF(collection, insertAsync),
            renderEditRowDialogContent: createRenderEditRowDialogContentRHF(collection, editAsync),
            data: data ?? [],
            enableRowNumbers,
            getRowId: $getRowId,
            getRowCanExpand,
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
            paginationDisplayMode: 'pages',
            positionPagination: 'both',
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
