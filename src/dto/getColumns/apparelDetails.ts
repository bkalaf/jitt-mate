import { createMRTColumnHelper } from 'material-react-table';
import { IApparelDetails } from '../../dal/types';
import { RHFM_Depends } from '../../components/Table/Controls/RHFM_Depends';
import { clothingCareMeta } from '../../components/Table/clothingCareMeta';
import { enumMeta } from '../../components/Table/metas/enumMeta';
import { intMeta } from '../../components/Table/intMeta';
import { lookupMeta } from '../../components/Table/metas/lookupMeta';
import { floatMeta } from '../../components/Table/percentageMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { toDependency } from '../../components/Table/toDependency';
import { BacklineTypes } from '../../dal/enums/backlineTypes';
import { CollarTypes } from '../../dal/enums/collarTypes';
import { CuffTypes } from '../../dal/enums/cuffTypes';
import { NecklineTypes } from '../../dal/enums/necklineTypes';
import { SleeveTypes } from '../../dal/enums/sleeveTypes';
import { TopAdornments } from '../../dal/enums/topAdornments';
import { WaistTypes } from '../../dal/enums/waistTypes';

export const apparelDetailsHelper = createMRTColumnHelper<IApparelDetails>();

export const apparelDetailsColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            apparelDetailsHelper.accessor(
                'backlineType',
                RHFM_Depends<IApparelDetails, any>(enumMeta('backlineType', BacklineTypes, { header: 'Backline' }), ['enable', 'taxon.klass', (x: string) => x === 'tops'])
            ),
            apparelDetailsHelper.accessor('collarType', RHFM_Depends(enumMeta('collarType', CollarTypes, { header: 'Collar' }), ['enable', 'taxon.klass', (x: string) => x === 'tops'])),
            apparelDetailsHelper.accessor('cuffType', RHFM_Depends(enumMeta('cuffType', CuffTypes, { header: 'Cuffs' }), ['enable', 'taxon.klass', (x: string) => x === 'tops'])),
            apparelDetailsHelper.accessor('cutNo', {
                ...stringMeta({ propertyName: 'cutNo', header: 'Cut #' })
            }),
            apparelDetailsHelper.accessor('necklineType', RHFM_Depends(enumMeta('necklineType', NecklineTypes, { header: 'Neckline' }))),
            apparelDetailsHelper.accessor(
                'pocketCount',
                RHFM_Depends(
                    {
                        ...intMeta('pocketCount', { header: 'Pocket #', min: 0 })
                    },
                    ['enable', 'taxon.kingdom', (x: string) => x === 'apparel']
                )
            ),
            apparelDetailsHelper.accessor('size', {
                ...stringMeta({ propertyName: 'size', header: 'Size' })
            }),
            apparelDetailsHelper.accessor('sleeveType', RHFM_Depends(enumMeta('sleeveType', SleeveTypes, { header: 'Sleeves' }), ['enable', 'taxon.klass', (x: string) => x === 'tops'])),
            apparelDetailsHelper.accessor('topAdornment', RHFM_Depends(enumMeta('topAdornment', TopAdornments, { header: 'Top Adornment' }), ['enable', 'taxon.klass', (x: string) => x === 'tops'])),
            apparelDetailsHelper.accessor('waistType', RHFM_Depends(enumMeta('waistType', WaistTypes, { header: 'Waist' }), ['enable', 'taxon.klass', (x) => x === 'bottoms'])),
            apparelDetailsHelper.accessor(
                'measurements.bustInches',
                RHFM_Depends(
                    {
                        ...floatMeta<IApparelDetails>('measurements.bustInches', { header: 'Bust Size', precision: 2, uom: 'in', min: 0 })
                    },
                    ['enable', 'taxon.klass', (x) => x === 'undergarment']
                )
            ),
            apparelDetailsHelper.accessor(
                'measurements.chestInches',
                RHFM_Depends(
                    {
                        ...floatMeta<IApparelDetails>('measurements.chestInches', { header: 'Chest Size', precision: 2, uom: 'in', min: 0 })
                    },
                    ['enable', 'taxon.klass', (x) => x === 'tops']
                )
            ),
            apparelDetailsHelper.accessor(
                'measurements.footInches',
                RHFM_Depends(
                    {
                        ...floatMeta<IApparelDetails>('measurements.footInches', { header: 'Foot Size', precision: 2, uom: 'in', min: 0 })
                    },
                    ['enable', 'taxon.klass', (x) => x === 'footwear']
                )
            ),
            apparelDetailsHelper.accessor(
                'measurements.headInches',
                RHFM_Depends(
                    {
                        ...floatMeta<IApparelDetails>('measurements.headInches', { header: 'Head Size', precision: 2, uom: 'in', min: 0 })
                    },
                    ['enable', 'taxon.order', (x) => x === 'head']
                )
            ),
            apparelDetailsHelper.accessor(
                'measurements.heelInches',
                RHFM_Depends(
                    {
                        ...floatMeta<IApparelDetails>('measurements.heelInches', { header: 'Heel Size', precision: 2, uom: 'in', min: 0 })
                    },
                    ['enable', 'taxon.klass', (x) => x === 'footwear']
                )
            ),
            apparelDetailsHelper.accessor(
                'measurements.hipInches',
                RHFM_Depends(
                    {
                        ...floatMeta<IApparelDetails>('measurements.hipInches', { header: 'Hip Size', precision: 2, uom: 'in', min: 0 })
                    },
                    ['enable', 'taxon.klass', (x) => x === 'bottoms ']
                )
            ),
            apparelDetailsHelper.accessor(
                'measurements.inseamInches',
                RHFM_Depends(
                    {
                        ...floatMeta<IApparelDetails>('measurements.inseamInches', { header: 'Inseam Size', precision: 2, uom: 'in', min: 0 })
                    },
                    ['enable', 'taxon.klass', (x) => x === 'bottoms']
                )
            ),
            apparelDetailsHelper.accessor(
                'measurements.lengthInches',
                RHFM_Depends(
                    {
                        ...floatMeta<IApparelDetails>('measurements.lengthInches', { header: 'Leg Length', precision: 2, uom: 'in', min: 0 })
                    },
                    ['enable', 'taxon.klass', (x) => x === 'bottoms']
                )
            ),
            apparelDetailsHelper.accessor(
                'measurements.neckInches',
                RHFM_Depends(
                    {
                        ...floatMeta<IApparelDetails>('measurements.neckInches', { header: 'Neck Size', precision: 2, uom: 'in', min: 0 })
                    },
                    ['enable', 'taxon.klass', (x) => x === 'tops']
                )
            ),
            apparelDetailsHelper.accessor(
                'measurements.sleeveInches',
                RHFM_Depends(
                    {
                        ...floatMeta<IApparelDetails>('measurements.sleeveInches', { header: 'Sleeve Size', precision: 2, uom: 'in', min: 0 })
                    },
                    ['enable', 'taxon.klass', (x) => x === 'tops']
                )
            ),
            apparelDetailsHelper.accessor(
                'measurements.torsoInches',
                RHFM_Depends(
                    {
                        ...floatMeta<IApparelDetails>('measurements.torsoInches', { header: 'Torso Size', precision: 2, uom: 'in', min: 0 })
                    },
                    ['enable', 'taxon.klass', (x) => x === 'tops']
                )
            ),
            apparelDetailsHelper.accessor(
                'measurements.waistInches',
                RHFM_Depends(
                    {
                        ...floatMeta<IApparelDetails>('measurements.waistInches', { header: 'Waist Size', precision: 2, uom: 'in', min: 0 })
                    },
                    ['enable', 'taxon.klass', (x) => x === 'tops']
                )
            ),
            apparelDetailsHelper.accessor(
                'rn',
                RHFM_Depends(
                    {
                        ...lookupMeta('rn', 'rn', 'companyName', { header: 'RN' })
                    },
                    toDependency('taxon.kingdom', 'apparel')
                )
            ),
            apparelDetailsHelper.accessor('clothingCare', {
                ...clothingCareMeta()
            })
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
} as StaticTableDefinitions<IApparelDetails>;