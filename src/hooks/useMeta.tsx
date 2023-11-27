import { tapOr } from './useMUIReactTable';

export function useMeta<T extends AnyObject>($columns: DefinedMRTColumns<T>) {
    const columns = $columns.filter(x => x.columnDefType === 'data');
    console.info(`useMeta.columns`, columns);
    const init = async () => {
        const result: T = {} as T;
        for (const col of columns) {
            const name = col.accessorKey ?? col.id ?? ('' as keyof T);
            const { defaultValue } = col.meta ?? { defaultValue: null };
            if (defaultValue == null) {
                result[name] = '' as T[keyof T];
            }
            if (typeof defaultValue === 'function') {
                result[name] = await defaultValue();
            } else {
                result[name] = defaultValue;
            }
        }
        console.info(`init.result`, result);
        return result;
    };
    const valueIn = (payload: AnyObject) => {
        console.info(`valueIn.payload`, payload);
        const result = Object.fromEntries(
            columns.map((col) => [col.accessorKey ?? col.id ?? '', col.meta?.valueIn == null ? '' : col.meta.valueIn(payload[col.accessorKey ?? col.id ?? ''])] as [string, string])
        );
        console.info('valueIn.result', result);
        return result;
    };
    const valueOut = (payload: Record<string, string | string[]>) => {
        console.info(`valueOut.payload`, payload);
        const result = Object.fromEntries(
            columns.map(
                (col) =>
                    [col.accessorKey ?? col.id ?? '', col.meta?.valueOut == null ? null : (col.meta.valueOut as ValueOutFunc<unknown>)(payload[col.accessorKey ?? col.id ?? ''])] as [string, unknown]
            )
        );
        console.info(`valueOut.result`, result);
        return result;
    };
    return {
        init,
        valueIn,
        valueOut
    };
}
