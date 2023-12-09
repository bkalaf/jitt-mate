import { MRT_RowData, MRT_ColumnDef } from 'material-react-table';
import { IProductImage } from '../../dal/types';


export function RHFM_ImageListCell<T extends MRT_RowData>(props: Parameters<Exclude<MRT_ColumnDef<T, Realm.Results<Entity<IProductImage>>>['Cell'], undefined>>[0]) {
    const value = props.cell.getValue();
    return <span>{Array.from(value ?? []).length}</span>;
}
