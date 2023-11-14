import { taxonomy } from '../../dal/enums/taxa';

function lookupEnumMap(...values: string[]) {
        const [$kingdom, $phylum, $klass, $order, $family, $genus, $species] = [...values, ...[undefined, undefined, undefined, undefined, undefined, undefined]];
        const $taxonomy = taxonomy as any as Record<string, Record<string, Record<string, Record<string, Record<string, Record<string, string>>>>>>;
        return Object.fromEntries(
            Object.entries(
                $kingdom != null
                    ? $phylum
                        ? $klass
                            ? $order
                                ? $family
                                    ? $genus
                                        ? $species
                                            ? {}
                                            : $taxonomy[$kingdom][$phylum][$klass][$order][$family][$genus]
                                        : $taxonomy[$kingdom][$phylum][$klass][$order][$family]
                                    : $taxonomy[$kingdom][$phylum][$klass][$order]
                                : $taxonomy[$kingdom][$phylum][$klass]
                            : $taxonomy[$kingdom][$phylum]
                        : $taxonomy[$kingdom]
                    : taxonomy
            ).map(([k, v]) => [k, v != null ? typeof v === 'function' ? v() : v : undefined] as [string, string])
        );
    }

console.log(lookupEnumMap('apparel', 'mens', 'tops'))
console.log(lookupEnumMap('apparel'));
console.log(lookupEnumMap('apparel', 'womens', 'tops'));
console.log(lookupEnumMap('apparel', 'womens', 'tops', 'shirts'));

