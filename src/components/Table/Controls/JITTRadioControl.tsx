import { RadioButtonGroup, useFormContext } from 'react-hook-form-mui';
import { useDependencies } from '../../../hooks/useDependencies';
import { MRT_ColumnDef } from 'material-react-table';
import { toProperFromCamel } from '../../../common/text/toProperCase';

export function JITTRadioControl({ enumMap }: { enumMap: EnumMap }, initialDisable = false, ...dependencies: IDependency[]) {
    function InnerJITTRadioControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const { control, disabled, label, name, onBlur } = useDependencies(props, initialDisable, ...dependencies);
        const options = Object.entries(enumMap)
            .map(([k, v]) => ({
                id: k,
                label: toProperFromCamel(v)
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        return disabled ? null : (
            <RadioButtonGroup
                row
                name={name}
                label={label}
                onChange={(value: any) => {
                    console.log(`onChange`, value);
                    onBlur({ target: { value } } as any);
                }}
                disabled={disabled}
                control={control}
                emptyOptionLabel='(null)'
                options={options}
            />
        );
    }
    return InnerJITTRadioControl;
}
