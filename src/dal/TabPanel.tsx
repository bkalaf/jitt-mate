import { Row, Table } from '@tanstack/react-table';
import { useTabPanelContext } from '../hooks/useTabPanelContext';
import { useMemo } from 'react';
import { checkTransaction } from '../util/checkTransaction';
import Realm from 'realm';
import { CollectionPropertyView } from '../components/CollectionPropertyView';

export function collectionMutation<TValue>(db: Realm, func: (newItem: TValue | [string, TValue]) => void) {
    return function (newItem: TValue | [string, TValue]) {
        checkTransaction(db)(() => func(newItem));
        return Promise.resolve();
    };
}

export function TabPanel<TParent extends EntityBase, TKey extends keyof TParent & string, TType extends 'list' | 'dictionary' | 'set', TValue extends EntityBase>(props: {
    type: TType;
    propertyName: TKey;
    objectType: string;
    parentRow: Row<TParent>;
    collectionName: string;
    table: Table<TParent>
}) {
    const { propertyName, type, objectType, parentRow, collectionName } = props;
    // const [collection, setCollection] = useState<TType extends 'list' ? DBList<TValue> : TType extends 'dictionary' ? DBDictionary<TValue> : TType extends 'set' ? DBSet<TValue> : never>(
    //     parentRow.original[propertyName] as TType extends 'list' ? DBList<TValue> : TType extends 'dictionary' ? DBDictionary<TValue> : TType extends 'set' ? DBSet<TValue> : never
    // );
    // const appendToCollection = (newItem: TValue | [string, TValue]) => {
    //     switch (type) {
    //         case 'list':
    //             (collection as DBList<TValue>).push(newItem as TValue);
    //             return;
    //         case 'dictionary':
    //             (collection as DBDictionary<TValue>).set(Object.fromEntries([newItem] as [[string, TValue]]));
    //             return;
    //         case 'set':
    //             (collection as DBSet<TValue>).add(newItem as TValue);
    //             return;
    //     }
    // };
    // const db = useLocalRealm();
    // const { mutate } = useMutation({
    //     mutationFn: collectionMutation(db, appendToCollection)
    // });
    // const columns = useNestedColumnDefs<TValue>(objectType);
    const { actions } = useTabPanelContext();
    const { isCurrent } = useMemo(() => actions(propertyName), [actions, propertyName]);
    const id = `${propertyName}-tab`;
    const controlsId = `${id}panel`;
    // const getRowId = useCallback((value: any) => {
    //     return value._index;
    // }, [])
    // const data = useMemo(() => Array.from(collection.values()).map((x, ix) => {
    //     (x as any)._index = ix;
    //     return x;
    // }), [collection]);
    // const table = useReactTable({
    //     data: data,
    //     columns,
    //     defaultColumn: {
    //         cell: DefaultTableBodyCell,
    //         footer: DefaultTableFooterCell,
    //         header: DefaultTableHeaderCell
    //     },
    //     getCoreRowModel: getCoreRowModel(),
    //     getPaginationRowModel: getPaginationRowModel(),
    //     getFilteredRowModel: getFilteredRowModel(),
    //     getSortedRowModel: getSortedRowModel(),
    //     debugAll: true,
    //     getRowId: getRowId,
    //     // getRowCanExpand: getRowCanExpand,
    //     initialState: {
    //         // columnVisibility,
    //         pagination: {
    //             pageIndex: 0,
    //             pageSize: 25
    //         }
    //     }
    // });
    return (
        <div className='flex flex-grow w-full h-full aria-not-current:hidden' role='tabpanel' aria-labelledby={id} id={controlsId} aria-current={isCurrent()}>
            <CollectionPropertyView parentTable={props.table} row={parentRow} propertyName={propertyName} />
        </div>
    );
}
