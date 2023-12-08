import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { CheckboxButtonGroup, useFormContext } from 'react-hook-form-mui';
import React from 'react';
import * as LaundryCareTypes from '../../../laundry-care.json';

export const LaundryCareOptions = Object.entries(LaundryCareTypes).map(([k, v]) => ({ id: k, label: v }));
export const clothingCareMeta = function <T extends MRT_RowData>() {
    return {
        header: 'Clothing Care',
        Cell: (props: Parameters<Exclude<MRT_ColumnDef<T, DBSet<keyof typeof LaundryCareTypes>>['Cell'], undefined>>[0]) => {
            const values = props.cell.getValue();
            const output = Array.from(values.values()).join('\n');
            return <span>{output}</span>;
        },
        Edit: function (props: Parameters<Exclude<MRT_ColumnDef<T, DBSet<keyof typeof LaundryCareTypes>>['Edit'], undefined>>[0]) {
            const context = useFormContext();
            return (
                <fieldset className='flex w-full'>
                    <legend>CLOTHING CARE OPTIONS</legend>
                    <CheckboxButtonGroup control={context.control} name={props.column.columnDef.accessorKey ?? props.column.columnDef.id ?? 'n/a'} options={LaundryCareOptions} row />
                </fieldset>
                // <div className='flex flex-col shadow-lg'>
                //     <div className='flex justify-between w-full'>
                //         <Typography className='flex flex-grow' variant='caption'>
                //             {props.column.columnDef.header}
                //         </Typography>
                //         <IconButton onClick={toggleOpen}>
                //             <FontAwesomeIcon icon={faSquarePlus} className='block object-contain w-6 h-6' />
                //         </IconButton>
                //     </div>
                //     <List dense>
                //         {data.map((item, ix) => (
                //             <ListItem
                //                 key={ix}
                //                 secondaryAction={<IconButton className='flex' onClick={deleteItem(ix)}>
                //                     <FontAwesomeIcon icon={faTrashCan} className='block object-contain w-6 h-6' />
                //                 </IconButton>}>
                //                 <ListItemText primary={ItemComponent({ payload: item })} />
                //             </ListItem>
                //         ))}
                //     </List>
                // </div>
            );
        }
    };
};
