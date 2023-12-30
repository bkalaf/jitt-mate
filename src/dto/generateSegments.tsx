import { ignore } from '../common/functions/ignore';
import { ISku } from '../dal/types';

export type TitlePartsKeys = '$brandName' | '$itemType' | '$color' | '$descriptiveText';
export function generateSegments(sku: ISku, extraCharacters = true, showMetric = true) {
    const titleParts = new Map<TitlePartsKeys, string>();
    const kvps = new Map<string, string>();
    const lists = new Map<string, string[]>();
    const flags = new Set<string>();
    const links = new Map<string, string>();
    const freeText = new Set<string>();
    const selectors = new Map<string, string>();
    const hashtags = new Set<string>();

    const { defects, effectiveBrand: brand, effectiveHashTags: hashTags, price, isNoBrand, product } = sku;
    if (product == null) throw new Error('no product');
    const { apparelDetails, decorDetails, circa, classifier, color, descriptiveText, dimensions, effectiveBrandName: brandName, effectiveCategoryID: categoryId, effectiveSubCategoryID: subCategoryId, effectiveSubSubCategoryID: subSubCategoryId, effectiveMercariBrandName: mercariBrandName, features, flags, materials, modelNo, notes, origin, upcs, productLine } = product;
    if (classifier == null) throw new Error('no classifier');
    const { isMediaMail, shortname } = classifier;

    const addTitlePart = (key: TitlePartsKeys, value?: string) => {
        if (value != null) titleParts.set(key, value);
    }
    addTitlePart('$brandName', brandName);
    addTitlePart('$color', color);

}