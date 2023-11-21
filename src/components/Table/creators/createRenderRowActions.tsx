import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePen, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { Box, IconButton } from '@mui/material';
import { ignore } from '../../../common/functions/ignore';
import { MRT_Row } from 'material-react-table';

export function createRenderRowActions(outerProps: { deleteOne?: (args: { row: MRT_Row<any> }) => void; getCanInsertDelete: () => boolean; }) {
    function RenderRowActions<T extends AnyObject>(props: MRT_TableOptionFunctionParams<T, 'renderRowActions'>) {
        return (
            <Box className='flex flex-nowrap gap-x-2'>
                <IconButton onClick={() => props.table.setEditingRow(props.row)} title='Edit this row.' className='flex text-sky-600 p-0.5'>
                    <FontAwesomeIcon icon={faSquarePen} className='block object-fill' />
                </IconButton>
                {outerProps.getCanInsertDelete() && (
                    <IconButton onClick={() => (outerProps.deleteOne ?? ignore)({ row: props.row })} className='flex p-1 text-emerald-800' title='Delete this row.'>
                        <FontAwesomeIcon icon={faTrashCan} className='inline-block object-cover' />
                    </IconButton>
                )}
            </Box>
        );
    }
    return RenderRowActions;
}
