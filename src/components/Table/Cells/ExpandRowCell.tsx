import { CellContext } from '@tanstack/react-table';
import { faCaretSquareDown, faCaretSquareRight, faCheckSquare, faSquare } from '@fortawesome/pro-solid-svg-icons';
import { Button } from '../../Buttons/Button';
import { FALSE } from '../../../common/FALSE';

export function ExpandRowCell<T extends EntityBase>(props: CellContext<T, any>) {
    const { getCanExpand, getIsExpanded, getToggleExpandedHandler } = props.row;
    return <Button type='button' renderCondition={getCanExpand} disabledCondition={FALSE} onClick={getToggleExpandedHandler()} icon={getIsExpanded() ? faCaretSquareDown : faCaretSquareRight} />;
}

export function RowSelectCell<T extends EntityBase>(props: CellContext<T, any>) {
    const { getCanSelect, getToggleSelectedHandler, getIsSelected } = props.row;
    return <Button type='button' renderCondition={getCanSelect} disabledCondition={false} onClick={getToggleSelectedHandler()} icon={getIsSelected() ? faCheckSquare : faSquare} />;
}
