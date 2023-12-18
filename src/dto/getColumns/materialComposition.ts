import { IMaterialComposition } from '../../dal/types';
import { $metas } from '../../components/Table/metas';

export const materialCompositionColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IMaterialComposition> =>
        (
            [
                $metas.percent<IMaterialComposition>('acrylic', { min: 0, max: 1 }, false),
                $metas.percent<IMaterialComposition>('cashmere', { min: 0, max: 1 }, false),
                $metas.percent<IMaterialComposition>('cotton', { min: 0, max: 1 }, false),
                $metas.percent<IMaterialComposition>('denim', { min: 0, max: 1 }, false),
                $metas.percent<IMaterialComposition>('leather', { min: 0, max: 1 }, false),
                $metas.percent<IMaterialComposition>('nylon', { min: 0, max: 1 }, false),
                $metas.percent<IMaterialComposition>('organicCotton', { min: 0, max: 1 }, false),
                $metas.percent<IMaterialComposition>('polyester', { min: 0, max: 1 }, false),
                $metas.percent<IMaterialComposition>('polyurethane', { min: 0, max: 1 }, false),
                $metas.percent<IMaterialComposition>('rayon', { min: 0, max: 1 }, false),
                $metas.percent<IMaterialComposition>('silk', { min: 0, max: 1 }, false),
                $metas.percent<IMaterialComposition>('spandex', { min: 0, max: 1 }, false),
                $metas.percent<IMaterialComposition>('suede', { min: 0, max: 1 }, false),
                $metas.percent<IMaterialComposition>('wool', { min: 0, max: 1 }, false)
            ] as DefinedMRTColumns<IMaterialComposition>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<IMaterialComposition>
} as StaticTableDefinitions<IMaterialComposition>;
