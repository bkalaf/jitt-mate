export function PercentCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Edit', number, T>) {
    const value = props.row.original.shipWeightPercent;
    return value ? (value * 100).toFixed(2).concat('%') : null;
}
