import { Table } from '@tanstack/react-table';
import { useMemo } from 'react';
import { composeR } from '../../../common/functions/composeR';
import { useCollectionViewContext } from '../../../hooks/useCollectionViewContext';
import { Button } from '../../Buttons/Button';
import { faFilterCircleXmark, faFilters } from '@fortawesome/pro-solid-svg-icons';
import { ignore } from '../../../common/functions/ignore';

export function ToggleFilteringButton(props: { table: Table<any> }) {
    const context = useCollectionViewContext();
    const { filteringEnabled, toggleFiltering, renderButton } = context == null ? { renderButton: false, filteringEnabled: () => false, toggleFiltering: ignore } : { renderButton: true, ...context };
    const onClick = useMemo(() => composeR(toggleFiltering, () => props.table.resetColumnFilters(true)), [props.table, toggleFiltering]);
    return (
        <Button renderCondition={renderButton} onClick={onClick} icon={filteringEnabled() ? faFilterCircleXmark : faFilters} className='w-6 h-6 bg-transparent border border-sky-500 text-rose-700' />
    );
}
