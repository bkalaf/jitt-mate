import { Path } from 'react-hook-form-mui';
import { JITTEnumControl } from '../Controls/JITTEnumControl';
import { OuterEnumCell } from '../OuterEnumCell';
import { toHeader } from '../toHeader';
import { MRT_RowData } from 'material-react-table';

export function enumDefinition<T extends MRT_RowData>(
    name: Path<T>,
    { enumMap, colorMap, ...opts }: { enumMap: EnumMapOrFunction; colorMap?: EnumMapOrFunction; header?: string },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    const header = toHeader(opts, name);
    return {
        accessorKey: name,
        header: header,
        Cell: OuterEnumCell(enumMap, colorMap),
        Edit: JITTEnumControl({ enumMap }, initialDisable ?? false, ...dependencies)
    } as DefinedMRTColumn<T>;
}



