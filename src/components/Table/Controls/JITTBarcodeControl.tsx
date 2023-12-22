/* eslint-disable @typescript-eslint/no-explicit-any */
import { MRT_ColumnDef } from 'material-react-table';
import { useDependencies } from '../../../hooks/useDependencies';
import { Box, List } from '@mui/material';
import { JITTIconButton } from '../JITTIconButton';
import { faPlusSquare } from '@fortawesome/pro-solid-svg-icons';
import { useToggler } from '../../../hooks/useToggler';
import { JITTBarcodeDialog } from '../Dialogs/JITTBarcodeDialog';
import { useFormContext } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import { Barcode } from '../../../dto/collections/Barcode';
import { useEditingOrCreatingRow } from '../../../hooks/useEditingOrCreatingRow';
import { JITTBarcodeRow } from './JITTBarcodeRow';

export function JITTBarcodeControl(initialDisable = false, ...dependencies: IDependency[]) {
    function InnerJITTBarcodeControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const spread = useDependencies(props, initialDisable, ...dependencies);
        const formContext = useFormContext();
        const array = formContext.watch(spread.name);
        const value = useMemo(() => (array == null ? [] : Array.isArray(array) ? array : Array.from(array.values())), [array]);
        const [isOpen, toggleOpen, , hideModal] = useToggler(false);
        const onChange = useEditingOrCreatingRow(props, initialDisable, ...dependencies);
        const insert = useCallback(
            (bc: string) => {
                const barcode = Barcode.ctor(bc);
                const next = [...value, barcode];
                onChange(hideModal)(next);
            },
            [hideModal, onChange, value]
        );
        const onDelete = useCallback(
            (index: number) => {
                return () => {
                    const next = value.filter((x, i) => index !== i);
                    onChange()(next);
                };
            },
            [onChange, value]
        );
        return (
            <>
                <Box className='flex flex-row justify-between w-full border border-black'>
                    <div className='flex justify-end w-full'>
                        <JITTBarcodeDialog isOpen={isOpen} hideModal={hideModal} submit={insert} />
                        <JITTIconButton
                            className='w-5 h-5 disabled:bg-stone-500 disabled:text-neutral-400'
                            color='info'
                            title='Add barcode.'
                            Icon={faPlusSquare}
                            disabled={value == null || spread.disabled}
                            onClick={toggleOpen}
                        />
                    </div>
                    <List disablePadding>
                        {value.map((bc, ix) => (
                            <JITTBarcodeRow key={ix} barcode={bc} onDelete={onDelete(ix)} />
                        ))}
                    </List>
                </Box>
            </>
        );
    }
    return InnerJITTBarcodeControl;
}

