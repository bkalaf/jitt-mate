import { toProperFromCamel } from '../../../common/text/toProperCase';
import { RHFM_FloatCell } from '../Cells/RHFM_FloatCell';
import { RHFM_FloatControl } from '../../Controls/RHFM_FloatControl';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { IDependency } from '../Controls/RHFM_Depends';


export function floatMeta<T extends MRT_RowData>(name: string, { header, precision, ...rest }: { header?: string; min?: number; max?: number; precision?: 1 | 2 | 3 | 4; required?: boolean; readOnly?: boolean; uom?: string; }, ...dependencies: IDependency[]) {
    return {
        header: header ?? toProperFromCamel(name.split('.').reverse()[0]),
        Cell: RHFM_FloatCell<T>(precision ?? 2, rest.uom),
        Edit: RHFM_FloatControl(name, header ?? toProperFromCamel(name), precision ?? 2, rest, ...dependencies),
        enableSorting: false,
        enableColumnFilter: false
    } as MRT_ColumnDef<T, any>;
}
