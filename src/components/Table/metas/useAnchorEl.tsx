import { useCallback, useState } from 'react';
import { PopoverProps } from '@mui/material';


export function useAnchorEl(defaultValue: HTMLElement | null = null) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(defaultValue);
    const open = Boolean(anchorEl);
    const anchorOrigin: PopoverProps['anchorOrigin'] = { horizontal: 'left', vertical: 'bottom' };
    const onClose = useCallback(() => {
        setAnchorEl(null);
    }, []);
    const onClick = useCallback((ev: React.SyntheticEvent) => {
        if (ev.currentTarget != null) {
            setAnchorEl(ev.currentTarget as any);
        }
    }, []);
    return {
        onClick,
        popoverProps: {
            open,
            anchorOrigin,
            onClose,
            anchorEl
        }
    };
}
