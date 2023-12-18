import { createMRTColumnHelper } from 'material-react-table';
import { IApparelDetails, IMeasurementDictionary } from '../../dal/types';
import { $metas } from '../../components/Table/metas';
import { enableWhen } from './enableWhen';
import { ChestFitTypes } from '../../dal/enums/chestFitTypes';
import { toEnableDependency } from '../../components/Table/toDependency';

export const measurementsHelper = createMRTColumnHelper<IApparelDetails['measurements']>();

export const measurementsColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<IMeasurementDictionary> =>
        (
            [
                $metas.float<IMeasurementDictionary>('bustInches', { header: 'Bust (in)', uom: 'in', precision: 2, min: 0 }, true, enableWhen('taxon.klass', 'undergarments')),
                $metas.float<IMeasurementDictionary>('chestInches', { header: 'Chest (in)', uom: 'in', precision: 2, min: 0 }, true, enableWhen('taxon.klass', 'tops')),
                $metas.enum<IMeasurementDictionary>(
                    'chestFit',
                    { header: 'Chest Fit', enumMap: ChestFitTypes },
                    true,
                    toEnableDependency('chestInches', (x: number) => x != null && x > 0)
                ),
                $metas.float<IMeasurementDictionary>('footInches', { header: 'Foot (in)', precision: 2, min: 0, uom: 'in' }, true, enableWhen('taxon.klass', 'footwear')),
                $metas.float<IMeasurementDictionary>('headInches', { header: 'Head (in)', precision: 2, min: 0, uom: 'in' }, true, enableWhen('taxon.family', 'head')),
                $metas.float<IMeasurementDictionary>('heelInches', { header: 'Heel (in)', precision: 2, min: 0, uom: 'in' }, true, enableWhen('taxon.klass', 'footwear')),
                $metas.float<IMeasurementDictionary>('hipInches', { header: 'Hip (in)', precision: 2, min: 0, uom: 'in' }, true, enableWhen('taxon.klass', 'bottoms')),
                $metas.float<IMeasurementDictionary>('inseamInches', { header: 'Inseam (in)', precision: 2, min: 0, uom: 'in' }, true, enableWhen('taxon.klass', 'bottoms')),
                $metas.float<IMeasurementDictionary>(
                    'lengthInches',
                    { header: 'Length (in)', precision: 2, min: 0, uom: 'in' },
                    true,
                    toEnableDependency('taxon.klass', (x: string) => ['bottoms', 'tops'].includes(x))
                ),
                $metas.float<IMeasurementDictionary>('neckInches', { header: 'Neck (in)', precision: 2, min: 0, uom: 'in' }, true, enableWhen('taxon.klass', 'tops')),
                $metas.float<IMeasurementDictionary>('sleeveInches', { header: 'Sleeve (in)', precision: 2, min: 0, uom: 'in' }, true, enableWhen('taxon.klass', 'tops')),
                $metas.float<IMeasurementDictionary>('torsoInches', { header: 'Torso (in)', precision: 2, min: 0, uom: 'in' }, true, enableWhen('taxon.klass', 'tops')),
                $metas.float<IMeasurementDictionary>('waistInches', { header: 'Length (in)', precision: 2, min: 0, uom: 'in' }, true, enableWhen('taxon.klass', 'bottoms'))
            ] as DefinedMRTColumns<IMeasurementDictionary>
        ).map((x) => ({
            ...x,
            accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined
        })) as DefinedMRTColumns<IMeasurementDictionary>
} as StaticTableDefinitions<IMeasurementDictionary>;
