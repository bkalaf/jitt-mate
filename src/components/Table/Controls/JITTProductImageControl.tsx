import { useFormContext } from 'react-hook-form-mui';
import { MRT_ColumnDef } from 'material-react-table';
import { useDependencies } from '../../../hooks/useDependencies';
import { List, ListItem, ListItemText } from '@mui/material';
import { IProductImage, ISku } from '../../../dal/types';
import * as path from 'path';
import { JITTIconButton } from '../JITTIconButton';
import { faFilePlus, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { useToggler } from '../../../hooks/useToggler';
import { JITTProductImageDialog } from '../metas/JITTProductImageDialog';
import { useCallback, useEffect, useState } from 'react';
import { useLocalRealm } from '../../../hooks/useLocalRealm';
import { checkTransaction } from '../../../util/checkTransaction';

export function JITTProductImageControl<T extends EntityBase>(initialDisable: boolean, ...dependencies: IDependency[]) {
    function InnerJITTImageControl(props: Parameters<Exclude<MRT_ColumnDef<T, DBBacklink<IProductImage>>['Edit'], undefined>>[0]) {
        const { classes, control, disabled, label, name, onBlur } = useDependencies(props as any, initialDisable, ...dependencies);
        const formContext = useFormContext();
        const [backlink, setBacklink] = useState(props.cell.renderValue());
        const refreshBacklink = useCallback(() => {
            setBacklink(props.cell.renderValue());
        }, [props.cell]);
        const images = Array.from(backlink ?? []);
        useEffect(() => {
            const listener = (collection: any, changes: any) => {
                refreshBacklink();
            };
            console.info('addListener-collection/change');
            props.cell.renderValue()?.addListener(listener);
            return () => {
                console.info('removeListener-collection/change');
                props.cell.renderValue()?.removeListener(listener);
            };
        }, [props.cell, refreshBacklink]);
        console.log(`value`, images);
        console.log(`props`, props);
        const [isOpen, toggleModal, , hideModal] = useToggler(false);
        const db = useLocalRealm();
        return (
            <fieldset name={name} className='flex flex-col'>
                <legend className='flex w-full'>{label}</legend>
                <div className='flex justify-end w-full'>
                    <JITTIconButton title='Add files' Icon={faFilePlus} color='info' onClick={toggleModal} type='button' />
                    <JITTProductImageDialog
                        isOpen={isOpen}
                        hideModal={hideModal}
                        label={label}
                        name={name}
                        disabled={disabled}
                        sku={props.row.original as any as Entity<ISku>}
                        formContext={formContext}
                        images={images}
                        onChange={(newValue) => console.info(`newValue`, newValue)}
                    />
                </div>
                <List disablePadding>
                    {images.map((image, ix) => (
                        <ListItem
                            key={ix}
                            disableGutters
                            disablePadding
                            secondaryAction={
                                <JITTIconButton
                                    title='Delete this item'
                                    Icon={faTrash}
                                    color='neon'
                                    type='button'
                                    onClick={() => {
                                        checkTransaction(db)(() => db.delete(image));
                                    }}
                                />
                            }
                            sx={{
                                minWidth: 'min-content'
                            }}>
                            <ListItemText primary={path.basename(image.effectivePath)} />
                        </ListItem>
                    ))}
                </List>
            </fieldset>
        );
    }
    return InnerJITTImageControl;
}
