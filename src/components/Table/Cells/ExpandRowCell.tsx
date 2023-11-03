import { CellContext } from '@tanstack/react-table';
import { faCaretSquareDown, faCaretSquareRight } from '@fortawesome/pro-solid-svg-icons';
import { Button } from '../../Buttons/Button';
import { FALSE } from '../../../common/FALSE';

export function ExpandRowCell<T extends EntityBase>(props: CellContext<T, any>) {
    const { getCanExpand, getIsExpanded, getToggleExpandedHandler } = props.row;
    return (
        <Button
            type='button'
            renderCondition={getCanExpand}
            disabledCondition={FALSE}
            onClick={getToggleExpandedHandler()}
            icon={getIsExpanded() ? faCaretSquareDown : faCaretSquareRight}
            className='w-4 h-4 bg-transparent border border-sky-500 text-slate-700'
        />
    );
}

