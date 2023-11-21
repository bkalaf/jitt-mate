import { useCallback, useMemo, useState } from 'react';
import { PaginationButtonProps } from './CollectionView';
import { Table } from '@tanstack/react-table';
import { not } from '../common/not';

export function usePagination<T>(initialPageIndex = 0, initialPageSize = 250) {
    const getPageIndex = useCallback((table: Table<T>) => table.getState().pagination.pageIndex, []);
    const getPageSize = useCallback((table: Table<T>) => {
        const result = table.getState().pagination.pageSize;
        console.log('getPageSize', result);
        return result;
    }, []);
    return useCallback(
        (table: Table<T>) => {
            const { nextPage, previousPage, setPageIndex, setPageSize, getCanNextPage, getCanPreviousPage, getPageCount } = table;
            const goFirstPage = () => setPageIndex(0);
            const goLastPage = () => setPageIndex(getPageCount() - 1);
            const onPageSizeSelectChanged = (ev: React.ChangeEvent<HTMLSelectElement>) => {
                const options = ev.target.selectedOptions[0];
                console.log('options', options);
                const selectedValue = parseInt(ev.target.selectedOptions[0].value ?? '250', 10);
                console.log(`selectedValue`, selectedValue);
                setPageSize((prev) => (prev === selectedValue ? prev : selectedValue));
            };
            const goToPage: Record<'first' | 'last' | 'next' | 'previous', PaginationButtonProps> = {
                first: [not(getCanPreviousPage), goFirstPage],
                last: [not(getCanNextPage), goLastPage],
                next: [not(getCanNextPage), nextPage],
                previous: [not(getCanPreviousPage), previousPage]
            };

            return {
                goToPage,
                onPageSizeSelectChanged,
                pageSize: getPageSize(table),
                page: getPageIndex(table) + 1,
                setPageIndex,
                initialState: {
                    pagination: {
                        pageSize: initialPageSize,
                        pageIndex: initialPageIndex
                    }
                }
            };
        },
        [getPageIndex, getPageSize, initialPageIndex, initialPageSize]
    );
}
// export function usePagination<T>(initialPageIndex = 0, initialPageSize = 250) {
//     const [pageIndex, setPageIndex] = useState(initialPageIndex);
//     const [pageSize, setPageSize] = useState(initialPageSize);
//     const [data, setData] = useState<T[]>([]);
//     const maxIndex = useMemo(() => data.length, [data.length]);
//     const pageCount = useMemo(() => Math.ceil(maxIndex / pageSize), [maxIndex, pageSize]);
//     const canGoForward = useCallback(() => pageIndex < pageCount, [pageCount, pageIndex]);
//     const canGoBackward = useCallback(() => pageIndex !== 0, [pageIndex]);
//     const goPreviousPage = useCallback(() => setPageIndex((prev) => (canGoBackward() ? prev - 1 : prev)), [canGoBackward]);
//     const goNextPage = useCallback(() => setPageIndex((prev) => (canGoForward() ? prev + 1 : prev)), [canGoForward]);
//     const goFirstPage = useCallback(() => setPageIndex(0), []);
//     const goLastPage = useCallback(() => setPageIndex(pageCount - 1), [pageCount]);
//     const setSpecificPage = useCallback((page: number) => (page >= 0 && page < pageCount ? setPageIndex(page) : ignore()), [pageCount]);
//     const setSpecificPageSize = useCallback((size: number) => (size > 0 && size <= maxIndex ? setPageSize((prev) => (prev === size ? prev : size)) : ignore()), [maxIndex]);
//     return {
//         data,
//         setData,
//         setSpecificPageSize,
//         setSpecificPage,
//         pageCount,
//         initialState: {
//             pagination: {
//                 pageSize: initialPageSize,
//                 pageIndex: initialPageIndex
//             }
//         },
//         pagination: {
//             pageIndex,
//             pageSize
//         },
//         gotoFirstPage: [canGoBackward, goFirstPage] as PaginationButtonProps,
//         gotoNextPage: [canGoForward, goNextPage] as PaginationButtonProps,
//         gotoPreviousPage: [canGoBackward, goPreviousPage] as PaginationButtonProps,
//         gotoLastPage: [canGoForward, goLastPage] as PaginationButtonProps
//     };
// }
