import { MRT_Row, MRT_RowData, MRT_TableOptions } from 'material-react-table';
import { fromOID } from '../dal/fromOID';
import { flattenPayload } from '../util/flattenPayload';
import { checkTransaction } from '../util/checkTransaction';
import { toNotNullOID } from '../dal/toOID';
import { BSON } from 'realm';
import { $$queryClient } from '../components/App';
import { collections } from '../components/Table/collections';
import { is } from '../dal/is';
import { IRealmEntity } from '../dal/types';
import { createDetailSubComponent } from '../components/Table/creators/createDetailSubComponent';

export type TableTypeObject<TResult extends MRT_RowData> = {
    persistedName: string;
    queryKey: string[];
    queryFn: () => Promise<TResult[]>;
    columns: DefinedMRTColumns;
    getRowId: (original: TResult) => string;
    invalidator: {
        onSuccess: () => Promise<void>;
    };
    insert: (args: { values: TResult }) => Promise<AnyObject>;
    edit: (args: { values: TResult }) => Promise<AnyObject>;
    deleteOne: (args: { row: MRT_Row<TResult> | MRT_Row<TResult>[] }) => Promise<any>;
    toGetRowCanExpand: (info: FieldInfo[]) => () => boolean;
    renderDetailPanel: Optional<(info: FieldInfo[]) => MRT_TableOptions<TResult>['renderDetailPanel']>;
    getCanInsertDelete: () => boolean;
};

