import { Chip } from '@mui/material';
import React from 'react';

// function DBListCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<DBList<any>>, T>) {
//     const value = props.cell.getValue() as Optional<DBList<any>>;
//     return (value?.length ?? 0).toFixed(0);
// }
export function OuterEnumCell(enumMap: EnumMap, colorMap?: EnumMap) {
    return function EnumCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<string>, T>) {
        const value = props.cell.getValue() as Optional<string>;
        const output = value != null ? enumMap[value] : value;
        const colors = value != null && colorMap != null ? colorMap[value] : '';
        return value != null && <Chip className={colors} label={output}></Chip>;
    };
}
