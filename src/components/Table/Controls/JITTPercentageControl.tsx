import { TextFieldElement, useFormContext } from 'react-hook-form-mui';
import { useDependencies } from '../../../hooks/useDependencies';
import { MRT_ColumnDef } from 'material-react-table';
import { faDollarSign } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@mui/material';

export function JITTPercentageControl(opts: { header?: string; max?: number; min?: number; readOnly?: boolean; required?: boolean; } = {}, initalDisable = false, ...dependencies: IDependency[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function MRT_PercentageControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const spread = useDependencies(props, initalDisable, ...dependencies);
        const { watch } = useFormContext();
        const [value] = watch([spread.name]);
        return (
            <TextFieldElement
                margin='dense'
                type='number'
                inputProps={{ step: 0.01 }}
                required={opts.required ?? false}
                InputProps={{
                    readOnly: opts.readOnly ?? false,
                    endAdornment: (
                        <Icon>
                            <FontAwesomeIcon icon={faDollarSign} className='block object-contain w-5 h-5' />
                        </Icon>
                    )
                }}
                validation={{
                    max: opts?.max
                        ? {
                            value: opts.max,
                            message: `Maximum value is ${opts.max}.`
                        }
                        : undefined,
                    min: opts?.min
                        ? {
                            value: opts.min,
                            message: `Minimum value is ${opts.min}.`
                        }
                        : undefined
                }}
                helperText={((value ?? 0) * 100).toFixed(2).concat('%')}
                {...spread} />
        );
    }
    return MRT_PercentageControl;
}