export const tableType: Record<string, (args: { parentRow: MRT_Row<EntityBase & AnyObject>; collection: keyof typeof collections; objectType: string; propertyName: string }) => TableTypeObject<any>> = {
    dictionary: <T extends AnyObject | string | number | boolean | Date>({
        collection,
        objectType,
        propertyName,
        parentRow
    }: {
        parentRow: MRT_Row<EntityBase & AnyObject>;
        collection: keyof typeof collections;
        objectType: string;
        propertyName: string;
    }): TableTypeObject<[string, T]> => ({
        persistedName: ['dictionary', objectType].join('.'),
        getCanInsertDelete: () => true,
        renderDetailPanel: undefined,
        queryKey: [collection, parentRow.id, propertyName],
        queryFn: () => Promise.resolve(Array.from((parentRow.original[propertyName] as DBDictionary<T>).entries())),
        columns: [
            {
                accessorKey: '0',
                header: 'Key',
                muiEditTextFieldProps: {
                    required: true
                }
            } as DefinedMRTColumn<any>,
            ...collections[objectType].getColumns('1')
        ],
        getRowId: (row: [string, T]) => row[0],
        invalidator: {
            onSuccess: async () => {
                console.error('INVALIDATING', [collection]);

                await $$queryClient.invalidateQueries({ queryKey: [collection] });
                await $$queryClient.refetchQueries({ queryKey: [collection] });
            }
        },
        insert: (args: { values: [string, T] }) => {
            return new Promise<AnyObject>((resolve, reject) => {
                try {
                    const func = () => {
                        const dict = parentRow.original[propertyName] as DBDictionary<T>;
                        const { value: payload } =
                            is.string(args.values[1]) || is.number(args.values[1]) || is.bool(args.values[1]) || is.objectId(args.values[1]) || is.date(args.values[1])
                                ? flattenPayload({ value: args.values[1] })
                                : { value: flattenPayload(args.values[1]) };
                        console.log(`dict`, dict);
                        const result = dict.set({ [args.values[0]]: payload as T });
                        resolve(result);
                    };
                    if (window.$$store == null) throw new Error('NO REALM');
                    checkTransaction(window.$$store)(func);
                } catch (error) {
                    reject(error);
                }
            });
        },
        edit: (args: { values: [string, T] }) => {
            return new Promise<AnyObject>((resolve, reject) => {
                try {
                    const func = () => {
                        const dict = parentRow.original[propertyName] as DBDictionary<T>;
                        const { value: payload } =
                            is.string(args.values[1]) || is.number(args.values[1]) || is.bool(args.values[1]) || is.objectId(args.values[1]) || is.date(args.values[1])
                                ? flattenPayload({ value: args.values[1] })
                                : { value: flattenPayload(args.values[1]) };
                        console.log(`dict`, dict);
                        const result = dict.set({ [args.values[0]]: payload as T });
                        resolve(result);
                    };
                    if (window.$$store == null) throw new Error('NO REALM');
                    checkTransaction(window.$$store)(func);
                } catch (error) {
                    reject(error);
                }
            });
        },
        deleteOne: (args) => {
            return new Promise<string[]>((resolve, reject) => {
                try {
                    const func = () => {
                        const dict = parentRow.original[propertyName] as DBDictionary<T>;
                        const r = is.array(args.row) ? args.row : [args.row];
                        console.log(`dict`, dict);
                        dict.remove(r.map((x) => x.id));
                        resolve(r.map((x) => x.id));
                    };
                    if (window.$$store == null) throw new Error('NO REALM');
                    checkTransaction(window.$$store)(func);
                } catch (error) {
                    reject(error);
                }
            });
        },
        toGetRowCanExpand: () => () => false
    }),
    list: <T extends AnyObject | string | number | boolean | Date>({
        collection,
        objectType,
        propertyName,
        parentRow
    }: {
        parentRow: MRT_Row<EntityBase & AnyObject>;
        collection: keyof typeof collections;
        objectType: string;
        propertyName: string;
    }): TableTypeObject<[number, T]> => ({
        getCanInsertDelete: () => true,
        renderDetailPanel: undefined,
        persistedName: ['list', objectType].join('.'),
        queryKey: [collection, parentRow.id, propertyName],
        queryFn: () => Promise.resolve(Array.from((parentRow.original[propertyName] as DBList<T>).map((x, ix) => [ix, x] as [number, T]))),
        columns: [
            {
                accessorKey: '0',
                header: 'Index',
                muiEditTextFieldProps: {
                    required: true,
                    type: 'text'
                }
            } as DefinedMRTColumn<any>,
            ...collections[objectType].getColumns('1')
        ],
        getRowId: (row: { index: number }) => row.index.toFixed(0),
        invalidator: {
            onSuccess: async () => {
                console.error('INVALIDATING', [collection]);

                await $$queryClient.invalidateQueries({ queryKey: [collection] });
                await $$queryClient.refetchQueries({ queryKey: [collection] });
            }   
        },
        insert: (args: { values: [number, T] }) => {
            return new Promise<DBList<T>>((resolve, reject) => {
                try {
                    const func = () => {
                        const list = parentRow.original[propertyName] as DBList<T>;
                        const { value: payload } =
                            is.string(args.values[1]) || is.number(args.values[1]) || is.bool(args.values[1]) || is.objectId(args.values[1]) || is.date(args.values[1])
                                ? flattenPayload({ value: args.values[1] })
                                : { value: flattenPayload(args.values[1]) };
                        console.log(`list`, list);
                        console.log(`listtype`, list.type);
                        list.push(payload as T);
                        resolve(list);
                    };
                    if (window.$$store == null) throw new Error('NO REALM');
                    checkTransaction(window.$$store)(func);
                } catch (error) {
                    reject(error);
                }
            });
        },
        edit: (args: { values: [number, T] }) => {
            return new Promise<AnyObject>((resolve, reject) => {
                try {
                    const func = () => {
                        const list = parentRow.original[propertyName] as DBList<T>;
                        const { value: payload } =
                            is.string(args.values[1]) || is.number(args.values[1]) || is.bool(args.values[1]) || is.objectId(args.values[1]) || is.date(args.values[1])
                                ? flattenPayload({ value: args.values[1] })
                                : { value: flattenPayload(args.values[1]) };
                        console.log(`list`, list);
                        console.log(`listtype`, list.type);
                        const index = is.number(args.values[0]) ? args.values[0] : parseInt(args.values[0] as string, 10);
                        const newList = list.map((x, ix) => (index !== ix ? x : payload));
                        parentRow.original[propertyName] = newList;
                        resolve(newList);
                    };
                    if (window.$$store == null) throw new Error('NO REALM');
                    checkTransaction(window.$$store)(func);
                } catch (error) {
                    reject(error);
                }
            });
        },
        deleteOne: (args) => {
            return new Promise<number[]>((resolve, reject) => {
                try {
                    const func = () => {
                        const list = parentRow.original[propertyName] as DBList<T>;
                        const r = is.array(args.row) ? args.row : [args.row];
                        const rs = r
                            .map((x) => parseInt(x.id, 10))
                            .sort()
                            .reverse();
                        console.log(`list`, list);
                        console.log(`listtype`, list.type);
                        rs.forEach((rsone) => list.remove(rsone));
                        resolve(rs);
                    };
                    if (window.$$store == null) throw new Error('NO REALM');
                    checkTransaction(window.$$store)(func);
                } catch (error) {
                    reject(error);
                }
            });
        },
        toGetRowCanExpand: () => () => false
    }),
    set: <T extends AnyObject | string | number | boolean | Date>({
        collection,
        objectType,
        propertyName,
        parentRow
    }: {
        parentRow: MRT_Row<EntityBase & AnyObject>;
        collection: keyof typeof collections;
        objectType: string;
        propertyName: string;
    }): TableTypeObject<[number, T]> => ({
        getCanInsertDelete: () => true,
        renderDetailPanel: undefined,
        persistedName: ['set', objectType].join('.'),
        queryKey: [collection, parentRow.id, propertyName],
        queryFn: () => Promise.resolve(Array.from((parentRow.original[propertyName] as DBSet<T>).map((x, ix) => [ix, x] as [number, T]))),
        columns: [
            {
                accessorKey: '0',
                header: 'Index',
                muiEditTextFieldProps: {
                    required: true,
                    type: 'text'
                }
            } as DefinedMRTColumn<any>,
            ...collections[objectType].getColumns('1')
        ],
        getRowId: (row: [number, T]) => row[0].toFixed(0),
        invalidator: {
            onSuccess: async () => {
                console.error('INVALIDATING', [collection]);

                await $$queryClient.invalidateQueries({ queryKey: [collection] });
                await $$queryClient.refetchQueries({ queryKey: [collection] });
            }
        },
        insert: (args: { values: [number, T] }) => {
            return new Promise<DBSet<T>>((resolve, reject) => {
                try {
                    const func = () => {
                        const list = parentRow.original[propertyName] as DBSet<T>;
                        const { value: payload } =
                            is.string(args.values[1]) || is.number(args.values[1]) || is.bool(args.values[1]) || is.objectId(args.values[1]) || is.date(args.values[1])
                                ? flattenPayload({ value: args.values[1] })
                                : { value: flattenPayload(args.values[1]) };
                        console.log(`set`, list);
                        console.log(`settype`, list.type);
                        list.add(payload as T);
                        resolve(list);
                    };
                    if (window.$$store == null) throw new Error('NO REALM');
                    checkTransaction(window.$$store)(func);
                } catch (error) {
                    reject(error);
                }
            });
        },
        edit: (args: { values: [number, T] }) => {
            return new Promise<AnyObject>((resolve, reject) => {
                try {
                    const func = () => {
                        const list = parentRow.original[propertyName] as DBSet<T>;
                        const { value: payload } =
                            is.string(args.values[1]) || is.number(args.values[1]) || is.bool(args.values[1]) || is.objectId(args.values[1]) || is.date(args.values[1])
                                ? flattenPayload({ value: args.values[1] })
                                : { value: flattenPayload(args.values[1]) };
                        console.log(`list`, list);
                        console.log(`listtype`, list.type);
                        const index = is.number(args.values[0]) ? args.values[0] : parseInt(args.values[0] as string, 10);
                        const current = list[index];
                        list.delete(current);
                        list.add(payload as T);

                        resolve(list);
                    };
                    if (window.$$store == null) throw new Error('NO REALM');
                    checkTransaction(window.$$store)(func);
                } catch (error) {
                    reject(error);
                }
            });
        },
        deleteOne: (args) => {
            return new Promise<number[]>((resolve, reject) => {
                try {
                    const func = () => {
                        const list = parentRow.original[propertyName] as DBSet<T>;
                        console.log(`list`, list);
                        console.log(`listtype`, list.type);
                        const indexes = is.array(args.row) ? args.row : [args.row];
                        const index = indexes.map((x) => parseInt(x.id, 10));
                        const current = index.map((x) => list[x]);
                        current.forEach((x) => list.delete(x));
                        resolve(index);
                    };
                    if (window.$$store == null) throw new Error('NO REALM');
                    checkTransaction(window.$$store)(func);
                } catch (error) {
                    reject(error);
                }
            });
        },
        toGetRowCanExpand: () => () => false
    }),
    object: <T extends AnyObject>({
        collection,
        objectType,
        propertyName,
        parentRow
    }: {
        parentRow: MRT_Row<EntityBase & AnyObject>;
        collection: keyof typeof collections;
        objectType: string;
        propertyName: string;
    }): TableTypeObject<T> => ({
        persistedName: objectType,
        getCanInsertDelete: () => false,
        renderDetailPanel: undefined,
        queryKey: [collection, parentRow.id, propertyName],
        queryFn: () => Promise.resolve([parentRow.original[propertyName]]),
        getRowId: () => '0',
        columns: collections[objectType].getColumns(propertyName),
        insert: (args: { values: T }) => {
            throw new Error('cannot insert');
        },
        invalidator: {
            onSuccess: async () => {
                await $$queryClient.invalidateQueries({ queryKey: [collection] });
                await $$queryClient.refetchQueries({ queryKey: [collection] });
            }
        },
        edit: (args: { values: T }) => {
            return new Promise((resolve, reject) => {
                try {
                    const func = () => {
                        const payload = { ...parentRow.original, [propertyName]: flattenPayload(args.values) };
                        if (window.$$store == null) throw new Error('NO REALM');
                        const result = window.$$store.create<Entity<T> & IRealmEntity<T>>(collection, payload as any, Realm.UpdateMode.Modified);
                        if (result.update) {
                            result.update();
                        }
                        resolve(result);
                    };
                    if (window.$$store == null) throw new Error('NO REALM');
                    checkTransaction(window.$$store)(func);
                } catch (error) {
                    reject(error);
                }
            });
        },
        toGetRowCanExpand: () => () => false,
        deleteOne: (args) => {
            throw new Error('cannot delete');
        }
    }),
    collection: <T extends EntityBase>({ collection }: { collection: keyof typeof collections }) => ({
        persistedName: collection,
        queryKey: [collection],
        renderDetailPanel: createDetailSubComponent,
        getCanInsertDelete: () => true,
        queryFn: () => Promise.resolve(Array.from(window.$$store?.objects<T>(collection) ?? []).sort((a, b) => {
            return (a._id < b._id) ? 1 : (a._id > b._id) ? -1 : 0;
        })),
        columns: collections[collection].getColumns(),
        getRowId: (row: EntityBase) => fromOID(row._id),
        insert: (args: { values: AnyObject }) => {
            return new Promise<T>((resolve, reject) => {
                try {
                    const func = () => {
                        const result = window.$$store?.create<Entity<T> & IRealmEntity<T>>(collection, args.values as any, Realm.UpdateMode.Modified);
                        if (result == null) throw new Error('unsucessful create');
                        if (result.update && typeof result.update === 'function') {
                            result.update();
                        }
                        resolve(result);
                    };
                    if (window.$$store == null) throw new Error('NO REALM');
                    checkTransaction(window.$$store)(func);
                } catch (error) {
                    reject(error);
                }
            });
        },
        invalidator: {
            onSuccess: async () => {
                console.error('INVALIDATING', [collection]);
                await $$queryClient.invalidateQueries({ queryKey: [collection] });
                await $$queryClient.refetchQueries({ queryKey: [collection] });
            }
        },
        edit: (args: { values: AnyObject }) => {
            return new Promise<T>((resolve, reject) => {
                try {
                    const func = () => {
                        // const payload = flattenPayload(args.values) as T;
                        console.log(`payload`, args.values);
                        const result = window.$$store?.create<Entity<T> & IRealmEntity<T>>(collection, args.values as any, Realm.UpdateMode.Modified);
                        if (result == null) throw new Error('unsucessful create');
                        if (result.update && typeof result.update === 'function') {
                            result.update();
                        }
                        resolve(result);
                    };
                    if (window.$$store == null) throw new Error('NO REALM');
                    checkTransaction(window.$$store)(func);
                } catch (error) {
                    reject(error);
                }
            });
        },
        deleteOne: (args) => {
            return new Promise<BSON.ObjectId[]>((resolve, reject) => {
                try {
                    const func = () => {
                        if (window.$$store == null) throw new Error('no realm');
                        const oids = (is.array(args.row) ? args.row : [args.row]).map((x) => toNotNullOID(x.id));
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        const objs = oids.map((o) => window.$$store!.objectForPrimaryKey(collection, o)!);
                        window.$$store.delete(objs);
                        resolve(oids);
                    };
                    if (window.$$store == null) throw new Error('NO REALM');
                    checkTransaction(window.$$store)(func);
                } catch (error) {
                    reject(error);
                }
            });
        },
        toGetRowCanExpand: (infos: FieldInfo[]) => () => (infos?.length ?? 0) > 0
    })
};

