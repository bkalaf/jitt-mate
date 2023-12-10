import { useRealmContext } from '../../hooks/useRealmContext';
import { FormContainer, FormErrorProvider } from 'react-hook-form-mui';
import Dialog from '@mui/material/Dialog';
import { DialogActions, DialogContent, DialogTitle, Divider, Button as MUIButton } from '@mui/material';
import { charRange } from '../../common/array/charRange';
import { catchError } from '../catchError';
import { useCallback } from 'react';
import { SubmitReactHookFormLoadingButton } from '../ReactHookForm/SubmitReactHookFormLoadingButton';
import { RHFM_TextFieldElement } from '../Table/Controls/RHFM_TextFieldElement';

export function LogInDialog({ open, toggler }: { open: boolean; toggler: () => void }) {
    const { logIn } = useRealmContext();
    const onSuccess = useCallback(
        async (data: any, event: any) => {
            try {
                await logIn(data);
                // navigate('/');
                toggler();
                return;
            } catch (err) {
                catchError(err);
            }
        },
        [logIn, toggler]
    );
    return (
        <Dialog maxWidth='md' fullWidth open={open} onClose={toggler}>
            <DialogTitle variant='h4' className='font-bold text-white bg-slate-600 font-rubik'>
                LOGIN FORM
            </DialogTitle>
            <Divider variant='middle' className='border-yellow-700' />
            <FormContainer onSuccess={onSuccess} criteriaMode='all' reValidateMode='onChange' mode='onBlur' defaultValues={{ password: 'diane1221', email: 'admin@junk-in-the-trunk.com' }}>
                <>
                    <DialogContent>
                        <FormErrorProvider
                            onError={(error) => {
                                switch (error.type) {
                                    case 'containsLowerChar':
                                        return 'Value must contain one lowercase letter character.';
                                    case 'containsDigitChar':
                                        return 'Value must contain one digit character.';

                                    default:
                                        return error.message;
                                }
                            }}>
                            <div className='flex flex-col'>
                                <RHFM_TextFieldElement
                                    name='email'
                                    header='Username (e-mail)'
                                    required
                                    type='email'
                                    requiredMessage='Username is a required field.'
                                    patternMessage='Username must be in the form of a standard email address.'
                                    pattern={/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/}
                                />
                                <RHFM_TextFieldElement
                                    name='password'
                                    header='Password'
                                    required
                                    type='password'
                                    requiredMessage='Password is a required field.'
                                    minLength={8}
                                    minLengthMessage='Password must be at least 8 characters.'
                                    validators={[
                                        ['containsLowerChar', (value?: string) => (value?.split('') ?? []).some((x) => charRange('a', 'z').includes(x))],
                                        ['containsDigitChar', (value?: string) => (value?.split('') ?? []).some((x) => charRange('0', '9').includes(x))]
                                    ]}
                                />
                            </div>
                        </FormErrorProvider>
                    </DialogContent>
                    <DialogActions className='flex justify-between flex-full'>
                        <MUIButton className='inline-flex' color='secondary' type='button' onClick={toggler} size='small'>
                            Cancel
                        </MUIButton>
                        <MUIButton className='inline-flex' color='secondary' type='reset' size='small' variant='contained'>
                            Reset
                        </MUIButton>
                        <SubmitReactHookFormLoadingButton />
                    </DialogActions>
                </>
            </FormContainer>
        </Dialog>
    );
}
