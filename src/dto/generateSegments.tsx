import { process } from '@electron/remote';
import { identity } from '../common/functions/identity';
import { IDimensions, IMeasurementDictionary, ISku } from '../dal/types';
import * as Config from './../config.json';
import { $format, ApparelDetails, ofMaterialComposition } from './embedded/ApparelDetails';
import { capitalize } from '../common/text/capitalize';
import { surroundText } from '../common/text/surroundText';

export type TitlePartsKeys =
    | '$brandName'
    | '$itemType'
    | '$color'
    | '$descriptiveText'
    | '$productLineName'
    | '$holiday'
    | '$apparelType'
    | '$sleeveType'
    | '$frontType'
    | '$legType'
    | '$backlineType'
    | '$necklineType'
    | '$waistType'
    | '$cuffType'
    | '$collarType'
    | '$size'
    | '$gender';
export type NarrativePartKeys = 'STYLE #' | 'CUT #' | 'RN #' | 'CLOTHING CARE' | 'SIZE' | 'BUST SIZE' | 'CHEST SIZE' | 'FOOT SIZE'  | 'HEAD SIZE' | 'HEEL SIZE' | 'HIP SIZE' | 'INSEAM' | 'LENGTH' | 'NECK' | 'SLEEVE' | 'TORSO' | 'WAIST' | 'RARE' | 'VINTAGE' | 'COLLECTIBLE' | 'HAS ORIGINAL PACKAGING' | 'UNOPENED' | 'UPCS' | 'MODEL #' | 'CIRCA' | 'MADE IN' | 'COLOR' | 'FEATURES' | 'DEFECTS' | 'LENGTH' | 'WIDTH' | 'HEIGHT' | 'WEIGHT' | 'VOLUME' | 'DIAMETER' | 'MADE OF' | 'TITLE';

