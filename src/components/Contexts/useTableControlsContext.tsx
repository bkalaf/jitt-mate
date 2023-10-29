import { useProvidedContext } from '../../hooks/useProvidedContext';
import { ITableControlsContext, TableControlsContext } from './TableControlsContext';


export function useTableControlsContext<T extends EntityBase = EntityBase>(): ITableControlsContext<T> {
    return useProvidedContext<ITableControlsContext<T>>(TableControlsContext as React.Context<ITableControlsContext<T> | undefined> as any);
}
