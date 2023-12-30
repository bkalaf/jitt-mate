import { MRT_Row, MRT_RowData, MRT_TableInstance } from 'material-react-table';
import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { IRealmEntity } from '../dal/types';
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
import { BSON } from 'realm';
import { useNonPersistedState } from './useNonPersistedState';
import { useToggler } from './useToggler';
import { useJITTCollectionContext } from '../components/Contexts/useJITTCollectionContext';

export function useMUIItemReactTable<T extends MRT_RowData>({
    type, parentRow
}: {
    type?: 'list' | 'dictionary' | 'set' | 'object';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentRow?: MRT_Row<any>;
}) {
    const collectionRoute = useParams<{ collection: string; }>().collection;
    const collection = collectionRoute ?? 'n/a';
    const oidRoute = useParams<{ oid: string; }>().oid;
    const oid = oidRoute ?? 'n/a';
    const db = useLocalRealm();

    const { data, dataUpdatedAt, isLoading: isQueryLoading, isError: isQueryErrored } = useQuery({
        queryKey: [collection, oid],
        queryFn: () => {
            return Promise.resolve([db.objectForPrimaryKey(collection, new BSON.ObjectId(oid))]);
        }
    });
    const { matchFromStart, toggleMatchFromStart } = useJITTCollectionContext()
    const getCanInsertDelete = () => false;
    const {
        deleteOne, invalidator, columns, toGetRowCanExpand, getRowId,
        // renderDetailPanel: toRenderDetailPanel
    } = useMemo(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        () => tableType['collection']({ collection: collectionRoute ?? '', objectType: '', propertyName: '', parentRow: parentRow as any }) as TableTypeObject<T>,
        [collectionRoute, parentRow]
    );

    const { isPending: isEditPending, isError: isEditError } = useMutation({
        mutationFn: updateRecord(collection, db)
    });
    const {
        mutateAsync: deleteAsync, mutate: deleteSync, isPending: isDeletePending, isError: isDeleteError
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
    const isError = isDeleteError || isEditError || isQueryErrored;
    const isLoading = isDeletePending || isEditPending || isQueryLoading;
    const { state, handlers, resetState } = useNonPersistedState();
    const enableRowNumbers = type != null && (type === 'set' || type === 'list');
    const { getFieldInfos } = useReflectionContext();
    const fieldInfos = useMemo(() => getFieldInfos(collection), [collection, getFieldInfos]);
    const getRowCanExpand = useMemo(() => toGetRowCanExpand(fieldInfos), [fieldInfos, toGetRowCanExpand]);
    const renderDetailPanel = (createDetailSubComponent ?? konst(konst(<></>)))(fieldInfos);
    const renderToolbarInternalActions = createRenderToolbarInternalActions({
        onClickDumpsterFire,
        resetState,
        onClickLightning,
        getCanInsertDelete,
        objectType: undefined,
        propertyName: undefined,
        parentRow,
        type: 'object',
        state,
        handlers,
        matchFromStart,
        toggleMatchFromStart
    });
    const renderRowActions = createRenderRowActions({ getCanInsertDelete, deleteOne: deleteSync });
    const constants = useTableConstants();
    const defaultColumn = useDefaultColumn<T>();
    
    return {
        dataUpdatedAt,
        options: {
            ...constants,
            renderDetailPanel,
            renderToolbarInternalActions,
            renderRowActions,
            renderCreateRowDialogContent: createRenderCreateRowDialogContentRHF(collection),
            renderEditRowDialogContent: createRenderEditRowDialogContentRHF(collection),
            data: data ?? [],
            enableRowNumbers,
            getRowId: getRowId,
            getRowCanExpand,
            renderFallbackValue: null,
            columns: columns,
            defaultColumn,
            ...handlers,
            state: {
                ...state,
                isLoading,
                showLoadingOverlay: isLoading,
                isSaving: isEditPending,
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