export function generateSegments(sku: ISku, extraCharacters = true, showMetric = true) {
    const titleParts = new Map<TitlePartsKeys, string>();
    const kvps = new Map<string, string>();
    const lists = new Map<string, string[]>();
    const callouts = new Set<string>();
    const links = new Map<string, string>();
    const freeText = new Set<string>();
    const selectors = new Map<string, string>();
    const hashtags = new Set<string>();

    const { defects, effectiveBrand: brand, effectiveHashTags: hashTags, price, isNoBrand, product } = sku;
    if (product == null) throw new Error('no product');
    const {
        apparelDetails,
        decorDetails,
        circa,
        classifier,
        color,
        descriptiveText,
        dimensions,
        effectiveBrandName: brandName,
        effectiveCategoryID: categoryId,
        effectiveSubCategoryID: subCategoryId,
        effectiveSubSubCategoryID: subSubCategoryId,
        effectiveMercariBrandName: mercariBrandName,
        effectiveDiscriminator: discriminator,
        features,
        flags,
        materials,
        modelNo,
        notes,
        origin,
        upcs,
        productLine,
        effectiveCategoryName: categoryName,
        effectiveSubCategoryName: subCategoryName,
        effectiveSubSubCategoryName: subSubCategoryName
    } = product;
    if (classifier == null) {
        console.warn(`MISSING CLASSIFIER:`, product);
        return {
            hashtags,
            selectors,
            kvps,
            titleParts,
            lists,
            callouts,
            freeText,
            discriminator
        };
    }
    const { isMediaMail, shortname } = classifier;

    const addList = (key: string, list?: string[], func?: (x: string) => string) => {
        if (list != null && list.length > 0) {
            const listToAdd = list
                .map(func ?? identity)
                .map((x) => x ?? '')
                .filter((x) => x != null && x.length > 0);
            if (listToAdd.length > 0) {
                lists.set(key, listToAdd);
            }
        }
    };
    const addTitlePart = (key: TitlePartsKeys, value?: string) => {
        if (value != null) titleParts.set(key, value);
    };
    const addCallout = (key: string, text: string) => {
        if (flags.has(key)) callouts.add(extraCharacters ? '#'.concat(text).concat('#') : text);
    };
    const addKVP = (key: string, value?: string) => {
        if (value != null) kvps.set(key, value);
    };
    const addSelector = (enumType: keyof typeof Config['enums'], key: string, value?: string) => {
        if (value != null) {
            const enumMap = window.$$config.enums[enumType] as Record<string, { key: string; text: string; color?: string; selector?: string; aliases?: string[] }>;
            const $enumMap = Object.fromEntries(
                Object.entries(enumMap)
                    .map(([k, v]) => {
                        const keys = [k, ...(v.aliases ?? [])];
                        return keys.map((k2) => [k2, v] as [string, { key: string; text: string; color?: string; selector?: string; aliases?: string[] }]);
                    })
                    .reduce((pv, cv) => [...pv, ...cv], [])
            );
            if (value in $enumMap) {
                const $v = $enumMap[value];
                if ('selector' in $v) {
                    selectors.set(key, $v.selector ?? '');
                } else {
                    console.info(`could not find selector for ${value}`);
                }
            }
        }
    };
    const $dimensionObject = dimensions.toJSON() as Record<keyof IDimensions, Optional<number>>;
    if (discriminator === 'decor') {
        addTitlePart('$holiday', decorDetails?.effectiveHoliday);
    }
    if (discriminator === 'apparel') {
        const {
            apparelType,
            backlineType,
            clothingCare,
            collarType,
            cuffType,
            frontType,
            cutNo,
            gender,
            legType,
            necklineType,
            measurements,
            styleNo,
            sleeveType,
            sizeGroup,
            size,
            waistType,
            rn,
            effectiveApparelType: $apparelType,
            effectiveGender: $gender,
            effectiveLegType: $legType,
            effectiveSizeGroup: $sizeGroup
        } = apparelDetails as ApparelDetails;
        addKVP('STYLE #:', styleNo);
        addKVP('CUT #:', cutNo);
        addKVP('RN #:', rn ? [rn.rnNo, rn.companyName].filter((x) => x != null).join(': ') : undefined);
        addList(
            'CLOTHING CARE:',
            Array.from(clothingCare.values()).map((x) => (extraCharacters ? '* ' : '').concat(x.replaceAll('-', '')).split(' ').map(capitalize).join(' ').concat())
        );
        addTitlePart('$apparelType', $apparelType ?? apparelType);
        addTitlePart('$backlineType', backlineType);
        addTitlePart('$collarType', collarType);
        addTitlePart('$cuffType', cuffType);
        addTitlePart('$frontType', frontType);
        addTitlePart('$gender', $gender ?? gender);
        addTitlePart('$necklineType', necklineType);
        addTitlePart('$sleeveType', sleeveType);
        addTitlePart('$waistType', waistType);
        addTitlePart('$legType', $legType ?? legType);
        if ($sizeGroup && size) {
            const s = Config.enums.sizes[$sizeGroup ?? sizeGroup] as { key: string; selector: string; text: string }[];
            const result = s.find((x) => x.key === size);
            process.stdout.write(`SIZE LOOKUP: ${$sizeGroup} ${size} ${result?.text ?? 'not-found'}`);
            if (result) {
                addTitlePart('$size', surroundText('[')(']')(result.text.includes('"') ? result.text : result.key));
                addKVP('SIZE:', result.text);
                selectors.set('size', result.selector);
            }
        }
        const $measures = (measurements as any as DBDictionary<number>).toJSON() as Record<keyof IMeasurementDictionary, Optional<number>>;
        addKVP(
            'BUST SIZE:',
            $measures.bustInches
                ? $format
                      .uom('"')($measures.bustInches)
                      ?.concat(
                          showMetric
                              ? ' ('.concat(
                                    $format
                                        .uom('cm')($measures.bustInches * 2.54)
                                        ?.concat(')') ?? ''
                                )
                              : ''
                      )
                : undefined
        );
        addKVP(
            'CHEST SIZE:',
            $measures.chestInches
                ? $format
                      .uom('"')($measures.chestInches)
                      ?.concat(
                          showMetric
                              ? ' ('.concat(
                                    $format
                                        .uom('cm')($measures.chestInches * 2.54)
                                        ?.concat(')') ?? ''
                                )
                              : ''
                      )
                : undefined
        );
        addKVP(
            'FOOT SIZE:',
            $measures.footInches
                ? $format
                      .uom('"')($measures.footInches)
                      ?.concat(
                          showMetric
                              ? ' ('.concat(
                                    $format
                                        .uom('cm')($measures.footInches * 2.54)
                                        ?.concat(')') ?? ''
                                )
                              : ''
                      )
                : undefined
        );
        addKVP(
            'HEAD SIZE:',
            $measures.headInches
                ? $format
                      .uom('"')($measures.headInches)
                      ?.concat(
                          showMetric
                              ? ' ('.concat(
                                    $format
                                        .uom('cm')($measures.headInches * 2.54)
                                        ?.concat(')') ?? ''
                                )
                              : ''
                      )
                : undefined
        );
        addKVP(
            'HEEL SIZE:',
            $measures.heelInches
                ? $format
                      .uom('"')($measures.heelInches)
                      ?.concat(
                          showMetric
                              ? ' ('.concat(
                                    $format
                                        .uom('cm')($measures.heelInches * 2.54)
                                        ?.concat(')') ?? ''
                                )
                              : ''
                      )
                : undefined
        );
        addKVP(
            'HIP SIZE:',
            $measures.hipInches
                ? $format
                      .uom('"')($measures.hipInches)
                      ?.concat(
                          showMetric
                              ? ' ('.concat(
                                    $format
                                        .uom('cm')($measures.hipInches * 2.54)
                                        ?.concat(')') ?? ''
                                )
                              : ''
                      )
                : undefined
        );
        addKVP(
            'INSEAM:',
            $measures.inseamInches
                ? $format
                      .uom('"')($measures.inseamInches)
                      ?.concat(
                          showMetric
                              ? ' ('.concat(
                                    $format
                                        .uom('cm')($measures.inseamInches * 2.54)
                                        ?.concat(')') ?? ''
                                )
                              : ''
                      )
                : undefined
        );
        addKVP(
            'LENGTH:',
            $measures.lengthInches
                ? $format
                      .uom('"')($measures.lengthInches)
                      ?.concat(
                          showMetric
                              ? ' ('.concat(
                                    $format
                                        .uom('cm')($measures.lengthInches * 2.54)
                                        ?.concat(')') ?? ''
                                )
                              : ''
                      )
                : undefined
        );
        addKVP(
            'NECK:',
            $measures.neckInches
                ? $format
                      .uom('"')($measures.neckInches)
                      ?.concat(
                          showMetric
                              ? ' ('.concat(
                                    $format
                                        .uom('cm')($measures.neckInches * 2.54)
                                        ?.concat(')') ?? ''
                                )
                              : ''
                      )
                : undefined
        );
        addKVP(
            'SLEEVE:',
            $measures.sleeveInches
                ? $format
                      .uom('"')($measures.sleeveInches)
                      ?.concat(
                          showMetric
                              ? ' ('.concat(
                                    $format
                                        .uom('cm')($measures.sleeveInches * 2.54)
                                        ?.concat(')') ?? ''
                                )
                              : ''
                      )
                : undefined
        );
        addKVP(
            'TORSO:',
            $measures.torsoInches
                ? $format
                      .uom('"')($measures.torsoInches)
                      ?.concat(
                          showMetric
                              ? ' ('.concat(
                                    $format
                                        .uom('cm')($measures.torsoInches * 2.54)
                                        ?.concat(')') ?? ''
                                )
                              : ''
                      )
                : undefined
        );
        addKVP(
            'WAIST:',
            $measures.waistInches
                ? $format
                      .uom('"')($measures.waistInches)
                      ?.concat(
                          showMetric
                              ? ' ('.concat(
                                    $format
                                        .uom('cm')($measures.waistInches * 2.54)
                                        ?.concat(')') ?? ''
                                )
                              : ''
                      )
                : undefined
        );
    }
    addTitlePart('$brandName', brandName);
    addTitlePart('$productLineName', productLine?.name);
    addTitlePart('$color', color);
    addTitlePart('$descriptiveText', descriptiveText);
    addTitlePart('$itemType', shortname);

    addCallout('isRare', 'RARE');
    addCallout('isVintage', 'VINTAGE');
    addCallout('isCollectible', 'COLLECTIBLE');
    addCallout('hasOriginalPackaging', 'HAS ORIGINAL PACKAGING');
    addCallout('isUnopened', 'UNOPENED');

    addList(
        'UPCS:',
        Array.from(upcs.values())
            .filter((x) => x.valid)
            .map(({ rawValue, type }) => [type === 'isbn10' ? 'ISBN-10' : type === 'isbn13' ? 'ISBN-13' : type === 'upcA' || type === 'upcE' ? 'UPC' : 'EAN', $format.barcode(rawValue)].join(': '))
    );
    addList('FEATURES:', Array.from(features.values()), (x) => (extraCharacters ? '+ '.concat(x) : x));
    addList('DEFECTS:', Array.from(defects.values()), (x) => (extraCharacters ? '+ '.concat(x) : x));

    addKVP('MODEL #:', modelNo);
    addKVP('CIRCA:', circa);
    addKVP('MADE IN:', origin ? Config.enums.country[origin as keyof typeof Config.enums.country].text : undefined);
    addKVP('COLOR:', color);
    addKVP(
        'LENGTH:',
        $dimensionObject.lengthInches
            ? $format
                  .uom('"')($dimensionObject.lengthInches)
                  ?.concat(
                      showMetric
                          ? ' ('.concat(
                                $format
                                    .uom('cm')($dimensionObject.lengthInches * 2.54)
                                    ?.concat(')') ?? ''
                            )
                          : ''
                  )
            : undefined
    );
    addKVP(
        'WIDTH:',
        $dimensionObject.widthInches
            ? $format
                  .uom('"')($dimensionObject.widthInches)
                  ?.concat(
                      showMetric
                          ? ' ('.concat(
                                $format
                                    .uom('cm')($dimensionObject.widthInches * 2.54)
                                    ?.concat(')') ?? ''
                            )
                          : ''
                  )
            : undefined
    );
    addKVP(
        'DIAMETER:',
        $dimensionObject.diameterInches
            ? $format
                  .uom('"')($dimensionObject.diameterInches)
                  ?.concat(
                      showMetric
                          ? ' ('.concat(
                                $format
                                    .uom('cm')($dimensionObject.diameterInches * 2.54)
                                    ?.concat(')') ?? ''
                            )
                          : ''
                  )
            : undefined
    );
    addKVP(
        'HEIGHT:',
        $dimensionObject.heightInches
            ? $format
                  .uom('"')($dimensionObject.heightInches)
                  ?.concat(
                      showMetric
                          ? ' ('.concat(
                                $format
                                    .uom('cm')($dimensionObject.heightInches * 2.54)
                                    ?.concat(')') ?? ''
                            )
                          : ''
                  )
            : undefined
    );
    addKVP('MADE OF:\n', ofMaterialComposition(materials));
    addSelector('color', 'color', color);
    if (isNoBrand) {
        selectors.set('noBrand', '#__next > div.Grid--shg6c2.gTeZIP > div:nth-child(4) > p > span');
    } else {
        selectors.set('brand', `div=${mercariBrandName}`);
    }
    selectors.set('price', price.toFixed(2));
    selectors.set('categoryId', categoryId ?? '');
    selectors.set('subCategoryId', subCategoryId ?? '');
    selectors.set('subSubCategoryId', subSubCategoryId ?? '');
    selectors.set('categoryName', categoryName ?? '');
    selectors.set('subCategoryName', subCategoryName ?? '');
    selectors.set('subSubCategoryName', subSubCategoryName ?? '');
    if (notes != null && notes.length > 0) freeText.add(notes);
    const sortedHash = hashTags.sort((a, b) => (a.$maxCount < b.$maxCount ? -1 : a.$maxCount > b.$maxCount ? 1 : 0));
    console.log(`sortedHash`, sortedHash);
    sortedHash.reverse().slice(0, 5).forEach((x) => hashtags.add(x.name));
    console.log(`hashtags`, hashtags);
    return {
        hashtags,
        selectors,
        kvps,
        titleParts,
        lists,
        callouts,
        freeText,
        discriminator
    };
}

