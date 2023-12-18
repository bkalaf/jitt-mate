import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { useFormContext } from 'react-hook-form-mui';

export function RHFM_Depends<T extends MRT_RowData, TValue>(def: Partial<MRT_ColumnDef<T, TValue>>, ...dependencies: IDependency[]) {
    function InnerRHFMDepends(props: Parameters<Exclude<MRT_ColumnDef<T, TValue>['Edit'], undefined>>[0]) {
        console.log(`RHFM_Depends`, 'def', def, 'dependencies', dependencies, 'props', props)
        const { Edit } = def;
        if (Edit == null) throw new Error('no Edit to depend');
        const context = useFormContext();
        const { getValues } = context;
        const values = getValues();
        const enableDependencies = dependencies.filter(x => x[0] === 'enable');
        const disableDependencies = dependencies.filter((x) => x[0] === 'disable');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const enabled = enableDependencies.map(([_act, prop, pred]) => pred(values[prop])).reduce((l, r) => l || r, true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const disabled = disableDependencies.map(([_act, prop, pred]) => pred(values[prop])).reduce((l, r) => l || r, false);
        return (enabled && !disabled) ? <Edit {...props} /> : null;
    }
    console.log(`RHFM_Depends`, 'def', def, 'dependencies', dependencies);
    const { Edit, ...remain } = def;
    if (Edit == null) throw new Error('no Edit to depend');
    return {
        ...remain,
        Edit: InnerRHFMDepends
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as MRT_ColumnDef<T, any>;
}
