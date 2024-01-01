import Realm, { ObjectSchema } from 'realm';
import { BacklineTypesKeys } from '../../dal/enums/backlineTypes';
import { CollarTypesKeys } from '../../dal/enums/collarTypes';
import { CuffTypesKeys } from '../../dal/enums/cuffTypes';
import { NecklineTypesKeys } from '../../dal/enums/necklineTypes';
import { SleeveTypesKeys } from '../../dal/enums/sleeveTypes';
import { TopAdornmentsKeys } from '../../dal/enums/topAdornments';
import { WaistTypesKeys } from '../../dal/enums/waistTypes';
import { IApparelProperties, IDetails, IMaterialComposition, IMeasurementDictionary, IProduct, IRn, ISku } from '../../dal/types';
import { $db } from '../../dal/db';
import * as LaundryCare from '../../../laundry-care.json';
import { ApparelTypesKeys } from '../../dal/enums/apparelType';
import { IApparelEnums } from '../../dal/types/enumTypes';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { FrontTypesKeys } from '../../dal/enums/frontTypes';
import { LegTypesKeys } from '../../dal/enums/legTypes';
import { toProperFromCamel } from '../../common/text/toProperCase';
import { convertFraction } from '../../common/text/convertFraction';
import { ChestFitTypesKeys } from '../../dal/enums/chestFitTypes';
import { GendersKeys } from '../../dal/enums/genders';
import { SizeGroupsKeys } from '../../enums/sizes';
import { getSiginifcantDigits } from './getSiginifcantDigits';
import { generateNarrative, generateTitle } from '../generateSegments';

export function take(qty: number) {
    return function <T>(arr: T[]) {
        return arr.slice(0, qty);
    };
}
export function ofMaterialComposition(materials?: DBDictionary<IMaterialComposition>) {
    if (materials == null || Object.entries(materials).length === 0) return undefined;
    const materialSections = Object.entries(materials).map(([k, v]) => ({
        sectionName: k,
        section: Object.entries(v as any as Record<string, Optional<number>>).filter(([k2, v2]) => v2 != null && v2 !== 0) as [string, number][]
    }));
    const preMadeOf = materialSections.map(({ section, sectionName }) => ({
        sectionName: toProperFromCamel(sectionName),
        section: section
            .map(([k, v]) => {
                const percent = v * 100;
                const splitPercent = percent.toFixed(2).split('.');
                const isInt = splitPercent[1].split('').every((x) => x === '0');
                return {
                    material: toProperFromCamel(k).toLowerCase(),
                    value: isInt ? percent.toFixed(0).concat('%') : percent.toFixed(1).concat('%')
                };
            })
            .map(({ material, value }) => [value, material].join(' '))
    }));
    const madeOf = preMadeOf
        .map(({ section, sectionName }) => (preMadeOf.length > 1 ? [sectionName.concat(':'), ...section.map((x) => ' '.repeat(2).concat(x))] : [...section.map((x) => ' '.repeat(2).concat(x))]))
        .reduce((pv, cv) => [...pv, ...cv], [])
        .map((x) => ' '.repeat(2).concat(x));
    return [...madeOf].join('\n');
}
const asLabeled =
    (label: string) =>
    <T>(func: (x?: T) => string | undefined) =>
    (value?: T): string | undefined => {
        const output = func(value);
        return output == null ? undefined : [label, output].join(': ');
    };
const ofNumber = (x?: number) => {
    if (x == null) return undefined;
    const hasDecimal = x.toFixed(4).split('').includes('.');
    const isInt = x
        .toFixed(4)
        .split('.')[1]
        .split('')
        .every((x) => x === '0');
    const precision = hasDecimal ? getSiginifcantDigits(x) : 0;
    return isInt ? x.toFixed(0) : convertFraction(x, precision <= 2 ? precision : 2);
};
const ofUOM = (uom: string) => (x?: number) => ofNumber(x)?.concat(uom);
const ofUPC = (value: string) => [value.substring(0, 1), value.substring(1, 6), value.substring(6, 11), value.substring(11)].join('-');
const ofEAN = (value: string) => [value.substring(0, 1), ofUPC(value.substring(1))].join('-');
export const $format = {
    inches: (value?: number) => (value == null ? undefined : ofNumber(value)?.concat('"')),
    percent: (value?: number) => (value == null ? undefined : (value * 100).toFixed(2).concat('%')),
    dollar: (value?: number) => (value == null ? undefined : '$'.concat(value.toFixed(2))),
    uom: ofUOM,
    grams: ofUOM('g'),
    minutes: ofUOM('min'),
    fluidOunces: ofUOM('flOz'),
    barcode: (x?: string) => (x == null ? undefined : parseInt(x, 10).toFixed(0).length === 12 ? ofUPC(x) : ofEAN(x)),
    kvp: asLabeled
};
export type LaundryCareOptions = keyof typeof LaundryCare;
export class ApparelDetails extends Realm.Object<IApparelProperties & IApparelEnums> implements IDetails<IApparelProperties, IApparelEnums>, IApparelProperties, IApparelEnums {
    titleGenerator(sku: ISku, extraCharacters = true, showMetric = true, ignoreCap = false) {
        return generateTitle(sku, extraCharacters, showMetric, ignoreCap)(
            '$brandName',
            '$productLineName',
            '$gender',
            '$color',
            '$sleeveType',
            '$necklineType',
            '$backlineType',
            '$waistType',
            '$frontType',
            '$legType',
            '$collarType',
            '$cuffType',
            '$descriptiveText',
            '$apparelType',
            '$size'
        );
    }
    narrativeGenerator(sku: ISku, extraCharacters = true, showMetric = true, ignoreCap = false) {
        const title = this.titleGenerator(sku, extraCharacters, showMetric, ignoreCap);
        return generateNarrative(sku, extraCharacters, showMetric, ignoreCap)(title);
    }
    discriminator: 'apparel' = 'apparel' as const;
    apparelType: Optional<ApparelTypesKeys>;
    get effectiveApparelType(): Optional<ApparelTypesKeys> {
        if (this.apparelType) return this.apparelType;
        const product = this.getProduct;
        if (product == null) return;
        return product.classifier?.shortname as any;
    }
    backlineType: Optional<BacklineTypesKeys>;
    chestFitType: Optional<ChestFitTypesKeys>;
    collarType: Optional<CollarTypesKeys>;
    cuffType: Optional<CuffTypesKeys>;
    frontType: Optional<FrontTypesKeys>;
    gender: Optional<GendersKeys>;
    get effectiveGender(): Optional<GendersKeys> {
        if (this.gender) return this.gender;
        const product = this.getProduct;
        if (product == null) return;
        const result = product.checkTaxa('mens') ? 'mens' : product.checkTaxa('womens') ? 'womens' : product.checkTaxa('boys') ? 'boys' : product.checkTaxa('girls') ? 'girls' : undefined;
        return this.gender ?? result;
    }

