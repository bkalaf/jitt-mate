import { MRT_EditActionButtons } from 'material-react-table';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useCollectionRoute } from '../../../hooks/useCollectionRoute';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { Form } from '../../Form';
import { useMeta } from '../../../hooks/useMeta';
import { UseMutateAsyncFunction } from '@tanstack/react-query';

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

export function createRenderEditRowDialogContentRHF<T extends AnyObject>(collection: string, editAsync: UseMutateAsyncFunction<AnyObject, Error, { values: T }>) {
    function RenderEditRowDialogContent(props: MRT_TableOptionFunctionParams<T, 'renderEditRowDialogContent'>) {
        const { init, valueIn, valueOut } = useMeta(props.table.options.columns);
        console.log(`toJSON`, props.row.original.toJSON());
        const initial = async () => valueIn(props.row.original) as T;
        return (
            <>
                <Form defaultValues={initial} onValid={(data: T) => {
                    console.log(`data`, data);
                    const payload = valueOut(data);
                    console.log(`payload`, payload);    
                    return editAsync({ values: payload as T }, { onSuccess: () => {
                        props.table.setEditingRow(null);
                    }})
                }} onInvalid={(errors) => {
                    alert('ERROR');
                    const errs = Object.values(errors).map(e => e?.message).join('\n');
                    alert(errs);
                }}>
                    <DialogTitle variant='h5' className='flex items-center justify-center font-rubik'>
                        {toProperFromCamel(collection)}
                    </DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {props.internalEditComponents} {/* or render custom edit components here */}
                    </DialogContent>
                    <DialogActions>
                        <MRT_EditActionButtons variant='icon' table={props.table} row={props.row} />
                    </DialogActions>
                </Form>
            </>
        );
    }
    return RenderEditRowDialogContent;
}