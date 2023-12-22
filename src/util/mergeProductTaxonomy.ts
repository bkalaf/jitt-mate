import { IProductTaxonomy } from '../dal/types';

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
    const apparelType = left?.apparelType ?? right?.apparelType;
    const backlineType = left?.backlineType ?? right?.backlineType;
    const chestFitType = left?.chestFitType ?? right?.chestFitType;
    const collarType = left?.collarType ?? right?.collarType;
    const cuffType = left?.cuffType ?? right?.cuffType;
    const frontType = left?.frontType ?? right?.frontType;
    const gender = left?.gender ?? right?.gender;
    const itemGroup = left?.itemGroup ?? right?.itemGroup;
    const legType = left?.legType ?? right?.legType;
    const necklineType = left?.necklineType ?? right?.necklineType;
    const size = left?.size ?? right?.size;
    const sleeveType = left?.sleeveType ?? right?.sleeveType;
    const topAdornment = left?.topAdornment ?? right?.topAdornment;
    const waistType = left?.waistType ?? right?.waistType;
    const lock = (left?.lock ?? false) || (right?.lock ?? false);
    const bookType = left?.bookType ?? right?.bookType;
    const mediaType = left?.mediaType ?? right?.mediaType;
    const videoType = left?.videoType ?? right?.videoType;
    const gameRating = left?.gameRating ?? right?.gameRating;
    const movieRating = left?.movieRating ?? right?.movieRating;
    
    const result = Object.fromEntries(
        ([
            ['apparelType', apparelType],
            ['backlineType', backlineType],
            ['chestFitType', chestFitType],
            ['collarType', collarType],
            ['cuffType', cuffType],
            ['frontType', frontType],
            ['gender', gender],
            ['legType', legType],
            ['itemGroup', itemGroup],
            ['necklineType', necklineType],
            ['size', size],
            ['sleeveType', sleeveType],
            ['topAdornment', topAdornment],
            ['waistType', waistType],
            ['bookType', bookType],
            ['mediaType', mediaType],
            ['videoType', videoType],
            ['gameRating', gameRating],
            ['movieRating', movieRating],
            ['kingdom', kingdom],
            ['phylum', phylum],
            ['klass', klass],
            ['order', order],
            ['family', family],
            ['genus', genus],
            ['species', species],
            ['lock', lock]
        ] as [string, any][]).filter((tuple) => tuple[1] != null && tuple[1].length !== 0)
    ) as IProductTaxonomy;
    console.log('mergedProductTaxonomy', result);
    return result;
    // return {
    //     kingdom,
    //     phylum,
    //     klass,
    //     order,
    //     family,
    //     genus,
    //     species,
    //     name: [kingdom, phylum, klass, order, family, genus, species].filter((x) => x != null && x.length > 0).join('-'),
    //     lock: right.lock
    // } as Pick<IProductTaxonomy, Exclude<keyof IProductTaxonomy, 'update' | 'fullname'>>;
}
