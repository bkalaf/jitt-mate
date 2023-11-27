/* eslint-disable @typescript-eslint/no-explicit-any */
import { MRT_ColumnDef } from 'material-react-table';
import {
    IBarcode,
    IBrand,
    IClassifier,
    IHashTag,
    IHashTagUsage,
    ILocationSegment,
    IMercariBrand,
    IMercariCategory,
    IMercariSubCategory,
    IMercariSubSubCategory,
    IProductTaxonomy
} from '../../dal/types';
import { MRT_OIDCell } from './Cells/MRT_OIDCell';
import helpers from './helpers';
import { createSubComponent } from './creators/createSubComponent';
import { OuterTaxonomyComboBox } from './Controls/OuterTaxonomyComboBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquareDashed } from '@fortawesome/pro-solid-svg-icons';
import { Chip, Icon, List, ListItem, ListItemText } from '@mui/material';
import { konst } from '../../common/functions/konst';
import { CheckBoxCell } from './Cells/CheckBoxCell';
import { DateCell } from './Cells/DateCell';
import { LookupCell } from './Cells/LookupCell';
import { BarcodeCell, PercentCell } from './Cells/PercentCell';
import { fromOID } from '../../dal/fromOID';
import { toOID } from '../../dal/toOID';
import { BSON } from 'realm';
import { MRTIntegerControl, MRTPercentageControl } from './MRTPercentageControl';
import { MRTTextControl } from './MRTTextControl';
import { MRTDbSetAutoCompleteControl } from './MRTDbSetControl';
import { MRTEnumControl, MRTLookupControl } from './MRTLookupControl';
import { MRTListControl } from './MRTListControl';
import { MRTBoolControl } from './MRTBoolControl';
import { toProperFromCamel } from '../../common/text/toProperCase';
import { BarcodeTypes, BarcodeTypesColors } from '../../dal/enums/barcodeTypes';
import { LocationTypes, LocationTypesColors } from '../../dal/enums/locationTypes';
import { LocationKinds } from '../../dal/enums/locationKinds';
import { LocationLabelColors, LocationLabelColorsColors } from '../../dal/enums/locationLabelColors';
import { FieldValues, TextFieldElement, UseFormReturn } from 'react-hook-form-mui';
import { Barcode } from '../../dto/collections/Barcode';
const {
    taxonomy: productTaxonomyHelper,
    category: categoryHelper,
    subCategory,
    subSubCategory,
    classifierHelper,
    mercariBrandHelper,
    brandHelper,
    hashTagHelper,
    hashTagUsageHelper,
    locationSegmentHelper,
    barcodeHelper
} = helpers;

