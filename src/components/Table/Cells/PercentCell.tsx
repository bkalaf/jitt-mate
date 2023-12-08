import { Popover } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import { useBarcode } from 'react-barcodes';
import { useState } from 'react';
import { IBarcode } from '../../../dal/types';
import { BarcodeTypesKey } from '../../../dal/enums/barcodeTypes';

export function PercentCell<T extends EntityBase>(props: Parameters<Exclude<MRT_ColumnDef<T, Optional<number>>['Cell'], undefined>>[0]) {
    const value = props.renderedCellValue as Optional<number>;
    return value ? (value * 100).toFixed(2).concat('%') : null;
}
export function InnerBarcode({ value, type }: { value: string; type: BarcodeTypesKey }) {
    const { inputRef } = useBarcode({
        value,
        options: {
            format: type === 'upcA' || type === 'upcE' || type === 'isbn10' || type === 'sku' || type === 'locator' ? 'upc' : 'ean13',
            margin: 5
        }
    });
    return (
        <div className='flex'>
            <img className='block object-contain' ref={inputRef} />
        </div>
    );
}
export function BarcodeCell<T extends EntityBase>(props: Parameters<Exclude<MRT_ColumnDef<T, string>['Cell'], undefined>>[0]) {
    const { rawValue: value, type } = { ...(props.renderedCellValue as Optional<IBarcode>) };
    console.log(`BarcodeCell.value`, value, typeof value);
    // const output = [value.slice(0, 1), value.slice(1, 2), value.slice(2, 7), value.slice(7, 12), value.slice(12)].join('-');
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    // return (
    //     <div className='flex items-center justify-center text-center hover:scale-125'>

    //     </div>
    return (value == null ? null :
        <>
            <span onClick={(ev: React.SyntheticEvent) => setAnchorEl(ev.currentTarget as any)}>
                {value}
            </span>
            <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }} onClose={() => setAnchorEl(null)}>
                <InnerBarcode value={parseInt(value, 10).toFixed(0)} type={type} />
            </Popover>
        </>
    );
}

/*{/* <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
                <div className='flex'>
                    <img className='block object-contain' ref={inputRef} />
                </div>
            </Popover> */
