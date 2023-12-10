export function tap<T extends any[], U, V>(defFunc: (...x: T) => U, post?: (x: U) => V) {
    return (func?: (...args: T) => U) => {
        return (...values: T) => {
            const sub = (func ?? defFunc)(...values);
            return post ? post(sub) : (sub as any as V);
        };
    };
}

export const toFlag =
    (name: string, desiredResult = true) =>
    (value?: boolean) =>
        (value ?? false) === desiredResult ? ['* ', name, '*'].join('') : undefined;

// export function getDescription(product: IProduct, sku: ISku) {
//     const {
//         brand,
//         chestIn,
//         classifier,
//         color,
//         cutNo,
//         descriptiveText,
//         heightIn,
//         inseamIn,
//         lengthIn,
//         madeOf,
//         pocketCount,
//         modelNo,
//         neckIn,
//         origin,
//         rn,
//         size,
//         sleeveIn,
//         sleeveType,
//         styleNo,
//         torsoIn,
//         upcs,
//         widthIn,
//         waistIn,
//         weightG,
//         features,
//         necklineType,
//         backlineType,
//         waistType,
//         topAdornment,
//         hasTags,
//         isRare,
//         isVintage,
//         cuffType,
//         collarType,
//         circa
//     } = product;
//     const { defects } = sku;
//     if (classifier == null) throw new Error('no classifier');
//     const { gender, apparelType, legType } = classifier;
//     const $importSize = classifier.getImportSize();
//     const $getSizeName = getSizeName($importSize);
//     const $getSizeSelector = getSizeSelector($importSize);
//     const $getSizeKey = getSizeKey($importSize);
//     const $upcs =
//         upcs.length > 0
//             ? `UPC: ${upcs
//                   .map((u) => {
//                       console.log(`handing: ${u}`);
//                       const checkdigit = calculateCheckDigit(u);
//                       console.log(`checkdigit: ${checkdigit}`);
//                       return [u, checkdigit].join('');
//                   })
//                   .join(',')}`
//             : undefined;
//     console.log(`$upcs: ${$upcs}`);
//     const $pocket = pocketCount != null ? (pocketCount >= 2 ? `${pocketCount.toFixed(0)}-pocket` : undefined) : undefined;
//     const $model = toKVP('MODEL #')(modelNo);
//     const $style = toKVP('STYLE #')(styleNo);
//     const $cut = toKVP('CUT #')(cutNo);
//     const $neck = suffix('"')(toKVP('NECK')(convertInches(neckIn)));
//     const $chest = suffix('"')(toKVP('CHEST')(convertInches(chestIn)));
//     const $sleeve = suffix('"')(toKVP('SLEEVE')(convertInches(sleeveIn)));
//     const $waist = suffix('"')(toKVP('WAIST')(convertInches(waistIn)));
//     const $inseam = suffix('"')(toKVP('INSEAM')(convertInches(inseamIn)));
//     const $torso = suffix('"')(toKVP('LENGTH')(convertInches(torsoIn)));
//     const $circa = toKVP('CIRCA')(circa);
//     const $weight = toKVP('WEIGHT')(weightG == null ? undefined : weightG / 453.6) != null ? `${toKVP('WEIGHT')(weightG == null ? undefined : weightG / 453.6)} lbs` : undefined;
//     const $rn = toKVP('RN')(rn);
//     const [originKey, originName] = importOrigin(origin);
//     const $origin = toKVP('MADE IN')(originName);
//     const sizeName = $getSizeName(size);
//     const $size = toKVP('SIZE')(sizeName ?? size);
//     const [sleeveTypeKey, $sleeveType] = importSleeveType(sleeveType);
//     const [apparelTypeKey, $apparelType] = importApparelType(apparelType);
//     console.log(`apparelType: ${apparelType}`);
//     console.log(`$apparelType: ${$apparelType}`);
//     const [genderKey, $gender] = importGender(gender);
//     const [legTypeKey, $legType] = importLegType(legType);
//     const [necklineTypeKey, $necklineType] = importNecklineTypes(necklineType);
//     const [backlineTypeKey, $backlineType] = importBacklineType(backlineType);
//     const [waistTypeKey, $waistType] = importWaistType(waistType);
//     const [collarTypeKey, $collarType] = importCollarType(collarType);
//     const [cuffTypeKey, $cuffType] = importCuffType(cuffType);
//     const [topAdornmentKey, $topAdornment] = importTopAdornments(topAdornment);
//     const $cuff = toKVP('CUFF-TYPE')($cuffType);
//     const $collar = toKVP('COLLAR-TYPE')($collarType);
//     const $waistT = toKVP('WAIST-TYPE')($waistType);
//     const $neckline = toKVP('NECKLINE-TYPE')($necklineType);
//     const $backline = toKVP('BACKLINE-NECK-TYPE')($backlineType);

//     const $shortDescription = toProperCase(
//         [$gender, color, $sleeveType, $pocket, $necklineType, $backlineType, $waistType, $legType, $collarType, $cuffType, $topAdornment, descriptiveText, $apparelType]
//             .filter((x) => x != null)
//             .join(' ')
//     )
//         .replaceAll('  ', '')
//         .trim();
//     const $title = [brand == null || brand.name === '-' ? undefined : brand.name, $shortDescription].join(' ');
//     const $itemFolder = $shortDescription.replaceAll(' ', '-').replaceAll('.', '-').replaceAll(':', '-').toLowerCase();
//     const hasDims = lengthIn != null || widthIn != null || heightIn != null;
//     const dimKeys = hasDims ? [lengthIn != null ? 'l' : undefined, widthIn != null ? 'w' : undefined, heightIn != null ? 'h' : undefined].filter((x) => x != null).join('x') : undefined;
//     const dimValues = ([lengthIn, widthIn, heightIn].filter((x) => x != null) as number[])
//         .map((n: number) => (Number.isInteger(n) ? n.toFixed(0) : n.toFixed(2)))
//         .map((s) => [s, '"'].join(''))
//         .join('x');
//     const $dims = hasDims ? [`DIMS (${dimKeys})`, dimValues].join(': ') : undefined;
//     const $madeOf =
//         madeOf != null
//             ? Object.entries(madeOf).length > 0
//                 ? [
//                       'MADE OF: \n',
//                       Object.entries(madeOf)
//                           .map(([k, v]) => ['\t', [importMaterials(k)[1], [(v * 100).toFixed(0), '%'].join('')].join(': ')].join(''))
//                           .join('\n')
//                   ].join('')
//                 : undefined
//             : undefined;
//     const $features = features != null && features.length > 0 ? features.map((x) => ['* ', x].join('')).join('\n') : undefined;
//     const $defects = defects != null && defects.length > 0 ? defects.map((x) => ['- ', x].join('')).join('\n') : undefined;
//     const $flags = [toFlag('Vintage')(isVintage), toFlag('Rare')(isRare), toFlag('No Tags', false)(hasTags)].filter((x) => x != null).join('\n');
//     const $narrative = (
//         [
//             $title,
//             $upcs,
//             $size,
//             $model,
//             $style,
//             $cut,
//             $circa,
//             $neckline,
//             $backline,
//             $waistT,
//             $collar,
//             $cuff,
//             $neck,
//             $sleeve,
//             $chest,
//             $waist,
//             $inseam,
//             $torso,
//             $weight,
//             $rn,
//             $origin,
//             $dims,
//             $madeOf,
//             $features,
//             $defects,
//             $flags
//         ].filter((x) => x != null && x.length > 0) as string[]
//     ).join('\n');

//     return {
//         title: $title,
//         description: $narrative,
//         itemFolder: $itemFolder
//     };
// }
