import { useFormContext } from 'react-hook-form-mui';
import { MRT_ColumnDef } from 'material-react-table';
import { useDisabled } from '../../../hooks/useDependencies';
import { flattenColumnDef } from '../../../hooks/useEditControls';

export function JITTEmbedControl(initialDisable = false, ...dependencies: IDependency[]) {
    function InnerJITTEmbedControl({ children, ...props }: Parameters<Exclude<MRT_ColumnDef<T, any>['Edit'], undefined>>[0] & { children: Children }) {
        const { watch } = useFormContext();
        const { disabled } = useDisabled(watch, initialDisable, ...dependencies);
        const def = props.column.columnDef;
        return disabled ? null : (
            <>
                <fieldset name={def.accessorKey ?? def.id}>
                    <legend>{def.header}</legend>
                    {(def.columns ?? []).map(flattenColumnDef).map((components) => components.map((Component, ix) => <Component {...props} key={ix} />))}
                    {children}
                </fieldset>
            </>
        );
    }
    return InnerJITTEmbedControl;
}
