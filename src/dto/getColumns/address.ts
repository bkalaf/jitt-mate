import { IAddress } from '../../dal/types';
import { $metas } from '../../components/Table/metas';
import { toEnableDependency } from '../../components/Table/toDependency';

export const addressColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IAddress> =>
        ([
            $metas.string<IAddress>('line1', { maxLength: 150 }, false),
            $metas.string<IAddress>(
                'line2',
                { maxLength: 150 },
                true,
                toEnableDependency([...pre, 'line1'].join('.'), (x: string) => x != null && x.length > 0)
            ),
            $metas.string<IAddress>('city', { maxLength: 50 }, false),
            $metas.singleSelect('province', { enumType: 'province' }, false),
            $metas.singleSelect('country', { enumType: 'country' }, false),
            $metas.string<IAddress>('postalCode', { pattern: /^[0-9]{5}(-?[0-9]{4})?$/, patternMsg: 'Input must be in the form 01234 or 01234-1232.' })
        ]
        ).map((x) => (x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x,
        accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...
        pre, x.id].join('.') }: x) ) as DefinedMRTColumns<IAddress>
} as StaticTableDefinitions<IAddress>;
