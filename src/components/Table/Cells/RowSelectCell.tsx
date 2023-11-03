import { CellContext } from '@tanstack/react-table';
import { faCheckSquare, faSquare } from '@fortawesome/pro-solid-svg-icons';
import { Button } from '../../Buttons/Button';


export function RowSelectCell<T extends EntityBase>(props: CellContext<T, any>) {
    const { getCanSelect, getToggleSelectedHandler, getIsSelected } = props.row;
    return (
        <Button
            type='button'
            renderCondition={getCanSelect}
            disabledCondition={false}
            onClick={getToggleSelectedHandler()}
            icon={getIsSelected() ? faCheckSquare : faSquare}
            className='w-4 h-4 bg-transparent border border-sky-500 text-slate-700'
        />
    );
}
