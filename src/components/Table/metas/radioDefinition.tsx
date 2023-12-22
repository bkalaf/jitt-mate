import { toHeader } from '../toHeader';
import { Path } from 'react-hook-form-mui';
import { MRT_RowData } from 'material-react-table';
import { OuterEnumCell } from '../OuterEnumCell';
import { JITTRadioControl } from '../Controls/JITTRadioControl';

export function radioDefinition<T extends MRT_RowData>(
    name: Path<T>,
    { enumMap, colorMap, ...opts }: { enumMap: EnumMap; colorMap?: EnumMap; header?: string },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    const header = toHeader(opts, name);
    return {
        accessorKey: name,
        header: header,
        Cell: OuterEnumCell(enumMap, colorMap),
        Edit: JITTRadioControl({ enumMap }, initialDisable ?? false, ...dependencies)
    } as DefinedMRTColumn<T>;
}
