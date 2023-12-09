import { Divider, IconButton, List, ListItem, ListItemText, Stack, Tooltip, Typography } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form-mui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumpsterFire, faFileUpload, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import React, { useCallback } from 'react';
import { useInvalidator } from '../../../hooks/useInvalidator';
import { useDebounceFunction } from '../useDebounceFunction';
import { toHeader } from '../toHeader';
import { ipcRenderer } from 'electron';
import * as Config from './../../../config.json';
import { ProductImage } from '../../../dto/collections/ProductImage';
import * as fs from 'graceful-fs';
import * as path from 'path';
import { MRT_ColumnDef } from 'material-react-table';
import { IProductImage, ISku } from '../../../dal/types';
import { useLocalRealm } from '../../../routes/loaders/useLocalRealm';
import { $db } from '../../../dal/db';
import { catchError } from '../../catchError';
import { checkTransaction } from '../../../util/checkTransaction';

export function RHFM_ImageListControl<T extends MRT_RowData>(name: string, objectType: string, opts: { header?: string } = {}) {
    function InnerImageListControl(props: Parameters<Exclude<MRT_ColumnDef<T, Realm.Results<Entity<IProductImage>>>['Edit'], undefined>>[0]) {
        const watchedValue = useWatch({ name: name, defaultValue: [] }) as Realm.Results<Entity<IProductImage>> | undefined;
        const header = toHeader(opts, name);
        const { setValue } = useFormContext();
        const { onSuccess } = useInvalidator(name);
        const onClearAllClick = useCallback(() => {
            setValue(name, [] as any);
            onSuccess();
        }, [onSuccess, setValue]);
        const onClearAllClickDebounced = useDebounceFunction(onClearAllClick, 400);
        const db = useLocalRealm();
        const { editingRow, creatingRow } = props.table.getState();
        const onClick = useCallback(
            async (ev: React.MouseEvent) => {
                ev.preventDefault();
                ev.stopPropagation();
                const filePaths: string[] = await ipcRenderer.invoke('get-files', Config.imageImportRoot);
                const f = () => {
                    if (watchedValue == null) throw new Error('no watchedValue');
                    const images = Promise.all(
                        filePaths.map(async (x) => {
                            const buffer = (await fs.promises.readFile(x)).buffer;
                            const file = new File([buffer], x, { type: path.extname(x).replace('.', 'image/') });
                            console.log(`file`, file);
                            const productImage = await ProductImage.ctor(props.row.original as ISku, file);
                            return productImage;
                        })
                    );
                    const func = async () => {
                        const imagesList = await images;
                        const funcs = imagesList
                            .map((image) => {
                                return () => {
                                    db.create<IProductImage>($db.productImage(), image);
                                    return Promise.resolve();
                                };
                            })
                            .reduce(
                                (pv, cv) => async () => {
                                    await pv();
                                    await cv();
                                },
                                () => Promise.resolve()
                            );
                        return await funcs();
                    };
                    func()
                        .then(onSuccess)
                        .catch(catchError)
                        .finally(() => console.log(`images uploaded`));
                };
                checkTransaction(db)(f);
            },
            [db, onSuccess, props.row.original, watchedValue]
        );
        return creatingRow == null && editingRow != null ? (
            <Stack direction='column' spacing={1}>
                <Stack direction='row' spacing={1} className='text-white bg-teal-600 p-0.5'>
                    <Typography variant='h4' className='flex justify-start w-full font-bold indent-2 font-rubik'>
                        {header}
                    </Typography>
                    <Tooltip title='Clear the data structure of all values.'>
                        <IconButton color='error' type='button' onClick={onClearAllClickDebounced} className='flex'>
                            <FontAwesomeIcon icon={faDumpsterFire} className='block object-contain h-7 w-7' />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Divider variant='middle' className='border-sky-800' />
                <Stack direction='row'>
                    <span className='flex flex-grow'></span>
                    <Tooltip title='Upload files.'>
                        <IconButton color='primary' type='button' onClick={onClick} className='flex'>
                            <FontAwesomeIcon icon={faFileUpload} className='block object-contain h-7 w-7' />
                        </IconButton>
                    </Tooltip>
                </Stack>
                {/* <FormContainer
                    mode='onBlur'
                    reValidateMode='onChange'
                    criteriaMode='all'
                    defaultValues={{ value: undefined }}
                    onSuccess={async (data, event) => {
                        event?.preventDefault();
                        event?.stopPropagation();
                        const nextValue = data.value;
                        const nextList = [...watchedValue ?? [], nextValue] as TListOf[];
                        setValue(name, nextList as any);
                    }}>
                    <Stack direction='row' spacing={1} className='text-black bg-neutral-300 p-0.5'>
                        {ofTypeKind === 'embedded' ? null : ofTypeKind === 'primitive' && type != null ? (
                            <TextFieldElement
                                name='value'
                                type={type}
                                required
                                validation={{
                                    required: 'The value field is required.'
                                }}
                                FormHelperTextProps={{
                                    className: 'text-base font-normal font-rubik'
                                }}
                                InputLabelProps={{
                                    className: 'text-base font-normal font-rubik'
                                }}
                                InputProps={{
                                    className: 'text-base font-grandstander font-normal'
                                }}
                            />
                        ) : (
                            <RHFM_RealmObjectLookupControl<TListOf & EntityBase>
                                name='value'
                                objectType={listObjectType}
                                labelPropertyName={labelPropertyName as any}
                                ItemElement={({ data }) => <span>{labelPropertyName == null ? data : (data as any)[labelPropertyName as keyof typeof data]}</span>}
                                header='Value'
                            />
                        )}
                        <SubmitResetButton ofTypeKind={ofTypeKind} listArray={listArray} listType={listType} name={name} setList={setValue} />
                    </Stack>
                </FormContainer> */}
                <Divider variant='middle' className='border-sky-800' />
                <List className='list-disc'>
                    {(watchedValue ?? []).map((item, ix) => (
                        <ListItem
                            key={ix}
                            className='flex flex-row justify-between'
                            secondaryAction={
                                <IconButton
                                    edge='end'
                                    onClick={() => {
                                        if (watchedValue == null) throw new Error('no watched value');
                                        const obj = watchedValue[ix];
                                        const func = () => {
                                            db.delete(obj);
                                            onSuccess();
                                        };
                                        checkTransaction(db)(func);
                                    }}>
                                    <FontAwesomeIcon icon={faTrashCan} className='block object-contain w-8 h-8' />
                                </IconButton>
                            }>
                            <ListItemText className='flex flex-grow indent-2' title={item.filename} />
                        </ListItem>
                    ))}
                </List>
            </Stack>
        ) : null;
    }
    return InnerImageListControl;
}
