import { CellContext } from '@tanstack/react-table';
import { usePropertyInfo } from '../../../hooks/usePropertyInfo';
import { convertToLookup } from '../../../dal/enums/convertToLookup';

export function EnumTableCell<T>(props: CellContext<T, any>) {
    const { enumMap, lookupProperty } = usePropertyInfo(props.table, props.column, 'enum');
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
    const lookup = convertToLookup(enumMap ?? {}, lookupProperty as any);
    return value == null ? null : lookup(value) as string;
}

