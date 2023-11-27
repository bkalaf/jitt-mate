import { useNavigate } from 'react-router-dom';
import { useRealmContext } from '../hooks/useRealmContext';
import { useCallback, useMemo } from 'react';
import { handleSubmitter } from './handleSubmitter';
import { alertError } from './App';
import { Button } from './Buttons/Button';
import { SubmitButton } from './Buttons/SubmitButton';
import { useSpinnerContext } from './Contexts/useSpinnerContext';
import { faWashingMachine } from '@fortawesome/pro-solid-svg-icons';
import { useOverlayContext } from './Contexts/useOverlayContext';
import { LaundryCarePopup } from './LaundryCare/LaundryCarePopup';
import { FormField } from './Table/Controls/FormField';

export function LogInPage() {
    const { logIn } = useRealmContext();
    const navigate = useNavigate();
    const { setSpinner } = useSpinnerContext();
    const onSubmit = useMemo(() => handleSubmitter(setSpinner(logIn), () => navigate('/'), alertError), [logIn, navigate, setSpinner]);
    const { pushFrame, popFrame } = useOverlayContext();
    const onClick = useCallback(() => {
        pushFrame(LaundryCarePopup, { popFrame, onClosing: (x: string[]) => alert(x.join('\n')) });
    }, [popFrame, pushFrame]);
    return (
        <div className='container'>
            <form id='logInForm' onSubmit={onSubmit} className='grid w-3/4 grid-cols-2 mx-auto gap-x-3'>
                <FormField formID='logInForm' datatype='string' tagName='input' type='email' name='email' label='E-mail' required defaultValue='admin@junk-in-the-trunk.com' valueProperty='value' />
                <FormField formID='logInForm' datatype='string' tagName='input' type='password' name='password' label='Password' required defaultValue='diane1221' valueProperty='value' />
                <Button className='bg-teal-500' onClick={onClick} icon={faWashingMachine} />
                <footer className='flex justify-center cols-span-2'>
                    <SubmitButton>Log In To JITT</SubmitButton>
                    <div className='inline-flex space-x-1 border-2 rounded-md border-cyan-500'>
                        {/* <LaundryCareIcon className='font-extrabold text-white bg-yellow-500 h-11 w-11' SvgElement={DripDry} />
                        <LaundryCareIcon className='h-11 w-11' SvgElement={DoNotBleach} isSelected />
                        <LaundryCareIcon className='h-11 w-11' SvgElement={DryCleanAnySolvent} /> */}
                    </div>
                </footer>
            </form>

            {/* <form.Provider>
                <form onSubmit={form.handleSubmit}>
                    <div>
                        <form.Field name='email'>
                            {(field) => (
                                <div className='flex flex-row'>
                                    <label className='inline-flex'>E-mail</label>
                                    <input type='email' name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                                </div>
                            )}
                        </form.Field>
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </form.Provider> */}
        </div>
    );
}
