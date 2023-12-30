import { MRT_ColumnDef } from 'material-react-table';
import { IProductTaxonomy } from '../../dal/types';
import { RHFM_TaxonSelect } from '../../components/Table/Controls/RHFM_TaxonSelect';
import { $metas } from '../../components/Table/metas';
import { enableWhen, enableWhenNotNull } from './enableWhen';
import { SizesLabelMap } from '../../enums/sizes';
import { disableWhen } from './disableWhen';

export const productTaxonomyColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IProductTaxonomy> =>
        (
            [
                $metas.bool('lock', { header: 'Is Locked' }, false),
                $metas.string('name', { readOnly: true }, false),
                $metas.singleSelect('kingdom', {}, false),
                $metas.singleSelect('phylum', {}, true, enableWhenNotNull('taxon.kingdom')),
                $metas.singleSelect('klass', { header: 'Class' }, true, enableWhenNotNull('taxon.phylum')),
                $metas.singleSelect('order', { }, true, enableWhenNotNull('taxon.klass')),
                $metas.singleSelect('family', {  }, true, enableWhenNotNull('taxon.order')),
                $metas.singleSelect('genus', { }, true, enableWhenNotNull('taxon.family')),
                $metas.singleSelect('species', {  }, true, enableWhenNotNull('taxon.genus')),
                // {
                //     accessorKey: 'kingdom',
                //     header: 'Kingdom',
                //     Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                // },
                // {
                //     accessorKey: 'phylum',
                //     header: 'Phylum',
                //     Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                // },
                // {
                //     accessorKey: 'klass',
                //     header: 'Class',
                //     Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                // },
                // {
                //     accessorKey: 'order',
                //     header: 'Order',
                //     Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                // },
                // {
                //     accessorKey: 'family',
                //     header: 'Family',
                //     Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                // },
                // {
                //     accessorKey: 'genus',
                //     header: 'Genus',
                //     Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                // },
                // {
                //     accessorKey: 'species',
                //     header: 'Species',
                //     Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                // }
                // $metas.singleSelect('apparelType', {}, true, enableWhen('taxon.kingdom', 'apparel')),
                // $metas.singleSelect('backlineType', {}, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                // $metas.singleSelect('collarType', {}, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                // $metas.singleSelect('cuffType', {}, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                // $metas.singleSelect('frontType', {}, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                // $metas.singleSelect('gender', {}, true, enableWhen('taxon.kingdom', 'apparel')),
                // $metas.singleSelect('legType', {}, true, enableWhen('taxon.klass', ['bottoms', 'activewear'])),
                // $metas.singleSelect('itemGroup', {}, false),
                // $metas.singleSelect('necklineType', {}, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                // $metas.singleSelect('sizeGroup', {}, true, enableWhen('taxon.kingdom', 'apparel')),
                // // $metas.singleSelect('size', {}, true, enableWhen('taxon.kingdom', 'apparel')),
                // $metas.enum('size', { enumMap: SizesLabelMap('women-dresses') }, true, enableWhen('effectiveSizeGroup', 'women-dresses')),
                // $metas.enum('size', { enumMap: SizesLabelMap('women-letter') }, true, enableWhen('effectiveSizeGroup', 'women-letter')),
                // $metas.enum('size', { enumMap: SizesLabelMap('men-letter') }, true, enableWhen('effectiveSizeGroup', 'men-letter')),
                // $metas.enum('size', { enumMap: SizesLabelMap('women-bust') }, true, enableWhen('effectiveSizeGroup', 'women-bust')),

                // // $metas.string('size', {}, false),
                // $metas.singleSelect('sleeveType', {}, true, enableWhen('taxon.klass', ['tops', 'activewear', 'outfits'])),
                // $metas.singleSelect('topAdornment', {}, true, enableWhen('taxon.klass', ['tops', 'activewear', 'outfits'])),
                // $metas.singleSelect('waistType', {}, true, enableWhen('taxon.klass', ['bottoms', 'activewear', 'outfits'])),
                // $metas.singleSelect('mediaFormatType', {}, true, enableWhen('taxon.kingdom', 'media')),
                // $metas.singleSelect('videoType', {}, true, enableWhen('taxon.phylum', 'video')),
                // $metas.singleSelect('bookType', {}, true, enableWhen('taxon.phylum', 'books'))
                // $metas.radio('apparelType', { enumMap: ApparelTypesInfos }, true, enableWhen('taxon.kingdom', 'apparel')),
                // $metas.radio('backlineType', { enumMap: BacklineTypesEnumMap, colorMap: BacklineTypesColorMap }, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                // $metas.radio('collarType', { enumMap: CollarTypesEnumMap, colorMap: CollarTypesColorMap }, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                // $metas.radio('cuffType', { enumMap: CuffTypesEnumMap, colorMap: CuffTypesColorMap }, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                // $metas.radio('frontType', { enumMap: FrontTypesEnumMap, colorMap: FrontTypesColorMap }, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                // $metas.radio('gender', { enumMap: GendersEnumMap, colorMap: GendersColorMap }, true, enableWhen('taxon.kingdom', 'apparel')),
                // $metas.radio('legType', { enumMap: LegTypesEnumMap, colorMap: LegTypesColorMap }, true, enableWhen('taxon.klass', ['bottoms', 'activewear'])),
                // $metas.radio('itemGroup', { enumMap: ItemGroupsEnumMap, colorMap: ItemGroupsColorMap }, false),
                // $metas.radio('necklineType', { enumMap: NecklineTypesEnumMap, colorMap: NecklineTypesColorMap }, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                // // $metas.enum('size', { enumMap: Object.fromEntries(Object.entries(Sizes).map(([k, v]) => [k, v.name] as [string, string])) }, true, enableWhen('taxon.kingdom', 'apparel')),
                // $metas.radio('sizeGroup', { enumMap: SizeGroupsEnumMap, colorMap: SizeGroupsColorMap }, true, enableWhen('taxon.kingdom', 'apparel')),
                // $metas.radio('sleeveType', { enumMap: SleeveTypesEnumMap, colorMap: SleeveTypesColorMap }, true, enableWhen('taxon.klass', ['tops', 'activewear', 'outfits'])),
                // $metas.radio('topAdornment', { enumMap: TopAdornmentsEnumMap, colorMap: TopAdornmentsColorMap }, true, enableWhen('taxon.klass', ['tops', 'activewear', 'outfits'])),
                // $metas.radio('waistType', { enumMap: WaistTypesEnumMap, colorMap: WaistTypesColorMap }, true, enableWhen('taxon.klass', ['bottoms', 'activewear', 'outfits'])),
                // $metas.radio('mediaFormatType', { enumMap: MediaFormatTypesEnumMap, colorMap: MediaFormatTypesColorMap }, true, enableWhen('taxon.kingdom', 'media')),
                // $metas.radio('videoType', { enumMap: VideoTypesEnumMap, colorMap: VideoTypesColorMap }, true, enableWhen('taxon.phylum', 'video')),
                // $metas.radio('bookType', { enumMap: BookTypesEnumMap, colorMap: BookTypesColorMap }, true, enableWhen('taxon.phylum', 'books'))
            ] as DefinedMRTColumns<IProductTaxonomy>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IProductTaxonomy>
} as StaticTableDefinitions<IProductTaxonomy>;
