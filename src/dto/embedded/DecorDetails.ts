/* eslint-disable @typescript-eslint/ban-types */
import Realm from 'realm';
import { IDetails, IProduct, ISku } from '../../dal/types';
import { $db } from '../../dal/db';
import { toProperCase, toProperFromCamel } from '../../common/text/toProperCase';
import { identity } from '../../common/functions/identity';
import { BarcodeTypesKeys, BarcodeTypesLabelMap } from '../../dal/enums/barcodeTypes';
import { getEnum } from '../collections/ofEnum';
import { $format, ofMaterialComposition } from './ApparelDetails';
import { decorGenerateTitle, generateNarrative, generateTitle } from '../generateSegments';

const builder = <T extends Partial<Record<string, string>>>($g: (s: (keyof BaseSegments['segmentsMap'] | keyof T) & string) => string) => [
    $g('$brandName'),
    toProperCase(
        [$g('$circa'), $g('$isRare') ? 'RARE' : undefined, $g('$isVintage') ? 'VINTAGE' : undefined, $g('$descriptiveText'), $g('$holiday'), $g('$itemType')].filter((x) => x != null).join(' ')
    )
];
export function buildBaseGenerateTitle<T extends Partial<Record<string, string>>>(
    $builder: (func: (s: (keyof BaseSegments['segmentsMap'] | keyof T) & string) => string) => string[],
    segments: string[],
    optionLabels: string[] = ['showMetric', 'extraCharacters']
) {
    return function baseGenerateTitle(
        ignoreCap?: boolean | undefined,
        indexCap?: number | undefined,
        $options: Record<string, boolean> = {},
        additionalSegments: T = {} as T,
        getSegmentsMap: ($options: Record<string, boolean>, additionalSegments: T) => BaseSegments & { segmentsMap: T } = baseGenerateSegments<T>
    ): string {
        const recurse = (_ignoreCap?: boolean | undefined, _indexCap?: number | undefined) => baseGenerateTitle(_ignoreCap, _indexCap, $options, additionalSegments, getSegmentsMap);
        // const segments = ['$brandName', '$descriptiveText', '$holiday', '$itemType', '$circa', '$isVintage', '$isRare'];
        const maxIndex = segments.length + optionLabels.length;
        const takeQty = (indexCap ?? maxIndex) - segments.length;
        const takeNormalized = takeQty > 0 ? takeQty : -1;
        const currentOptions = Object.fromEntries(optionLabels.map((k, ix) => [k, ix < takeNormalized ? $options[k] : undefined] as [string, boolean]).filter((tuple) => tuple[1] != null));
        console.log(`currentOptions`, currentOptions);
        const { segmentsMap } = getSegmentsMap(currentOptions, additionalSegments);

        const allowedSegments = indexCap != null && takeNormalized !== -1 ? segments : segments.slice(0, indexCap);
        const $get = ((name: keyof typeof segmentsMap & string) => (allowedSegments.includes(name) ? segmentsMap[name] : undefined)) as (s: keyof typeof segmentsMap & string) => string;

        const title = $builder($get)
            .filter((x) => x != null)
            .join(' ');
        // const title = [
        //     $get('$brandName'),
        //     toProperCase(
        //         [$get('$circa'), $get('$isRare') ? 'RARE' : undefined, $get('$isVintage') ? 'VINTAGE' : undefined, $get('$descriptiveText'), $get('$holiday'), $get('$itemType')]
        //             .filter((x) => x != null)
        //             .join(' ')
        //     )
        // ]

        if (ignoreCap || title.length <= 80) {
            return title;
        }
        console.warn(`generatedTitle length exceeded: ${title.length}: ${title}`);
        const nextTitle = recurse(false, (indexCap ?? maxIndex) - 1);
        console.warn(`nextTitle: ${nextTitle.length} : ${nextTitle}`);
        return nextTitle;
    };
}
export function baseGenerateSegments<T extends Partial<Record<string, string>>>(this: IDetails<{}, {}>, $options: Record<string, boolean>, additionalSegments: T = {} as T) {
    const product = this.getProduct;
    if (product == null) throw new Error('no product');
    const sku = this.getSku;
    if (sku == null) throw new Error('no sku');
    const brandName = product.effectiveBrandName;
    const descriptiveText = product.descriptiveText;
    const $color = product.color;
    const { circa, dimensions, features, flags, materials, modelNo, notes, origin, styleNo, upcs } = product;
    const { defects } = sku;
    // const $options = {
    //     showMetric: true,
    //     extraCharacters: true
    // };
    const $dimensions = (dimensions as any as DBDictionary<number>).toJSON() as Record<string, Optional<number>>;
    const segmentsMap = {
        $brandName: brandName,
        $descriptiveText: descriptiveText,
        $color: $color,
        // $holiday: this.effectiveHoliday,
        $itemType: product.classifier?.shortname,
        $circa: $format.kvp('CIRCA')(identity<string>)(circa),
        $modelNo: $format.kvp('M/N')(identity<string>)(modelNo),
        $origin: $format.kvp('MADE IN')(getEnum('country'))(origin),
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
            ? `WEIGHT: ${$format.uom($dimensions.weightGrams < 453 ? 'lb' : 'lbs')($dimensions.weightGrams / 453.59)}${$options.showMetric ? ` (${$format.uom('g')($dimensions.weightGrams)})` : ``}`
            : undefined,
        $flags: Array.from(flags.values()).map((x) => ($options.extraCharacters ? '#' : '').concat(toProperFromCamel(x).toUpperCase()).concat($options.extraCharacters ? '#' : '')),
        $isRare: product.flags.has('isRare'),
        $isVintage: product.flags.has('isVintage'),
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
        $materials: ofMaterialComposition(materials)
        //  $format.kvp('SIZE')(ofEnum(Object.fromEntries(Object.entries(getSizes($$sizeGroup as SizeGroupsKeys)).map(([k, v]) => [k, v.name] as [string, string])))(size))
    };
    return {
        segmentsMap: {
            ...segmentsMap,
            ...additionalSegments
        }
    };
}
export type BaseSegments = ReturnType<typeof baseGenerateSegments>;

