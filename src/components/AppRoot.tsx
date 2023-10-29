import { Outlet, useLocation } from 'react-router-dom';
import { TopBarAuthSegment } from './TopBarAuthSegment';
import { Toaster } from './Toaster/Toaster';
import { toProperCase } from '../common/text/toProperCase';
import { LeftSidebar } from './LeftSidebar';
import { useEffect } from 'react';
import { TableControlsContext, TableControlsProvider } from './Contexts/TableControlsContext';

export function AppRoot() {
    const location = useLocation();
    useEffect(() => {
        document.addEventListener('realm-change', () => console.log('REALM-CHANGE'));
    }, []);
    return (
        <div className='flex flex-col w-full h-full'>
            <nav className='flex justify-end w-full h-auto p-1 bg-sky-700/90'>
                <TopBarAuthSegment />
            </nav>
            <div className='relative flex flex-grow bg-slate-700'>
                <LeftSidebar />
                <div className='flex items-start justify-start flex-grow p-1 overflow-auto border border-black bg-sky-700/70'>
                    <Outlet />
                </div>
                <Toaster />
            </div>
            <footer className='w-full h-auto flex bottom-0 sticky bg-black text-white p-0.5 text-lg font-semibold justify-around'>
                <span className='inline-flex'>{location.pathname}</span>
                <span className='inline-flex'>12:00</span>
            </footer>
        </div>
    );
}

// export function AppMain
