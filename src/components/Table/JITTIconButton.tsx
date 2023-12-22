import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, IconButton, CircularProgress, IconButtonProps } from '@mui/material';
import { $cn } from '../../util/$cn';
import SvgBleaching from '../../assets/laundrySVG/Bleaching';

export function JITTIconButton({
    isLoading, title, type, color, onClick, Icon, disabled, size, ...rest
}: {
    isLoading?: boolean;
    title: string;
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
    onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
    color?: IconButtonProps['color'];
    Icon: IconDefinition | typeof SvgBleaching;
    className?: string;
    disabled?: boolean;
    size?: IconButtonProps['size'];
}) {
    const spread = $cn(rest, {}, 'block object-contain');
    return (
        <Tooltip title={title}>
            <IconButton aria-label={title} color={color ?? 'primary'} type={type ?? 'button'} onClick={onClick} disabled={disabled ?? false} size={size}>
                {(isLoading ?? false) ? <CircularProgress size={18} /> : typeof Icon === 'function' ? <Icon /> : <FontAwesomeIcon icon={Icon} {...spread} />}
            </IconButton>
        </Tooltip>
    );
}
