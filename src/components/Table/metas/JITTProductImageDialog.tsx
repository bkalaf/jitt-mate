import { FieldValues, UseFormReturn } from 'react-hook-form-mui';
import { Dialog, DialogActions, DialogContent, FilledInput, FormControl, InputLabel, TextField } from '@mui/material';
import { IProductImage, ISku } from '../../../dal/types';
import { JITTIconButton } from '../JITTIconButton';
import { faFloppyDisk } from '@fortawesome/pro-duotone-svg-icons';
import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { useInvalidator } from '../../../hooks/useInvalidator';
import { checkTransaction } from '../../../util/checkTransaction';
import { useLocalRealm } from '../../../hooks/useLocalRealm';
import * as path from 'path';
import Input from './Input';
import { faCancel } from '@fortawesome/pro-solid-svg-icons';
import { useMutation } from '@tanstack/react-query';
import { BSON } from 'realm';
import { ProductImage } from '../../../dto/collections/ProductImage';

export function _JITTProductImageDialog(
    {
        isOpen,
        disabled,
        hideModal,
        name,
        label,
        formContext,
        sku,
        images,
        onChange
    }: {
        isOpen: boolean;
        hideModal: () => void;
        name: string;
        label: string;
        formContext: UseFormReturn<FieldValues>;
        sku: ISku;
        disabled?: boolean;
        images: IProductImage[];
        onChange: (newValue: File[] | null) => void;
    },
    ref: React.ForwardedRef<HTMLInputElement>
) {
    // const [value, setValue] = useState<undefined | File[]>(undefined);
    const { onSuccess } = useInvalidator('sku');
    const db = useLocalRealm();
    
    const inputRef = useRef<HTMLInputElement>(null);
    const inputText = images.map((image) => path.basename(image.effectivePath)).join(', ');
    const { mutateAsync: insertProductImage } = useMutation({
        mutationFn: async ({ uploadedFrom }: { uploadedFrom: string }) => {
            // const func = () => db.create('productImage', { _id: new BSON.ObjectId(), doNotRemoveBG: false, sku, uploadedFrom });
            // checkTransaction(db)(func);
            return ProductImage.ctor(sku as Entity<ISku>, uploadedFrom);
        }
    });
    const handleChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = ev.target.files;
        const fileArray = fileList ? Array.from(fileList) : [];
        onChange?.(fileArray);
        if (fileArray.length === 0 && inputRef.current) {
            inputRef.current.value = '';
        }
    }, [onChange]);
    const handleClear = useCallback((ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        if (disabled) return;
        onChange?.([]);
    }, [disabled, onChange]);
    const onClick = useCallback(async () => {
        if (inputRef.current == null) throw new Error('no inputRef');
        const fileList = inputRef.current.files;
        const fileArray = fileList ? Array.from(fileList) : [];
        const filteredList = fileArray.filter((file) => !images.map((x) => path.basename(x.effectivePath)).includes(path.basename(file.name)));
        console.log(`images, fileList, fileArray, filteredList`, images, fileList, fileArray, filteredList);
        for (const { name: n, path: p } of filteredList) {
            const uploadedFrom = p;
            console.info(`path`, p, n);
            await insertProductImage({ uploadedFrom });
        }
        onSuccess();
        // filteredList.forEach((flist) => {
        //     console.log(`flist`, flist);
        //     const fullname = [flist.path, flist.name].join('/');
        //     insertProductImage({ uploadedFrom: fullname });
        // });
    }, [images, insertProductImage, onSuccess]);
    return (
        <Dialog open={isOpen} onClose={hideModal}>
            <DialogContent>
                <TextField
                    type='file'
                    ref={ref}
                    disabled={disabled}
                    onChange={handleChange}
                    InputProps={{
                        inputComponent: Input,
                        inputProps: {
                            ref: inputRef,
                            text: inputText,
                            multiple: true,
                            isPlaceholder: (images ?? []).length > 0,
                            placeholder: '<empty'
                        },
                        endAdornment:
                            (images ?? []).length > 0 ? <JITTIconButton title='Clear all.' Icon={faCancel} color='warning' disabled={images.length === 0} size='small' onClick={handleClear} /> : <></>
                    }}
                />
                {/* <FormControl variant='filled'>
                    <InputLabel htmlFor='file-input'>{label}</InputLabel>
                    <FilledInput
                        slotProps={{
                            input: {
                                multiple: true,
                                type: 'file',
                                id: 'file-input',
                                name: 'files',
                                onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                                    const fileArray = event.target.files;
                                    const files = Array.from(fileArray ?? []);
                                    console.log(`files`, files);
                                    setValue(prev => {
                                        if (prev == null && files.length === 0) return undefined;
                                        if (prev?.length ?? 0 !== files.length) return files;
                                        if (prev == null) return files;
                                        return prev.every(x => files.map(x => x.name).includes(x.name)) ? prev : files;
                                    }); 
                                },
                                defaultValue: []
                            }
                        }}
                    />
                </FormControl> */}
                {/* <MuiFileInput disabled={disabled} multiple value={value} onChange={handleChange} name={name} label={label} /> */}
            </DialogContent>
            <DialogActions>
                <JITTIconButton color='primary' title='Save values' Icon={faFloppyDisk} type='button' onClick={onClick} />
            </DialogActions>
        </Dialog>
    );
}

export const JITTProductImageDialog = forwardRef(_JITTProductImageDialog);