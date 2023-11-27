import { MRT_EditActionButtons, MRT_Row } from 'material-react-table';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { useCollectionRoute } from '../../../hooks/useCollectionRoute';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { useMeta } from '../../../hooks/useMeta';
import { Form } from '../../Form';
import { Barcode } from '../../../dto/collections/Barcode';
import { ILocationSegment } from '../../../dal/types';

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

const initialCollection = {
    barcode:() => ({
        rawValue: ''
    })
}

const convertToRealm = {
    barcode: (payload: { rawValue: string }) => payload,
}

const insertAction = {
    locationSegmentBarcode: (row: MRT_Row<ILocationSegment>) => (payload: { rawValue: string }) => () => {
        row.original.upcs.push(insertAction.barcode(payload) as any)
    },
    barcode: (payload: { rawValue: string }) => Barcode.ctor(payload.rawValue, false)
};
export function createRenderCreateRowDialogContentRHF<T extends AnyObject>(collection: string, insertAsync: UseMutateAsyncFunction<AnyObject, Error, { values: T }>) {
    function RenderCreateRowDialogContent(props: MRT_TableOptionFunctionParams<T, 'renderEditRowDialogContent'>) {
        const { init, valueIn, valueOut } = useMeta(props.table.options.columns);
        const initial = async () => valueIn(init()) as T;
        return (
            <>
                <Form
                    defaultValues={initial}
                    onValid={(data: T) => {
                        console.log(`data`, data);
                        const payload = valueOut(data);
                        console.log(`payload`, payload);
                        return insertAsync(
                            { values: payload as T },
                            {
                                onSuccess: () => {
                                    props.table.setEditingRow(null);
                                }
                            }
                        );
                    }}
                    onInvalid={(errors) => {
                        alert('ERROR');
                        const errs = Object.values(errors)
                            .map((e) => e?.message)
                            .join('\n');
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
    return RenderCreateRowDialogContent;
}