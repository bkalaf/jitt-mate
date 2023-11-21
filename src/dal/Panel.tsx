import { Row } from '@tanstack/react-table';
import { IProductTaxonomy } from './types';
import { useMemo } from 'react';
import { useTabPanelContext } from '../hooks/useTabPanelContext';
import { useMaterialReactTable } from 'material-react-table';
import { collections } from '../components/Table/collections';


export function Panel(props: { propertyName: string; objectType: RealmObjects; parentRow: Row<{ taxon: IProductTaxonomy; }>; }) {
    const { actions } = useTabPanelContext();
    const { isCurrent } = useMemo(() => actions(props.propertyName), [actions, props.propertyName]);
    const id = `${props.propertyName}-tab`;
    const controlsId = `${id}panel`;
    const table = useMaterialReactTable({
        data: [props.parentRow.original[props.propertyName as keyof typeof props.parentRow.original]] as any[],
        columns: collections[props.objectType as keyof typeof collections].columns() as any[]
    });
    return <div className='flex flex-grow w-full h-full aria-not-current:hidden' role='tabpanel' aria-labelledby={id} id={controlsId} aria-current={isCurrent()}></div>;
}
