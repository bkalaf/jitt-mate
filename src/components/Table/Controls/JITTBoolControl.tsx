import { CheckboxElement } from 'react-hook-form-mui';
import { useDependencies } from '../../../hooks/useDependencies';
import { MRT_ColumnDef } from 'material-react-table';

export function JITTBoolControl(opts: { defaultValue?: boolean, required?: boolean, readOnly?: boolean } = {}, initialDisable = false, ...dependencies: IDependency[]) {
    return function MRT_BoolControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const spread = useDependencies(props, initialDisable, ...dependencies);
        return <CheckboxElement labelProps={{ labelPlacement: 'top' }} {...spread} required={opts.required ?? false} defaultChecked={opts.defaultValue ?? false} readOnly={opts.readOnly ?? false} />;
    };
}
