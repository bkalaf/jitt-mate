import { useNavigate } from 'react-router-dom';
import { useRealmContext } from '../hooks/useRealmContext';
import { useMemo } from 'react';
import { handleSubmitter } from './handleSubmitter';
import { Field } from './Field';
import { alertError } from './App';

export function LogInPage() {
    const { logIn } = useRealmContext();
    const navigate = useNavigate();
    const onSubmit = useMemo(() => handleSubmitter(logIn, () => navigate('/'), alertError), [logIn, navigate]);
    return (
        <div>
            <form id='logInForm' onSubmit={onSubmit} className='grid grid-cols-2'>
                <Field type='email' name='email' label='E-mail' required defaultValue='admin@junk-in-the-trunk.com' />
                <Field type='password' name='password' label='Password' required />
                <footer className='flex cols-span-2 justify-center'>
                    <button type='submit' className='inline-flex'>
                        Submit
                    </button>
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
