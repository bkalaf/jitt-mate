import { useFormContext } from 'react-hook-form-mui';
import { IDependency } from '../Table/Controls/RHFM_Depends';
import { $cn } from '../../util/$cn';


export function useDependencies(...dependencies: IDependency[]) {
    const { control, watch } = useFormContext();
    const mapped = dependencies.map(([k, v, x]) => [k, watch([v])[0], x] as ['enable' | 'disable', any, (x: any) => boolean]);
    console.log(`mapped`, mapped);
    const depends = mapped
        .map(([k, p, pred]) => (pred(p) ? k : k === 'enable' ? 'disable' : 'enable'))
        .reduce((pv, cv) => (pv === 'enable' ? cv : 'disable'), 'enable');
    const { className } = $cn({ className: '' }, { hidden: depends === 'disable' });
    return {
        control,
        classes: { root: className }
    };
}
