import { CellContext } from '@tanstack/react-table';
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
            case undefined:
                return <Wrapper />;
            case 'string':
                return (
                    <Wrapper>
                        <TextFieldInput<T> noLabel={noLabel} initialValue={initialValue()} table={props.table} column={props.column} />
                    </Wrapper>
                );
            case 'objectId':
                return (
                    <Wrapper>
                        <TextFieldInput<T> noLabel={noLabel} initialValue={initialValue()} table={props.table} column={props.column} expected='objectId' />
                    </Wrapper>
                );
            case 'object':
                return (
                    <Wrapper>
                        <LookupDatalist noLabel={noLabel} initialValue={initialValue()} table={props.table} column={props.column} getId={props.getId}/>
                    </Wrapper>
                );
            case 'enum':
                return (
                    <Wrapper>
                        <DropdownSelect noLabel={noLabel} initialValue={initialValue()} table={props.table} column={props.column} />
                    </Wrapper>
                );
            default:
                break;
        }
    };
}

export const EditTableBodyCell = DefaultEditBodyCell(true);
export const EditFormControl = DefaultEditBodyCell(false);