const intMeta = (name: string, opts: { header?: string; min?: number; max?: number } = {}) => ({
    header: opts.header ?? toProperFromCamel(name),
    enableColumnActions: false,
    enableColumnDragging: false,
    maxSize: 200,
    meta: {
        valueIn: (x?: number | null) => x?.toFixed(4) ?? '',
        valueOut: (x?: string) => (x != null && typeof x === 'string' && x.length > 0 ? parseFloat(x) : x != null && typeof x === 'number' ? x : null),
        defaultValue: undefined
    },
    Edit: MRTIntegerControl(name, opts.header ?? toProperFromCamel(name), { min: opts.min, max: opts.max }),
    Cell: IntCell
});
const percentageMeta = function (name: string, opts: { header?: string } = {}) {
    return {
        header: opts.header ?? toProperFromCamel(name),
        enableColumnActions: false,
        enableColumnDragging: false,
        maxSize: 200,
        meta: {
            valueIn: (x?: number | null) => x?.toFixed(4) ?? '',
            valueOut: (x?: string) => (x != null && typeof x === 'string' && x.length > 0 ? parseFloat(x) : x != null && typeof x === 'number' ? x : null),
            defaultValue: undefined
        },
        Edit: MRTPercentageControl(name, opts.header ?? toProperFromCamel(name)),
        Cell: PercentCell as any
    };
};
const barcodeMeta = function (name: string, opts: { header?: string } = {}) {
    return {
        header: opts.header ?? toProperFromCamel(name),
        meta: {
            // valueIn: (x?: string | null) => x ?? '',
            // valueOut: (x?: string) => (x != null && x.length > 0 ? x : null),
            defaultValue: undefined
        },
        enableEditing: false,
        Cell: BarcodeCell as any
    };
};
// const entityDbListMeta = function (opts: { header: string }) {
//     return {
//         Cell: DBListCell,
//         header: opts.header.concat(' #'),
//         enableEditing: false
//     };
// };
const entityDbSetMeta = function <TItem extends EntityBase>(objectType: string, name: string, lookupProperty: string, opts: { header?: string } = {}) {
    return {
        Cell: DBSetCell,
        header: 'HashTag #',
        enableEditing: true,
        enableColumnFilter: false,
        maxSize: 200,
        meta: {
            valueIn: (x?: DBSet<Entity<TItem>> | null) => (x?.map((y) => fromOID(y?._id)).filter((y) => y != null) ?? []) as string[],
            valueOut: (x?: string[]) => (x?.map((y) => window.$$store?.objectForPrimaryKey<TItem>(objectType, toOID(y) as any)) ?? []) as Entity<TItem>[],
            defaultValue: () => Promise.resolve([]) as any
        },
        muiEditTextFieldProps: {
            type: 'hidden',
            className: 'hidden'
        },
        // Edit: MRTDbSetControl<IHashTag>(objectType, name, opts.header ?? [toProperFromCamel(name), '#'].join(' '), lookupProperty, '_ID')
    };
};
const lookupMeta = <TLookup extends AnyObject, TParent extends EntityBase>(name: string, objectType: string, lookupProperty: string, opts: { maxSize?: number; header?: string } = {}) => ({
    header: opts.header ?? toProperFromCamel(name),
    maxSize: opts.maxSize ?? 200,
    Cell: LookupCell<TLookup, TParent>(lookupProperty),
    enableColumnFilter: false,
    editVariant: 'select' as const,
    meta: {
        valueIn: (x?: OptionalEntity<TLookup> | null) => fromOID(x?._id) ?? '',
        valueOut: (x?: string) => (x != null && x.length > 0 ? window.$$store?.objectForPrimaryKey<TLookup>(objectType, toOID(x) as any) ?? null : null),
        defaultValue: undefined
    },
    Edit: MRTLookupControl(objectType, name, opts.header ?? toProperFromCamel(name), lookupProperty, '_ID')
});
const dateMeta = (name: string, opts: { header?: string }) => ({
    header: opts.header ?? toProperFromCamel(name),
    Cell: DateCell,
    meta: {
        valueIn: (x?: Date | null) => (x != null ? (typeof x === 'string' ? new Date(Date.parse(x)) : x instanceof Date ? x : null) : null)?.toLocaleString() ?? '',
        valueOut: (x?: string) => (x != null && x.length > 0 ? new Date(Date.parse(x)) : null),
        defaultValue: () => Promise.resolve(new Date(Date.now()))
    },
    Edit: MRTTextControl(name, opts.header ?? toProperFromCamel(name), undefined, undefined, undefined, undefined, undefined, 'datetime-local')
});

