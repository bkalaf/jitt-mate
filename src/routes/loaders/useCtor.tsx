import $$schema from '../../dto';

export function useCtor<T extends EntityBase>(objectType: string) {
    const $$ctors = $$schema as any as EntityConstructor<T>[];
    const ctor = $$ctors.find(x => x.schema.name === objectType);
    if (ctor == null) throw new Error('no ctor');
    return ctor as EntityConstructor<T>;
}
