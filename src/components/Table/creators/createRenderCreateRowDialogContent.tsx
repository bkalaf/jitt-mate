import { MRT_EditActionButtons } from 'material-react-table';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { useCollectionRoute } from '../../../hooks/useCollectionRoute';

export function createRenderCreateRowDialogContent() {
    function RenderCreateRowDialogContent<T extends AnyObject>(props: MRT_TableOptionFunctionParams<T, 'renderCreateRowDialogContent'>) {
        const collection = useCollectionRoute();
        return (
            <>
                <DialogTitle variant='h5' className='flex items-center justify-center font-rubik'>
                    {toProperFromCamel(collection)}
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {props.internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant='icon' table={props.table} row={props.row} />
                </DialogActions>
            </>
        );
    }
    return RenderCreateRowDialogContent;
}