export function generateTitle(sku: ISku, extraCharacters = true, showMetric = true, ignoreCap = false, ...omit: TitlePartsKeys[]) {
    return function (...builder: TitlePartsKeys[]): string {
        const $OMIT: TitlePartsKeys[] = [
            '$color',
            '$size',
            '$holiday',
            '$backlineType',
            '$cuffType',
            '$collarType',
            '$necklineType',
            '$frontType',
            '$waistType',
            '$legType',
            '$sleeveType',
            '$productLineName',
            '$descriptiveText'
        ];
        const { titleParts } = generateSegments(sku, extraCharacters, showMetric);
        console.info(`titleParts original:`, titleParts);
        omit.forEach((k) => titleParts.delete(k));
        console.info(`titleParts omitted:`, titleParts);
        const title = (builder.map((x) => titleParts.get(x)).filter((x) => x != null && x.length > 0) as string[]).map((x) => x.split(/[-]/).map(capitalize).join('-').split(' ').map(capitalize).join(' ')).join(' ');

        if (ignoreCap || title.length <= 80) {
            process.stdout.write(`TITLE PASSED: ${title}\n`);
            return title;
        }
        process.stdout.write(`TITLE CAP EXCEEDED: ${title.length}\n\t${title}\n`);
        if (extraCharacters) return generateTitle(sku, false, true, ignoreCap)(...builder);
        if (showMetric) return generateTitle(sku, false, false, ignoreCap)(...builder);
        if (omit.length === $OMIT.length) {
            process.stdout.write(`FORCED TRUNCATE: ${title.slice(0, 80)}\n`);
            return title.slice(0, 80);
        }
        return generateTitle(sku, false, false, ignoreCap, ...$OMIT.slice(0, omit.length + 1))(...builder);
    };
}

