export function IntCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<number>, T>) {
    return (props.cell.getValue() as Optional<number>)?.toFixed(0);
}
