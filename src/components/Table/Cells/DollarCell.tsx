import { MRT_ColumnDef } from 'material-react-table';


export function DollarCell<T extends EntityBase>(props: Parameters<Exclude<MRT_ColumnDef<T, Optional<number>>['Cell'], undefined>>[0]) {
    const value = props.renderedCellValue as Optional<number>;
    return value ? '$'.concat(value.toFixed(2)) : null;
}
