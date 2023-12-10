import { TextFieldElement, useWatch } from 'react-hook-form-mui';

export const MRTPercentageControl = (name: string, header: string, opts: { min?: number, max?: number } = {}) =>
    function MRT_PercentageControl() {
        const [watchedValue] = useWatch({
            name: [name]
        });
        const helperText = watchedValue != null && watchedValue.length > 0 ? (parseFloat(watchedValue) * 100).toFixed(2).concat('%') : '';
        return <TextFieldElement margin='dense' label={header} name={name} type='number' inputProps={{ step: 0.01 }} validation={{
            max: opts?.max ? {
                value: opts.max,
                message: `Maximum value is ${opts.max}.`
            } : undefined,
            min: opts?.min ? {
                value: opts.min,
                message: `Minimum value is ${opts.min}.`
            } : undefined
        }} helperText={helperText} />;
    };
