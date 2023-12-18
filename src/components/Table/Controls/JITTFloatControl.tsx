import { TextFieldElement } from 'react-hook-form-mui';
import { MRT_ColumnDef } from 'material-react-table';
import { useDependencies } from '../../../hooks/useDependencies';

export function JITTFloatControl({ precision, helperText, ...opts }: { precision: 0 | 1 | 2 | 3 | 4, max?: number; min?: number; uom?: string; required?: boolean; helperText?: string }, initialDisable = false, ...dependencies: IDependency[]) {
    function Inner_RHFM_FloatControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        console.log('InnerProps', props);
        const step = 1 / (10 ^ precision);
        const spread = useDependencies(props, initialDisable, ...dependencies);
        return (
            <TextFieldElement
                margin='dense'
                type='number'
                inputProps={{ step }}
                helperText={helperText}
                label={spread.label}
                name={spread.name}
                classes={spread.classes}
                disabled={spread.disabled}
                control={spread.control}
                onBlur={spread.onBlur}
                validation={{
                    min: opts.min
                        ? {
                              message: `Input must be greater than ${opts.min}.`,
                              value: opts.min
                          }
                        : undefined,
                    max: opts.max
                        ? {
                              message: `Input must be less than ${opts.max}.`,
                              value: opts.max
                          }
                        : undefined
                }}
            />
        );
    }
    return Inner_RHFM_FloatControl;
}
