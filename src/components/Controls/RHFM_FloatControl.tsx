import { TextFieldElement, useFormContext } from 'react-hook-form-mui';
import { useOnBlurContext } from '../Table/creators/useOnBlurContext';

export function RHFM_FloatControl(name: string, header: string, precision: 1 | 2 | 3 | 4, opts: { max?: number; min?: number; uom?: string; required?: boolean }) {
    function Inner_RHFM_FloatControl() {
        const step = 1 / (10 ^ precision);
        const helperText = opts.uom;
        const { control } = useFormContext();
        const onBlur = useOnBlurContext();
        return <TextFieldElement margin='dense' label={header} name={name} type='number' inputProps={{ step, min: opts.min, max: opts.max }} helperText={helperText} control={control} onBlur={onBlur(name)} />;
    }
    return Inner_RHFM_FloatControl;
}
