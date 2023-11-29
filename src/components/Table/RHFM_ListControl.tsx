import { Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { ControllerRenderProps, Path, TextFieldElement, useController, useFormContext, useWatch } from 'react-hook-form-mui';
import { toProperFromCamel } from '../../common/text/toProperCase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumpsterFire, faPlusHexagon, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { ignore } from '../../common/functions/ignore';
import { useCallback, useEffect, useMemo } from 'react';
import { label } from '../../schema/decorators/label';
import { listObjectTypeToInputType } from './listObjectTypeToInputType';
import { useInvalidator } from '../../hooks/useInvalidator';
import { RHFM_RealmObjectLookupControl } from './RHFM_RealmObjectLookupControl';
import { convertToRealm, ConvertToRealmFunction } from './creators/createRenderCreateRowDialogContent';
import { useDebounceFunction } from './useDebounceFunction';

export type DataTypeKind = 'primitive' | 'embedded' | 'reference';
export type ListTypeKind = 'set' | 'list' | 'dictionary';

export type DeleteByIndexAction = (index: number) => Promise<void>;
export type DeleteByKeyAction = (key: string) => Promise<void>;
export type RHFM_ListControlProps<TParent extends EntityBase, TName extends Path<TParent>, TListOf> = {
    name: TName;
    header?: string;
    objectType: string;
    listObjectType: RealmObjects | RealmPrimitives;
    ofTypeKind: DataTypeKind;
    listType: ListTypeKind;
    ItemElement: React.FunctionComponent<{ data: TListOf }>;
    InsertControlElement: React.FunctionComponent;
    onDeleteAction: DeleteByIndexAction | DeleteByKeyAction;
    promptForKey?: (field: ControllerRenderProps<TParent, TName>) => (data: TListOf) => void;
    labelPropertyName: string;
};

export function RHFM_ListControl<TParent extends EntityBase, TName extends Path<TParent>, TListOf>({
    name,
    header,
    objectType,
    InsertControlElement,
    ItemElement,
    onDeleteAction,
    promptForKey,
    listType,
    listObjectType,
    ofTypeKind,
    labelPropertyName
}: RHFM_ListControlProps<TParent, TName, TListOf>) {
    const convertTo = convertToRealm[objectType as keyof typeof convertToRealm] as any as ConvertToRealmFunction<TListOf & AnyObject>;
    const listArray = useWatch({ name }) as TListOf[] | undefined;
    const { setValue, getValues } = useFormContext();
    const { onSuccess } = useInvalidator(name);
    const onClearAllClick = useCallback(() => {
        setValue(name, [] as any);
        onSuccess();
    }, [name, onSuccess, setValue]);
    const onClearAllClickDebounced = useDebounceFunction(onClearAllClick, 400);
    const onAppendClick = useCallback(() => {
        setValue(name, [...(listArray ?? []), convertTo(getValues() as any)] as any);
        onSuccess();
    }, [convertTo, getValues, listArray, name, onSuccess, setValue]);
    const onAppendClickDebounced = useDebounceFunction(onAppendClick, 400);
    const onDeleteClick = useCallback(
        (index?: number) => {
            return () => {
                if (index == null) return;
                setValue(name, (listArray ?? []).filter((_, ix) => ix !== index) as any);
                onSuccess();
            };
        },
        [listArray, name, onSuccess, setValue]
    );
    const onDeleteClickDebounced = useDebounceFunction<[number?], () => void>(onDeleteClick, 400) as (index: number) => () => void;
    const type = useMemo(() => listObjectTypeToInputType(listObjectType), [listObjectType]);
    const appendTooltipTitle =
        ofTypeKind === 'embedded'
            ? "Open a modal window to input information for a new object that will be appending to this control's list."
            : "Append the primitive value or append a link of the referenced Realm object to this control's list.";
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
                        ItemElement={({ data }) => <span>{(data as any)[labelPropertyName]}</span>}
                        header='Value'
                    />
                )}
                <Tooltip title={appendTooltipTitle}>
                    <IconButton color='warning' type='button' onClick={onAppendClickDebounced} className='flex'>
                        <FontAwesomeIcon icon={faPlusHexagon} className='block object-contain h-7 w-7' />
                    </IconButton>
                </Tooltip>
            </Stack>
            <Divider variant='middle' className='border-sky-800' />
            <List className='list-disc'>
                {(listArray ?? []).map((item, ix) => (
                    <ListItem
                        key={ix}
                        className='flex flex-row justify-between'
                        secondaryAction={
                            <IconButton edge='end' onClick={onDeleteClickDebounced(ix)}>
                                <FontAwesomeIcon icon={faTrashCan} className='block object-contain w-8 h-8' />
                            </IconButton>
                        }>
                        <ListItemText className='flex flex-grow indent-2'>
                            <ItemElement data={item} />
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
