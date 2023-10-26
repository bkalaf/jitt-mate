import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { OIDTableCell } from '../components/Table/Cells/OIDTableCell';
import { StringTableCell } from '../components/Table/Cells/StringTableCell';
import { ofOID } from '../routes/loaders/ofOID';
import { BSON } from 'realm';
import { IMercariBrand, IBrand } from '../dto/types';

const $helpers = {
    mercariBrand: createColumnHelper<IMercariBrand>(),
    brand: createColumnHelper<IBrand>()
};

const $_id = function <T extends { _id: BSON.ObjectId }>(key: keyof typeof $helpers) {
    const $$ = $helpers[key];
    return ($$.accessor as any)((row: T) => ofOID(row._id), {
        header: 'ID',
        id: '_id',
        cell: OIDTableCell,
        footer: (props: CellContext<T, any>) => props.column.id
    });
};
const $defs: Record<string, TableInfo> = {
    mercariBrand: {
        defaultSort: ['name'],
        columns: [
            $_id('mercariBrand'),
            // $helpers.mercariBrand.accessor((row) => ofOID(row._id), {
            //     header: 'ID',
            //     id: '_id',
            //     cell: OIDTableCell,
            //     footer: props => props.column.id
            // }),
            $helpers.mercariBrand.accessor('name', { header: 'Name', cell: StringTableCell })
        ]
    },
    brand: {
        defaultSort: ['name']
    },
    mercariCategory: {
        defaultSort: ['name']
    },
    classifier: {
        defaultSort: ['name']
    },
    mercariSubCategory: {
        defaultSort: ['name']
    },
    mercariSubSubCategory: {
        defaultSort: ['fullname']
    },
    product: {
        defaultSort: ['notes']
    },
    sku: {
        defaultSort: ['sku'],
        defaultFilter: ['product != $0', [null]]
    },
    locationSegment: {
        defaultSort: [
            ['type', false],
            ['barcode', false]
        ]
    },
    productImage: {
        defaultSort: [
            ['sku.sku', false],
            ['filename', false]
        ]
    },
    draft: {
        defaultSort: [['_id', false]]
    }
};

export default $defs;
