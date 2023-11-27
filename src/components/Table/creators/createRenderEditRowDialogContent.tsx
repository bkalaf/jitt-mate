import { MRT_EditActionButtons } from 'material-react-table';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { Form } from '../../Form';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { convertToRealm } from './createRenderCreateRowDialogContent';

/** @deprecated */
export function createRenderEditRowDialogContent() {
    // function RenderEditRowDialogContent<T extends AnyObject>(props: MRT_TableOptionFunctionParams<T, 'renderEditRowDialogContent'>) {
    //     const collection = useCollectionRoute();
    //     return (
    //         <>
    //             <DialogTitle variant='h5' className='flex items-center justify-center font-rubik'>{toProperFromCamel(collection)}</DialogTitle>
    //             <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    //                 {props.internalEditComponents} {/* or render custom edit components here */}
    //             </DialogContent>
    //             <DialogActions>
    //                 <MRT_EditActionButtons variant='icon' table={props.table} row={props.row} />
    //             </DialogActions>
    //         </>
    //     );
    // }
    // return RenderEditRowDialogContent;
}

export function createRenderEditRowDialogContentRHF<T extends AnyObject>(collection: string, editAsync: UseMutateAsyncFunction<AnyObject, Error, { values: T }>) {
    function RenderEditRowDialogContent(props: MRT_TableOptionFunctionParams<T, 'renderEditRowDialogContent'>) {
        const convertTo = convertToRealm[collection] as (payload: Partial<T>) => T
        console.log(`initialForm`, props.row.original.toJSON());
        const initial = async () => props.row.original.toJSON() as T;
        console.log(`internalEditComponents`, props.internalEditComponents);
        return (
            <>
                <Form defaultValues={initial} onValid={(data: T) => {
                    const payload = convertTo(data);
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