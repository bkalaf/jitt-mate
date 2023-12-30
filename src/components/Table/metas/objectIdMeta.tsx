import { MRT_OIDCell } from '../Cells/MRT_OIDCell';

export const objectIdMeta = {
    accessorKey: '_id',
    id: '_id',
    header: 'OID',
    Cell: MRT_OIDCell,
    enableEditing: false,
    maxSize: 100,
    muiTableBodyCellProps: { style: { justifyContent: 'center' } },
    Edit: () => null,
    enableClickToCopy: true
} as DefinedMRTColumn<any>;
