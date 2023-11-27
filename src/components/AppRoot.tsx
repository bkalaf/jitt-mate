import { Outlet, useLocation } from 'react-router-dom';
import { SchemaLoader } from './TopBarAuthSegment';
import { Toaster } from './Toaster/Toaster';
import { useEffect } from 'react';
import { LeftDrawer } from './Navigation/LeftDrawer';
import { useToggler } from '../hooks/useToggler';
import { BoundingClientElement } from './BoundingClientElement';
import { TopAppBar } from './TopAppBar';
import { useRealmContext } from '../hooks/useRealmContext';
import { not } from '../common/not';

export function AppRoot() {
    const location = useLocation();
    const { isAuthenticated, logIn, logOut } = useRealmContext();
    const [open, toggleOpen, _, setClosed] = useToggler(false);
    useEffect(() => {
        document.addEventListener('realm-change', () => console.log('REALM-CHANGE'));
    }, []);
    return (
        <div className='relative flex flex-col w-full h-full overflow-auto'>
            {/* <nav className='flex justify-between w-full h-auto p-1 bg-sky-700/90'>
                <IconButton className='w-8 h-8 bg-yellow-400' onClick={toggleOpen}>
                    <FontAwesomeIcon icon={faArrowCircleRight} className='inline-block object-cover'></FontAwesomeIcon>
                </IconButton>
                <TopBarAuthSegment />
            </nav> */}
            <TopAppBar
                pages={['Data', 'Scanning']}
                toggleLeftDrawer={toggleOpen}
                settings={[
                    ['LogIn', not(isAuthenticated), () => logIn({ email: 'admin@junk-in-the-trunk.com', password: 'diane1221' })],
                    ['LogOut', isAuthenticated, () => logOut()]
                ]}
            />
            {isAuthenticated() && <SchemaLoader />}
            <LeftDrawer open={open} toggleOpen={toggleOpen} setClosed={setClosed} />
            <BoundingClientElement>
                <Outlet />
            </BoundingClientElement>
            <Toaster />
            {/* <footer className='w-full h-auto flex bottom-0 sticky bg-black text-white p-0.5 text-lg font-semibold justify-around'>
                <span className='inline-flex'>{location.pathname}</span>
                <span className='inline-flex'>12:00</span>
            </footer> */}
        </div>
    );
}

// export function AppMain
