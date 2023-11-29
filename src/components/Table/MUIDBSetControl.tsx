import { useQuery } from '@tanstack/react-query';
import { MRT_ColumnDef } from 'material-react-table';
import { useLocalRealm } from '../../routes/loaders/useLocalRealm';
import { MultiSelectElement, useController, useFormContext, useWatch } from 'react-hook-form-mui';
import { useInvalidator } from '../../hooks/useInvalidator';
import { useEffect } from 'react';
import { checkTransaction } from '../../util/checkTransaction';
import { CircularProgress } from '@mui/material';

export function MUIDBSetControl<TListOf, TParent extends AnyObject>(
    parentObjectType: string,
    listOfObjectType: string,
    name: string,
    header: string,
    labelPropertyName: string,
    valuePropertyName = '_id'
) {
    function InnerControl(props: Parameters<NonNullable<MRT_ColumnDef<Entity<TParent>, Optional<DBSet<TListOf>>>['Edit']>>[0]) {
        const db = useLocalRealm();
        // const { data, isLoading } = useQuery({
        //     queryKey: [listOfObjectType],
        //     queryFn: () => {
        //         const result = db.objects<TListOf>(listOfObjectType);
        //         return Promise.resolve(Array.from(result).sort(sortOptions));
        //     }
        // });
        const context = useFormContext();

        const invalidate = useInvalidator(parentObjectType);
        // useEffect(() => {
        //     const values = Array.from((watchedValue as DBSet<TListOf>).values());
        //     const func = () => {
        //         props.row.original[name as keyof TParent] = values as any;
        //     };
        //     checkTransaction(db)(func);
        //     invalidate.onSuccess();
        // }, [db, invalidate, props.row.original, watchedValue]);
        // return isLoading ? (
        //     <CircularProgress color='error' className='w-8 h-8' />
        // ) : (
        //     <MultiSelectElement
        //         name={name}
        //         label={header}
        //         options={data ?? []}
        //         multiple
        //         showCheckbox
        //         itemKey='_id'
        //         itemValue={valuePropertyName}
        //         itemLabel={labelPropertyName}
        //         variant='filled'
        //         control={context.control}
        //         formControlProps={{
        //             size: 'small',
        //             color: 'info'
        //         }}
        //     />
        return <></>
    }
    return InnerControl;
}
