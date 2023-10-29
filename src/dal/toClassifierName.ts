import { IClassifier } from './types';

export function toClassifierName(classifier: IClassifier) {
    const { itemGroup, gender, apparelGroup, legType, topAdornment, sleeveType, apparelType } = classifier.gather();
    switch (itemGroup) {
        case undefined:
            return '';
        case 'apparel':
            return [gender, apparelGroup, sleeveType, legType, topAdornment, apparelType].filter((x) => x == null).join('-');
        case 'media':
            return '';
    }
}
