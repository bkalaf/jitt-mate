import { Path, useFormContext } from 'react-hook-form-mui';
import { toHeader } from '../toHeader';
import { collections } from '../collections';
import { MRT_ColumnDef, MRT_RowData, createMRTColumnHelper } from 'material-react-table';
import { useDisabled } from '../../../hooks/useDependencies';

const helper = createMRTColumnHelper();

export function WrappedEdit(Edit: Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>, initialDisable = false, ...dependencies: IDependency[]) {
    function InnerWrappedEdit(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const formContext = useFormContext();
        const { disabled, classes } = useDisabled(formContext.watch, initialDisable, ...dependencies);
        return disabled ? null : <Edit {...props} />;
    }
    return InnerWrappedEdit;
}
export function embedDefinition<T extends MRT_RowData>(
    name: Path<T>,
    { getColumnsKey, ...opts }: { getColumnsKey: RealmPrimitives | RealmObjects; header?: string },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    return {
        header: toHeader(opts, name),
        columns: collections[getColumnsKey].getColumns(name).map((def) => {
            return def.Edit
                ? ({
                      ...def,
                      Edit: WrappedEdit(def.Edit, initialDisable, ...dependencies)
                  } as DefinedMRTColumn<T>)
                : def;
        }) as DefinedMRTColumns<T>,
        // Edit: JITTEmbedControl(initialDisable, ...dependencies),
        columnDefType: 'group'
    } as DefinedMRTColumn<T>;
    // return {
    //     header: toHeader(opts, name),
    //     columns: collections[getColumnsKey].getColumns(name),
    //     Edit: JITTEmbedControl(initialDisable, ...dependencies),
    //     columnDefType: 'group'
    // } as DefinedMRTColumn<T>
}
