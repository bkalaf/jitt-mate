import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { IMaterialComposition } from '../../../dal/types';
import { List, ListItem, ListItemText } from '@mui/material';

export function JITTMaterialsCell<T extends MRT_RowData>({...props }: Parameters<Exclude<MRT_ColumnDef<T, DBDictionary<IMaterialComposition>>['Cell'], undefined>>[0]) {
    const dictionary = Object.entries(props.cell.getValue() ?? {});
    return (
        <List disablePadding>
            {dictionary.map(([k, v], ix) => (
                <ListItem key={ix} disableGutters disablePadding >
                    <ListItemText primary={k} secondary={v.toOutput} />
                </ListItem>
            ))}
        </List>
    );
}
