import { IProductImage } from '../../../dal/types';
import * as path from 'path';
import * as fs from 'graceful-fs';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, ListItem, ListItemText } from '@mui/material';
import { JITTIconButton } from '../JITTIconButton';
import { faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { useToggler } from '../../../hooks/useToggler';
import { Transition } from '../metas/Transition';
import { $cn } from '../../../util/$cn';

export function JITTImageListItem({
    image,
    deleteItem,
    ix,
    ...rest
}: {
    ix: number;
    image: IProductImage;
    deleteItem: () => void;
    className?: string;
}) {
    const [src, setSrc] = useState<undefined | string>(undefined);
    const { className } = $cn(rest, {});
    useEffect(() => {
        if (fs.existsSync(image.effectivePath)) {
            setSrc(URL.createObjectURL(new File([fs.readFileSync(image.effectivePath)], image.effectivePath, { type: `image/${path.extname(image.effectivePath).replaceAll('.', '')}` })));
            return () => {
                setSrc((prev) => {
                    if (prev != null) {
                        URL.revokeObjectURL(prev);
                        return undefined;
                    }
                    return prev;
                });
            };
        }
    }, [image.effectivePath]);
    const [open, toggleOpen, , hideModal] = useToggler(false);
    return src != null ? (
        <>
            <ListItem
                key={ix}
                className={className}
                disableGutters
                disablePadding
                onClick={toggleOpen}
                secondaryAction={<JITTIconButton title='Delete product image row.' Icon={faTrashCan} color='error' type='button' onClick={deleteItem} />}>
                <ListItemText primary={`#${ix.toFixed(0)}`} secondary={path.basename(image.effectivePath)} />
            </ListItem>

            <Dialog open={open} onClose={hideModal} maxWidth='lg' TransitionComponent={Transition} className='w-auto h-auto p-5'>
                <DialogContent>
                    <img src={src} alt={image.effectivePath} />
                </DialogContent>
            </Dialog>

            {/* <Popover {...popoverProps}>
                <img src={src} alt={image.effectivePath} />
            </Popover> */}
        </>
    ) : null;
}
