import { MRT_Row, MRT_RowData, MRT_TableInstance, MRT_TableOptions } from 'material-react-table';
import { useFormContext } from 'react-hook-form-mui';
import { useMutation } from '@tanstack/react-query';
import { useLocalRealm } from '../routes/loaders/useLocalRealm';
import { useCallback } from 'react';
import { updateRecordProperty } from './updateRecord';
import { useInvalidator } from './useInvalidator';
import { $tagIs } from '../dal/is';
import { ipcRenderer } from 'electron';

export function useClearCRUD<T extends MRT_RowData>() {
    return useCallback(({ row, table }: { row?: MRT_Row<T>; table: MRT_TableInstance<T> }) => {
        return () => {
            const { editingRow, creatingRow } = table.getState();
            const { setEditingRow, setCreatingRow } = table;
            if (editingRow != null) {
                setEditingRow(row ?? null);
            } else if (creatingRow != null) {
                setCreatingRow(row ?? null);
            }
        };
    }, []);
}
export function useOnSave<T extends MRT_RowData>(collection: string) {
    // const db = useLocalRealm();
    // const context = useFormContext();
    // const { formState } = context;
    // const { dirtyFields } = formState;
    // const setCRUDRow = useClearCRUD<T>();
    // const propertyNames = Object.entries(dirtyFields)
    //     .filter((x) => x[1])
    //     .map((x) => x[0]);
    // const { onSuccess } = useInvalidator(collection);
    // const { mutate } = useMutation({
    //     mutationFn: updateRecordProperty<T>(db, collection, context),
    //     onSuccess: () => {
    //         onSuccess();
    //     }
    // });
    // const createOnBlur = useCallback(
    //     ({ row }: { row: MRT_Row<T> }) => {
    //         return () => mutate({ propertyNames, row });
    //     },
    //     [mutate, propertyNames]
    // );
    // const onEditingRowSave = useCallback((props: Parameters<Exclude<MRT_TableOptions<T>['onEditingRowSave'], undefined>>[0]) => {
    //     const clearRow = setCRUDRow<T>({ row: props.row, table: props.table });
    //     const El = document.activeElement;
    //     if (El != null && $tagIs.dataEntryControl(El as HTMLElement)) {
    //         (El as HTMLInputElement).blur();
    //     }
    //     props.exitEditingMode();
    //     clearRow();
    // }, [setCRUDRow]);
    // const onEditingRowCancel: Exclude<MRT_TableOptions<T>['onEditingRowCancel'], undefined> = useCallback((props: Parameters<Exclude<MRT_TableOptions<T>['onEditingRowCancel'], undefined>>[0]) => {
    //     const func = async () => {
    //         const token = await (ipcRenderer.invoke('confirm-cancel') as Promise<number>);
    //         if (token === 0) {
    //             setCRUDRow({ row: undefined, table: props.table })();
    //         }
    //     };
    //     setImmediate(func);
    // }, [setCRUDRow]);
    // const onCreatingRowCancel = useCallback((props: Parameters<Exclude<MRT_TableOptions<T>['onCreatingRowCancel'], undefined>>[0]) => {
    //     const func = async () => {
    //         const token = await (ipcRenderer.invoke('confirm-cancel') as Promise<number>);
    //         if (token === 0) {
    //             setCRUDRow({ row: undefined, table: props.table })();
    //         }
    //     };
    //     setImmediate(func);
    // }, [setCRUDRow])
    return {
        
    };
}
