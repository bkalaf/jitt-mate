import { MRT_ColumnDef } from 'material-react-table';
import { List, ListItem, ListItemText } from '@mui/material';

export function DBListDetailCell<T>(ItemComponent: ({ payload }: { payload: T; }) => string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function DBListDetailCellInner(props: Parameters<Exclude<MRT_ColumnDef<any, DBList<T>>['Cell'], undefined>>[0]) {
        const value = props.cell.getValue();
        return value == null || value.length === 0 ? null : (
            <List dense className='p-0 m-0'>
                {(value ?? []).map((item, ix) => (
                    <ListItem key={ix} className='p-0 m-0'>
                        <ListItemText primary={ItemComponent({ payload: item })} />
                    </ListItem>
                ))}
            </List>
        );
    };
}
