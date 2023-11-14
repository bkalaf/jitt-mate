import { konst } from '../../common/functions/konst';
import { toProperFromCamel } from '../../common/text/toProperCase';
import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';
import { pipeDecorators } from '../pipeDecorators';
import { label } from './label';

export function subColumns<T extends EntityBase>(EntityCtor: EntityConstructor<T>, groupHeader?: string) {
    return pipeDecorators(
        wrappedSetMetadata('columns', (...prefixed: string[]) => (EntityCtor.embeddedColumns ?? konst([]))(prefixed.join('.'))),
        label(groupHeader ?? toProperFromCamel(EntityCtor.schema.name))
    );
}
