import { CheckboxElement } from 'react-hook-form-mui';

export const MRTBoolControl = (name: string, header: string, defaultValue = false, required = false) =>
    function MRT_BoolControl() {
        return <CheckboxElement name={name} label={header} labelProps={{ labelPlacement: 'top' }} defaultChecked={defaultValue} required={required} />;
    };
