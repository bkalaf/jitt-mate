import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';

export type RHFM_IconButtonProps = {
    isLoading?: boolean;
    icon: IconDefinition;
    title: string;
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
    color?: Parameters<typeof IconButton>[0]['color'];
    onClick?: Parameters<typeof IconButton>[0]['onClick'];
    size?: Parameters<typeof IconButton>[0]['size'];
    disabled?: Parameters<typeof IconButton>[0]['disabled'] | (() => boolean);
    IconComponent?: React.FunctionComponent;
};

const handleDisabled = function <TComponent extends React.FunctionComponent<{ disabled?: boolean }>>(isDisabled?: Parameters<TComponent>[0]['disabled'] | (() => boolean)): boolean {
    if (isDisabled == null) return false;
    if (typeof isDisabled === 'function') {
        return isDisabled();
    }
    return isDisabled;
};

export function RHFM_IconButton({ isLoading, icon, title, type, color, onClick, size, disabled, IconComponent }: RHFM_IconButtonProps) {
    const $disabled = handleDisabled(disabled);
    return (
        <Tooltip title={title}>
            <IconButton aria-label={title} color={color ?? 'primary'} type={type ?? 'button'} onClick={onClick} size={size ?? 'small'} disabled={$disabled}>
                {isLoading ?? false ? <CircularProgress size={18} /> : IconComponent ? <IconComponent /> : <FontAwesomeIcon icon={icon} className='block object-contain w-8 h-8' />}
            </IconButton>
        </Tooltip>
    );
}
