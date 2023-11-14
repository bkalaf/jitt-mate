import { wrappedSetMetadata } from '../../dal/types/wrappedSetMetadata';
import { pipeDecorators } from '../pipeDecorators';
import { objectType } from './objectType';
import { subColumns } from './subColumns';

export function embeddedObject<T extends EntityBase>(EntityCtor: EntityConstructor<T>) {
    const name = EntityCtor.schema.name;
    return pipeDecorators(objectType(name as RealmTypes), wrappedSetMetadata('Ctor', EntityCtor), subColumns(EntityCtor));
}
