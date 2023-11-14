import { CellContext, flexRender } from '@tanstack/react-table';
import { TextFieldInput } from '../Controls/TextFieldInput';
import { LookupDatalist } from '../Controls/LookupDatalist';
import { DropdownSelect } from '../Controls/DropdownSelect';
import { useLogger } from '../../Contexts/useLogger';
import { TableCell } from '../TableCell';
import React from 'react';

export function DefaultEditBodyCell(noLabel = false) {
    return function DefaultEditBodyCellInner<T>(props: {
        column: CellContext<T, any>['column'];
        table: CellContext<T, any>['table'];
        getValue?: CellContext<T, any>['getValue'];
        cell?: CellContext<T, any>['cell'];
        getId: (x: T) => string;
    }) {
        const logger = useLogger();
        logger(`attempting: ${(props.column.columnDef as any).accessorKey ?? props.column.columnDef.id}`, 'schema');
        const Wrapper = props.cell != null ? TableCell : React.Fragment;
        const initialValue = props.getValue ? props.getValue<any> : () => null;
        switch (props.column.columnDef?.meta?.datatype) {
            case 'string':
                return (
                    <Wrapper>
                        <TextFieldInput<T> noLabel={noLabel} initialValue={initialValue()} table={props.table} column={props.column} />
                    </Wrapper>
                );
            case 'object':
                return (
                    <Wrapper>
                        <LookupDatalist noLabel={noLabel} initialValue={initialValue()} table={props.table} column={props.column} getId={props.getId} />
                    </Wrapper>
                );
            case 'objectId':
                return (
                    <Wrapper>
                        <TextFieldInput<T> noLabel={noLabel} initialValue={initialValue()} table={props.table} column={props.column} expected='objectId' />
                    </Wrapper>
                );
            case 'uuid':
            case 'int':
            case 'double':
            case 'float':
            case 'decimal128':
                return (
                    <Wrapper>
                        <TextFieldInput<T> noLabel={noLabel} initialValue={initialValue()} table={props.table} column={props.column} />
                    </Wrapper>
                );
            case 'bool':
                return (
                    <Wrapper>
                        <TextFieldInput<T> noLabel={noLabel} initialValue={initialValue()} table={props.table} column={props.column} />
                    </Wrapper>
                );
            case 'date':
                return (
                    <Wrapper>
                        <TextFieldInput<T> noLabel={noLabel} initialValue={initialValue()} table={props.table} column={props.column} />
                    </Wrapper>
                );
            case 'data':
            case 'list':
            case 'dictionary':
            case 'set':
                return <Wrapper>{null}</Wrapper>;
            case 'enum':
                return (
                    <Wrapper>
                        <DropdownSelect noLabel={noLabel} initialValue={initialValue()} table={props.table} column={props.column} row={props.cell?.row as any} />
                    </Wrapper>
                );
            case undefined:
                return <Wrapper>{flexRender(props.column.columnDef.cell, props.cell?.getContext() as any)}</Wrapper>;
        }
    };
}

export const EditTableBodyCell = DefaultEditBodyCell(true);
export const EditFormControl = DefaultEditBodyCell(false);
