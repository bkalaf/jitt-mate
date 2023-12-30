import Realm, { ObjectSchema } from 'realm';
import { BacklineTypesEnumMap, BacklineTypesKeys } from '../../dal/enums/backlineTypes';
import { CollarTypesEnumMap, CollarTypesKeys } from '../../dal/enums/collarTypes';
import { CuffTypesEnumMap, CuffTypesKeys } from '../../dal/enums/cuffTypes';
import { NecklineTypesEnumMap, NecklineTypesKeys } from '../../dal/enums/necklineTypes';
import { SleeveTypesEnumMap, SleeveTypesKeys } from '../../dal/enums/sleeveTypes';
import { TopAdornmentsEnumMap, TopAdornmentsKeys } from '../../dal/enums/topAdornments';
import { WaistTypesEnumMap, WaistTypesKeys } from '../../dal/enums/waistTypes';
import { IApparelProperties, IDetails, IMaterialComposition, IMeasurementDictionary, IProduct, IRn, ISku } from '../../dal/types';
import { $db } from '../../dal/db';
import * as LaundryCare from '../../../laundry-care.json';
import { ApparelTypesInfos, ApparelTypesKeys } from '../../dal/enums/apparelType';
import { IApparelEnums } from '../../dal/types/enumTypes';
import { wrapInTransactionDecorator } from '../../dal/transaction';
import { FrontTypesEnumMap, FrontTypesKeys } from '../../dal/enums/frontTypes';
import { LegTypesEnumMap, LegTypesKeys } from '../../dal/enums/legTypes';
import { toProperCase, toProperFromCamel } from '../../common/text/toProperCase';
import { convertFraction } from '../../common/text/convertFraction';
import { identity } from '../../common/functions/identity';
import { capitalize } from '../../common/text/capitalize';
import { ChestFitTypesKeys } from '../../dal/enums/chestFitTypes';
import { GendersEnumMap, GendersKeys } from '../../dal/enums/genders';
import { BarcodeTypesKeys, BarcodeTypesLabelMap } from '../../dal/enums/barcodeTypes';
import { SizeGroupsEnumMap, SizeGroupsKeys, getSizes } from '../../enums/sizes';
import { getSiginifcantDigits } from './getSiginifcantDigits';
import { getEnum, ofEnum } from '../collections/ofEnum';

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
    return ['MADE OF:', ...madeOf].join('\n');
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
            product.checkTaxa('womens') && product.checkTaxa('pull-over', 'jacket', 'button-front')
                ? 'women-letter'
                : product.checkTaxa('womens') && product.checkTaxa('dresses', 'bottoms')
                ? 'women-dresses'
                : product.checkTaxa('womens') && product.checkTaxa('footwear')
                ? 'women-footwear'
                : product.checkTaxa('mens') && product.checkTaxa('footwear')
                ? 'men-footwear'
                : product.checkTaxa('mens') && product.checkTaxa('blazer', 'sports-coat', 'suits')
                ? 'men-suits'
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
    generateSegments($options: Record<string, boolean>) {
        const product = this.getProduct;
        if (product == null) throw new Error('no product');
        const sku = this.getSku;
        if (sku == null) throw new Error('no sku');
        const { clothingCare, cutNo, rn, measurements, styleNo: styleNo2 } = product.apparelDetails;
        const brandName = product.effectiveBrandName;
        const descriptiveText = product.descriptiveText;
        const $color = product.color;
        const {
            effectiveApparelType: apparelType,
            effectiveGender: gender,
            effectiveLegType: legType,
            effectiveSizeGroup: sizeGroup,
            sleeveType,
            necklineType,
            backlineType,
            waistType,
            collarType,
            cuffType,
            topAdornment,
            frontType,
            size
        } = this;
        const { circa, dimensions, features, flags, materials, modelNo, notes, origin, styleNo, upcs } = product;
        const { defects } = sku;
        // const $options = {
        //     showMetric: true,
        //     extraCharacters: true
        // };
        const $dimensions = (dimensions as any as DBDictionary<number>).toJSON() as Record<string, Optional<number>>;
        const $measurements = (measurements as any as DBDictionary<number>).toJSON() as any as IMeasurementDictionary;
        const $$sizeGroup = ofEnum(SizeGroupsEnumMap)(sizeGroup);
        console.log('defects', defects);
        const segmentsMap = {
            $brandName: brandName,
            $descriptiveText: descriptiveText,
            $color: $color,
            $apparelType: apparelType,
            $sleeveType: sleeveType ? SleeveTypesEnumMap[sleeveType] : undefined,
            $necklineType: necklineType ? NecklineTypesEnumMap[necklineType] : undefined,
            $backlineType: backlineType ? BacklineTypesEnumMap[backlineType] : undefined,
            $waistType: waistType ? WaistTypesEnumMap[waistType] : undefined,
            $legType: legType ? LegTypesEnumMap[legType] : undefined,
            $collarType: collarType ? CollarTypesEnumMap[collarType] : undefined,
            $cuffType: cuffType ? CuffTypesEnumMap[cuffType] : undefined,
            $topAdornment: topAdornment ? TopAdornmentsEnumMap[topAdornment] : undefined,
            $gender: gender ? GendersEnumMap[gender] : undefined,
            $frontType: frontType ? FrontTypesEnumMap[frontType] : undefined,
            $circa: $format.kvp('CIRCA')(identity<string>)(circa),
            $modelNo: $format.kvp('M/N')(identity<string>)(modelNo),
            $origin: $format.kvp('MADE IN')(getEnum('country'))(origin),
            $styleNo: $format.kvp('STYLE #')(identity<string>)(styleNo2 ?? styleNo),
            $rn: $format.kvp('RN #')((x?: IRn) => x?.companyName)(rn),
            $cutNo: $format.kvp('CUT #')(identity<string>)(cutNo),
            $length: $dimensions.lengthInches
                ? `LENGTH: ${$dimensions.lengthInches.toFixed(1).concat('"')}${$options.showMetric ? ` (${($dimensions.lengthInches * 2.54).toFixed(1).concat('cm')})` : ``}`
                : undefined,
            $width: $dimensions.widthInches
                ? `WIDTH: ${$dimensions.widthInches.toFixed(1).concat('"')}${$options.showMetric ? ` (${($dimensions.widthInches * 2.54).toFixed(1).concat('cm')})` : ``}`
                : undefined,
            $height: $dimensions.heightInches
                ? `HEIGHT: ${$dimensions.heightInches.toFixed(1).concat('"')}${$options.showMetric ? ` (${($dimensions.heightInches * 2.54).toFixed(1).concat('cm')})` : ``}`
                : undefined,
            $weight: $dimensions.weightGrams
                ? `WEIGHT: ${$format.uom($dimensions.weightGrams < 453 ? 'lb' : 'lbs')($dimensions.weightGrams / 453.59)}${
                      $options.showMetric ? ` (${$format.uom('g')($dimensions.weightGrams)})` : ``
                  }`
                : undefined,
            $inseam: $measurements.inseamInches
                ? `INSEAM LENGTH: ${$format.uom('"')($measurements.inseamInches)}${$options.showMetric ? ` ~(${$format.uom('cm')($measurements.inseamInches * 2.54)})` : ``}`
                : undefined,

            $bust: $measurements.bustInches
                ? `BUST SIZE: ${$format.uom('"')($measurements.bustInches)}${$options.showMetric ? ` ~(${$format.uom('cm')($measurements.bustInches * 2.54)})` : ``}`
                : undefined,
            $foot: $measurements.footInches
                ? `FOOT SIZE: ${$format.uom('"')($measurements.footInches)}${$options.showMetric ? ` ~(${$format.uom('cm')($measurements.footInches * 2.54)})` : ``}`
                : undefined,
            $heel: $measurements.heelInches
                ? `HEEL HEIGHT: ${$format.uom('"')($measurements.heelInches)}${$options.showMetric ? ` ~(${$format.uom('cm')($measurements.heelInches * 2.54)})` : ``}`
                : undefined,
            $head: $measurements.headInches
                ? `HEAD: ${$format.uom('"')($measurements.headInches)}${$options.showMetric ? ` ~(${$format.uom('cm')($measurements.headInches * 2.54)})` : ``}`
                : undefined,
            $hip: $measurements.hipInches ? `HIP: ${$format.uom('"')($measurements.hipInches)}${$options.showMetric ? ` ~(${$format.uom('cm')($measurements.hipInches * 2.54)})` : ``}` : undefined,
            $neck: $measurements.neckInches
                ? `NECK: ${$format.uom('"')($measurements.neckInches)}${$options.showMetric ? ` ~(${$format.uom('cm')($measurements.neckInches * 2.54)})` : ``}`
                : undefined,
            $leg: $measurements.lengthInches
                ? `LEG LENGTH: ${$format.uom('"')($measurements.lengthInches)}${$options.showMetric ? ` ~(${$format.uom('cm')($measurements.lengthInches * 2.54)})` : ``}`
                : undefined,
            $sleeve: $measurements.sleeveInches
                ? `SLEEVE LENGTH: ${$format.uom('"')($measurements.sleeveInches)}${$options.showMetric ? ` ~(${$format.uom('cm')($measurements.sleeveInches * 2.54)})` : ``}`
                : undefined,
            $torso: $measurements.torsoInches
                ? `TORSO: ${$format.uom('"')($measurements.torsoInches)}${$options.showMetric ? ` ~(${$format.uom('cm')($measurements.torsoInches * 2.54)})` : ``}`
                : undefined,
            $waist: $measurements.waistInches
                ? `WAIST: ${$format.uom('"')($measurements.waistInches)}${$options.showMetric ? ` ~(${$format.uom('cm')($measurements.waistInches * 2.54)})` : ``}`
                : undefined,
            $onlyChest:
                // $dimensions.weightGrams
                // ? `WEIGHT: ${$format.uom($dimensions.weightGrams < 453 ? 'lb' : 'lbs')($dimensions.weightGrams / 453.59)}${$options.showMetric ? ` (${$format.uom('g')($dimensions.weightGrams)})` :``}`
                // : undefined,
                $measurements.chestInches && !$measurements.chestFit
                    ? `CHEST SIZE: ${$format.uom('"')($measurements.chestInches)}${$options.showMetric ? ` ~(${$format.uom('cm')($measurements.chestInches * 2.54)})` : ``}`
                    : undefined,
            $chest:
                $measurements.chestInches && $measurements.chestFit
                    ? `CHEST SIZE${$measurements.chestFit != null ? $measurements.chestFit : '/FIT'}: ${$measurements.chestInches
                          .toFixed($measurements.chestFit ? 0 : 1)
                          .concat($measurements.chestFit ? $measurements.chestFit : '"')}${$options.showMetric ? ` ~(${($measurements.chestInches * 2.54).toFixed(1).concat('cm')})` : ``}`
                    : undefined,
            $flags: Array.from(flags.values()).map((x) => ($options.extraCharacters ? '#' : '').concat(toProperFromCamel(x).toUpperCase()).concat($options.extraCharacters ? '#' : '')),
            $clothingCare:
                clothingCare.length === 0
                    ? undefined
                    : [
                          'CLOTHING CARE:',
                          Array.from(clothingCare.values()).map((x) => ($options.extraCharacters ? '* ' : '').concat(x.replaceAll('-', '')).split(' ').map(capitalize).join(' ').concat())
                      ].join($options.extraCharacters ? ' *' : ''),
            $features:
                Array.from(features.values()).filter((x) => x != null && /^\S+$/.test(x)).length === 0
                    ? undefined
                    : `FEATURES:\n${Array.from(features.values())
                          .filter((x) => x != null && /^\S+$/.test(x))
                          .map((x) => ($options.extraCharacters ? '+ ' : '').concat(toProperFromCamel(x)))
                          .join('\n')}`,
            $defects:
                Array.from(defects.values()).filter((x) => x != null && /^\S+$/.test(x)).length === 0
                    ? undefined
                    : `DEFECTS:\n${Array.from(defects.values())
                          .filter((x) => x != null && /^\S+$/.test(x))
                          .map((x) => ($options.extraCharacters ? '+ ' : '').concat(toProperFromCamel(x)))
                          .join('\n')}`,
            $barcodes:
                upcs.length === 0
                    ? undefined
                    : upcs
                          .filter(({ valid }) => valid)
                          .map(({ rawValue, type }) => [BarcodeTypesLabelMap[type as BarcodeTypesKeys], $format.barcode(rawValue)].join(': '))
                          .join('\n'),
            $materials: ofMaterialComposition(materials),
            $$sleeveType: ofEnum(SleeveTypesEnumMap)(sleeveType),
            $$necklineType: ofEnum(NecklineTypesEnumMap)(necklineType),
            $$backlineType: ofEnum(BacklineTypesEnumMap)(backlineType),
            $$waistType: ofEnum(WaistTypesEnumMap)(waistType),
            $$apparelType: apparelType,
            $$cuffType: ofEnum(CuffTypesEnumMap)(cuffType),
            $$collarType: ofEnum(CollarTypesEnumMap)(collarType),
            $$legType: ofEnum(LegTypesEnumMap)(legType),
            $$topAdornment: ofEnum(TopAdornmentsEnumMap)(topAdornment),
            $$frontType: ofEnum(FrontTypesEnumMap)(frontType),
            $$gender: ofEnum(GendersEnumMap)(gender),
            $$sizeGroup,
            $size: $$sizeGroup && size != null ? `SIZE: ${getSizes($$sizeGroup as SizeGroupsKeys)[size].name}` : undefined,
            $$size: $$sizeGroup && size != null ? getSizes($$sizeGroup as SizeGroupsKeys)[size].key : undefined
            //  $format.kvp('SIZE')(ofEnum(Object.fromEntries(Object.entries(getSizes($$sizeGroup as SizeGroupsKeys)).map(([k, v]) => [k, v.name] as [string, string])))(size))
        };
        return {
            segmentsMap
        };
    }
    generateTitle(ignoreCap = false, indexCap?: number): string {
        const segments = [
            '$$apparelType',
            '$brandName',
            '$descriptiveText',
            '$$gender',
            '$$size',
            '$color',
            '$$sleeveType',
            '$$waistType',
            '$$necklineType',
            '$$legType',
            '$$frontType',
            '$$collarType',
            '$$cuffType',
            '$$topAdornment',
            '$$backlineType'
        ];
        const optionLabels = ['showMetric', 'extraCharacters'];
        const maxIndex = segments.length + optionLabels.length;
        const takeQty = (indexCap ?? maxIndex) - segments.length;
        const takeNormalized = takeQty > 0 ? takeQty : -1;
        const currentOptions = Object.fromEntries(optionLabels.map((k, ix) => [k, ix < takeNormalized] as [string, boolean]));
        console.log(`currentOptions`, currentOptions);
        const { segmentsMap } = this.generateSegments(currentOptions);

        const allowedSegments = indexCap != null && takeNormalized !== -1 ? segments : segments.slice(0, indexCap);
        const $get = (name: keyof typeof segmentsMap) => (allowedSegments.includes(name) ? segmentsMap[name] : undefined);

        const title = [
            $get('$brandName'),
            toProperCase(
                [
                    $get('$$gender'),
                    $get('$$size'),
                    $get('$color'),
                    $get('$$sleeveType'),
                    $get('$$necklineType'),
                    $get('$$backlineType'),
                    $get('$$waistType'),
                    $get('$$frontType'),
                    $get('$$legType'),
                    $get('$$collarType'),
                    $get('$$cuffType'),
                    $get('$$topAdornment'),
                    $get('$descriptiveText'),
                    $get('$$apparelType')
                ]
                    .filter((x) => x != null)
                    .join(' ')
            )
        ]
            .filter((x) => x != null)
            .join(' ');

        if (ignoreCap || title.length <= 80) {
            return title;
        }
        console.warn(`generatedTitle length exceeded: ${title.length}: ${title}`);
        const nextTitle = this.generateTitle(false, (indexCap ?? maxIndex) - 1);
        console.warn(`nextTitle: ${nextTitle.length} : ${nextTitle}`);
        return nextTitle;
    }
    generateNarrative(indexCap?: number): string {
        const segments = [
            '$title',
            '$size',
            '$modelNo',
            '$barcodes',
            '$origin',
            '$styleNo',
            '$length',
            '$width',
            '$height',
            '$weight',
            '$inseam',
            '$bust',
            '$onlyChest',
            '$foot',
            '$heel',
            '$head',
            '$hip',
            '$leg',
            '$neck',
            '$chest',
            '$sleeve',
            '$waist',
            '$torso',
            '$chest',
            '$materials',
            '$flags',
            '$features',
            '$defects',
            '$clothingCare',
            '$cutNo',
            '$rn'
        ];
        const optionLabels = ['showMetric', 'extraCharacters'];
        const maxIndex = segments.length + optionLabels.length;
        const takeQty = (indexCap ?? maxIndex) - segments.length;
        const takeNormalized = takeQty > 0 ? takeQty : -1;
        const currentOptions = Object.fromEntries(optionLabels.map((k, ix) => [k, ix < takeNormalized] as [string, boolean]));
        console.log(`currentOptions`, currentOptions);
        const { segmentsMap: _segmentsMap } = this.generateSegments(currentOptions);
        const segmentsMap = { ..._segmentsMap, $title: this.generateTitle(true) };
        const allowedSegments = indexCap != null && takeNormalized !== -1 ? segments : segments.slice(0, indexCap);
        const $get = (name: keyof typeof segmentsMap) => (allowedSegments.includes(name) ? segmentsMap[name] : undefined);
        const output = [
            $get('$title'),
            (
                [
                    $get('$circa'),
                    $get('$size'),
                    $get('$modelNo'),
                    $get('$styleNo'),
                    $get('$cutNo'),
                    $get('$length'),
                    $get('$width'),
                    $get('$height'),
                    $get('$weight'),
                    $get('$inseam'),
                    $get('$waist'),
                    $get('$head'),
                    $get('$heel'),
                    $get('$foot'),
                    $get('$chest'),
                    $get('$bust'),
                    $get('$onlyChest'),
                    $get('$sleeve'),
                    $get('$torso'),
                    $get('$leg'),
                    $get('$hip'),
                    $get('$rn'),
                    $get('$origin')
                ].filter((x) => x != null) as string[]
            ).join('\n'),
            ([$get('$barcodes'), $get('$materials'), $get('$clothingCare'), $get('$flags'), $get('$features'), $get('$defects')].filter((x) => x != null) as string[]).join('\n')
        ].join('\n');
        if (output.length <= 1000) {
            return output;
        }
        console.warn(`generateNarrative length exceeded: ${output.length}`);
        return this.generateNarrative((indexCap ?? maxIndex) - 1);
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
