import { useRealmContext } from '../hooks/useRealmContext';
import { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/pro-duotone-svg-icons';
import { Button } from './Buttons/Button';

export function TopBarAuthSegment() {
    const { isAuthenticated, currentUser, logOut } = useRealmContext();
    const isNotAuthenticated = useCallback(() => !isAuthenticated(), [isAuthenticated]);

    return (
        <span className='inline-flex px-2'>
            {isAuthenticated() ? (
                <span className='relative inline-flex items-center justify-center'>
                    <span className='inline-flex invisible'>{currentUser?.profile?.email ?? 'UNKNOWN E-MAIL'}</span>
                    <span className='absolute bottom-0 p-0.5 text-sm text-white bg-slate-900 border border-cyan-300 font-extrabold font-fira-sans rounded-lg z-20 opacity-80 transform translate-y-4'>
                        {currentUser?.profile?.email ?? 'UNKNOWN E-MAIL'}
                    </span>
                    <span className='absolute top-0 inline-block opacity-100 left-1/2'>
                        <FontAwesomeIcon className='block text-yellow-500 opacity-100' size='3x' icon={faUser} />
                    </span>
                </span>
            ) : null}
            <Button route='login' renderCondition={isNotAuthenticated}>
                Log In
            </Button>
            <Button onClick={logOut} renderCondition={isAuthenticated}>
                Log Out
            </Button>
        </span>
    );
}
