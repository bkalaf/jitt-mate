import { Divider, IconButton, List, ListItem, ListItemText, Stack, Tooltip, Typography } from '@mui/material';
import { FormContainer, Path, TextFieldElement, useFormContext, useWatch } from 'react-hook-form-mui';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumpsterFire, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import React, { useCallback, useMemo } from 'react';
import { listObjectTypeToInputType } from '../listObjectTypeToInputType';
import { useInvalidator } from '../../../hooks/useInvalidator';
import { RHFM_RealmObjectLookupControl } from '../RHFM_RealmObjectLookupControl';
import { ConvertToRealmFunction } from '../creators/createRenderCreateRowDialogContent';
import { useDebounceFunction } from '../useDebounceFunction';
import { createPopupForKey } from '../createPopupForKey';
import { SubmitResetButton } from '../SubmitResetButton';
import { $convertToRealm } from '../creators/$convertToRealm';
import { useReflectionContext } from '../../Contexts/useReflectionContext';
import { is } from '../../../dal/is';
import { randomString } from '../../../util/randomString';
import { getProperty } from '../../Contexts/getProperty';
import { MRT_ColumnDef } from 'material-react-table';
export type DeleteByIndexAction = (index: number) => Promise<void>;
export type DeleteByKeyAction = (key: string) => Promise<void>;
export type RHFM_ListControlProps<TParent, TName extends Path<TParent>, TListOf> = {
    name: TName;
    header?: string;
    objectType: string;
    listObjectType: RealmObjects | RealmPrimitives;
    listType: ListTypeKind;
    ItemElement: React.FunctionComponent<{ data: TListOf }>;
    // InsertControlElement: React.FunctionComponent;
    labelPropertyName?: string;
};

const deleteActions = {
    index: function <T>(name: string, setValue: (name: string, x: any) => void, list: T[]) {
        return (index: number) => {
            if (index == null) return;
            setValue(name, (list ?? []).filter((_, ix) => ix !== index) as any);
        };
    },
    key: function <T>(name: string, setValue: (name: string, x: any) => void, list: [string, T][]) {
        return (key: string) => {
            if (key == null) return;
            setValue(
                name,
                (list ?? []).filter(([k, v]) => k !== key)
            );
        };
    }
};

export function useRandomID() {
    return useMemo(() => randomString(24), []);
}

export function RHFM_ListControl<TParent, TName extends Path<TParent>, TListOf>({
    name,
    header,
    objectType,
    ItemElement,
    listType,
    listObjectType,
    labelPropertyName
}: RHFM_ListControlProps<TParent, TName, TListOf>) {
    const convertTo = $convertToRealm[objectType as keyof typeof $convertToRealm] as any as ConvertToRealmFunction<TListOf & AnyObject>;

    function InnerListControl(props: Parameters<Exclude<MRT_ColumnDef<T, any>['Edit'], undefined>>[0]) {
        console.log(`rendering: ${name}`);
        console.log(`watchedValue.name`, name);
        console.log(`objectType`, objectType, 'ItemElement', ItemElement, 'listType', listType, 'listObjectType', listObjectType, 'labelPropertyName', labelPropertyName);
        const watchedValue = useMemo(() => getProperty(name)(props.row.original) ?? (listType === 'dictionary' ? {} : []), [props.row.original]);
        const listArray = useMemo(() => (listType === 'dictionary' ? Object.entries(watchedValue as Record<string, TListOf>) : (watchedValue as TListOf[])), [watchedValue]);
        const { getIsEmbedded } = useReflectionContext();
        const ofTypeKind: DataTypeKind = is.realmType.primitive(listObjectType) ? 'primitive' : getIsEmbedded(listObjectType) ? 'embedded' : 'reference';
        const { setValue } = useFormContext();
        const { onSuccess } = useInvalidator(name);
        const onClearAllClick = useCallback(() => {
            setValue(name, [] as any);
            onSuccess();
        }, [onSuccess, setValue]);
        const onClearAllClickDebounced = useDebounceFunction(onClearAllClick, 400);
        const onDeleteClick = deleteActions[listType === 'dictionary' ? 'key' : 'index'];
        const onDeleteClickDebounced = useDebounceFunction<[string | number | undefined], void>(onDeleteClick(name, setValue, listArray as any) as (item?: string | number) => void, 400, undefined);
        const type = useMemo(() => listObjectTypeToInputType(listObjectType), []);

        return (
            <Stack direction='column' spacing={1}>
                <Stack direction='row' spacing={1} className='text-white bg-teal-600 p-0.5'>
                    <Typography variant='h4' className='flex justify-start w-full font-bold indent-2 font-rubik'>
                        {header ?? toProperFromCamel(name)}
                    </Typography>
                    <Tooltip title='Clear the data structure of all values.'>
                        <IconButton color='error' type='button' onClick={onClearAllClickDebounced} className='flex'>
                            <FontAwesomeIcon icon={faDumpsterFire} className='block object-contain h-7 w-7' />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Divider variant='middle' className='border-sky-800' />
                <FormContainer
                    mode='onBlur'
                    reValidateMode='onChange'
                    criteriaMode='all'
                    defaultValues={{ value: undefined }}
                    onSuccess={async (data, event) => {
                        event?.preventDefault();
                        event?.stopPropagation();
                        const nextValue = data.value;
                        const nextList = listType === 'dictionary' ? await createPopupForKey(listArray, nextValue) : ([...(listArray as TListOf[]), nextValue] as TListOf[]);
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
                            <RHFM_RealmObjectLookupControl<TListOf> name='value' objectType={listObjectType} labelPropertyName={labelPropertyName as any} ItemElement={ItemElement} header='Value' />
                        )}
                        <SubmitResetButton ofTypeKind={ofTypeKind} listArray={listArray} listType={listType} name={name} setList={setValue} />
                    </Stack>
                </FormContainer>
                <Divider variant='middle' className='border-sky-800' />
                <List className='list-disc'>
                    {(listArray ?? []).map((item, ix) => (
                        <ListItem
                            key={ix}
                            className='flex flex-row justify-between'
                            secondaryAction={
                                <IconButton edge='end' onClick={() => onDeleteClickDebounced(Array.isArray(item) ? (item[0] as string) : (ix as number))}>
                                    <FontAwesomeIcon icon={faTrashCan} className='block object-contain w-8 h-8' />
                                </IconButton>
                            }>
                            <ListItemText className='flex flex-grow indent-2'>
                                {Array.isArray(item) ? (
                                    <>
                                        <span className='flex px-3 py-1 text-white bg-amber-600 font-rubik'>{item[0]}</span>
                                        <ItemElement data={item[1]} />
                                    </>
                                ) : (
                                    <ItemElement data={item} />
                                )}
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </Stack>
        );
    }
    return InnerListControl;
}
