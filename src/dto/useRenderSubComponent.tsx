import { Row } from '@tanstack/react-table';
import { useCollectionRoute } from '../hooks/useCollectionRoute';
import { useGetRowCanExpand } from './useGetRowCanExpand';
import { toProperFromCamel } from '../common/text/toProperCase';
import { useTabPanelContext } from '../hooks/useTabPanelContext';
import { useMemo } from 'react';
import { TabPanelProvider } from '../components/TabPanelProvider';

export function Tab(props: { children?: string; propertyName: string; objectType: string; type: string }) {
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
export function TabPanel(props: { propertyName: string; objectType: string }) {
    const { propertyName, objectType } = props;
    const { actions } = useTabPanelContext();
    const { isCurrent } = useMemo(() => actions(propertyName), [actions, propertyName]);
    const id = `${propertyName}-tab`;
    const controlsId = `${id}panel`;
    return (
        <div className='flex flex-grow w-full h-full aria-not-current:hidden' role='tabpanel' aria-labelledby={id} id={controlsId} aria-current={isCurrent()}>
            <span>{propertyName}</span>
            <span>{objectType}</span>
        </div>
    );
}
// props: { row: Row<T>, table: Table<T> }
export function createSubComponent<T extends EntityBase>(infos: FieldInfo[]) {
    const Result = function () {
        return (
            <TabPanelProvider>
                <section className='flex flex-col w-full h-1/5'>
                    <nav className='grid justify-start w-full grid-cols-10 p-2' role='tablist' aria-label='SubComponent Tabs'>
                        {infos.map(([propertyName, type, objectType], ix) => (
                            <Tab key={ix} propertyName={propertyName} objectType={objectType ?? ''} type={type} />
                        ))}
                    </nav>
                    <div className='flex flex-grow w-full h-full'>
                        {infos.map(([propertyName, type, objectType], ix) => (
                            <TabPanel key={ix} propertyName={propertyName} objectType={objectType ?? ''} />
                        ))}
                    </div>
                </section>
            </TabPanelProvider>
        );
    };
    Result.displayName = 'SubComponent';
    return Result;
}
export function useRenderSubComponent() {
    const collectionName = useCollectionRoute();
    const { subComponentTabPanels, ...result } = useGetRowCanExpand(collectionName);
    const SubComponent = useMemo(() => createSubComponent(subComponentTabPanels), [subComponentTabPanels]);

    return {
        ...result,
        SubComponent
    };
}
