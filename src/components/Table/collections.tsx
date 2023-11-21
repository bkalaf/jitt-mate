/* eslint-disable @typescript-eslint/no-explicit-any */
import { MRT_ColumnDef } from 'material-react-table';
import { IBrand, IClassifier, IHashTag, IHashTagUsage, IMercariBrand, IMercariCategory, IMercariSubCategory, IMercariSubSubCategory, IProductTaxonomy } from '../../dal/types';
import { MRT_OIDCell } from './Cells/MRT_OIDCell';
import helpers from './helpers';
import { createSubComponent } from './creators/createSubComponent';
import { OuterLookupComboBox } from './Controls/OuterLookupComboBox';
import { OuterTaxonomyComboBox } from './Controls/OuterTaxonomyComboBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquareDashed } from '@fortawesome/pro-solid-svg-icons';
import { Icon } from '@mui/material';
import { konst } from '../../common/functions/konst';
import { CheckBoxCell } from './Cells/CheckBoxCell';
import { DateCell } from './Cells/DateCell';
import { LookupCell } from './Cells/LookupCell';
import { PercentCell } from './Cells/PercentCell';
const { taxonomy: productTaxonomyHelper, category: categoryHelper, subCategory, subSubCategory, classifierHelper, mercariBrandHelper, brandHelper, hashTagHelper, hashTagUsageHelper } = helpers;

