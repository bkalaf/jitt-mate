/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldValues, UseFormWatch, useFormContext } from 'react-hook-form-mui';
import { $cn } from '../util/$cn';
import { useColumnDef } from '../components/Table/Controls/useColumnDef';
import { MRT_ColumnDef } from 'material-react-table';

export function useDisabled(watch: UseFormWatch<FieldValues>, initialValue = false, ...dependencies: IDependency[]) {    
    const mapped = dependencies.map(([k, v, x]) => [k, watch([v])[0], x] as ['enable' | 'disable', any, (x: any) => boolean]);
    const depends = mapped.map(([k, p, pred]) => (pred(p) ? k : k === 'enable' ? 'disable' : 'enable'));
    const result = initialValue === true ? (depends.some((x) => x === 'enable') ? 'enable' : 'disable') : depends.some((x) => x === 'disable') ? 'disable' : 'enable';
    const { className } = $cn({ className: '' }, { hidden: result === 'disable' });
    return {
        disabled: result === 'disable',
        classes: { root: className }
    }
}

export function useDependencies(props: { column: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]['column']; }, initialValue = false, ...dependencies: IDependency[]) {
    const { control, watch } = useFormContext();
    const { disabled, classes } = useDisabled(watch, initialValue, ...dependencies);
    const { name, header, onBlur } = useColumnDef(props);
    return {
        control,
        classes,
        disabled,
        label: header,
        name,
        onBlur
    };
}
