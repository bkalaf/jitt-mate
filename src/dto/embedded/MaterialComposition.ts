import { ObjectSchema } from 'realm';
import { sum } from '../../common/math/sum';
import { IMaterialComposition } from '../../dal/types';
import { $db } from '../../dal/db';

export function zip<T, U>(array1: T[], array2: U[]): [T, U][] {
    if (array1.length !== array2.length) throw new Error('mismatched arrays in zip');
    if (array1.length === 0) return [];
    const [head1, ...tail1] = array1;
    const [head2, ...tail2] = array2;
    return [[head1, head2], ...zip(tail1, tail2)]
}
export class MaterialComposition extends Realm.Object<IMaterialComposition> implements IMaterialComposition {
    get toOutput(): string {
        const keys = [
            'acrylic',
            'cashmere',
            'cotton',
            'denim',
            'polyurethane',
            'leather',
            'silk',
            'linen',
            'modal',
            'nylon',
            'organicCotton',
            'polyester',
            'rayon',
            'suede',
            'wool',
            'spandex'
        ]
        const values = [
            this.acrylic,
            this.cashmere,
            this.cotton,
            this.denim,
            this.polyurethane,
            this.leather,
            this.silk,
            this.linen,
            this.modal,
            this.nylon,
            this.organicCotton,
            this.polyester,
            this.rayon,
            this.suede,
            this.wool,
            this.spandex
        ];
        const zipped = zip(keys, values).filter((x) => x[1] != null && x[1] !== 0).map(([k, v]) => [k, ((v ?? 0) * 100).toFixed(2).concat('%')].join(': ')).join('\n');
        return zipped;
    }
    static schema: ObjectSchema = {
        name: $db.materialComposition(),
        embedded: true,
        properties: {
            acrylic: $db.float.opt,
            cotton: $db.float.opt,
            cashmere: $db.float.opt,
            denim: $db.float.opt,
            polyurethane: $db.float.opt,
            leather: $db.float.opt,
            silk: $db.float.opt,
            linen: $db.float.opt,
            modal: $db.float.opt,
            nylon: $db.float.opt,
            organicCotton: $db.float.opt,
            polyester: $db.float.opt,
            rayon: $db.float.opt,
            suede: $db.float.opt,
            wool: $db.float.opt,
            spandex: $db.float.opt
        }
    };
    acrylic: Optional<number>;
    cotton: Optional<number>;
    cashmere: Optional<number>;
    denim: Optional<number>;
    polyurethane: Optional<number>;
    leather: Optional<number>;
    silk: Optional<number>;
    linen: Optional<number>;
    modal: Optional<number>;
    nylon: Optional<number>;
    organicCotton: Optional<number>;
    polyester: Optional<number>;
    rayon: Optional<number>;
    suede: Optional<number>;
    wool: Optional<number>;
    spandex: Optional<number>;
    get isComplete(): boolean {
        const values = [
            this.acrylic,
            this.cashmere,
            this.cotton,
            this.denim,
            this.polyester,
            this.leather,
            this.silk,
            this.linen,
            this.modal,
            this.nylon,
            this.organicCotton,
            this.polyester,
            this.rayon,
            this.suede,
            this.wool,
            this.spandex
        ].filter((x) => x != null) as any as number[];
        return values.reduce(sum, 0) === 1;
    }
    get hasValues(): boolean {
        return [
            this.acrylic,
            this.cashmere,
            this.cotton,
            this.denim,
            this.polyester,
            this.leather,
            this.silk,
            this.linen,
            this.modal,
            this.nylon,
            this.organicCotton,
            this.polyester,
            this.rayon,
            this.suede,
            this.wool,
            this.spandex
        ].some(x => x != null);
    }
    get remaining(): number {
        const values = [
            this.acrylic,
            this.cashmere,
            this.cotton,
            this.denim,
            this.polyester,
            this.leather,
            this.silk,
            this.linen,
            this.modal,
            this.nylon,
            this.organicCotton,
            this.polyester,
            this.rayon,
            this.suede,
            this.wool,
            this.spandex
        ].filter((x) => x != null) as any as number[];
        return 1 - values.reduce(sum, 0);
    }
    update() {
        return this;
    }
}
