import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { List, ListItem, ListItemText } from '@mui/material';
import React from 'react';

export function DBSetDetailCell<T, TParent>(ItemComponent: ({ payload }: { payload: T; }) => string) {
    return function DBListDetailCellInner(props: Parameters<Exclude<MRT_ColumnDef<TParent & MRT_RowData, DBSet<T>>['Cell'], undefined>>[0]) {
        const value = props.cell.getValue();
        return value == null || value.length === 0 ? null : (
            <List dense className='p-0 m-0'>
                {Array.from(value.values()).map((item, ix) => (
                    <ListItem key={ix} className='p-0 m-0'>
                        <ListItemText primary={ItemComponent({ payload: item })} />
                    </ListItem>
                ))}
            </List>
        );
    };
}
