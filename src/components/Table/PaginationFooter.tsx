import { faChevronDoubleLeft, faChevronLeft, faChevronRight, faChevronDoubleRight } from '@fortawesome/pro-solid-svg-icons';
import { PaginationSize } from '../../enums/importNecklineType';
import { Button } from '../Buttons/Button';
import { NumericIcon } from '../NumericIcon';
import { default as prompt } from 'electron-prompt';
import { useCallback } from 'react';
import { FALSE } from '../../common/FALSE';
import { Table } from '@tanstack/react-table';

const paginationSizes = {
    '10': 10,
    '25': 25,
    '100': 100,
    '250': 250,
    '1000': 1000
};

export function PaginationFooter<T extends EntityBase>({
    pageIndex,
    maxPageIndex,
    maxPage,
    page,
    pageSize,
    nextPage,
    previousPage,
    lastPage,
    canNotGoForward,
    canNotGoBackward,
    firstPage,
    onSizeChange,
    setPage
}: {
    page: number;
    maxPage: number;
    pageIndex: number;
    maxPageIndex: number;
    pageSize: number;
    canNotGoForward: boolean;
    canNotGoBackward: boolean;
    nextPage: () => void;
    previousPage: () => void;
    lastPage: () => void;
    firstPage: () => void;
    onSizeChange: (ev: React.ChangeEvent<HTMLSelectElement>) => void;
    setPage: (page: number) => void;
}) {
    // const {pageSize, pageIndex} = table.getState().pagination;
    // const { getCanNextPage, getCanPreviousPage, getPageCount, nextPage, previousPage, setPageSize, setPageIndex } = table;
    const onSpecificPageClick = useCallback(() => {
        prompt({
            title: 'Go To Specific Page',
            label: 'Page #:',
            value: page.toFixed(0),
            inputAttrs: {
                type: 'number',
                step: '1',
                min: '1',
                max: maxPage.toFixed(0)
            },
            type: 'input'
        }).then((x) => {
            if (x == null) return;
            setPage(parseInt(x, 10));
        });
    }, [maxPage, page, setPage]);
    console.log(`pagination`, page, maxPage, pageIndex, maxPageIndex, canNotGoForward, canNotGoBackward);
    return (
        <div className='sticky bottom-0 flex flex-col items-center justify-center w-full'>
            <div className='inline-flex'>
                <Button icon={faChevronDoubleLeft} disabledCondition={canNotGoBackward} onClick={firstPage} title='Go to first page.' type='button' />
                <Button icon={faChevronLeft} disabledCondition={canNotGoBackward} onClick={previousPage} title='Go to previous page.' type='button' />
                <span className='flex items-center justify-between bg-sky-600' onClick={onSpecificPageClick} title={`${page} of ${maxPage}`}>
                    {page
                        .toFixed(0)
                        .split('')
                        .map((x, ix) => (
                            <NumericIcon key={ix}>{x}</NumericIcon>
                        ))}
                </span>
                <Button icon={faChevronRight} disabledCondition={canNotGoForward} onClick={nextPage} title='Go to next page.' type='button' />
                <Button icon={faChevronDoubleRight} disabledCondition={canNotGoForward} onClick={lastPage} title='Go to last page.' type='button' />
            </div>
            <div className='inline-flex'>
                <select
                    className='flex w-full h-full p-1 text-base font-normal text-black border border-black font-raleway bg-zinc-400'
                    value={pageSize}
                    onChange={onSizeChange}>
                    {Object.entries(paginationSizes).map(([k, v], ix) => (
                        <option key={ix} value={v} label={`Show ${k} Rows.`} />
                    ))}
                </select>
            </div>
        </div>
    );
}
