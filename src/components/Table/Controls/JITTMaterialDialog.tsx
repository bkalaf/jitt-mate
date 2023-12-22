import { FormProvider, useForm } from 'react-hook-form-mui';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { IMaterialComposition } from '../../../dal/types';
import { useCallback } from 'react';
import { JITTIconButton } from '../JITTIconButton';
import { faCancel, faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { $metas } from '../metas';
import { collections } from '../collections';
import { $initialCollection } from '../creators/$initialCollection';

export function JITTMaterialDialog<TParent>({
    isOpen, hideModal, onInsert, _id
}: {
    isOpen: boolean;
    hideModal: () => void;
    _id: OID;
    onInsert: (values: { _id: OID; key: string; value: IMaterialComposition; }) => Promise<void>;
}) {
    function InnerMaterialsDialog(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const columns = [$metas.string('key', { header: 'Key' }, false), ...collections['materialComposition'].getColumns('value')] as DefinedMRTColumns<{ key: string; value: TParent & MRT_RowData; }>;
        const EditControls = useEditControls(columns);
        const formContext = useForm({
            defaultValues: () => $initialCollection['materialComposition']().then((value) => ({
                key: '',
                value: value as IMaterialComposition
            }))
        });
        const onClick = useCallback(
            (ev: React.MouseEvent) => {
                formContext.handleSubmit(({ key, value }) => {
                    onInsert({ _id, key, value }).then(hideModal);
                })(ev);
            },
            [formContext]
        );
        return (
            <FormProvider {...formContext}>
                <Dialog open={isOpen} onClose={hideModal} maxWidth='md' fullWidth>
                    <DialogContent>
                        <EditControls {...(props as any)} />
                    </DialogContent>
                    <DialogActions className='flex justify-end w-full'>
                        <JITTIconButton type='button' color='warning' title='Cancel' Icon={faCancel} className='w-5 h-5' onClick={hideModal} />
                        <JITTIconButton type='button' color='primary' title='Submit' Icon={faFloppyDisk} onClick={onClick} className='w-5 h-5' />
                    </DialogActions>
                </Dialog>
            </FormProvider>
        );
    }
    return InnerMaterialsDialog;
}
