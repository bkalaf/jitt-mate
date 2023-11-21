import { MRT_Row, MRT_RowData, MRT_TableOptions, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { IRealmEntity } from '../../dal/types';
import { useMUIReactTable } from '../../hooks/useMUIReactTable';
import { useMutation } from '@tanstack/react-query';
import { is } from '../../dal/is';
import { checkTransaction } from '../../util/checkTransaction';
import { FullScreenDialog } from '../Contexts/LinkItemDialog';
import { toProperFromCamel } from '../../common/text/toProperCase';

export function RelationshipTableMRT<T extends MRT_RowData & EntityBase & IRealmEntity<T>>(props: {
    type?: 'object' | 'list' | 'dictionary' | 'set';
    propertyName?: string;
    objectType?: string;
    parentRow?: MRT_Row<AnyObject>;
    open: boolean;
    setClosed: () => void;
}) {
    // const getRowId = useCallback((entity: T) => fromOID(entity._id), []);
    // const { data, isError, isInsertError, isInsertPending, isLoading, onCreatingRowCancel, onCreatingRowSave, onEditingRowCancel, onEditingRowSave } = useAsyncLoading<T>(collectionRoute);
    // const deleteOne = useDeleteOne(collectionRoute);
    // const { state, ...options } = useStandardTableOptions(data, isLoading, isError, deleteOne, { collection: collectionRoute });
    const { dataUpdatedAt, options, invalidator } = useMUIReactTable<T>({ ...props, isLink: true });
    const table = useMaterialReactTable({ ...options, enableEditing: false } as MRT_TableOptions<T>);
    const link = useMutation({
        mutationFn: (args: { values: MRT_Row<AnyObject> | MRT_Row<AnyObject>[] }) => {
            return new Promise((resolve, reject) => {
                try {
                    const payload = is.array(args.values) ? args.values : [args.values];
                    const realm = window.$$store;
                    if (realm == null) throw new Error('no realm');
                    const func = () => {
                        if (props.parentRow == null || props.propertyName == null) throw new Error('insufficient parent data');
                        const value = props.parentRow.original[props.propertyName];
                        if (is.dbList(value)) {
                            props.parentRow.original[props.propertyName] = [...value, ...payload.map((x) => x.original)];
                        } else if (is.dbSet(value)) {
                            payload.map((x) => value.add(x.original));
                        } else {
                            throw new Error('cannot link');
                        }
                    };
                    checkTransaction(realm)(func);
                    resolve(payload);
                } catch (error) {
                    reject(error);
                }
            });
        },
        ...invalidator
    });
    const onClick = () => {
        link.mutate(
            { values: table.getSelectedRowModel().rows as MRT_Row<AnyObject>[] },
            {
                onSuccess: () => {
                    props.setClosed();
                }
            }
        );
    };
    return (
        <FullScreenDialog collection={toProperFromCamel(props.objectType ?? '')} onSave={onClick} open={props.open} setClosed={props.setClosed}>
            <div className='flex flex-col overflow-scroll'>
                <MaterialReactTable table={table} />
                <footer className='flex items-center justify-end w-full flex-between'>
                    {/* <IconButton className='flex' title='Link selections' color='primary' onClick={onClick}>
                    <FontAwesomeIcon icon={faExclamationSquare} className='inline-block object-cover' />
                </IconButton> */}
                    <span className='inline-flex'>{new Date(dataUpdatedAt).toLocaleString()}</span>
                </footer>
            </div>
        </FullScreenDialog>
    );
}
