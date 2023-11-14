export function fromMetaToColumnDef() {
    return function (Ctor: any) {
        console.log(Ctor);
        console.log(Ctor.name);

        const metadata = Ctor[Symbol.metadata];
        return (...prefixes: string[]) =>
            Object.entries(metadata.fields).map(([k, v]) => {
                const { accessorKey, accessorFn, header, objectCtor, objectType, embedded, footer, id, ...meta } = {
                    ...({
                        // accessorKey: undefined,
                        // accessorFn: undefined,
                        // header: undefined,
                        // footer: undefined,
                        // id: undefined
                    } as {
                        accessorKey?: string;
                        accessorFn?: AnyFunction;
                        header?: string;
                        footer?: string;
                        id?: string;
                        embedded?: boolean;
                        objectType?: string;
                        objectCtor: EntityConstructor<any>;
                    }),
                    ...((Object.getOwnPropertyNames(v).includes('accessorFn') ? v : { accessorKey: k, ...(v as AnyObject) }) as AnyObject)
                };
                const columns = accessorKey != null ? (objectCtor?.columns as any as (prefix: string) => DefinedColumns) : () => undefined;
                return {
                    id,
                    accessorKey: prefixes.length > 0 && accessorKey != null ? [...prefixes, accessorKey].join('.') : accessorKey,
                    accessorFn: prefixes.length > 0 && accessorFn != null ? (x: any) => accessorFn(x[prefixes[0]]) : accessorFn,
                    footer,
                    header,
                    meta: { ...meta, objectCtor, objectType, embedded },
                    columns: columns(accessorKey ?? '')
                };
            });
    };
}
