import { pipeDecorators } from '../pipeDecorators';
import { konst } from '../../common/functions/konst';
import { toProperFromCamel } from '../../common/text/toProperCase';
import { label } from './label';
import { enableEditing } from './enableEditing';
import { columnName } from './columnName';
import { accessorKey } from './accessorKey';

export function entityKey<T extends EntityBase>(name: keyof T & string, autoHeader = true) {
    return pipeDecorators(accessorKey(name as any), enableEditing, columnName(name), autoHeader ? konst(undefined) : label(toProperFromCamel(name)));
}
