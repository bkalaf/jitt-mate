import { TextFieldElement, useWatch } from 'react-hook-form-mui';

export const MRTPercentageControl = (name: string, header: string) =>
    function MRT_PercentageControl() {
        const [watchedValue] = useWatch({
            name: [name]
        });
        const helperText = watchedValue != null && watchedValue.length > 0 ? (parseFloat(watchedValue) * 100).toFixed(2).concat('%') : '';
        return <TextFieldElement margin='dense' label={header} name={name} type='number' inputProps={{ step: 0.01, min: 1, max: 2 }} helperText={helperText} />;
    };
    
export const MRTIntegerControl = (name: string, header: string, opts: { max?: number, min?: number }) =>
    function MRT_PercentageControl() {
        const { min, max } = opts;
        return <TextFieldElement margin='dense' label={header} name={name} type='number' inputProps={{ step: 1, min, max }}  />;
    };
