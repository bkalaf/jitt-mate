import { NavLink } from 'react-router-dom';
import { $cn } from '../util/$cn';
import { toProperFromCamel } from '../common/text/toProperCase';
import { useRealmContext } from '../hooks/useRealmContext';


export function SidebarListItem({ label, children }: { label?: string; children: string; }) {
    const { dbIsOpen} = useRealmContext();
    return (
        dbIsOpen() ? <li className='flex w-auto transition duration-500 ease-in-out delay-75 transform border-2 border-white hover:bg-yellow-500 hover:scale-110'>
            <NavLink
                className={({ isActive }) => {
                    return $cn(
                        {} as { className?: string; },
                        { 'bg-rose-500': isActive },
                        'text-black text-lg font-grandstander font-medium border border-black w-full h-full bg-cyan-400 list-item items-center'
                    ).className;
                }}
                to={['data', children].join('/')}>
                <button className='w-full h-full text-black text-lg items-center font-open-sans font-semibold border border-black p-0.5 justify-start inline-flex bg-inherit hover:bg-yellow-500'>
                    <span className='indent-2.5'>{label ?? toProperFromCamel(children)}</span>
                </button>
            </NavLink>
        </li> : null
    );
}
