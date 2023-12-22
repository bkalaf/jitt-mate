import { toHeader } from '../toHeader';
import { JITTProductImageCell } from '../Cells/JITTProductImageCell';
import { IProductImage } from '../../../dal/types';
import { JITTProductImageControl } from '../Controls/JITTProductImageControl';

export function imageDefinition<T extends AnyObject>(fn: (x: Realm.Object<T> & T) => DBBacklink<IProductImage> | null, opts: { id: string, header?: string }, initialDisable = false, ...dependencies: IDependency[]) {
    const header = toHeader(opts, opts.id);
    return {
        accessorFn: fn,
        id: opts.id,
        header,
        Cell: JITTProductImageCell,
        Edit: JITTProductImageControl(initialDisable, ...dependencies) as any
    } as DefinedMRTColumn<T>;
}
