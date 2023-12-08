import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { BSON } from 'realm';


export function RHFM_UUIDCell<T extends MRT_RowData>(props: Parameters<Exclude<MRT_ColumnDef<T, BSON.UUID | undefined>['Cell'], undefined>>[0]) {
    const value = props.cell.getValue()?.toHexString(true) ?? 'n/a';
    return <span>
        {value}
    </span>;
}
