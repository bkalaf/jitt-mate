import { ListItem, ListItemText } from '@mui/material';
import { JITTIconButton } from '../clothingCareMeta';
import { InnerBarcode } from '../Cells/InnerBarcode';
import { BarcodeTypes } from '../../../dal/enums/barcodeTypes';
import { faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { IBarcode } from '../../../dal/types';

export function JITTBarcodeRow({ barcode, onDelete }: { barcode: IBarcode; onDelete: () => void }) {
    const { rawValue, type, valid } = barcode;
    return (
        <ListItem
            className='flex w-full aria-invalid:bg-rose-300'
            aria-invalid={!valid}
            secondaryAction={<JITTIconButton color='error' onClick={onDelete} Icon={faTrashCan} className='w-5 h-5' title='Delete this row.' />}>
            <ListItemText primary={<InnerBarcode value={rawValue.padStart(13, '0')} type={'ean' as keyof BarcodeTypes} />} secondary={type} />
        </ListItem>
    );
}
