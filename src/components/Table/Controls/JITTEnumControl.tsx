/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectElement } from 'react-hook-form-mui';
import { useDependencies } from '../../../hooks/useDependencies';
import { MRT_ColumnDef } from 'material-react-table';
import { useHandleEnumMapOrFunction } from '../useHandleEnumMapOrFunction';

export function JITTEnumControl({ enumMap }: { enumMap: EnumMapOrFunction }, initialDisable = false, ...dependencies: IDependency[]) {
    return function MRT_EnumControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        console.log(`MRT_EnumControl`, props);
        console.log(`enumMap`, enumMap);
        const spread = useDependencies(props, initialDisable, ...dependencies);
        const eMap = useHandleEnumMapOrFunction(enumMap);
        const options = Object.entries(eMap)
            .map(([id, label]) => ({ id, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
        return <SelectElement options={options} type='string' {...spread} />;
    };
}
