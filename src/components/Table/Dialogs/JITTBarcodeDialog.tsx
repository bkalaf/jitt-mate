import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';
import { JITTIconButton } from '../clothingCareMeta';
import { faCancel, faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { useCallback, useEffect, useState } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { charRange } from '../../../common/array/charRange';

const digits = charRange('0', '9');
const letters = [...charRange('A', 'Z'), ...charRange('a', 'z')];
export const keys = ['Backspace', ...digits, ...letters];

export function JITTBarcodeDialog({ isOpen, hideModal, submit }: { isOpen: boolean; hideModal: () => void; submit: (barcode: string) => void; }) {
    const formContext = useForm({
        defaultValues: () => Promise.resolve({
            value: ''
        })
    });
    const [value, setValue] = useState('');
    const onClick = useCallback((ev: React.MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        submit(value);
        hideModal();
    }, [hideModal, submit, value]);
    const onKeyDown = useCallback((ev: React.KeyboardEvent<HTMLInputElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
        console.log('onKeyDown', ev, ev.key);
        const { key } = ev;
        setValue(prev => {
            if (keys.includes(key)) {
                if (key === 'Backspace') {
                    return prev.slice(0, prev.length - 1);
                }
                return [...prev, key].join('');
            }
            return prev;
        });
    }, []);
    useEffect(() => {
        formContext.setValue('value', value);
    }, [formContext, value])
    return (
        <FormContainer context={formContext}>
            <Dialog maxWidth='md' fullWidth open={isOpen} onClose={hideModal}>
                <DialogTitle className='flex w-full'>CHANGE BARCODE</DialogTitle>
                <Divider variant='middle' className='border-black' />
                <DialogContent className='flex flex-col w-full'>
                    <TextFieldElement
                        control={formContext.control}
                        name='value'
                        onKeyDown={onKeyDown}
                        value={value}
                        validation={{
                            maxLength: {
                                value: 13,
                                message: `Field must be less than or equal to 13 characters.`
                            }
                        }} />
                </DialogContent>
                <Divider variant='middle' className='border-black' />
                <DialogActions className='flex justify-end w-full'>
                    <JITTIconButton type='button' color='warning' title='Cancel' Icon={faCancel} className='w-5 h-5' onClick={hideModal} />
                    <JITTIconButton type='button' color='primary' title='Submit' Icon={faFloppyDisk} onClick={onClick} className='w-5 h-5' />
                </DialogActions>
            </Dialog>
        </FormContainer>
    );
}
