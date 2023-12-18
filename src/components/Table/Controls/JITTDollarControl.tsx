import { faDollarSign } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@mui/material';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { TextFieldElement } from 'react-hook-form-mui';
import { useDependencies } from '../../../hooks/useDependencies';

export function JITTDollarControl<T extends MRT_RowData>(opts: { required?: boolean; readOnly?: boolean; min?: number, max?: number }, initialDisable = false, ...dependencies: IDependency[]) {
    return function MRT_DollarControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const spread = useDependencies(props, initialDisable, ...dependencies);
        return (
            <TextFieldElement
                margin='dense'
                type='number'
                required={opts.required ?? false}                
                inputProps={{ step: 0.01, min: opts.min, max: opts.max }}
                InputProps={{
                    readOnly: opts.readOnly ?? false,
                    startAdornment: (
                        <Icon>
                            <FontAwesomeIcon icon={faDollarSign} className='block object-contain w-6 h-6' />
                        </Icon>
                    )
                }}
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
}
