import { Chip } from '@mui/material';
import React from 'react';

// function DBListCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<DBList<any>>, T>) {
//     const value = props.cell.getValue() as Optional<DBList<any>>;
//     return (value?.length ?? 0).toFixed(0);
// }
export function OuterEnumCell(enumMap: EnumMap | ((x: string) => string), colorMap?: EnumMap | ((x: string) => string)) {
    return function EnumCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<string>, T>) {
        const value = props.cell.getValue() as Optional<string>;
        const output = value != null ? handleEnumMap(enumMap)(value) : value;
        const colors = value != null && colorMap != null ? handleEnumMap(colorMap)(value) : '';
        return value != null ? <Chip className={colors} label={output}></Chip> : null;
    };
}

export const handleEnumMap = (enumMap: EnumMap | ((x: string) => string)) => (value: string) => typeof enumMap === 'function' ? enumMap(value) : enumMap[value];