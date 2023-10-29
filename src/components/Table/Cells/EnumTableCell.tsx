import { CellContext } from '@tanstack/react-table';
import { usePropertyInfo } from './usePropertyInfo';

export function EnumTableCell<T>(props: CellContext<T, any>) {
    const { enumMap } = usePropertyInfo(props.table, props.column, 'enum');
    // const { isRowEdittable, updateOne } = useCollectionViewContext<T>();
    // const { enumMap } = useColumnMeta<T>(props.column);
    // console.log(`meta`, props.column.columnDef.meta)
    // const $isEdittable = useMemo(() => isRowEdittable(props.row), [isRowEdittable, props.row]);
    // const value = useMemo(() => {
    //     return props.getValue<string | undefined>();
    // }, [props]);
    // const getRowId = useGetRowId();
    // const $onChange = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
    //     // $setValue(ev.target.selectedOptions[0].value ?? '');
    //     updateOne({ id: getRowId(props.row.original), propertyName: props.column.id, value: ev.target.selectedOptions[0].value });
    // }, [getRowId, updateOne, props.column.id, props.row.original]);
    const value = props.getValue();
    return value == null ? null : (enumMap ?? {})[value as string];
}
