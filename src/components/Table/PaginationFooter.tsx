import { Table } from '@tanstack/react-table';
import { usePagination } from '../usePagination';
import { faChevronDoubleLeft, faChevronLeft, faChevronRight, faChevronDoubleRight } from '@fortawesome/pro-solid-svg-icons';
import { PaginationSize } from '../../enums/importNecklineType';
import { Button } from '../Buttons/Button';
import { NumericIcon } from '../NumericIcon';
import { default as prompt } from 'electron-prompt';
import { useCallback } from 'react';

export function PaginationFooter<T extends EntityBase>({ table }: { table: Table<T> }) {
    const createPagination = usePagination<T>(0, 250);
    const { goToPage, onPageSizeSelectChanged, page, pageSize, setPageIndex } = createPagination(table);
    const onSpecificPageClick = useCallback(() => {
        prompt({
            title: 'Go To Specific Page',
            label: 'Page #:',
            value: page.toFixed(0),
            inputAttrs: {
                type: 'number',
                step: '1',
                min: '1',
                max: (table.getPageCount() - 1).toFixed(0)
            },
            type: 'input'
        }).then((x) => setPageIndex(parseInt(x ?? '0', 10) - 1));
    }, [page, setPageIndex, table]);
    return (
        <div className='flex flex-col items-center justify-center w-full'>
            <div className='inline-flex'>
                <Button icon={faChevronDoubleLeft} disabledCondition={goToPage.first[0]} onClick={goToPage.first[1]} title='Go to first page.' type='button' />
                <Button icon={faChevronLeft} disabledCondition={goToPage.previous[0]} onClick={goToPage.previous[1]} title='Go to previous page.' type='button' />
                <span className='flex items-center justify-between bg-sky-600' onClick={onSpecificPageClick}>
                    {page
                        .toFixed(0)
                        .split('')
                        .map((x, ix) => (
                            <NumericIcon key={ix}>{x}</NumericIcon>
                        ))}
                </span>
                <Button icon={faChevronRight} disabledCondition={goToPage.next[0]} onClick={goToPage.next[1]} title='Go to next page.' type='button' />
                <Button icon={faChevronDoubleRight} disabledCondition={goToPage.last[0]} onClick={goToPage.last[1]} title='Go to last page.' type='button' />
            </div>
            <div className='inline-flex'>
                <select value={pageSize} onChange={onPageSizeSelectChanged}>
                    {Object.entries(PaginationSize).map(([k, v], ix) => (
                        <option key={ix} value={v} label={`Show ${v} Rows.`} />
                    ))}
                </select>
            </div>
        </div>
    );
}
