// ///<reference path="./../global.d.ts" />
export function ctorColumnDef(...pre: string[]) {
    return function ([key, { accessorKey, accessorFn, header, objectCtor, objectType, embedded, footer, id, ...meta }]: [
        string,
        {
            accessorKey?: string;
            accessorFn?: AnyFunction;
            header?: string;
            footer?: string;
            id?: string;
            embedded?: boolean;
            objectType?: string;
            objectCtor: EntityConstructor<any>;
        }
    ]) {
        return {
            accessorKey: accessorKey ? [...pre, accessorKey].join('.') : undefined,
            accessorFn,
            id,
            header,
            footer,
            meta: {
                ...meta,
                objectType,
                objectCtor
            },
            columns: objectCtor != null && (embedded ?? true) ? (objectCtor.columns as any)(...pre, key) : undefined
        };
    };
}
