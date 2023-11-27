import { MRT_ColumnDef } from 'material-react-table';

export function PercentCell<T extends EntityBase>(props: Parameters<Exclude<MRT_ColumnDef<T, Optional<number>>['Cell'], undefined>>[0]) {
    const value = props.renderedCellValue as Optional<number>;
    return value ? (value * 100).toFixed(2).concat('%') : null;
}
