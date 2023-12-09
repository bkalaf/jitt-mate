import { TextFieldElement } from 'react-hook-form-mui';


export const MRTIntegerControl = (name: string, header: string, opts: { max?: number; min?: number; }) => function MRT_PercentageControl() {
    const { min, max } = opts;
    return <TextFieldElement margin='dense' label={header} name={name} type='number' inputProps={{ step: 1, min, max }} />;
};
