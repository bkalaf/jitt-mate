/* eslint-disable @typescript-eslint/no-explicit-any */
import { MRT_ColumnDef } from 'material-react-table';
import { IBarcode } from '../../../dal/types';
import { is } from '../../../common/is';
import { JITTIndivBarcodeCell } from './JITTIndivBarcodeCell';

export function BarcodeCell<T extends EntityBase>(props: Parameters<Exclude<MRT_ColumnDef<T, string>['Cell'], undefined>>[0]) {
    const cellValue = props.cell.getValue<IBarcode[] | DBList<IBarcode> | undefined>() ?? [];
    const value = Array.isArray(cellValue) ? cellValue : is.dbList(cellValue) ? Array.from(cellValue.values()) : [];
    console.log(`BarcodeCell.value`, value, typeof value);
    // const output = [value.slice(0, 1), value.slice(1, 2), value.slice(2, 7), value.slice(7, 12), value.slice(12)].join('-');

    // return (
    //     <div className='flex items-center justify-center text-center hover:scale-125'>
    //     </div>
    return (
        <span className='flex flex-col'>
            {value.map((bc, ix) => {
                return <JITTIndivBarcodeCell value={bc} key={ix} />;
            })}
        </span>
    );
}

