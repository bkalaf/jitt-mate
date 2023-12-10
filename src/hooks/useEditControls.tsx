import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import * as React from 'react';
import { useCallback } from 'react';

export function useEditControls<T>(columns: DefinedMRTColumns<T & MRT_RowData>) {
    return useCallback(
        (props: Parameters<Exclude<MRT_ColumnDef<any, DBList<T>>['Edit'], undefined>>[0]) => {
            return (
                <>
                    {columns
                        .map((x) => x.Edit ?? (() => null))
                        .map((EditComponent, ix) => {
                            const EditComp = EditComponent as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<any, DBList<T>>['Edit'], undefined>>[0]>;
                            return <EditComp key={ix} {...props} />;
                        })}
                </>
            );
        },
        [columns]
    );
}
