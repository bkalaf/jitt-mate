import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton, Modal } from '@mui/material';
import { FieldValues, FormContainer, UseFormReturn, useForm } from 'react-hook-form-mui';
import { faFloppyDisk, faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import * as React from 'react';

export function InsertItemModal<T extends FieldValues>({
    open,
    toggleOpen,
    EditControls,
    init,
    appendItem
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    EditControls: React.FunctionComponent<{ context: UseFormReturn<T, any, undefined> }>;
    init: () => Promise<T>;
    appendItem: (payload: T) => void;
    open: boolean;
    toggleOpen: () => void;
}) {
    const context = useForm({ defaultValues: init });
    const onSubmit = context.handleSubmit((data, event) => {
        event?.preventDefault();
        event?.stopPropagation();
        appendItem(data as T);
        init().then((next) => context.reset(next));
        toggleOpen();
    });
    return (
        <Modal open={open} onClose={toggleOpen}>
            <FormContainer context={context}>
                <Box className='absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] bg-neutral-300 border-solid border-2 border-white shadow-lg pt-2 px-4 pb-3'>
                    <>
                        <EditControls context={context} />
                        <div className='flex justify-end w-full'>
                            <IconButton
                                className='inline-flex'
                                onClick={() => {
                                    init().then(context.reset);
                                    toggleOpen();
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
