import { ILocationSegment } from '../../dal/types';
import { LocationKinds } from '../../dal/enums/locationKinds';
import { LocationLabelColors, LocationLabelColorsColors } from '../../dal/enums/locationLabelColors';
import { LocationTypes, LocationTypesColors } from '../../dal/enums/locationTypes';
import { $metas } from '../../components/Table/metas';

export const locationSegmentColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns<ILocationSegment> =>
        (
            [
                $metas.oid,
                $metas.string('name', { required: true, maxLength: 50 }, false),
                $metas.barcode('upcs', {}, false),
                $metas.string('notes', { maxLength: 200 }, false),
                $metas.enum('type', { enumMap: LocationTypes, colorMap: LocationTypesColors, header: 'Location Type' }, false),
                $metas.enum('kind', { enumMap: LocationKinds, header: 'Location Kind' }, false),
                $metas.enum('color', { enumMap: LocationLabelColors, colorMap: LocationLabelColorsColors }, false)
            ] as DefinedMRTColumns<ILocationSegment>
        ).map((x) =>
            x.columnDefType === 'group' ? x : x.accessorKey != null ? { ...x, accessorKey: [...pre, x.accessorKey].join('.') } : x.id != null ? { ...x, id: [...pre, x.id].join('.') } : x
        ) as DefinedMRTColumns<ILocationSegment>
} as StaticTableDefinitions<ILocationSegment>;
