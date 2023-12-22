/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectElement } from 'react-hook-form-mui';
import { useDependencies } from '../../../hooks/useDependencies';
import { MRT_ColumnDef } from 'material-react-table';

export function JITTEnumControl({ enumMap }: { enumMap: EnumMap | ((value: string) => string);  }, initialDisable = false, ...dependencies: IDependency[]) {
    return function MRT_EnumControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const spread = useDependencies(props, initialDisable, ...dependencies);
        const options = Object.entries(enumMap)
            .map(([id, label]) => ({ id, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
        return <SelectElement options={options} type='string' {...spread} />;
    };
}
