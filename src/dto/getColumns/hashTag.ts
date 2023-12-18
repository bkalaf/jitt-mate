import { DateCell } from '../../components/Table/Cells/DateCell';
import { IntCell } from '../../components/Table/IntCell';
import { IHashTag } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const hashTagColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IHashTag> =>
        (
            [
                $metas.oid,
                $metas.string('name', { required: true, maxLength: 100 }, false),
                {
                    accessorKey: '$highestUsage',
                    header: 'Highest Usage',
                    enableEditing: false,
                    Cell: IntCell
                },
                {
                    accessorKey: '$mostRecentDate',
                    header: 'Most Recent',
                    enableEditing: false,
                    Cell: DateCell
                }
            ] as DefinedMRTColumns<IHashTag>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IHashTag>
} as StaticTableDefinitions<IHashTag>;
