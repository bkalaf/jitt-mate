import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton, Modal } from '@mui/material';
import { FieldValues, FormContainer, useForm } from 'react-hook-form-mui';
import { faFloppyDisk, faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import { toNotNullOID } from '../../dal/toOID';
import { useLocalRealm } from '../../routes/loaders/useLocalRealm';
import { HashTag } from '../../dto/collections/HashTag';

export function InsertItemModal<T extends FieldValues & EntityBase>({
    open,
    toggleOpen,
    EditControls,
    init,
    list,
    setList
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    EditControls: React.FunctionComponent<{ context: any }>;
    init: () => Promise<T>;
    list: T[];
    open: boolean;
    toggleOpen: () => void;
    setList: (nextList: T[]) => void;
}) {
    const context = useForm<Entity<T>, any, undefined>({ defaultValues: init as any });
    const db = useLocalRealm();
    const onSubmit = context.handleSubmit((data, event) => {
        alert(JSON.stringify(data));
        event?.preventDefault();
        event?.stopPropagation();
        if (data.value == null || (typeof data.value === 'string' && data.value.length === 0)) {
            alert('no value entered');
            toggleOpen();
            return;
        }
        
        const nextList = [...list, db.objectForPrimaryKey(data.objectSchema().name, toNotNullOID(data._id))];
        console.log(`nextList`, nextList);
        setList(nextList as T[]);
        toggleOpen();
    });
    return (
        <Modal open={open} onClose={() => {
            ipcRenderer.invoke('confirm-cancel').then((response) => {
                if (response === 0) toggleOpen();
            });
        }}>
            <FormContainer context={context}>
                <Box className='absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] bg-neutral-300 border-solid border-2 border-white shadow-lg pt-2 px-4 pb-3'>
                    <>
                        <EditControls context={context} />
                        <div className='flex justify-end w-full'>
                            <IconButton
                                className='inline-flex'
                                onClick={() => {
                                    // init().then(context.reset);
                                    ipcRenderer.invoke('confirm-cancel').then(response => {
                                        if (response === 0) toggleOpen();
                                    })
                                }}>
                                <FontAwesomeIcon icon={faTimesCircle} className='block object-contain w-6 h-6' />
                            </IconButton>
                            <IconButton className='inline-flex' type='button' onClick={onSubmit}>
                                <FontAwesomeIcon icon={faFloppyDisk} className='block object-contain w-6 h-6' />
                            </IconButton>
                        </div>
                    </>
                </Box>
            </FormContainer>
        </Modal>
    );
}
