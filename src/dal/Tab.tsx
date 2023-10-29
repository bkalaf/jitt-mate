import { toProperFromCamel } from '../common/text/toProperCase';
import { useTabPanelContext } from '../hooks/useTabPanelContext';
import { useMemo } from 'react';


export function Tab(props: { children?: string; propertyName: string; objectType: string; type: string; }) {
    const { children, propertyName, objectType, type } = props;
    const label = children ? children : toProperFromCamel(propertyName);
    const { actions } = useTabPanelContext();
    const { isCurrent, setCurrent } = useMemo(() => actions(propertyName), [actions, propertyName]);
    const id = `${propertyName}-tab`;
    const controlsId = `${id}panel`;
    return (
        <button
            className='flex items-center justify-center w-full h-auto px-2 py-1 text-base font-medium text-white border border-white rounded-lg bg-slate-800 font-open-sans aria-selected:bg-rose-600 whitespace-nowrap'
            type='button'
            onClick={setCurrent}
            aria-selected={isCurrent()}
            aria-controls={controlsId}
            role='tab'
            id={id}>
            <span className='inline-flex'>{label}</span>
        </button>
    );
}
