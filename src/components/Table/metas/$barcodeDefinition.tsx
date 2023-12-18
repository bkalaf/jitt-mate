import { BarcodeCell } from '../Cells/BarcodeCell';
import { MRT_RowData } from 'material-react-table';
import { toHeader } from '../toHeader';
import { Path } from 'react-hook-form-mui';
import { JITTBarcodeControl } from '../Controls/JITTBarcodeControl';

export function barcodeDefinition<T extends MRT_RowData>(name: Path<T>, opts: { header?: string; index?: number }, initialDisable = false, ...dependencies: IDependency[]) {
    return {
        accessorKey: name,
        header: toHeader(opts, name),
        enableEditing: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Cell: BarcodeCell as any,
        Edit: JITTBarcodeControl(initialDisable, ...dependencies)
    } as DefinedMRTColumn<T>;
}


