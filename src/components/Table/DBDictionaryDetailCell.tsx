import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { List, ListItem, ListItemText } from '@mui/material';
import React from 'react';

export function DBDictionaryDetailCell<T, TParent>(ItemComponent: ({ data }: { data: T }) => React.ReactNode) {
    return function DBDictionaryInnerCell(props: Parameters<Exclude<MRT_ColumnDef<TParent & MRT_RowData, DBDictionary<T>>['Cell'], undefined>>[0]) {
        const value = props.cell.getValue() ?? {};
        const entries = Object.entries(value);
        return (
            <fieldset className='w-full'>
                <legend>{props.column.columnDef.header}</legend>
                <List>
                    {entries.map(([k, v], ix) => {
                        return (
                            <ListItem key={ix}>
                                <ListItemText primary={<span>{k}</span>} secondary={<ItemComponent data={v} />} />
                            </ListItem>
                        );
                    })}
                </List>
            </fieldset>
        );
    };
}
