import { createMRTColumnHelper } from 'material-react-table';
import { DateCell } from '../../components/Table/Cells/DateCell';
import { IntCell } from '../../components/Table/IntCell';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { IHashTag } from '../../dal/types';
import { objectIdMeta } from '../../components/Table/metas/objectIdMeta';

export const hashTagHelper = createMRTColumnHelper<IHashTag>();

export const hashTagColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            hashTagHelper.accessor('_id', objectIdMeta),
            hashTagHelper.accessor('name', {
                ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 100 })
            }),
            hashTagHelper.accessor('$maxCount', {
                header: 'Highest Usage',
                enableEditing: false,
                Cell: IntCell
            }),
            hashTagHelper.accessor('$mostRecentDate', {
                header: 'Most Recent',
                enableEditing: false,
                Cell: DateCell
            })
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
} as StaticTableDefinitions<IHashTag>;