export const collections: Record<string, StaticTableDefinitions<any>> = {
    string: {
        getColumns: (): DefinedMRTColumns => [
            {
                accessorKey: '1',
                header: 'Value',
                enableEditing: true,
                muiEditTextFieldProps: {
                    type: 'text'
                }
            }
        ],
        createRenderDetailPanel: () => () => null
    },
    hashTagUsage: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                hashTagUsageHelper.accessor('count', {
                    header: 'Count',
                    muiEditTextFieldProps: {
                        type: 'number',
                        inputProps: {
                            min: 0,
                            step: 1
                        }
                    }
                }),
                hashTagUsageHelper.accessor('from', {
                    header: 'From',
                    muiEditTextFieldProps: {
                        type: 'datetime-local'
                    }
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns,
        createRenderDetailPanel:
            () =>
            () =>
                null
    } as StaticTableDefinitions<IHashTagUsage>,
    hashTag: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                hashTagHelper.accessor('_id', {
                    id: '_id',
                    header: 'OID',
                    Cell: MRT_OIDCell,
                    enableEditing: false,
                    enableColumnActions: false,
                    enableColumnDragging: false,
                    maxSize: 100,
                    muiTableBodyCellProps: { style: { justifyContent: 'center' } }
                }),
                hashTagHelper.accessor('name', {
                    header: 'Name',
                    muiEditTextFieldProps: {
                        required: true
                    }
                }),
                // hashTagHelper.accessor('usage', {
                //     Cell: (props) => {
                //         const value = props.cell.getValue<DBList<IHashTagUsage> | undefined>();
                //         return value?.length ?? 0;
                //     },
                //     header: 'Usage',
                //     enableEditing: true,
                //     enableColumnFilter: false,
                //     maxSize: 200,
                //     muiEditTextFieldProps: {
                //         type: 'hidden',
                //         className: 'hidden'
                //     }
                // }),
                hashTagHelper.accessor('$highestUsage.count', {
                    header: 'Highest Usage',
                    enableEditing: false,
                    Cell: IntCell
                }),
                hashTagHelper.accessor('$mostRecentUsage.from', {
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
                brandHelper.accessor('_id', {
                    id: '_id',
                    header: 'OID',
                    Cell: MRT_OIDCell,
                    enableEditing: false,
                    enableColumnActions: false,
                    enableColumnDragging: false,
                    maxSize: 100,
                    muiTableBodyCellProps: { style: { justifyContent: 'center' } }
                }),
                brandHelper.accessor('name', {
                    header: 'Name'
                }),
                brandHelper.accessor('folder', {
                    header: 'Folder'
                }),
                brandHelper.accessor('mercariBrand', {
                    header: 'Mercari Brand',
                    maxSize: 200,
                    Cell: (props) => {
                        const value = props.cell.getValue<Optional<IMercariBrand>>();
                        return value?.name;
                    },
                    enableColumnFilter: false,
                    editVariant: 'select',
                    Edit: OuterLookupComboBox({ objectType: 'mercariBrand', name: 'mercariBrand', label: 'name' }) as MRT_ColumnDef<IBrand, OptionalEntity<IMercariBrand>>['Edit']
                }),

                brandHelper.accessor('hashTags', {
                    Cell: (props) => {
                        const value = props.cell.getValue<DBList<any> | undefined>();
                        console.log(`brandHelper.hashTags`, value);
                        return value?.length ?? 0;
                    },
                    header: 'HashTag #',
                    enableEditing: true,
                    enableColumnFilter: false,
                    maxSize: 200,
                    muiEditTextFieldProps: {
                        type: 'hidden',
                        className: 'hidden'
                    }
                }),
                brandHelper.accessor('parent', {
                    header: 'Parent',
                    maxSize: 200,
                    Cell: (props) => {
                        const value = props.cell.getValue<Optional<IBrand>>();
                        return value?.name;
                    },
                    enableColumnFilter: false,
                    editVariant: 'select',
                    Edit: OuterLookupComboBox({ objectType: 'brand', name: 'brand', label: 'name' }) as MRT_ColumnDef<IBrand, OptionalEntity<IBrand>>['Edit']
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns,
        createRenderDetailPanel:
            (subComponentTabPanels: FieldInfo[]) =>
            ({ row, table }: MRT_TableOptionFunctionParams<IBrand, 'renderDetailPanel'>) =>
                createSubComponent(subComponentTabPanels)<IBrand>({ row, table, collectionName: 'brand' })
    } as StaticTableDefinitions<IBrand>,
    mercariBrand: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                mercariBrandHelper.accessor('_id', {
                    id: '_id',
                    header: 'OID',
                    Cell: MRT_OIDCell,
                    enableEditing: false,
                    enableColumnActions: false,
                    enableColumnDragging: false,
                    maxSize: 100,
                    muiTableBodyCellProps: { style: { justifyContent: 'center' } }
                }),
                mercariBrandHelper.accessor('name', {
                    header: 'Name',
                    muiEditTextFieldProps: {
                        required: true,
                        inputProps: {
                            maxLength: 100
                        }
                    }
                }),
                mercariBrandHelper.accessor('hashTags', {
                    Cell: (props) => {
                        const value = props.cell.getValue<DBSet<any> | undefined>();
                        console.log(`hashTag value`, value);
                        return value?.size ?? 0;
                    },
                    header: 'HashTag #',
                    enableEditing: true,
                    enableColumnFilter: false,
                    maxSize: 200,
                    muiEditTextFieldProps: {
                        type: 'hidden',
                        className: 'hidden'
                    }
                })
            ].map((x) => ({ ...x, accessorKey: x.accessorKey ? [...pre, x.accessorKey].join('.') : undefined })) as DefinedMRTColumns,
        createRenderDetailPanel:
            (subComponentTabPanels: FieldInfo[]) =>
            ({ row, table }: MRT_TableOptionFunctionParams<IClassifier, 'renderDetailPanel'>) =>
                createSubComponent(subComponentTabPanels)<IClassifier>({ row, table, collectionName: 'classifier' })
    } as StaticTableDefinitions<IClassifier>,
    classifier: {
        getColumns: (...pre: string[]): DefinedMRTColumns =>
            [
                classifierHelper.accessor('_id', {
                    id: '_id',
                    header: 'OID',
                    Cell: MRT_OIDCell,
                    enableEditing: false,
                    enableColumnActions: false,
                    enableColumnDragging: false,
                    maxSize: 100,
                    muiTableBodyCellProps: { style: { justifyContent: 'center' } }
                }),
                classifierHelper.accessor('name', {
                    header: 'Name',
                    muiEditTextFieldProps: {
                        required: true,
                        inputProps: {
                            maxLength: 150
                        }
                    }
                }),
                classifierHelper.accessor('isAthletic', {
                    header: 'Athletic',
                    Cell: CheckBoxCell,
                    muiEditTextFieldProps: {
                        type: 'checkbox'
                    }
                }),
                classifierHelper.accessor('mercariSubSubCategory', {
                    header: 'SubSubCategory',
                    maxSize: 200,
                    Cell: LookupCell<IMercariSubSubCategory, IClassifier>('fullname'),
                    enableColumnFilter: false,
                    editVariant: 'select',
                    Edit: OuterLookupComboBox({ objectType: 'mercariSubSubCategory', name: 'mercariSubSubCategory', label: 'name' }) as MRT_ColumnDef<
                        IClassifier,
                        OptionalEntity<IMercariSubSubCategory>
                    >['Edit']
                }),
                classifierHelper.accessor('shortname', {
                    header: 'Short Name',
                    muiEditTextFieldProps: {
                        inputProps: {
                            maxLength: 30
                        }
                    }
                }),
                classifierHelper.accessor('hashTags', {
                    Cell: DBSetCell,
                    header: 'HashTag #',
                    enableEditing: true,
                    enableColumnFilter: false,
                    maxSize: 200,
                    muiEditTextFieldProps: {
                        type: 'hidden',
                        className: 'hidden'
                    }
                }),
                classifierHelper.accessor('shipWeightPercent', {
                    header: 'Ship Wght %',
                    enableColumnActions: false,
                    enableColumnDragging: false,
                    maxSize: 200,
                    Cell: PercentCell,
                    muiEditTextFieldProps: {
                        type: 'number',
                        inputProps: {
                            min: 1,
                            max: 2,
                            step: 0.01
                        }
                    }
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
                    header: 'Name'
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
                categoryHelper.accessor('_id', {
                    id: '_id',
                    header: 'OID',
                    Cell: MRT_OIDCell,
                    enableEditing: false,
                    enableColumnActions: false,
                    enableColumnDragging: false,
                    maxSize: 100,
                    muiTableBodyCellProps: { style: { justifyContent: 'center' } }
                }),
                categoryHelper.accessor('name', {
                    header: 'Name',
                    muiEditTextFieldProps: {
                        required: true,
                        inputProps: {
                            maxLength: 50
                        }
                    }
                }),
                categoryHelper.accessor('id', {
                    header: 'Selector',
                    muiEditTextFieldProps: {
                        required: true,
                        inputProps: {
                            maxLength: 30
                        }
                    },
                    maxSize: 200
                }),
                categoryHelper.accessor('hashTags', {
                    Cell: DBSetCell,
                    header: 'HashTag #',
                    enableEditing: true,
                    enableColumnFilter: false,
                    maxSize: 200,
                    muiEditTextFieldProps: {
                        type: 'hidden',
                        className: 'hidden'
                    }
                }),
                categoryHelper.accessor('shipWeightPercent', {
                    header: 'Ship Wght %',
                    enableColumnActions: false,
                    enableColumnDragging: false,
                    maxSize: 200,
                    Cell: PercentCell,
                    muiEditTextFieldProps: {
                        type: 'number',
                        inputProps: {
                            min: 1,
                            max: 2,
                            step: 0.01
                        }
                    }
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
                subCategory.accessor('_id', {
                    id: '_id',
                    header: 'OID',
                    Cell: MRT_OIDCell,
                    enableEditing: false,
                    enableColumnActions: false,
                    enableColumnDragging: false,
                    maxSize: 100,
                    muiTableBodyCellProps: { style: { justifyContent: 'center' } }
                }),
                subCategory.accessor('taxon.name', {
                    enableEditing: false,
                    id: 'taxon.name',
                    header: 'Taxonomy'
                }),
                subCategory.accessor('name', {
                    header: 'Name',
                    muiEditTextFieldProps: {
                        required: true,
                        inputProps: {
                            maxLength: 50
                        }
                    }
                }),
                subCategory.accessor('id', {
                    header: 'Selector',
                    muiEditTextFieldProps: {
                        required: true,
                        inputProps: {
                            maxLength: 30
                        }
                    },
                    maxSize: 200
                }),
                subCategory.accessor('hashTags', {
                    Cell: DBSetCell,
                    header: 'HashTag #',
                    enableEditing: true,
                    enableColumnFilter: false,
                    maxSize: 200,
                    muiEditTextFieldProps: {
                        type: 'hidden',
                        className: 'hidden'
                    }
                }),
                subCategory.accessor('shipWeightPercent', {
                    header: 'Ship Wght %',
                    enableColumnActions: false,
                    enableColumnDragging: false,
                    maxSize: 200,
                    Cell: PercentCell,
                    muiEditTextFieldProps: {
                        type: 'number',
                        inputProps: {
                            min: 1,
                            max: 2,
                            step: 0.01
                        }
                    }
                }),
                subCategory.accessor('parent', {
                    header: 'Category',
                    maxSize: 200,
                    Cell: LookupCell<IMercariCategory, IMercariSubCategory>('name'),
                    enableColumnFilter: false,
                    editVariant: 'select',
                    Edit: OuterLookupComboBox({ objectType: 'mercariCategory', name: 'parent', label: 'name' }) as any
                }),
                subCategory.accessor('parent.name', {
                    header: 'Category Name',
                    enableEditing: false
                }),
                subCategory.accessor('categoryID', {
                    header: 'Category ID',
                    editVariant: 'text',
                    muiEditTextFieldProps: {
                        InputProps: {
                            readOnly: true
                        }
                    }
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
                subSubCategory.accessor('_id', {
                    id: '_id',
                    header: 'OID',
                    Cell: MRT_OIDCell,
                    enableEditing: false,
                    enableColumnActions: false,
                    enableColumnDragging: false,
                    maxSize: 100,
                    muiTableBodyCellProps: { style: { justifyContent: 'center' } }
                }),
                subSubCategory.accessor('taxon.name', {
                    enableEditing: false,
                    id: 'taxon.name',
                    header: 'Taxonomy'
                }),
                subSubCategory.accessor('fullname', {
                    header: 'Full Name'
                }),
                subSubCategory.accessor('name', {
                    header: 'Name',
                    muiEditTextFieldProps: {
                        required: true,
                        inputProps: {
                            maxLength: 50
                        }
                    }
                }),
                subSubCategory.accessor('id', {
                    header: 'Selector',
                    muiEditTextFieldProps: {
                        required: true,
                        inputProps: {
                            maxLength: 30
                        }
                    },
                    maxSize: 200
                }),
                subSubCategory.accessor('hashTags', {
                    Cell: DBSetCell,
                    header: 'HashTag #',
                    enableEditing: true,
                    enableColumnFilter: false,
                    maxSize: 200,
                    muiEditTextFieldProps: {
                        type: 'hidden',
                        className: 'hidden'
                    }
                }),
                subSubCategory.accessor('shipWeightPercent', {
                    header: 'Ship Wght %',
                    enableColumnActions: false,
                    enableColumnDragging: false,
                    maxSize: 200,
                    Cell: PercentCell,
                    muiEditTextFieldProps: {
                        type: 'number',
                        inputProps: {
                            min: 1,
                            max: 2,
                            step: 0.01
                        }
                    }
                }),
                subSubCategory.accessor('parent', {
                    header: 'Parent',
                    maxSize: 200,
                    Cell: LookupCell<IMercariSubCategory, IMercariSubSubCategory>('name'),
                    editVariant: 'select',
                    Edit: OuterLookupComboBox({ objectType: 'mercariSubCategory', name: 'parent', label: 'name' })<IMercariSubSubCategory> as any
                }),
                subSubCategory.accessor('categoryID', {
                    header: 'Category ID',
                    editVariant: 'text',
                    muiEditTextFieldProps: {
                        InputProps: {
                            readOnly: true
                        }
                    }
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
    };

function BoolCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<boolean>, T>) {
        const value = (props.cell?.getValue ?? konst(false))() ?? false;
        return (
            <Icon className='bg-yellow-500 h-7 w-7'>
                {value ? (
                    <FontAwesomeIcon icon={faCheckSquare} className='inline-block object-cover' />
                ) : (
                    <FontAwesomeIcon icon={faSquareDashed} className='inline-block object-cover' />
                )}
            </Icon>
        );
    };


function DBSetCell<T extends EntityBase>(props: MRT_ColumnDefFunctionParams<'Cell', Optional<DBSet<any>>, T>) {
        const value = props.cell.getValue() as Optional<DBSet<any>>;
        return (value?.size ?? 0).toFixed(0);
    };

