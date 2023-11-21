/** @deprecated */
export function TabPanel<TParent extends EntityBase, TKey extends keyof TParent & string, TType extends 'list' | 'dictionary' | 'set'>(props: any) {
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
    return null;
}
