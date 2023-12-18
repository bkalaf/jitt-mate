import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/pro-solid-svg-icons';
import { BSON } from 'realm';
import { fromOID } from '../../../dal/fromOID';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MRT_OIDCell<T extends MRT_RowData>(props: Parameters<Exclude<MRT_ColumnDef<T, any>['Cell'], undefined>>[0]) {
    const value = fromOID(props.cell.getValue<BSON.ObjectId>());
    return (
        <>
            <span className='flex w-4 h-4 bg-transparent border border-sky-500 text-slate-700' title={value as string}>
                <FontAwesomeIcon icon={faKey} className='block object-fill' />
            </span>
        </>
    );
}
