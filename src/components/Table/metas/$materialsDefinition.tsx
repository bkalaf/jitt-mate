import { MRT_RowData } from 'material-react-table';
import { Path } from 'react-hook-form';
import { JITTMaterialsCell } from '../Controls/JITTMaterialsCell';
import { JITTMaterialsControl } from '../Controls/JITTMaterialsControl';

export function materialsDefinition<T extends MRT_RowData>(name: Path<T>, initialDisable = false, ...dependencies: IDependency[]) {
    return {
        accessorKey: name, 
        Cell: JITTMaterialsCell,
        Edit: JITTMaterialsControl(initialDisable, ...dependencies)
    }
}