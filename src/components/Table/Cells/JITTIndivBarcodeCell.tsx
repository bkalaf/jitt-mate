import { Popover } from '@mui/material';
import { MRT_RowData } from 'material-react-table';
import { useState } from 'react';
import { IBarcode } from '../../../dal/types';
import { InnerBarcode } from './InnerBarcode';
import { convertBarcodeType } from './BarcodeCell';

export function JITTIndivBarcodeCell<T extends MRT_RowData>({ value }: { value: Optional<IBarcode>; }) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const output = value != null ? [value.rawValue.slice(0, 1), value.rawValue.slice(1, 2), value.rawValue.slice(2, 7), value.rawValue.slice(7, 12), value.rawValue.slice(12)].join('-') : '';
    return value == null ? null : (
        <span className='flex flex-row'>
            <span onClick={(ev: React.SyntheticEvent) => setAnchorEl(ev.currentTarget as any)}>{output}</span>
            <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }} onClose={() => setAnchorEl(null)}>
                <InnerBarcode value={parseInt(value.rawValue, 10).toFixed(0)} type={convertBarcodeType(value.type) ?? 'ean13'} />
            </Popover>
        </span>
    );
}
