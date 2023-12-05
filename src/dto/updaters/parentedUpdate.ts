import { IProductAttributes, IRealmObject } from '../../dal/types';


export function parentedUpdate<TName extends string, U extends IProductAttributes & IRealmObject<U>, T extends Partial<Record<TName, OptionalEntity<U>>> & IProductAttributes>(this: T, name: TName) {
    const isIn = name in this;
    console.log(`parentedUpdate: [${name}] in this`);
    if (!isIn) return;
    const parent = this[name] as Entity<U>;
    if (parent != null) {
        parent.update();
        const target = this.taxon;
        if (target != null && !target.lock) {
            const values = [parent.taxon?.kingdom, parent.taxon?.phylum, parent.taxon?.klass, parent.taxon?.order, parent.taxon?.family, parent.taxon?.genus, parent.taxon?.species].filter(
                (x) => x != null
            ) as string[];
            const setters = [
                (value: string) => (target.kingdom = value),
                (value: string) => (target.phylum = value),
                (value: string) => (target.klass = value),
                (value: string) => (target.order = value),
                (value: string) => (target.family = value),
                (value: string) => (target.genus = value),
                (value: string) => (target.species = value)
            ];
            for (let index = 0; index < values.length; index++) {
                const currentValue = values[index];
                setters[index](currentValue);
            }
        }
    }
}
