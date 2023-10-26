import { useNavigate } from 'react-router-dom';
import { useRealmContext } from '../hooks/useRealmContext';
import { useMemo } from 'react';
import { handleSubmitter } from './handleSubmitter';
import { Field } from './Field';
import { alertError } from './App';
import { Button } from './Buttons/Button';
import { SubmitButton } from './Buttons/SubmitButton';

export function LogInPage() {
    const { logIn } = useRealmContext();
    const navigate = useNavigate();
    const onSubmit = useMemo(() => handleSubmitter(logIn, () => navigate('/'), alertError), [logIn, navigate]);
    return (
        <div className='container'>
            <form id='logInForm' onSubmit={onSubmit} className='grid w-3/4 grid-cols-2 mx-auto gap-x-3'>
                <Field type='email' name='email' label='E-mail' required defaultValue='admin@junk-in-the-trunk.com' valueProperty='value' />
                <Field type='password' name='password' label='Password' required defaultValue='diane1221' valueProperty='value' />
                <footer className='flex justify-center cols-span-2'>
                    <SubmitButton>Log In To JITT</SubmitButton>
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
