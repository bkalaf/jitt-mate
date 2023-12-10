import { TextFieldElement } from 'react-hook-form-mui';
import { useOnBlurContext } from '../creators/useOnBlurContext';
import { MRT_ColumnDef } from 'material-react-table';
import { IDependency } from './RHFM_Depends';
import { useDependencies } from '../../Controls/useDependencies';

export function RHFM_FloatControl(name: string, header: string, precision: 1 | 2 | 3 | 4, opts: { max?: number; min?: number; uom?: string; required?: boolean }, ...dependencies: IDependency[]) {
    function Inner_RHFM_FloatControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        console.log('InnerProps', props);
        // const toProps = props.column.columnDef?.muiEditTextFieldProps ?? konst({} as any);
        // const spread = typeof toProps === 'function' ? toProps(props) : toProps;
        const step = 1 / (10 ^ precision);
        const helperText = opts.uom;
        const { control, classes } = useDependencies(...dependencies);
        const onBlur = useOnBlurContext();
        return <TextFieldElement margin='dense' label={header} name={name} type='number' inputProps={{ step, min: opts.min, max: opts.max }} helperText={helperText} control={control} onBlur={onBlur(name)} classes={classes} />;
    }
    return Inner_RHFM_FloatControl;
}