export class DecorDetails extends Realm.Object<{}> implements IDetails<{}, {}> {
    titleGenerator(sku: ISku, extraCharacters = true, showMetric = true, ignoreCap = false) {
        return generateTitle(sku, extraCharacters, showMetric, ignoreCap)('$brandName', '$productLineName', '$color', '$descriptiveText', '$holiday', '$itemType');
    }
        
    narrativeGenerator(sku: ISku, extraCharacters = true, showMetric = true, ignoreCap = false) {
        const title = this.titleGenerator(sku, extraCharacters, showMetric, ignoreCap);
        return generateNarrative(sku, extraCharacters, showMetric, ignoreCap)(title);
    };
    static schema: Realm.ObjectSchema = {
        name: $db.decorDetails(),
        embedded: true,
        properties: {
            itemType: $db.string.opt
        }
    };
    get effectiveHoliday() {
        if (this.getProduct == null) return undefined;
        return this.getProduct.checkTaxa('christmas')
            ? 'Christmas'
            : this.getProduct.checkTaxa('halloween')
            ? 'Halloween'
            : this.getProduct.checkTaxa('easter')
            ? 'Easter'
            : this.getProduct.checkTaxa('valentines')
            ? "Valentine's Day"
            : undefined;
    }
    get getProduct(): OptionalEntity<IProduct> {
        const result = this.linkingObjects('product', 'decorDetails')[0] as any;
        console.info(`getProduct.result`, result);
        return result;
    }
    get getSku(): OptionalEntity<ISku> {
        const result = this.getProduct?.linkingObjects('sku', 'product')[0] as any;
        console.info(`getSku.result`, result);
        return result;
    }

