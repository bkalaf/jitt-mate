import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';

export function RHFM_FloatCell<T extends MRT_RowData>(precision: 0 | 1 | 2 | 3 | 4, uom?: string) {
    function InnerFloatCell(props: Parameters<Exclude<MRT_ColumnDef<T, Optional<number>>['Cell'], undefined>>[0]): React.ReactNode {
        console.log('InnerFloatCell');
        const v1 = props.renderedCellValue;
        console.log(`renderedCellValue`, v1);
        const value = props.cell.getValue() ?? 0;
        console.log(`value`, value);
        return <span>
            {value ? [(value as number)?.toFixed(precision), uom].filter((x) => x != null).join(' ') : null}
        </span>
    }
    console.log('RHFM_FloatCell')
    return InnerFloatCell;
}
