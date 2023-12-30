/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion, AccordionDetails, AccordionSummary, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useRealmContext } from '../../../hooks/useRealmContext';
import { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/pro-solid-svg-icons';
import { useNavigate } from 'react-router';
import * as Config from './../../../config.json';
import { toProperFromCamel } from '../../../common/text/toProperCase';

export function LeftDrawer(props: { open: boolean; toggleOpen: () => void; setClosed: () => void }) {
    const menuItems = Config.menus.leftDrawer;
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
            {authenticated && (
                <List disablePadding>
                    {Object.entries(menuItems).map(([groupName, { classes, subMenus, itemClasses }], ix) => (
                        <ListItem key={ix} className='flex flex-col px-1 py-2' disableGutters disablePadding>
                            <Accordion className='w-full' disableGutters>
                                <AccordionSummary className='w-full'>
                                    <Typography sx={{}} variant='h6' component='div' className={`${classes} whitespace-pre w-full indent-2 text-lg font-bold font-`}>
                                        {toProperFromCamel(groupName)}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails className={'w-full p-0 m-0 '.concat(itemClasses)}>
                                    <List disablePadding className={'w-full '.concat(itemClasses)}>
                                        {subMenus.map((subMenuName, ix2) => (
                                            <ListItem key={ix2} className={'w-full '.concat(itemClasses)} disableGutters disablePadding>
                                                <ListItemButton onClick={goTo(subMenuName)}>
                                                    <ListItemIcon>
                                                        <FontAwesomeIcon icon={faTable} className='inline-block object-fill w-5 h-5' />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<span className={'w w-full border '.concat(itemClasses)}>{toProperFromCamel(subMenuName)}</span>} className={'w-full '.concat(itemClasses)} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        </ListItem>
                    ))}
                </List>
            )}
        </Drawer>
    );
}
