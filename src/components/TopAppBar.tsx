import { faBars } from '@fortawesome/pro-duotone-svg-icons';
import { faEllipsisH } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Image } from '@mui/icons-material';
import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useMenuAnchor } from '../hooks/useMenuAnchor';
import { useRealmContext } from '../hooks/useRealmContext';
import { compR, composeR } from '../common/functions/composeR';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logo = require('./../assets/logos/resized-logo.png');

export function TopAppBar({ pages, toggleLeftDrawer, settings }: { settings: [string, () => boolean, () => void][]; toggleLeftDrawer: () => void; pages: string[] }) {
    const { currentUser } = useRealmContext();
    const [menuOpen, menuAnchor, handleOpenMenu, handleCloseMenu] = useMenuAnchor();
    const [userMenuOpen, userMenuAnchor, handleOpenUserMenu, handleCloseUserMenu] = useMenuAnchor();
    return (
        <AppBar position='static'>
            <Container className='max-w-full'>
                <Toolbar disableGutters variant='dense'>
                    <Box className='flex'>
                        <Tooltip title='Open the left sidebar'>
                            <IconButton size='large' aria-label='account of current user' aria-controls='left-drawer' aria-haspopup='true' onClick={toggleLeftDrawer} color='inherit'>
                                <FontAwesomeIcon icon={faBars} className='block object-cover' />
                            </IconButton>
                        </Tooltip>
                        <Box className='flex h-12'>
                            <img src={logo} alt='Junk-in-the-Trunk, Inc logo' className='block object-scale-down' />
                        </Box>
                    </Box>
                    <Box className='flex flex-grow md:hidden'>
                        <Tooltip title='Expand the main menubar.'>
                            <IconButton size='large' aria-label='account of current user' aria-controls='menu-appbar' aria-haspopup='true' onClick={handleOpenMenu} color='inherit'>
                                <FontAwesomeIcon icon={faEllipsisH} className='block object-cover' />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id='menu-appbar'
                            anchorEl={menuAnchor}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            open={menuOpen}
                            onClose={handleCloseMenu}
                            className='block md:hidden'>
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseMenu}>
                                    <Typography className='text-center'>{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box className='flex-grow hidden md:flex'>
                        {pages.map((page) => (
                            <Button key={page} onClick={handleCloseMenu} className='block my-2 text-white'>
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <Box className='flex flex-row flex-shrink'>
                        <Typography className='flex items-center mr-2 font-semibold text-white'>{currentUser?.profile?.email ?? 'n/a'}</Typography>
                        <Tooltip title='Open settings'>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt='User avatar' src='https://gravatar.com/userimage/242964898/d873bf96d51ca6f8905ea7c5aa880804.jpeg?size=256' />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id='menu-appbar'
                            anchorEl={userMenuAnchor}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={userMenuOpen}
                            onClose={handleCloseUserMenu}>
                            {settings.map(
                                ([label, can, execute]) =>
                                    can() && (
                                        <MenuItem
                                            key={label}
                                            onClick={() => {
                                                execute();
                                                handleCloseUserMenu();
                                            }}>
                                            <Typography textAlign='center'>{label}</Typography>
                                        </MenuItem>
                                    )
                            )}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
