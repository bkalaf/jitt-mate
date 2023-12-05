export function DBSetCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<DBSet<any>>, T>) {
    const value = props.cell.getValue() as Optional<DBSet<any>>;
    return (value?.size ?? 0).toFixed(0);
}
