import { useState } from 'react';


export function useMenuAnchor(): [open: boolean, anchorEl: HTMLElement | null, handleOpen: (event: React.MouseEvent<HTMLElement>) => void, handleClose: () => void] {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    return [Boolean(anchorEl), anchorEl, handleOpen, handleClose];
}
