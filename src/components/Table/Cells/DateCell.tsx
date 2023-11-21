export function DateCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Edit', Date, T>) {
    const value = props.cell.getValue() as Date;
    return value.toLocaleString();
}