    // generateTitle(ignoreCap?: boolean | undefined): string {
    //     if (this.getSku == null) return 'unknown';
    //     return decorGenerateTitle(this.getSku, true, true, ignoreCap);
    //     // const segments = ['$brandName', '$descriptiveText', '$holiday', '$itemType', '$circa', '$isVintage', '$isRare'];
    //     // const optionLabels = ['showMetric', 'extraCharacters'];
    //     // const maxIndex = segments.length + optionLabels.length;
    //     // const takeQty = (indexCap ?? maxIndex) - segments.length;
    //     // const takeNormalized = takeQty > 0 ? takeQty : -1;
    //     // const currentOptions = Object.fromEntries(optionLabels.map((k, ix) => [k, ix < takeNormalized] as [string, boolean]));
    //     // console.log(`currentOptions`, currentOptions);
    //     // const { segmentsMap } = this.generateSegments(currentOptions);

    //     // const allowedSegments = indexCap != null && takeNormalized !== -1 ? segments : segments.slice(0, indexCap);
    //     // const $get = (name: keyof typeof segmentsMap) => (allowedSegments.includes(name) ? segmentsMap[name] : undefined);

    //     // const title = [
    //     //     $get('$brandName'),
    //     //     toProperCase(
    //     //         [$get('$circa'), $get('$isRare') ? 'RARE' : undefined, $get('$isVintage') ? 'VINTAGE' : undefined, $get('$descriptiveText'), $get('$holiday'), $get('$itemType')]
    //     //             .filter((x) => x != null)
    //     //             .join(' ')
    //     //     )
    //     // ]
    //     //     .filter((x) => x != null)
    //     //     .join(' ');

    //     // if (ignoreCap || title.length <= 80) {
    //     //     return title;
    //     // }
    //     // console.warn(`generatedTitle length exceeded: ${title.length}: ${title}`);
    //     // const nextTitle = this.generateTitle(false, (indexCap ?? maxIndex) - 1);
    //     // console.warn(`nextTitle: ${nextTitle.length} : ${nextTitle}`);
    //     // return nextTitle;
    // }
    // generateNarrative(indexCap?: number | undefined): string {
    //     const segments = ['$title', '$modelNo', '$barcodes', '$origin', '$length', '$width', '$height', '$weight', '$materials', '$flags', '$features', '$defects'];
    //     const optionLabels = ['showMetric', 'extraCharacters'];
    //     const maxIndex = segments.length + optionLabels.length;
    //     const takeQty = (indexCap ?? maxIndex) - segments.length;
    //     const takeNormalized = takeQty > 0 ? takeQty : -1;
    //     const currentOptions = Object.fromEntries(optionLabels.map((k, ix) => [k, ix < takeNormalized] as [string, boolean]));
    //     console.log(`currentOptions`, currentOptions);
    //     const { segmentsMap: _segmentsMap } = this.generateSegments(currentOptions);
    //     const segmentsMap = { ..._segmentsMap, $title: this.generateTitle(true) };
    //     const allowedSegments = indexCap != null && takeNormalized !== -1 ? segments : segments.slice(0, indexCap);
    //     const $get = (name: keyof typeof segmentsMap) => (allowedSegments.includes(name) ? segmentsMap[name] : undefined);
    //     const output = [
    //         $get('$title'),
    //         ([$get('$circa'), $get('$modelNo'), $get('$length'), $get('$width'), $get('$height'), $get('$weight'), $get('$origin')].filter((x) => x != null) as string[]).join('\n'),
    //         ([$get('$barcodes'), $get('$materials'), $get('$flags'), $get('$features'), $get('$defects')].filter((x) => x != null) as string[]).join('\n')
    //     ].join('\n');
    //     if (output.length <= 1000) {
    //         return output;
    //     }
    //     console.warn(`generateNarrative length exceeded: ${output.length}`);
    //     return this.generateNarrative((indexCap ?? maxIndex) - 1);
    // }
    update() {
        return this;
    }
}
