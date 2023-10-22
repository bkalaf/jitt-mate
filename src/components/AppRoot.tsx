import { Outlet, useLocation } from 'react-router-dom';
import { TopBarAuthSegment } from './TopBarAuthSegment';
import { Toaster } from './contexts/Toaster';
import { NavLink } from 'react-router-dom';
import { $cn } from '../util/$cn';
import { toProperCase, toProperFromCamel } from '../common/text/toProperCase';

export function SidebarListItem({ label, children }: { label?: string; children: string }) {
    return (
        <li className='flex hover:bg-rose-500 border-2 border-black'>
            <NavLink
                className={({ isActive }) => {
                    return $cn(
                        {} as { className?: string },
                        { 'bg-rose-500': isActive },
                        'text-black text-lg font-grandstander font-medium border border-black w-full h-full bg-cyan-400 list-item items-center'
                    ).className;
                }}
                to={['data', children].join('/')}>
                <button className='w-full h-full text-black text-xl items-center font-grandstander font-medium border border-black p-0.5 justify-start inline-flex bg-inherit hover:bg-yellow-500'>
                    <span className='indent-2.5'>{label ?? toProperFromCamel(children)}</span>
                </button>
            </NavLink>
        </li>
    );
}
export function AppRoot() {
    const location = useLocation();

    return (
        <div className='w-screen h-screen flex flex-col box-border'>
            <nav className='w-full h-auto flex justify-end bg-slate-700 p-0.5'>
                <TopBarAuthSegment />
            </nav>
            <div className='relative flex flex-grow overflow-auto bg-sky-700 dark:bg-slate-500'>
                <div className='flex resize-x border border-red-500 text-cyan-500  p-0.5 overflow-auto z-10 min-w-[15%] text-lg font-grandstander font-medium flex-col'>
                    <label className='flex justify-center font-grandstander font-bold text-2xl text-center text-white mb-0' htmlFor='tables'>
                        Tables
                    </label>
                    <ul id='tables' className='flex flex-col w-full m-0 mt-1.5 pl-1'>
                        <SidebarListItem>brand</SidebarListItem>
                        <SidebarListItem>classifier</SidebarListItem>
                        <SidebarListItem>draft</SidebarListItem>
                        <SidebarListItem>locationSegment</SidebarListItem>
                        <SidebarListItem>mercariBrand</SidebarListItem>
                        <SidebarListItem>mercariCatergory</SidebarListItem>
                        <SidebarListItem>mercariSubCategory</SidebarListItem>
                        <SidebarListItem>mercariSubSubCategory</SidebarListItem>
                        <SidebarListItem>product</SidebarListItem>
                        <SidebarListItem>productImage</SidebarListItem>
                        <SidebarListItem>sku</SidebarListItem>
                    </ul>
                </div>
                <main className='flex flex-grow bg-cyan-200'>
                    <Outlet />
                </main>
                <Toaster />
            </div>
            <footer className='w-full h-auto flex bottom-0 sticky bg-black text-white p-0.5 text-lg font-semibold justify-around'>
                <span className='inline-flex'>{location.pathname}</span>
                <span className='inline-flex'>12:00</span>
            </footer>
        </div>
    );
}
