/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useRealmContext } from '../../../hooks/useRealmContext';
import { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/pro-solid-svg-icons';
import { useNavigate } from 'react-router';
import { menuItems } from '../../menuItems';

export function LeftDrawer(props: { open: boolean; toggleOpen: () => void; setClosed: () => void }) {
    const { open, setClosed, toggleOpen } = props;
    const { isAuthenticated } = useRealmContext();
    const authenticated = isAuthenticated();
    const navigate = useNavigate();
    const goTo = useCallback(
        (route: string) => {
            return () => {
                const dataRoute = ['data', route].join('/');
                navigate(dataRoute);
                setClosed();
            };
        },
        [navigate, setClosed]
    );
    const onMouseLeave = useCallback(() => {
        console.log('OnMouseLeave');
        setClosed();
    }, [setClosed]);
    return (
        <Drawer id='left-drawer' anchor='left' open={open} onClose={toggleOpen} className='w-1/5 h-full text-white bg-neutral-400' onMouseLeave={onMouseLeave}>
            {authenticated &&
                Object.entries(menuItems).map(([_, { value, label, color, children }]) => (
                    <List key={value} disablePadding>
                        <ListItem className='flex flex-col px-1 py-2' disableGutters disablePadding>
                            <Typography sx={{ }} variant='h6' component='div' className={`${color} whitespace-pre flex w-full indent-2 font-bold`}>
                                {label}
                            </Typography>
                            <List disablePadding className='w-full'>
                                {Object.values(children as Record<string, { value: string; label: string; children: any[]; color: string }>).map(({ color: c, value: v, label: l }) => (
                                    <ListItem key={v} className={c} disableGutters disablePadding>
                                        <ListItemButton onClick={goTo(v)}>
                                            <ListItemIcon>
                                                <FontAwesomeIcon icon={faTable} className='inline-block object-fill w-5 h-5' />
                                            </ListItemIcon>
                                            <ListItemText primary={l} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </ListItem>
                    </List>
                ))}
        </Drawer>
    );
}
