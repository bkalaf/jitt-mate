import { ColumnDef, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Params, json } from 'react-router';
import { SortDescriptor } from 'realm';
import $defs from '../../schema';
import $$schema from '../../dto';

export function handleSorted<T>(results: Realm.Results<T>, sort?: SortDescriptor[]) {
    return sort != null ? results.sorted(sort) : results;
}
export function handleFiltered<T>(results: Realm.Results<T>, filter?: [string, any[]]) {
    return filter != null ? results.filtered(filter[0], ...filter[1]) : results;
}

export async function collectionLoader({ request, params: { collection } }: { request: Request; params: Params<'collection'> }) {
    console.log(`request`, request);
    console.log(`collection`, collection);
    const $$store = window.$$store;
    console.log('$$store', $$store);
    const ctors = ($$schema as { schema: Realm.ObjectSchema, defaultSort?: SortDescriptor[], defaultFilter?: [string, any[]] }[]);
    console.log('ctors', ctors);
    if ($$store == null) throw new Error('cannot read from null/undefined');
    const found = ctors.find(x => x.schema.name === collection);
    if (found == null) throw new Error('no ctor');
    const { defaultSort, defaultFilter } = found
    const results = handleSorted(handleFiltered($$store.objects(collection ?? ''), defaultFilter), defaultSort);
    console.log(`results`, results);
    const rows = Array.from(results);
    console.log(`rows`, rows);
    console.log(`rows.length`, rows.length);
    return json(rows, { status: 200 });
}

// export function CollectionTable() {

//     const Table = useReactTable({
//          columns: $mercariBrand,
//          data: [],
//          getCoreRowModel: getCoreRowModel()
//     })

//     return table;
// }
