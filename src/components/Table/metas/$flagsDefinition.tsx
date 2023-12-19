import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { CheckboxButtonGroup, Path } from 'react-hook-form-mui';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { FlagsKeys } from '../../../dal/types';
import { useDependencies } from '../../../hooks/useDependencies';

export const FlagsOptions = (flags: string[]) => flags.map((flag) => ({ id: flag, label: toProperFromCamel(flag) }));

export const flagsDefinition = function <T extends MRT_RowData>(name: Path<T>, { flags }: { flags: string[] }, initialDisable = false, ...dependencies: IDependency[]) {
    return {
        accessorKey: name,
        header: 'Flags',
        Cell: (props: Parameters<Exclude<MRT_ColumnDef<T, DBSet<FlagsKeys>>['Cell'], undefined>>[0]) => {
            const values = props.cell.getValue();
            const output = Array.from(values.values()).map(toProperFromCamel).join('\n');
            return <span className='whitespace-pre'>{output}</span>;
        },
        Edit: function (props: Parameters<Exclude<MRT_ColumnDef<T, DBSet<FlagsKeys>>['Edit'], undefined>>[0]) {
            const { disabled, control, name, onBlur, label } = useDependencies(props as any, initialDisable, ...dependencies);
            return (
                disabled ?? false ? null : (
                    <fieldset className='flex w-full'>
                        <legend>{label}</legend>
                        <CheckboxButtonGroup control={control} name={name} options={FlagsOptions(flags)} onChange={onBlur} row />
                    </fieldset>
                )
            );
        }
    };
};
