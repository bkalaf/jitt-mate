import { IApparelDetails, IRn } from '../../dal/types';
import { BacklineTypes } from '../../dal/enums/backlineTypes';
import { CollarTypes } from '../../dal/enums/collarTypes';
import { CuffTypes } from '../../dal/enums/cuffTypes';
import { NecklineTypes } from '../../dal/enums/necklineTypes';
import { SleeveTypes } from '../../dal/enums/sleeveTypes';
import { TopAdornments } from '../../dal/enums/topAdornments';
import { WaistTypes } from '../../dal/enums/waistTypes';
import { $metas } from './../../components/Table/metas';
import { enableWhen } from './enableWhen';

export const apparelDetailsColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IApparelDetails> =>
        (
            [
                $metas.enum('backlineType', { header: 'Backline', enumMap: BacklineTypes }, true, enableWhen('taxon.klass', 'tops')),
                $metas.enum('collarType', { enumMap: CollarTypes, header: 'Collar' }, true, enableWhen('taxon.klass', 'tops')),
                $metas.enum('cuffType', { enumMap: CuffTypes, header: 'Cuff' }, true, enableWhen('taxon.klass', 'tops')),
                $metas.string('cutNo', { header: 'Cut #' }, true, enableWhen('taxon.kingdom', 'apparel')),
                $metas.enum('necklineType', { enumMap: NecklineTypes, header: 'Neckline' }, true, enableWhen('taxon.klass', 'tops')),
                $metas.int('pocketCount', { header: 'Pocket Count', min: 0 }, true, enableWhen('taxon.kingdom', 'apparel')),
                $metas.string('size', {}, true, enableWhen('taxon.kingdom', 'apparel')),
                $metas.enum('sleeveType', { enumMap: SleeveTypes, header: 'Sleeves' }, true, enableWhen('taxon.klass', 'tops')),
                $metas.enum<IApparelDetails>('topAdornment', { header: 'Top Adornment', enumMap: TopAdornments }, true, enableWhen('taxon.klass', 'tops')),
                $metas.enum<IApparelDetails>('waistType', { header: 'Waist', enumMap: WaistTypes }, true, enableWhen('taxon.klass', 'bottoms')),
                $metas.embed<IApparelDetails>('measurements', { getColumnsKey: 'measurements' }, true, enableWhen('taxon.kingdom', 'apparel')),
                $metas.lookup<IApparelDetails, IRn>('rn', { objectType: 'rn', header: 'RN', labelPropertyName: 'companyName' }, true, enableWhen('taxon.family', 'apparel')),
                $metas.clothingCare<IApparelDetails>('clothingCare', {}, true, enableWhen('taxon.family', 'apparel'))
            ] as DefinedMRTColumns<IApparelDetails>
        ).map((x) => (x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') }: x) ) as DefinedMRTColumns<IApparelDetails>
} as StaticTableDefinitions<IApparelDetails>;
