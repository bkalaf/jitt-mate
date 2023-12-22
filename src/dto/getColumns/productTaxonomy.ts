import { MRT_ColumnDef } from 'material-react-table';
import { IProductTaxonomy } from '../../dal/types';
import { RHFM_TaxonSelect } from '../../components/Table/Controls/RHFM_TaxonSelect';
import { $metas } from '../../components/Table/metas';
import { ApparelTypes } from '../../dal/enums/apparelType';
import { enableWhen } from './enableWhen';
import { BacklineTypes } from '../../dal/enums/backlineTypes';
import { CollarTypes, CollarTypesColors } from '../../dal/enums/collarTypes';
import { CuffTypes, CuffTypesColors } from '../../dal/enums/cuffTypes';
import { FrontTypes, FrontTypesColors } from '../../dal/enums/frontTypes';
import { Genders, GendersColors } from '../../dal/enums/genders';
import { LegTypes, LegTypesColors } from '../../dal/enums/legTypes';
import { ItemGroups, ItemGroupsColors } from '../../dal/enums/itemGroups';
import { NecklineTypes } from '../../dal/enums/necklineTypes';
import { Sizes } from '../../dal/enums/sizes';
import { SleeveTypes, SleeveTypesColors } from '../../dal/enums/sleeveTypes';
import { TopAdornments } from '../../dal/enums/topAdornments';
import { WaistTypes, WaistTypesColors } from '../../dal/enums/waistTypes';
import { MediaTypes } from '../../dal/enums/mediaTypes';
import { VideoTypes } from '../../dal/enums/videoTypes';
import { BookTypes } from '../../dal/enums/bookTypes';


export const productTaxonomyColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IProductTaxonomy> =>
        (
            [
                $metas.bool('lock', { header: 'Is Locked' }, false),
                $metas.string('name', { readOnly: true }, false),
                {
                    accessorKey: 'kingdom',
                    header: 'Kingdom',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                },
                {
                    accessorKey: 'phylum',
                    header: 'Phylum',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                },
                {
                    accessorKey: 'klass',
                    header: 'Class',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                },
                {
                    accessorKey: 'order',
                    header: 'Order',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                },
                {
                    accessorKey: 'family',
                    header: 'Family',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                },
                {
                    accessorKey: 'genus',
                    header: 'Genus',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                },
                {
                    accessorKey: 'species',
                    header: 'Species',
                    Edit: RHFM_TaxonSelect as React.FunctionComponent<Parameters<Exclude<MRT_ColumnDef<IProductTaxonomy, string>['Edit'], undefined>>[0]>
                },
                $metas.radio('apparelType', { enumMap: ApparelTypes }, true, enableWhen('taxon.kingdom', 'apparel')),
                $metas.radio('backlineType', { enumMap: BacklineTypes }, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                $metas.radio('collarType', { enumMap: CollarTypes, colorMap: CollarTypesColors }, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                $metas.radio('cuffType', { enumMap: CuffTypes, colorMap: CuffTypesColors }, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                $metas.radio('frontType', { enumMap: FrontTypes, colorMap: FrontTypesColors }, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                $metas.radio('gender', { enumMap: Genders, colorMap: GendersColors }, true, enableWhen('taxon.kingdom', 'apparel')),
                $metas.radio('legType', { enumMap: LegTypes, colorMap: LegTypesColors }, true, enableWhen('taxon.klass', ['bottoms', 'activewear'])),
                $metas.radio('itemGroup', { enumMap: ItemGroups, colorMap: ItemGroupsColors }, false),
                $metas.radio('necklineType', { enumMap: NecklineTypes }, true, enableWhen('taxon.klass', ['tops', 'activewear'])),
                $metas.enum('size', { enumMap: Object.fromEntries(Object.entries(Sizes).map(([k, v]) => [k, v.name] as [string, string])) }, true, enableWhen('taxon.kingdom', 'apparel')),
                $metas.radio('sleeveType', { enumMap: SleeveTypes, colorMap: SleeveTypesColors }, true, enableWhen('taxon.klass', ['tops', 'activewear', 'outfits'])),
                $metas.radio('topAdornment', { enumMap: TopAdornments }, true, enableWhen('taxon.klass', ['tops', 'activewear', 'outfits'])),
                $metas.radio('waistType', { enumMap: WaistTypes, colorMap: WaistTypesColors }, true, enableWhen('taxon.klass', ['bottoms', 'activewear', 'outfits'])),
                $metas.radio('mediaType', { enumMap: MediaTypes }, true, enableWhen('taxon.kingdom', 'media')),
                $metas.radio('videoType', { enumMap: VideoTypes }, true, enableWhen('taxon.phylum', 'video')),
                $metas.radio('bookType', { enumMap: BookTypes }, true, enableWhen('taxon.phylum', 'books'))
            ] as DefinedMRTColumns<IProductTaxonomy>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IProductTaxonomy>
} as StaticTableDefinitions<IProductTaxonomy>;
