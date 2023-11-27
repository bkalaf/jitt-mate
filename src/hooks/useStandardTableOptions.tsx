import { MRT_RowData, MRT_TableOptions } from 'material-react-table';
import { IRealmEntity } from '../dal/types';
import { useCallback, useMemo } from 'react';
import { useGetRowCanExpand } from '../dal/useGetRowCanExpand';
import { createRenderToolbarInternalActions } from '../components/Table/creators/createRenderToolbarInternalActions';
import { createRenderRowActions } from '../components/Table/creators/createRenderRowActions';
import { usePersistedState } from './usePersistedState';
import { createRenderCreateRowDialogContent } from '../components/Table/creators/createRenderCreateRowDialogContent';
import { createRenderEditRowDialogContent } from '../components/Table/creators/createRenderEditRowDialogContent';
import { collections } from '../components/Table/collections';
import { useDefaultColumn } from './useDefaultColumn';
import { useStaticDefs } from './useStaticDefs';
import { ColumnResizeMode } from '@tanstack/react-table';
import { useReflectionContext } from '../components/Contexts/useReflectionContext';
import { fromOID } from '../dal/fromOID';

function getRowOID<T extends EntityBase>(row: T) {
    return fromOID(row._id);
}
function getRowKey<T>(row: [string, T]) {
    return row[0];
}
function getRowIndex<T>(row: [number, T]) {
    return row[0].toFixed(0);
}
function convertList<T>(value: DBList<T>) {
    return value.map((x, ix) => [ix, x] as [number, T]);
}

export function useGetIDFunction(type: 'list' | 'dictionary' | 'set' | 'object' = 'object') {
    return useMemo(() => {
        switch (type) {
            case 'object':
                return getRowOID;
            case 'list':
            case 'set':
                return getRowIndex;
            case 'dictionary':
                return getRowKey;
        }
    }, []);
}
export function useStandardTableOptions<T extends MRT_RowData>(
    data: T[],
    isDataLoading: boolean,
    isDataErrored: boolean,
    deleteOne: (oid: OID) => void,
    {
        collection,
        propertyName,
        type,
        objectType
    }: { propertyName?: string; type?: 'list' | 'dictionary' | 'set' | 'object'; objectType?: RealmObjects; collection: keyof typeof collections & string },
    ...prefixedWith: string[]
) {
    const { handlers, state, resetState } = usePersistedState(objectType ?? collection);
    const { createRenderDetailPanel, getColumns } = useStaticDefs<T>(objectType ?? collection);
    const { getFieldInfos } = useReflectionContext();
    const infos = useMemo(() => getFieldInfos(collection), [collection, getFieldInfos]);
    const getRowCanExpand = useCallback(() => objectType == null && infos.length > 0, [infos.length, objectType]);
    const renderDetailPanel = useMemo(() => createRenderDetailPanel(infos), [createRenderDetailPanel, infos]);
    const columns = useMemo(() => getColumns(...prefixedWith), [getColumns, prefixedWith]);
    const renderRowActions = useMemo(() => createRenderRowActions({ deleteOne, collectionName: collection }), [collection, deleteOne]);
    const renderToolbarInternalActions = useMemo(() => createRenderToolbarInternalActions({ resetState }), [resetState]);
    const renderCreateRowDialogContent = useMemo(() => createRenderCreateRowDialogContent(), []);
    const renderEditRowDialogContent = useMemo(() => createRenderEditRowDialogContent(), []);
    const defaultColumn = useDefaultColumn<T>();

    return {
        autoResetAll: false,
        autoResetExpanded: false,
        autoResetPageIndex: false,
        columnResizeMode: 'onEnd' as ColumnResizeMode,
        columns,
        createDisplayMode: 'modal' as MRT_TableOptions<T>['createDisplayMode'],
        data,
        defaultColumn,
        editDisplayMode: 'modal' as MRT_TableOptions<T>['editDisplayMode'],
        enableColumnFilters: true,
        enableColumnOrdering: true,
        enableColumnResizing: true,
        enableRowSelection: true,
        enableStickyFooter: true,
        enableStickyHeader: true,
        enableRowActions: true,
        getRowCanExpand,
        layoutMode: 'grid-no-grow' as MRT_TableOptions<T>['layoutMode'],
        muiPaginationProps: {
            rowsPerPageOptions: [25, 50, 100, 250, 500, 1000, 2500]
        },
        positionToolbarAlertBanner: 'bottom' as MRT_TableOptions<T>['positionToolbarAlertBanner'],
        renderCreateRowDialogContent,
        renderDetailPanel,
        renderEditRowDialogContent,
        renderRowActions,
        renderToolbarInternalActions,
        columnFilterDisplayMode: 'popover' as MRT_TableOptions<T>['columnFilterDisplayMode'],
        ...handlers,
        state: {
            ...state,
            isLoading: isDataLoading
        } as Exclude<MRT_TableOptions<T>['state'], undefined>
    };
}


