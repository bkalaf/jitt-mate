import { CellContext } from '@tanstack/react-table';
import { FALSE } from 'src/components/Buttons/FALSE';
import { faCaretSquareDown, faCaretSquareRight } from '@fortawesome/pro-solid-svg-icons';
import { Button } from '../../Buttons/Button';

export function ExpandRowCell<T extends EntityBase>(props: CellContext<T, any>) {
    const { getCanExpand, getIsExpanded, getToggleExpandedHandler } = props.row;
    return <Button type='button' renderCondition={getCanExpand} disabledCondition={FALSE} onClick={getToggleExpandedHandler()} icon={getIsExpanded() ? faCaretSquareDown : faCaretSquareRight} />;
}
