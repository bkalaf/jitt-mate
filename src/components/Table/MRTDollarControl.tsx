import { faDollarSign } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@mui/material';
import { TextFieldElement } from 'react-hook-form-mui';


export const MRTDollarControl = (name: string, header: string) => function MRT_DollarControl() {
    return (
        <TextFieldElement
            margin='dense'
            label={header}
            name={name}
            type='number'
            inputProps={{ step: 0.01, min: 1, max: 2 }}
            InputProps={{
                startAdornment: (
                    <Icon>
                        <FontAwesomeIcon icon={faDollarSign} className='block object-contain w-6 h-6' />
                    </Icon>
                )
            }} />
    );
};
