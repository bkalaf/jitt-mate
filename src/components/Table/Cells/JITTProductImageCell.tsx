import { MRT_ColumnDef } from 'material-react-table';
import { IProductImage } from '../../../dal/types';
import { useCallback } from 'react';
import { List } from '@mui/material';
import { useLocalRealm } from '../../../hooks/useLocalRealm';
import { JITTImageListItem } from './JITTImageListItem';

export function JITTProductImageCell<T extends EntityBase>(props: Parameters<Exclude<MRT_ColumnDef<T, DBBacklink<IProductImage>>['Cell'], undefined>>[0]) {
    const images = Array.from(props.cell.getValue() ?? []);
    const db = useLocalRealm();
    const deleteItem = useCallback(
        (img: IProductImage) => {
            return () => db.delete(img);
        },
        [db]
    );
    return (
        <List disablePadding>
            {images.map((image, ix) => {
                return <JITTImageListItem image={image} ix={ix} className='border border-black rounded-lg m-0 px-2.5 py-1' deleteItem={deleteItem(image)} key={ix} />;
            })}
        </List>
    );
}
