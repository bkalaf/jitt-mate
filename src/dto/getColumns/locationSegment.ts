import { createMRTColumnHelper } from 'material-react-table';
import { ILocationSegment } from '../../dal/types';
import { barcodeMeta } from '../../components/Table/barcodeMeta';
import { boolMeta } from '../../components/Table/metas/boolMeta';
import { dbListMeta } from '../../components/Table/metas/dbListMeta';
import { enumMeta } from '../../components/Table/metas/enumMeta';
import { objectIdMeta } from '../../components/Table/objectIdMeta';
import { stringMeta } from '../../components/Table/metas/stringMeta';
import { LocationKinds } from '../../dal/enums/locationKinds';
import { LocationLabelColors, LocationLabelColorsColors } from '../../dal/enums/locationLabelColors';
import { LocationTypes, LocationTypesColors } from '../../dal/enums/locationTypes';

export const locationSegmentHelper = createMRTColumnHelper<ILocationSegment>();

export const locationSegmentColumns = {
    getColumns: (...pre: string[]): DefinedMRTColumns =>
        [
            locationSegmentHelper.accessor('_id', objectIdMeta),
            locationSegmentHelper.accessor('name', {
                ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 50 })
            }),
            locationSegmentHelper.accessor('barcode', {
                ...barcodeMeta('barcode', { header: '' }),
                enableEditing: false,
                enableClickToCopy: true,
                sortingFn: 'sortBarcode'
            }) as any,
            locationSegmentHelper.accessor('barcode.valid', {
                ...boolMeta({ propertyName: 'valid', header: 'Valid', readOnly: true }),
                enableEditing: false,
                Edit: undefined
            }),
            locationSegmentHelper.accessor('upcs', {
                ...dbListMeta<ILocationSegment>('upcs', 'barcode', {
                    header: 'UPCS',
                    parentObjectType: 'locationSegment',
                    ItemComponent: ({ payload }: { payload: ILocationSegment }) => [payload.barcode?.rawValue, payload.barcode?.type].join('/')
                })
            }),
            locationSegmentHelper.accessor('notes', {
                ...stringMeta({ propertyName: 'notes', header: 'Notes', maxLength: 200 })
            }),
            locationSegmentHelper.accessor('type', {
                ...enumMeta('type', LocationTypes, { colorMap: LocationTypesColors, header: 'Location Type' })
            }),
            locationSegmentHelper.accessor('kind', {
                ...enumMeta('kind', LocationKinds, { header: 'Location Kind' })
            }),
            locationSegmentHelper.accessor('color', {
                ...enumMeta('color', LocationLabelColors, { colorMap: LocationLabelColorsColors, header: 'Label Color' })
            })
        ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns
} as StaticTableDefinitions<ILocationSegment>;
