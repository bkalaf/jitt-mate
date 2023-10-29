import { Table } from '@tanstack/react-table';
import { useRealmContext } from '../hooks/useRealmContext';
import { SidebarListItem } from './SidebarListItem';
import { PaginationFooter } from './Table/PaginationFooter';
import { useTable } from './Table/ReactTable';

export function LeftSidebar<T extends EntityBase>() {
    const { isAuthenticated } = useRealmContext();
    return (
        <div className='flex resize-x border border-red-500 text-cyan-500 pl-1 pr-2 overflow-auto z-10 min-w-[20%] font-pala-dark flex-col'>
            {isAuthenticated() && (
                <>
                    <label className='flex justify-center mb-0 text-3xl font-bold text-center text-white font-pala-dark' htmlFor='tables'>
                        Collections
                    </label>
                    <ul id='tables' className='flex flex-col m-0 mt-1.5 pl-1 w-full'>
                        <SidebarListItem>brand</SidebarListItem>
                        <SidebarListItem>classifier</SidebarListItem>
                        <SidebarListItem>draft</SidebarListItem>
                        <SidebarListItem>locationSegment</SidebarListItem>
                        <SidebarListItem>mercariBrand</SidebarListItem>
                        <SidebarListItem>mercariCategory</SidebarListItem>
                        <SidebarListItem>mercariSubCategory</SidebarListItem>
                        <SidebarListItem>mercariSubSubCategory</SidebarListItem>
                        <SidebarListItem>product</SidebarListItem>
                        <SidebarListItem>productImage</SidebarListItem>
                        <SidebarListItem>sku</SidebarListItem>
                    </ul>
                </>
            )}
            <div id='pagination-root'></div>
            {/* {table && <PaginationFooter table={table} />} */}
        </div>
    );
}
