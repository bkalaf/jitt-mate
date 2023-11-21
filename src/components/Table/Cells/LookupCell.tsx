export function LookupCell<TV extends AnyObject,T extends EntityBase>(property: keyof TV & string) {
    return (props: MRT_ColumnDefFunctionParams<'Edit', TV, T>) => {
        const value = props.cell.getValue() as Optional<TV>;
        return value != null ? value[property].toString() : null;
    };
}
