import { ObjectSchema } from 'realm';
import { sum } from '../../common/math/sum';
import { IMaterialComposition } from '../../dal/types';
import { $db } from '../../dal/db';

export class MaterialComposition extends Realm.Object<IMaterialComposition> implements IMaterialComposition {
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
