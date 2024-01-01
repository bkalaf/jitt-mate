import { IApparelProperties, IRn } from '../../dal/types';
import { BacklineTypesEnumMap } from '../../dal/enums/backlineTypes';
import { NecklineTypesEnumMap } from '../../dal/enums/necklineTypes';
import { $metas } from './../../components/Table/metas';
import { enableWhen } from './enableWhen';
import { IApparelEnums } from '../../dal/types/enumTypes';
import { CollarTypesEnumMap } from '../../dal/enums/collarTypes';
import { CuffTypesEnumMap } from '../../dal/enums/cuffTypes';
import { SleeveTypesEnumMap, SleeveTypesColorMap } from '../../dal/enums/sleeveTypes';
import { SizeGroupsEnumMap, SizeGroupsColorMap, SizesLabelMap, SizeGroupsKeys } from '../../enums/sizes';
import { TopAdornmentsEnumMap } from '../../dal/enums/topAdornments';
import { WaistTypesEnumMap } from '../../dal/enums/waistTypes';

export const apparelDetailsColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IApparelProperties & IApparelEnums> =>
        (
            [
                $metas.singleSelect('backlineType', { header: 'Backline', enumType: 'backlineType' }, true, enableWhen('taxon.klass', 'tops')),
                $metas.singleSelect('collarType', { enumType: 'collarType', header: 'Collar' }, true, enableWhen('taxon.klass', 'tops')),
                $metas.singleSelect('cuffType', { enumType: 'cuffType', header: 'Cuff' }, true, enableWhen('taxon.klass', 'tops')),
                $metas.string('cutNo', { header: 'Cut #' }, true, enableWhen('taxon.kingdom', 'apparel')),
                $metas.singleSelect('necklineType', { enumType: 'necklineType', header: 'Neckline' }, true, enableWhen('taxon.klass', 'tops')),
                // $metas.int('pocketCount', { header: 'Pocket Count', min: 0 }, true, enableWhen('taxon.kingdom', 'apparel')),
                $metas.enum('sizeGroup', { enumMap: SizeGroupsEnumMap, colorMap: SizeGroupsColorMap }, true, enableWhen('taxon.kingdom', 'apparel')),
                $metas.enum('size', { enumMap: ['apparelDetails.sizeGroup', (x: string) => (x == null ? {} : SizesLabelMap(x as SizeGroupsKeys))] }, true, enableWhen('taxon.kingdom', 'apparel')),
                $metas.singleSelect('sleeveType', { enumType: 'sleeveType', header: 'Sleeves' }, true, enableWhen('taxon.klass', 'tops')),
                $metas.enum<IApparelEnums & IApparelProperties>('topAdornment', { header: 'Top Adornment', enumMap: TopAdornmentsEnumMap }, true, enableWhen('taxon.klass', 'tops')),
                $metas.singleSelect<IApparelEnums & IApparelProperties>('waistType', { header: 'Waist', enumType: 'waistType' }, true, enableWhen('taxon.klass', 'bottoms')),
                $metas.embed<IApparelEnums & IApparelProperties>('measurements', { getColumnsKey: 'measurements' }, true, enableWhen('taxon.kingdom', 'apparel')),
                $metas.lookup<any, IRn>('rn', { objectType: 'rn', header: 'RN', labelPropertyName: 'companyName' }, true, enableWhen('taxon.family', 'apparel')),
                $metas.clothingCare<IApparelEnums & IApparelProperties>('clothingCare', {}, true, enableWhen('taxon.family', 'apparel'))
            ] as DefinedMRTColumns<IApparelProperties & IApparelEnums>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IApparelProperties & IApparelEnums>
} as StaticTableDefinitions<IApparelProperties & IApparelEnums>;
