import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import * as React from 'react';

type T = React.ReactNode;
export function flattenColumnDef<T extends MRT_RowData>(def: MRT_ColumnDef<T, any>): [React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<T, any>['Edit'], undefined>>[0]>[], any] {
    if (def.columnDefType == null) return [];
    switch (def.columnDefType) {
        case 'data':
            return [def.Edit ? [def.Edit] : [], { column: { columnDef: def } }];
        case 'display':
            return [];
        case 'group':
            return [[
                (props: Parameters<Exclude<MRT_ColumnDef<T, any>['Edit'], undefined>>[0]) => {
                    const Edit = def.Edit
                        ? def.Edit
                        : ({ children }: { children: Children }) => {
                                  return <>{children}</>;
                              };
                    return (
                        <Edit {...props}>
                            <fieldset name={def.accessorKey ?? def.id}>
                                <legend>{def.header}</legend>
                                {(def.columns ?? []).map(flattenColumnDef).map(([components, p]) => components.map((Component, ix) => <Component {...props} {...p} key={ix} />))}
                            </fieldset>
                        </Edit>
                    );
                }
            ], { column: { columnDef: def } }];
    }
}
