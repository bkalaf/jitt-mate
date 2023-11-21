import { MRT_RowData, MRT_TableOptions } from 'material-react-table';
import { useMemo } from 'react';

export function useDefaultColumn<T extends MRT_RowData>() {
    const result: MRT_TableOptions<T>['defaultColumn'] = useMemo(
        () => ({
            muiTableHeadCellProps: {
                className: 'font-rubik',
                style: {
                    fontSize: '1.250rem',
                    fontFamily: 'Rubik',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                }
            },
            muiTableBodyCellProps: {
                className: 'font-rubik',
                style: {
                    fontSize: '1.05rem',
                    fontFamily: 'Rubik',
                    whiteSpace: 'nowrap'
                }
            }
        }),
        []
    );
    return result;
}