export function generateNarrative(sku: ISku, extraCharacters = true, showMetric = true, ignoreCap = false, ...omit: ['callout' | 'kvp' | 'list', NarrativePartKeys][]) {
    return function (title: string): string {
        const $OMIT: ['callout' | 'kvp' | 'list', NarrativePartKeys][] = [            
            ['kvp', 'COLOR'],
            ['kvp', 'CIRCA'],
            ['kvp', 'STYLE #'],
            ['kvp', 'CUT #'],
            ['kvp', 'RN #'],
            ['kvp', 'MADE IN'],
            ['list', 'CLOTHING CARE'], 
            ['kvp', 'SIZE'], 
            ['kvp', 'BUST SIZE'], 
            ['kvp', 'CHEST SIZE'], 
            ['kvp', 'FOOT SIZE'], 
            ['kvp', 'HEAD SIZE'], 
            ['kvp', 'HEEL SIZE'], 
            ['kvp', 'HIP SIZE'], 
            ['kvp', 'INSEAM'], 
            ['kvp', 'LENGTH'], 
            ['kvp', 'NECK'], 
            ['kvp', 'SLEEVE'], 
            ['kvp', 'TORSO'], 
            ['kvp', 'WAIST'],
            ['kvp', 'MADE OF'],
            ['callout', 'RARE'],
            ['callout', 'VINTAGE'], 
            ['callout', 'COLLECTIBLE'], 
            ['callout', 'HAS ORIGINAL PACKAGING'], 
            ['callout', 'UNOPENED'], 
            ['list', 'UPCS'],
            ['list', 'FEATURES'], 
            ['list', 'DEFECTS'],
             ['kvp', 'MODEL #'],
            ['kvp', 'LENGTH'], 
            ['kvp', 'WIDTH'], 
            ['kvp', 'HEIGHT'],
            ['kvp', 'VOLUME'], 
            ['kvp', 'DIAMETER'], 
            ['kvp', 'WEIGHT']
        ];
        const { callouts, freeText, hashtags, kvps, lists, selectors } = generateSegments(sku, extraCharacters, showMetric);
        console.info(`narrative parts original:`, callouts, freeText, hashtags, kvps, lists, selectors);
        omit.forEach(([key, value]) => {
            switch (key) {
                case 'callout': {
                    const toRemove = Array.from(callouts.values()).filter(x => x.includes(value))
                    console.info(`removing`, toRemove)
                    toRemove.forEach(x => callouts.delete(x));
                    break;
                }
                case 'kvp': {
                    const toRemove = Array.from(kvps.keys()).filter(x => x.includes(value));
                    console.info(`removing`, toRemove)
                    toRemove.forEach(x => kvps.delete(x));
                    break;
                }
                case 'list': {
                    const toRemove = Array.from(lists.keys()).filter(x => x.includes(value));
                    console.info(`removing`, toRemove)
                    toRemove.forEach(x => lists.delete(x))
                    break;
                }
            }
        });
        const narrative = [
            title,
            kvps.size > 0 ? Array.from(kvps.entries()).map(([k, v]) => [k, v].join(' ')).join('\n') : undefined,
            lists.size > 0 ? Array.from(lists.entries()).map(([k, v]) => [k, ...v.map(x => x)].join('\n')).join('\n') : undefined,
            callouts.size > 0 ? Array.from(callouts.values()).join('\n') : undefined,
            Array.from(freeText.values()).join('\n')
        ].filter(x => x != null && x.length > 0).join('\n');

        if (ignoreCap || narrative.length <= 1000) {
            process.stdout.write(`NARRATIVE PASSED: \n${narrative}\n`);
            return narrative;
        }
        process.stdout.write(`NARRATIVE CAP EXCEEDED: ${narrative.length}\n\t${narrative}\n`);
        if (extraCharacters) return generateNarrative(sku, false, true, ignoreCap)(title);
        if (showMetric) return generateNarrative(sku, false, false, ignoreCap)(title);
        if (omit.length === $OMIT.length) {
            process.stdout.write(`FORCED TRUNCATE: ${narrative.slice(0, 1000)}\n`);
            return narrative.slice(0, 1000);
        }
        return generateNarrative(sku, false, false, ignoreCap, ...$OMIT.slice(0, omit.length + 1))(title);
    };
}


export const defaultGenerateTitle = (sku: ISku, extraCharacters = true, showMetric = true, ignoreCap = false) =>
    generateTitle(sku, extraCharacters, showMetric, ignoreCap)('$brandName', '$productLineName', '$color', '$descriptiveText', '$itemType');
export const decorGenerateTitle = (sku: ISku, extraCharacters = true, showMetric = true, ignoreCap = false) =>
    generateTitle(sku, extraCharacters, showMetric, ignoreCap)('$brandName', '$productLineName', '$color', '$descriptiveText', '$holiday', '$itemType');
export const apparelGenerateTitle = (sku: ISku, extraCharacters = true, showMetric = true, ignoreCap = false) =>
    generateTitle(sku, extraCharacters, showMetric, ignoreCap)(
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
export const apparelGenerateNarrative = (sku: ISku, extraCharacters = true, showMetric = true, ignoreCap = false) => {
    const title = apparelGenerateTitle(sku, extraCharacters, showMetric, ignoreCap);
    return generateNarrative(sku, extraCharacters, showMetric, ignoreCap)(title);
}