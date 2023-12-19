import { Outlet } from 'react-router-dom';
import { SchemaLoader } from './TopBarAuthSegment';
import { Toaster } from './Toaster/Toaster';
import { useEffect } from 'react';
import { LeftDrawer } from './Navigation/LeftDrawer';
import { useToggler } from '../hooks/useToggler';
import { TopAppBar } from './TopAppBar';
import { useRealmContext } from '../hooks/useRealmContext';
import { not } from '../common/not';
import { LogInDialog } from './Dialogs/LogInDialog';

export function AppRoot() {
    const { isAuthenticated, logIn, logOut } = useRealmContext();
    const [leftDrawerOpen, toggleLeftDrawerOpen, _, setLeftDrawerClosed] = useToggler(false);
    const [loginDialogOpen, toggleLoginDialogOpen] = useToggler(false);
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
                toggleLeftDrawer={toggleLeftDrawerOpen}
                settings={[
                    ['LogIn', not(isAuthenticated), () => logIn({ email: 'admin@junk-in-the-trunk.com', password: 'diane1221' })],
                    ['LogOut', isAuthenticated, () => logOut()],
                    ['Show LogIn', not(isAuthenticated), toggleLoginDialogOpen]
                ]}
            />
            <LogInDialog open={loginDialogOpen} toggler={toggleLoginDialogOpen} />
            {isAuthenticated() && <SchemaLoader />}
            <LeftDrawer open={leftDrawerOpen} toggleOpen={toggleLeftDrawerOpen} setClosed={setLeftDrawerClosed} />
            <section className='flex flex-col flex-grow overflow-auto'>
                <Outlet />
            </section>
            <Toaster />
            {/* <footer className='w-full h-auto flex bottom-0 sticky bg-black text-white p-0.5 text-lg font-semibold justify-around'>
                <span className='inline-flex'>{location.pathname}</span>
                <span className='inline-flex'>12:00</span>
            </footer> */}
        </div>
    );
}

// export function AppMain
