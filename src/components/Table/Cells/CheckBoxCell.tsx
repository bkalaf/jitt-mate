import { MRT_ColumnDef } from 'material-react-table';
import { IClassifier } from '../../../dal/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquareDashed } from '@fortawesome/pro-solid-svg-icons';
import { Icon } from '@mui/material';
import { konst } from '../../../common/functions/konst';

export function CheckBoxCell(props: Parameters<Exclude<MRT_ColumnDef<IClassifier, boolean>['Cell'], undefined>>[0]) {
    const value = (props.cell?.getValue ?? konst(false))() ?? false;
    return (
        <Icon className='bg-transparent'>
            {value ? <FontAwesomeIcon icon={faCheckSquare} className='block object-cover text-yellow-700' /> : <FontAwesomeIcon icon={faSquareDashed} className='block object-cover text-yellow-700' />}
        </Icon>
    );
}
