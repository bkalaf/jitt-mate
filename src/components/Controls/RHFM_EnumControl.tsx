import { SelectElement, useFormContext } from 'react-hook-form-mui';
import { useOnBlurContext } from '../Table/creators/useOnBlurContext';

export function RHFM_EnumControl<T extends AnyObject>(name: string, header: string, enumMap: EnumMap | ((value: string) => string)) {
    return function MRT_EnumControl() {
        const options = Object.entries(enumMap)
            .map(([id, label]) => ({ id, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
        const context = useFormContext();
        const onBlur = useOnBlurContext();
        return <SelectElement name={name} label={header} options={options} type='string' control={context.control} onBlur={onBlur(name)} />;
    };
}
