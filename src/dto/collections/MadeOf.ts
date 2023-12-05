import { sum } from '../../common/math/sum';
import { $db } from '../../dal/db';
import { MaterialTypesKey } from '../../dal/enums/materialTypes';
import { IMadeOfDictionary, IMadeOfPart, IMadeOfSection } from '../../dal/types';
import { checkTransaction } from '../../util/checkTransaction';

export class MadeOfPart extends Realm.Object<IMadeOfPart> implements IMadeOfPart {
    
    material: MaterialTypesKey = 'cotton';
    percent = 0;
    
    static schema: Realm.ObjectSchema = {
        name: $db.madeOfPart(),
        embedded: true,
        properties: {
            material: $db.string(),
            percent: $db.float.zero,
        }
    }    
}

export class MadeOfSection extends Realm.Object<IMadeOfSection> implements IMadeOfSection {
    constructor(realm: Realm, args: any) {
        super(realm, args);
        const func = () => { 
            if (this.parts == null) {
                this.parts = [] as any;
            }
        }
        checkTransaction(realm)(func);
    }
    addPart(key: MaterialTypesKey, percent: number): void {
        if (this.parts.map((x) => x.material).includes(key)) {
            throw new Error(`duplicate key entry: ${key}`);
        }
        if (this.remain < percent) {
            throw new Error('100% exceeded');
        }
        this.parts.push({ material: key, percent });
    }
    name = '';
    parts: DBList<IMadeOfPart> = [] as any;
    get isComplete(): boolean {
        return this.parts.map((x) => x.percent).reduce(sum, 0) === 1;
    }
    get remain(): number {
        return 1 - this.parts.map((x) => x.percent).reduce(sum, 0);
    }

    static schema: Realm.ObjectSchema = {
        name: $db.madeOfSection(),
        embedded: true,
        properties: {
            name: $db.string(),
            parts: $db.madeOfPart.list
        }
    };
}
