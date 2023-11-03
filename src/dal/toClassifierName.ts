import { convertToLookup } from './enums/convertToLookup';
import { Genders } from './enums/genders';
import { IClassifier } from './types';

export function toClassifierName(classifier: IClassifier) {
    const { itemGroup, gender, apparelGroup, legType, topAdornment, sleeveType, apparelType, athletic } = classifier.gather();
    switch (itemGroup) {
        case undefined:
            return '';
        case 'apparel':
            return [convertToLookup(Genders, 'name')(gender), apparelGroup, athletic,sleeveType, legType, topAdornment, apparelType].filter((x) => x != null).join('-');
        case 'media':
            return '';
    }
}