    legType: Optional<LegTypesKeys>;
    get effectiveLegType() {
        const product = this.getProduct;
        if (product == null) return;
        const result = product.checkTaxa('relaxed-fit')
            ? 'relaxed-fit'
            : product.checkTaxa('slim-fit')
            ? 'slim-fit'
            : product.checkTaxa('straigh-fit')
            ? 'straight-fit'
            : product.checkTaxa('skinny')
            ? 'skinny'
            : product.checkTaxa('boot-cut')
            ? 'boot-cut'
            : product.checkTaxa('slim-boot-cut')
            ? 'slim-boot-cut'
            : product.checkTaxa('flare')
            ? 'flare'
            : product.checkTaxa('bell')
            ? 'bell'
            : product.checkTaxa('baggy')
            ? 'baggy'
            : product.checkTaxa('casual')
            ? 'casual'
            : undefined;
        return (this.legType ?? result) as Optional<LegTypesKeys>;
    }
    necklineType: Optional<NecklineTypesKeys>;
    size: Optional<string>;
    sizeGroup: Optional<SizeGroupsKeys>;
    get effectiveSizeGroup(): Optional<SizeGroupsKeys> {
        const product = this.getProduct;
        if (product == null) return;
        const result =
            product.checkTaxa('women') && product.checkTaxa('pull-over', 'jacket', 'button-front')
                ? 'women-letter'
                : product.checkTaxa('bras')
                ? 'women-bust'
                : product.checkTaxa('women') && product.checkTaxa('dresses', 'tops')
                ? 'women-letter'
                : product.checkTaxa('women') && product.checkTaxa('footwear')
                ? 'women-footwear'
                : product.checkTaxa('men') && product.checkTaxa('footwear')
                ? 'men-footwear'
                : product.checkTaxa('men') && product.checkTaxa('blazer', 'sports-coat', 'suits')
                ? 'men-suits'
                : product.checkTaxa('bottoms')
                ? 'inches'
                : product.checkTaxa('men')
                ? 'men-letter'
                : undefined;
        return this.sizeGroup ?? result;
    }
    sleeveType: Optional<SleeveTypesKeys>;
    topAdornment: Optional<TopAdornmentsKeys>;
    waistType: Optional<WaistTypesKeys>;
    @wrapInTransactionDecorator()
    update() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.measurements == null) this.measurements = {} as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.clothingCare == null) this.clothingCare = [] as any;
        return this as Entity<IApparelEnums & IApparelProperties>;
    }
    get getProduct(): OptionalEntity<IProduct> {
        const result = this.linkingObjects('product', 'apparelDetails')[0] as any;
        console.info(`getProduct.result`, result);
        return result;
    }
    get getSku(): OptionalEntity<ISku> {
        const result = this.getProduct?.linkingObjects('sku', 'product')[0] as any;
        console.info(`getSku.result`, result);
        return result;
    }
    clothingCare!: DBSet<LaundryCareOptions>;
    cutNo: Optional<string>;
    measurements!: IMeasurementDictionary;
    rn: OptionalEntity<IRn>;
    styleNo: Optional<string>;
    static schema: ObjectSchema = {
        name: $db.apparelDetails(),
        embedded: true,
        properties: {
            apparelType: $db.string.opt,
            backlineType: $db.string.opt,
            chestFitType: $db.string.opt,
            clothingCare: $db.string.set,
            collarType: $db.string.opt,
            cuffType: $db.string.opt,
            cutNo: $db.string.opt,
            frontType: $db.string.opt,
            gender: $db.string.opt,
            legType: $db.string.opt,
            measurements: $db.float.dictionary,
            necklineType: $db.string.opt,
            pocketCount: $db.int.opt,
            rn: $db.rn.opt,
            size: $db.string.opt,
            sleeveType: $db.string.opt,
            styleNo: $db.string.opt,
            topAdornment: $db.string.opt,
            waistType: $db.string.opt,
            discriminator: { type: 'string', optional: false, default: 'apparel' }
        }
    };
}
