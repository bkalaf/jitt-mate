import { IProductTaxonomy } from '../../dal/types';

export function mergeProductTaxonomy(left?: IProductTaxonomy, right?: IProductTaxonomy) {
    if (left != null && right == null) return left;
    if (right == null) return left;
    if (right?.lock ?? false) return right;
    const kingdom = left?.kingdom ?? right?.kingdom;
    const phylum = left?.phylum ?? right?.phylum;
    const klass = left?.klass ?? right?.klass;
    const order = left?.order ?? right?.order;
    const family = left?.family ?? right?.family;
    const genus = left?.genus ?? right?.genus;
    const species = left?.species ?? right?.species;
    return {
        kingdom,
        phylum,
        klass,
        order,
        family,
        genus,
        species,
        name: [kingdom, phylum, klass, order, family, genus, species].filter((x) => x != null && x.length > 0).join('-'),
        lock: right.lock
    } as Pick<IProductTaxonomy, Exclude<keyof IProductTaxonomy, 'update' | 'fullname'>>;
}
