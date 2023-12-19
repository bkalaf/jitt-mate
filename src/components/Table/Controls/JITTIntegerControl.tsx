import { TextFieldElement } from 'react-hook-form-mui';
import { useDependencies } from '../../../hooks/useDependencies';
import { MRT_ColumnDef } from 'material-react-table';

export const JITTIntegerControl = (opts: { max?: number; min?: number; required?: boolean } = {}, initialDisable = false, ...dependencies: IDependency[]) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function MRT_PercentageControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const { min, max } = opts;
        const spread = useDependencies(props, initialDisable, ...dependencies);
        return (
            <TextFieldElement
                margin='dense'
                type='number'
                required={opts.required ?? false}
                inputProps={{ step: 1, min, max }}
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
                {...spread}
            />
        );
    };
