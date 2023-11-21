import { AppBar, Button, Dialog, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/pro-duotone-svg-icons';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction='up' ref={ref} {...props} />;
});

export function FullScreenDialog(props: { children: Children; collection: string, onSave: () => void; open: boolean; setClosed: () => void }) {
    return (
        <Dialog fullScreen open={props.open} onClose={props.setClosed} TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton edge='start' color='inherit' onClick={props.setClosed} aria-label='close'>
                        <FontAwesomeIcon icon={faWindowClose} className='block object-cover' />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
                        {props.collection}
                    </Typography>
                    <Button autoFocus color='inherit' onClick={props.onSave}>
                        save
                    </Button>
                </Toolbar>
            </AppBar>
            {props.children}
        </Dialog>
    );

}
