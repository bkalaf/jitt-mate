import { MRT_Row, MRT_RowData } from 'material-react-table';
import { faFloppyDisk, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { Dialog, DialogTitle, Divider, DialogActions, ButtonGroup, DialogContent } from '@mui/material';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateRecordProp } from '../../../hooks/updateRecord';
import { useLocalRealm } from '../../../hooks/useLocalRealm';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { ClothingCareOptions, ClothingCareIndividualKeys, ClothingCareSectionKeys, sectionNames, getClothingCareSection, JITTIconButton } from '../clothingCareMeta';

export function JITTClothingCareDialog<T extends MRT_RowData>({
    isOpen, hideModal, dbSet, onSuccess, name, objectType, row
}: {
    isOpen: boolean;
    hideModal: () => void;
    dbSet: DBSet<ClothingCareOptions> | ClothingCareOptions[] | undefined;
    onSuccess: { onSuccess: () => void; };
    name: string;
    objectType: RealmObjects;
    row: MRT_Row<T>;
}) {
    const [value, setValue] = useState<ClothingCareIndividualKeys<ClothingCareSectionKeys>[]>(Array.from(dbSet?.values() ?? []));
    const db = useLocalRealm();
    const { mutateAsync } = useMutation({
        mutationFn: updateRecordProp(objectType, db),
        ...onSuccess
    });
    const toggleValue = useCallback((item: ClothingCareIndividualKeys<ClothingCareSectionKeys>) => {
        return () => setValue((prev) => {
            if (prev.includes(item)) {
                return [...prev.filter((x) => x !== item)];
            }
            return [...prev, item];
        });
    }, []);
    const hasValue = useCallback(
        (item: ClothingCareIndividualKeys<ClothingCareSectionKeys>) => {
            return () => value.includes(item);
        },
        [value]
    );
    const onSave = useCallback(() => {
        mutateAsync({ _id: row.id, propertyName: name, value }).then(hideModal);
    }, [hideModal, mutateAsync, name, row.id, value]);
    return (
        <Dialog maxWidth='md' fullWidth open={isOpen} onClose={hideModal}>
            <DialogTitle>CLOTHING CARE</DialogTitle>
            <Divider variant='middle' className='border-black' />
            <DialogContent className='flex flex-col w-full'>
                {sectionNames.map((section) => {
                    const options = Object.entries(getClothingCareSection(section)).map(([k, v]) => ({
                        title: v.text,
                        color: 'info' as const,
                        Icon: v.Element,
                        className: 'w-6 h-6 aria-selected:bg-lime-500 aria-unselected:bg-neutral-400 aria-selected:ring aria-selected:ring-lime-500',
                        onClick: toggleValue(k as ClothingCareOptions),
                        'aria-selected': hasValue(k as ClothingCareOptions)()
                    }));
                    return (
                        <fieldset key={section} name='section' className='flex w-full'>
                            <legend>{toProperFromCamel(section)}</legend>
                            <ButtonGroup variant='contained' size='small'>
                                {options.map((p, ix) => (
                                    <JITTIconButton {...p} key={ix} />
                                ))}
                            </ButtonGroup>
                        </fieldset>
                    );
                })}
            </DialogContent>
            <Divider variant='middle' className='border-black' />
            <DialogActions className='flex justify-end w-full space-x-1'>
                <JITTIconButton title='Cancel' Icon={faTimes} onClick={hideModal} color='warning' className='w-6 h-6' />
                <JITTIconButton title='Save' Icon={faFloppyDisk} onClick={onSave} color='info' className='w-6 h-6' />
            </DialogActions>
        </Dialog>
    );
}
