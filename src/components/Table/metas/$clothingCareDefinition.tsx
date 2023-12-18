import { MRT_RowData } from 'material-react-table';
import { toHeader } from '../toHeader';
import { ClothingCareCell } from '../clothingCareMeta';
import { JITTClothingCareControl } from '../Controls/JITTClothingCareControl';

export const clothingCareDefinition = function <T extends MRT_RowData>(name: string, opts: { header?: string }, initialDisable = false, ...dependencies: IDependency[]): DefinedMRTColumn<T> {
    const header = toHeader(opts, name);
    return {
        accessorKey: name,
        header,
        Cell: ClothingCareCell,
        Edit: JITTClothingCareControl(initialDisable, ...dependencies)
    };
};
