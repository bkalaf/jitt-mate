import { CellContext } from '@tanstack/react-table';
import { useColumnMeta } from '../../../hooks/useColumnMeta';

export function LookupTableCell<T, TValue extends EntityBase>({ getValue, ...props }: CellContext<T, any>) {
    const { labelProperty } = useColumnMeta<T>(props.column);
    const objValue: Optional<RealmObj<TValue> & TValue> = getValue<RealmObj<TValue> | null>() ?? undefined;
    const value = objValue == null ? null : labelProperty == null ? undefined : objValue[labelProperty as keyof TValue];
    return value?.toString() ?? null;
}
