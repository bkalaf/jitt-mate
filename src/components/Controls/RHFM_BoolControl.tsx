import { CheckboxElement, useFormContext } from 'react-hook-form-mui';
import { useOnBlurContext } from '../Table/creators/useOnBlurContext';

export const RHFM_BoolControl = (name: string, header: string, defaultValue = false, required = false) =>
    function MRT_BoolControl() {
        const context = useFormContext();
        const onBlur = useOnBlurContext();
        return <CheckboxElement name={name} label={header} labelProps={{ labelPlacement: 'top' }} defaultChecked={defaultValue} required={required} control={context.control} onBlur={onBlur(name)} />;
    };
