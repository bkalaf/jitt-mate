import { Chip } from '@mui/material';
import { konst } from '../../common/functions/konst';
import { MRT_Row, MRT_RowData } from 'material-react-table';
import { getProperty } from '../Contexts/getProperty';

export function useHandleEnumMapOrFunctionCell(row: MRT_Row<MRT_RowData>, enumMap?: EnumMapOrFunction) {
    const [propertyName, func] = Array.isArray(enumMap) ? enumMap : [undefined, konst(enumMap ?? {}) as (value: string) => EnumMap<string, string>];
    const value = propertyName ? getProperty(propertyName)(row.original) : undefined;
    return func(value);
}
export function OuterEnumCell(enumMap: EnumMapOrFunction, colorMap?: EnumMapOrFunction) {
    return function EnumCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<string>, T>) {
        const value = props.cell.getValue() as Optional<string>;
        const eMap = useHandleEnumMapOrFunctionCell(props.row, enumMap);
        const cMap = useHandleEnumMapOrFunctionCell(props.row, colorMap)
        const output = value != null ? eMap[value] : value;
        const colors = value != null && colorMap != null ? cMap[value] : '';
        return value != null ? <Chip className={colors} label={output}></Chip> : null;
    };
}
