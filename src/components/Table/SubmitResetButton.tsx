import { IconButton, Tooltip } from '@mui/material';
import { useFormContext } from 'react-hook-form-mui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusHexagon } from '@fortawesome/pro-solid-svg-icons';
import React, { useCallback } from 'react';
import { createPopupForKey } from './createPopupForKey';
import { DataTypeKind, ListTypeKind } from './Controls/RHFM_ListControl';


export function SubmitResetButton<T>({
    name, ofTypeKind, listArray, listType, setList
}: {
    ofTypeKind: DataTypeKind;
    listArray: T[] | [string, T][];
    listType: ListTypeKind;
    setList: (n: string, l: T[] | [string, T][]) => void;
    name: string;
}) {
    const appendTooltipTitle = ofTypeKind === 'embedded'
        ? "Open a modal window to input information for a new object that will be appending to this control's list."
        : "Append the primitive value or append a link of the referenced Realm object to this control's list.";
    const { reset, getValues } = useFormContext();
    const onClickAsync = useCallback(
        async (ev: React.MouseEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            const nextValue = getValues().value;
            const nextList = listType === 'dictionary' ? await createPopupForKey(listArray, nextValue) : ([...(listArray as T[]), nextValue] as T[]);
            setList(name, nextList as any);
        },
        [getValues, listArray, listType, name, setList]
    );
    const onClick = async (ev: React.MouseEvent) => {
        await onClickAsync(ev);
        reset({ value: undefined });
    };
    return (
        <Tooltip title={appendTooltipTitle}>
            <IconButton color='warning' type='button' className='flex' onClick={onClick}>
                <FontAwesomeIcon icon={faPlusHexagon} className='block object-contain h-7 w-7' />
            </IconButton>
        </Tooltip>
    );
}