const boolMeta = (opts: { propertyName: string; header: string; defaultValue?: boolean; required?: boolean; readOnly?: boolean }) => ({
    header: opts.header,
    Cell: CheckBoxCell,
    meta: {
        valueIn: (x?: string | boolean | null) => x?.toString() ?? '',
        valueOut: (x?: string | boolean) => (x == null ? null : typeof x === 'boolean' ? x : typeof x === 'string' ? (x === 'true' ? true : x === 'false' ? false : null) : null),
        defaultValue: false
    },
    enableEditing: !(opts.readOnly ?? false),
    Edit: opts.readOnly ?? false ? undefined : MRTBoolControl(opts.propertyName, opts.header, opts.defaultValue, opts.required)
});
const stringMeta = (opts: { propertyName: string; header: string; maxLength?: number; minLength?: number; pattern?: RegExp; required?: boolean; type?: React.HTMLInputTypeAttribute }) => ({
    header: opts.header,
    meta: {
        valueIn: (x?: string | null) => x ?? '',
        valueOut: (x?: string) => (x == null || x.length === 0 ? null : x),
        defaultValue: ''
    },
    Edit: MRTTextControl(opts.propertyName, opts.header, opts.maxLength, opts.minLength, opts.pattern, opts.required, false, opts.type),
    muiTableHeadCellProps: {
        'aria-required': opts.required ?? false
    }
});
const enumMeta = (name: string, enumMap: EnumMap, opts: { colorMap?: EnumMap; header?: string } = {}) => ({
    header: opts.header ?? toProperFromCamel(name),
    Cell: OuterEnumCell(enumMap, opts.colorMap),
    Edit: MRTEnumControl(name, opts.header ?? toProperFromCamel(name), enumMap),
    meta: {
        valueIn: (x?: string | null) => (x == null || x.length === 0 ? '' : x),
        valueOut: (x?: string) => (x == null || x.length === 0 ? null : (x as any)),
        defaultValue: undefined
    }
});
const objectIdMeta = {
    id: '_id',
    header: 'OID',
    Cell: MRT_OIDCell,
    enableEditing: false,
    enableColumnActions: false,
    enableColumnDragging: false,
    maxSize: 100,
    muiTableBodyCellProps: { style: { justifyContent: 'center' } },
    meta: {
        valueIn: (x?: OID | null) => (x == null || (typeof x === 'string' && x.length === 0) ? null : fromOID(x)) ?? '',
        valueOut: (x?: string) => (x == null || x.length === 0 ? null : toOID(x) ?? null),
        defaultValue: () => Promise.resolve(new BSON.ObjectId())
    },
    Edit: MRTTextControl('_id', 'OID', undefined, undefined, undefined, true, true)
};
const dbListMeta = function <T extends FieldValues>(
    name: string,
    objectType: string,
    opts: {
        header?: string;
        ItemComponent: ({ payload }: { payload: T }) => string;
        convertPayload: (x: any) => T;
        editControls: React.FunctionComponent<{ context: UseFormReturn<T, any, undefined> }>;
        init: () => Promise<T>;
    }
) {
    return {
        header: opts.header ?? toProperFromCamel(name),
        Cell: DBListDetailCell(opts.ItemComponent) as any,
        Edit: MRTListControl(name, objectType, opts.ItemComponent, opts.convertPayload, opts.editControls, opts.init) as any
    };
};
export const collections: Record<string, StaticTableDefinitions<any>> = {
    string: {
        getColumns: (): DefinedMRTColumns => [
            {
                accessorKey: '1',
                ...stringMeta({ propertyName: '1', header: 'Value', required: true, maxLength: 150 })
            }
        ],
        createRenderDetailPanel: () => () => null
    },
    hashTagUsage: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                hashTagUsageHelper.accessor('count', {
                    ...intMeta('count', { min: 0 })
                }),
                hashTagUsageHelper.accessor('from', {
                    ...dateMeta('from', { header: 'Timestamp' })
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns,
        createRenderDetailPanel: () => () => null
    } as StaticTableDefinitions<IHashTagUsage>,
    hashTag: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                hashTagHelper.accessor('_id', objectIdMeta),
                hashTagHelper.accessor('name', {
                    ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 100 })
                }),
                hashTagHelper.accessor('$maxCount', {
                    header: 'Highest Usage',
                    enableEditing: false,
                    Cell: IntCell
                }),
                hashTagHelper.accessor('$mostRecentDate', {
                    header: 'Most Recent',
                    enableEditing: false,
                    Cell: DateCell
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns,
        createRenderDetailPanel:
            (subComponentTabPanels: FieldInfo[]) =>
            ({ row, table }: MRT_TableOptionFunctionParams<IHashTag, 'renderDetailPanel'>) =>
                createSubComponent(subComponentTabPanels)<IHashTag>({ row, table, collectionName: 'hashTag' })
    } as StaticTableDefinitions<IHashTag>,
    brand: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                brandHelper.accessor('_id', objectIdMeta),
                brandHelper.accessor('name', {
                    ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 100 })
                }),
                brandHelper.accessor('folder', {
                    ...stringMeta({ propertyName: 'folder', header: 'Folder' })
                }),
                brandHelper.accessor('mercariBrand', {
                    ...lookupMeta<IMercariBrand, IBrand>('mercariBrand', 'mercariBrand', 'name', { header: 'Mercari Brand' })
                }),
                brandHelper.accessor('website', {
                    ...stringMeta({ propertyName: 'website', header: 'URL', type: 'url' })
                }),
                brandHelper.accessor('parent', {
                    ...lookupMeta<IBrand, IBrand>('parent', 'brand', 'name', { header: 'Parent' })
                }),
                brandHelper.accessor('hashTags', {
                    header: 'Hash Tags',
                    Cell: DBSetDetailCell<Entity<IHashTag>, IBrand>(({ payload }) => payload.name),
                    Edit: MRTDbSetAutoCompleteControl<Entity<IHashTag>, IBrand>('hashTag', 'brand', 'hashTags', 'Hash Tags', 'name', '_id') as any
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns,
        createRenderDetailPanel:
            (subComponentTabPanels: FieldInfo[]) =>
            ({ row, table }: MRT_TableOptionFunctionParams<IBrand, 'renderDetailPanel'>) =>
                createSubComponent(subComponentTabPanels)<IBrand>({ row, table, collectionName: 'brand' })
    } as StaticTableDefinitions<IBrand>,
    barcode: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                barcodeHelper.accessor('rawValue', {
                    ...stringMeta({ propertyName: 'rawValue', header: 'Raw Value', maxLength: 13 })
                }),
                barcodeHelper.accessor('type', {
                    ...enumMeta('type', BarcodeTypes, { colorMap: BarcodeTypesColors, header: 'Barcode Type' }),
                    enableEditing: false
                }),
                barcodeHelper.accessor('valid', {
                    ...boolMeta({ propertyName: 'valid', readOnly: true, header: 'Is Valid' }),
                    enableEditing: false
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns,
        createRenderDetailPanel: () => () => null
    } as StaticTableDefinitions<IBarcode>,
    locationSegment: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                locationSegmentHelper.accessor('_id', objectIdMeta),
                locationSegmentHelper.accessor('name', {
                    ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 50 })
                }),
                locationSegmentHelper.group({
                    header: 'Barcode',
                    enableEditing: false,
                    columns: [
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
                        })
                    ]
                }),
                locationSegmentHelper.accessor('upcs', {
                    ...dbListMeta<Entity<IBarcode>>('upcs', 'barcode', {
                        header: 'UPCS',
                        convertPayload: (values: { rawValue: string }) => Barcode.ctor(values.rawValue) as Entity<IBarcode>,
                        init: () => Promise.resolve({ rawValue: '' } as any),
                        ItemComponent: ({ payload }: { payload: IBarcode }) => [payload.rawValue, payload.type].join('/'),
                        editControls: ({ context }) => (
                            <TextFieldElement
                                name='rawValue'
                                control={context.control}
                                label='Raw Value'
                                inputProps={{
                                    maxLength: 13,
                                    required: true
                                }}
                            />
                        )
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

                // upcs, barcode (get), name, type keyof type LocationTypesObj, color LocationLabelColorsKey, notes Opt<String>, kind LocationKindsKey
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns,
        createRenderDetailPanel: () => () => null
    } as StaticTableDefinitions<ILocationSegment>,
    mercariBrand: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                mercariBrandHelper.accessor('_id', objectIdMeta),
                mercariBrandHelper.accessor('name', {
                    ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 100 })
                }),
                mercariBrandHelper.accessor('hashTags', {
                    header: 'Hash Tags',
                    Cell: DBSetDetailCell<Entity<IHashTag>, IMercariBrand>(({ payload }) => payload.name),
                    Edit: MRTDbSetAutoCompleteControl<Entity<IHashTag>, IMercariBrand>('hashTag', 'mercariBrand', 'hashTags', 'Hash Tags', 'name', '_id') as any
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns,
        createRenderDetailPanel:
            (subComponentTabPanels: FieldInfo[]) =>
            ({ row, table }: MRT_TableOptionFunctionParams<IMercariBrand, 'renderDetailPanel'>) =>
                createSubComponent(subComponentTabPanels)<IMercariBrand>({ row, table, collectionName: 'mercariBrand' })
    } as StaticTableDefinitions<IMercariBrand>,
    classifier: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                classifierHelper.accessor('_id', objectIdMeta),
                classifierHelper.accessor('name', {
                    ...stringMeta({ propertyName: 'name', header: 'Name', required: true, maxLength: 50 })
                }),
                classifierHelper.accessor('isAthletic', {
                    ...boolMeta({ propertyName: 'isAthletic', header: 'Is Athletic', defaultValue: false })
                }),
                classifierHelper.accessor('mercariSubSubCategory', {
                    ...lookupMeta<IMercariSubSubCategory, IClassifier>('mercariSubSubCategory', 'mercariSubSubCategory', 'fullname', { header: 'Full Name' })
                }),
                classifierHelper.accessor('shortname', {
                    ...stringMeta({ propertyName: 'shortname', header: 'Short Name', maxLength: 30 })
                }),
                classifierHelper.accessor('hashTags', {
                    ...entityDbSetMeta<IHashTag>('hashTag', 'hashTags', 'name')
                }),
                classifierHelper.accessor('shipWeightPercent', {
                    ...percentageMeta('shipWeightPercent', { header: 'Ship Weight %' })
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns,
        createRenderDetailPanel:
            (subComponentTabPanels: FieldInfo[]) =>
            ({ row, table }: MRT_TableOptionFunctionParams<IClassifier, 'renderDetailPanel'>) =>
                createSubComponent(subComponentTabPanels)<IClassifier>({ row, table, collectionName: 'classifier' })
    } as StaticTableDefinitions<IClassifier>,
    productTaxonomy: {
        getColumns: (...pre: string[]) =>
            [
                productTaxonomyHelper.accessor('name', {
                    ...stringMeta({ propertyName: 'name', header: 'Name' })
                }),
                productTaxonomyHelper.accessor((row) => row.kingdom ?? '', {
                    header: 'Kingdom',
                    editVariant: 'select',
                    id: 'kingdom',
                    Cell: (props) => {
                        const value = props.renderedCellValue;
                        return value ?? '';
                    },
                    Edit: OuterTaxonomyComboBox({ label: 'Kingdom', name: 'kingdom' }) as any
                }),
                productTaxonomyHelper.accessor((row) => row.phylum ?? '', {
                    header: 'Phlyum',
                    id: 'phylum',
                    Cell: (props) => {
                        const value = props.renderedCellValue;
                        return value ?? '';
                    },
                    editVariant: 'select',
                    Edit: OuterTaxonomyComboBox<any>({ label: 'Phlyum', name: 'phylum' }) as any
                }),
                productTaxonomyHelper.accessor((row) => row.klass ?? '', {
                    header: 'Class',
                    editVariant: 'select',
                    id: 'klass',
                    Cell: (props) => {
                        const value = props.renderedCellValue;
                        return value ?? '';
                    },
                    Edit: OuterTaxonomyComboBox<any>({ label: 'Class', name: 'klass' }) as any
                }),
                productTaxonomyHelper.accessor((row) => row.order ?? '', {
                    header: 'Order',
                    editVariant: 'select',
                    id: 'order',
                    Cell: (props) => {
                        const value = props.renderedCellValue;
                        return value ?? '';
                    },
                    Edit: OuterTaxonomyComboBox<any>({ label: 'Order', name: 'order' }) as any
                }),
                productTaxonomyHelper.accessor((row) => row.family ?? '', {
                    header: 'Family',
                    editVariant: 'select',
                    id: 'family',
                    Cell: (props) => {
                        const value = props.renderedCellValue;
                        return value ?? '';
                    },
                    Edit: OuterTaxonomyComboBox<any>({ label: 'Family', name: 'family' }) as any
                }),
                productTaxonomyHelper.accessor((row) => row.genus ?? '', {
                    header: 'Genus',
                    editVariant: 'select',
                    id: 'genus',
                    Cell: (props) => {
                        const value = props.renderedCellValue;
                        return value ?? '';
                    },
                    Edit: OuterTaxonomyComboBox<any>({ label: 'Genus', name: 'genus' }) as any
                }),
                productTaxonomyHelper.accessor((row) => row.species ?? '', {
                    header: 'Species',
                    editVariant: 'select',
                    id: 'species',
                    Cell: (props) => {
                        const value = props.renderedCellValue;
                        console.log(`cell value`, value);
                        return value ?? '';
                    },
                    Edit: OuterTaxonomyComboBox<any>({ label: 'Species', name: 'species' }) as any
                }),
                productTaxonomyHelper.accessor('lock', {
                    header: 'Is Locked',
                    Cell: BoolCell,
                    muiEditTextFieldProps: {
                        type: 'checkbox'
                    }
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as MRT_ColumnDef<IProductTaxonomy>[],
        getRowCanExpand: () => false,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        createRenderDetailPanel: (subComponentTabPanels: FieldInfo[]) => () => <></>
    } as StaticTableDefinitions<IProductTaxonomy>,
    mercariCategory: {
        getColumns: (...pre: string[]) =>
            [
                categoryHelper.accessor('_id', objectIdMeta),
                categoryHelper.accessor('name', {
                    ...stringMeta({ propertyName: 'name', maxLength: 50, required: true, header: 'Name' })
                }),
                categoryHelper.accessor('id', {
                    ...stringMeta({ propertyName: 'id', header: 'ID', required: true, maxLength: 30 })
                }),
                categoryHelper.accessor('hashTags', {
                    ...entityDbSetMeta<IHashTag>('hashTag', 'hashTags', 'name')
                }),
                categoryHelper.accessor('shipWeightPercent', {
                    ...percentageMeta('shipWeightPercent', { header: 'Ship Weight %' })
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as MRT_ColumnDef<IMercariCategory>[],
        getRowCanExpand: () => true,
        createRenderDetailPanel:
            (subComponentTabPanels: FieldInfo[]) =>
            ({ row, table }: MRT_TableOptionFunctionParams<IMercariCategory, 'renderDetailPanel'>) =>
                createSubComponent(subComponentTabPanels)<IMercariCategory>({ row, table, collectionName: 'mercariCategory' })
    } as StaticTableDefinitions<IMercariCategory>,
    mercariSubCategory: {
        getColumns: (...pre: string[]) =>
            [
                subCategory.accessor('_id', objectIdMeta),
                // subCategory.accessor('taxon.name', {
                //     enableEditing: false,
                //     id: 'taxon.name',
                //     header: 'Taxonomy'
                // }),
                subCategory.accessor('name', {
                    ...stringMeta({ propertyName: 'name', header: 'Name', maxLength: 50, required: true })
                }),
                subCategory.accessor('id', {
                    ...stringMeta({ propertyName: 'id', header: 'ID', required: true, maxLength: 30 })
                }),
                subCategory.accessor('parent', {
                    ...lookupMeta<IMercariCategory, IMercariSubCategory>('parent', 'mercariCategory', 'name', { header: 'Parent' })
                }),
                subCategory.accessor('hashTags', {
                    ...entityDbSetMeta<IHashTag>('hashTag', 'hashTags', 'name')
                }),
                subCategory.accessor('shipWeightPercent', {
                    ...percentageMeta('shipWeightPercent', { header: 'Ship Weight %' })
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })),
        getRowCanExpand: () => true,
        createRenderDetailPanel:
            (subComponentTabPanels: FieldInfo[]) =>
            ({ row, table }: MRT_TableOptionFunctionParams<IMercariSubCategory, 'renderDetailPanel'>) =>
                createSubComponent(subComponentTabPanels)<IMercariSubCategory>({ row, table, collectionName: 'mercariSubCategory' })
    } as StaticTableDefinitions<IMercariSubCategory>,
    mercariSubSubCategory: {
        getColumns: (...pre: string[]): MRT_ColumnDef<IMercariSubSubCategory, any>[] =>
            [
                subSubCategory.accessor('_id', objectIdMeta),
                subSubCategory.accessor('name', {
                    ...stringMeta({ propertyName: 'name', maxLength: 50, required: true, header: 'Name' })
                }),
                subSubCategory.accessor('fullname', {
                    ...stringMeta({ propertyName: 'fullname', header: 'Full Name' })
                }),
                subSubCategory.accessor('id', {
                    ...stringMeta({ propertyName: 'id', header: 'ID', required: true, maxLength: 30 })
                }),
                subSubCategory.accessor('parent', {
                    ...lookupMeta<IMercariSubCategory, IMercariSubSubCategory>('parent', 'mercariSubCategory', 'name', { header: 'Parent' })
                }),
                subSubCategory.accessor('hashTags', {
                    ...entityDbSetMeta<IHashTag>('hashTag', 'hashTags', 'name')
                }),
                subSubCategory.accessor('shipWeightPercent', {
                    ...percentageMeta('shipWeightPercent', { header: 'Ship Weight %' })
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as MRT_ColumnDef<IMercariSubSubCategory, any>[],
        getRowCanExpand: () => true,
        createRenderDetailPanel:
            (subComponentTabPanels: FieldInfo[]) =>
            ({ row, table }: MRT_TableOptionFunctionParams<IMercariSubSubCategory, 'renderDetailPanel'>) =>
                createSubComponent(subComponentTabPanels)<IMercariSubSubCategory>({ row, table, collectionName: 'mercariSubSubCategory' })
    } as StaticTableDefinitions<IMercariSubSubCategory>
};

function IntCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<number>, T>) {
    return (props.cell.getValue() as Optional<number>)?.toFixed(0);
}

function BoolCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<boolean>, T>) {
    const value = (props.cell?.getValue ?? konst(false))() ?? false;
    return (
        <Icon className='bg-yellow-500 h-7 w-7'>
            {value ? <FontAwesomeIcon icon={faCheckSquare} className='inline-block object-cover' /> : <FontAwesomeIcon icon={faSquareDashed} className='inline-block object-cover' />}
        </Icon>
    );
}

function DBSetCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<DBSet<any>>, T>) {
    const value = props.cell.getValue() as Optional<DBSet<any>>;
    return (value?.size ?? 0).toFixed(0);
}
// function DBListCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<DBList<any>>, T>) {
//     const value = props.cell.getValue() as Optional<DBList<any>>;
//     return (value?.length ?? 0).toFixed(0);
// }
function OuterEnumCell(enumMap: EnumMap, colorMap?: EnumMap) {
    return function EnumCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<string>, T>) {
        const value = props.cell.getValue() as Optional<string>;
        const output = value != null ? enumMap[value] : value;
        const colors = value != null && colorMap != null ? colorMap[value] : '';
        return value != null && <Chip className={colors} label={output}></Chip>;
    };
}
function DBListDetailCell<T>(ItemComponent: ({ payload }: { payload: T }) => string) {
    return function DBListDetailCellInner(props: Parameters<Exclude<MRT_ColumnDef<any, DBList<T>>['Cell'], undefined>>[0]) {
        const value = props.cell.getValue();
        return value == null || value.length === 0 ? null : (
            <List dense>
                {(value ?? []).map((item, ix) => (
                    <ListItem key={ix}>
                        <ListItemText primary={ItemComponent({ payload: item })} />
                    </ListItem>
                ))}
            </List>
        );
    };
}
function DBSetDetailCell<T, TParent extends EntityBase>(ItemComponent: ({ payload }: { payload: T }) => string) {
    return function DBListDetailCellInner(props: Parameters<Exclude<MRT_ColumnDef<TParent, DBSet<T>>['Cell'], undefined>>[0]) {
        const value = props.cell.getValue();
        return value == null || value.length === 0 ? null : (
            <List dense>
                {(Array.from(value.values())).map((item, ix) => (
                    <ListItem key={ix}>
                        <ListItemText primary={ItemComponent({ payload: item })} />
                    </ListItem>
                ))}
            </List>
        );
    };
}