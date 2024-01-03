import { MRT_ColumnDef } from 'material-react-table';
import { Chip } from '@mui/material';
import { useEnum } from '../../Contexts/useEnum';

export function OuterSingleSelectCell({ enumType }: { enumType?: string }) {
    return function EnumCell<T extends EntityBase>(props: Parameters<Exclude<MRT_ColumnDef<T, Optional<string>>['Cell'], undefined>>[0]) {
        const value = (props.cell.getValue() as Optional<string>) ?? '';
        console.log(`field: ${props.cell.id}`);
        const uniqueValues = props.column._getFacetedUniqueValues ?? (() => (new Map<string, number>()))
        console.log(`values: ${(Array.from(uniqueValues().keys()).join(', '))}`);
        // const uniqueValues = props.column.getFacetedUniqueValues();
        // const ordered = Object.entries(uniqueValues)
        //     .sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
        //     .map((x) => x[0] as string);
        // const pairs = createFrom(() => justcolors, Math.ceil(ordered.length / justcolors.length)).reduce((pv, cv) => [...pv, ...cv], []);
        // const enumMap = Object.fromEntries(ordered.map((k) => [k, kebabToProperCase(k)] as [string, string]));
        // const colorMap = Object.fromEntries(ordered.map((k, ix) => [k, pairs[ix]] as [string, string]));
        const { enumMap, colorMap } = useEnum(enumType ?? props.column.columnDef.accessorKey ?? props.column.columnDef.id);
        const output = value in enumMap ? enumMap[value] : value;
        const colors = value in colorMap ? colorMap[value] : value;
        return value != null ? <Chip className={colors} label={output}></Chip> : null;
    };
}
