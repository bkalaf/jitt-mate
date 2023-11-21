import { MRT_EditActionButtons } from 'material-react-table';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useCollectionRoute } from '../../../hooks/useCollectionRoute';
import { toProperFromCamel } from '../../../common/text/toProperCase';

export function createRenderEditRowDialogContent() {
    function RenderEditRowDialogContent<T extends AnyObject>(props: MRT_TableOptionFunctionParams<T, 'renderEditRowDialogContent'>) {
        const collection = useCollectionRoute();
        return (
            <>
                <DialogTitle variant='h5' className='flex items-center justify-center font-rubik'>{toProperFromCamel(collection)}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {props.internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant='icon' table={props.table} row={props.row} />
                </DialogActions>
            </>
        );
    }
    return RenderEditRowDialogContent;
}
