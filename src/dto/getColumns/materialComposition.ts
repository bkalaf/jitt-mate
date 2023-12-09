import { createMRTColumnHelper } from 'material-react-table';
import { IMaterialComposition } from '../../dal/types';
import { percentageMeta } from '../../components/Table/metas/percentageMeta';

const materialCompositionHelper = createMRTColumnHelper<IMaterialComposition>();
export const materialCompositionColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            materialCompositionHelper.accessor('acrylic', {
                ...percentageMeta('acrylic', { header: 'Acrylic' })
            }),
            materialCompositionHelper.accessor('cashmere', {
                ...percentageMeta('cashmere', { header: 'Cashmere' })
            }),
            materialCompositionHelper.accessor('cotton', {
                ...percentageMeta('cotton', { header: 'Cotton' })
            }),
            materialCompositionHelper.accessor('denim', {
                ...percentageMeta('denim', { header: 'Denim' })
            }),
            materialCompositionHelper.accessor('leather', {
                ...percentageMeta('leather', { header: 'Leather' })
            }),
            materialCompositionHelper.accessor('linen', {
                ...percentageMeta('linen', { header: 'Linen' })
            }),
            materialCompositionHelper.accessor('modal', {
                ...percentageMeta('modal', { header: 'Modal' })
            }),
            materialCompositionHelper.accessor('nylon', {
                ...percentageMeta('nylon', { header: 'Nylon' })
            }),
            materialCompositionHelper.accessor('organicCotton', {
                ...percentageMeta('organicCotton', { header: 'Organic Cotton' })
            }),
            materialCompositionHelper.accessor('polyester', {
                ...percentageMeta('polyester', { header: 'Polyester' })
            }),
            materialCompositionHelper.accessor('polyurethane', {
                ...percentageMeta('polyurethane', { header: 'Polyurethane' })
            }),
            materialCompositionHelper.accessor('rayon', {
                ...percentageMeta('rayon', { header: 'Rayon' })
            }),
            materialCompositionHelper.accessor('silk', {
                ...percentageMeta('silk', { header: 'Silk' })
            }),
            materialCompositionHelper.accessor('spandex', {
                ...percentageMeta('spandex', { header: 'Spandex' })
            }),
            materialCompositionHelper.accessor('suede', {
                ...percentageMeta('suede', { header: 'Suede' })
            }),
            materialCompositionHelper.accessor('wool', {
                ...percentageMeta('wool', { header: 'Wool' })
            })
        ].map((x) => ({
            ...x,
            accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined
        })) as DefinedMRTColumns
} as StaticTableDefinitions<IMaterialComposition>;