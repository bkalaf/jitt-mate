import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { useFormContext } from 'react-hook-form-mui';
import { $cn } from '../../../util/$cn';
import { getProperty } from '../../Contexts/getProperty';

export type IDependency = [action: 'enable' | 'disable', property: string, predicate: (value: any) => boolean];

export function makeDependent<T extends MRT_RowData, TValue>(...dependencies: IDependency[]) {
    const enableDependencies = dependencies.filter((x) => x[0] === 'enable');
    const disableDependencies = dependencies.filter((x) => x[0] === 'disable');
    
    return {
        muiEditTextFieldProps: (props) => {
            const enabled = enableDependencies.map(([_act, prop, pred]) => pred(getProperty(prop)(props.row.original))).reduce((l, r) => l || r, true);
            const disabled = disableDependencies.map(([_act, prop, pred]) => pred(getProperty(prop)(props.row.original))).reduce((l, r) => l || r, false);
            const spread = $cn({ className: '' }, {
                hidden: disabled || (!enabled)
            }, 'bg-inherit')
            console.log(`spread`, spread);
            return {
                InputLabelProps: spread,
                FormHelperTextProps: spread,
                InputProps: spread,
                inputProps: {
                    className: spread.className
                },
                classes: {
                    root: spread.className
                },
                ...spread
            }
        }
    } as Pick<MRT_ColumnDef<T, unknown>, 'muiEditTextFieldProps'>;
}
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
        const enabled = enableDependencies.map(([_act, prop, pred]) => pred(values[prop])).reduce((l, r) => l || r, true);
        const disabled = disableDependencies.map(([_act, prop, pred]) => pred(values[prop])).reduce((l, r) => l || r, false);
        return (enabled && !disabled) ? <Edit {...props} /> : null;
    }
    console.log(`RHFM_Depends`, 'def', def, 'dependencies', dependencies);
    const { Edit, ...remain } = def;
    if (Edit == null) throw new Error('no Edit to depend');
    return {
        ...remain,
        Edit: InnerRHFMDepends
    } as MRT_ColumnDef<T, any>;
}
