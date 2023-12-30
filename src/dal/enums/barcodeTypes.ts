import { enumColors } from './enumColors';

export const BarcodeTypesInfos = {
    upcA: { key: 'upc-a', label: 'UPC', color: enumColors.red2 },
    upcE: { key: 'upc-e', label: 'UPC', color: enumColors.pink2 },
    ean13: { key: 'ean-13', label: 'UPC', color: enumColors.cyan2 },
    isbn10: { key: 'isbn-10', label: 'ISBN', color: enumColors.yellow2 },
    isbn13: { key: 'isbn-13', label: 'ISBN', color: enumColors.amber2 },
    locator: { key: 'locator', label: 'LOCATOR', color: enumColors.lime2 },
    sku: { key: 'sku', label: 'SKU', color: enumColors.purple2 }
};

export type BarcodeTypesKeys = keyof typeof BarcodeTypesInfos;

export const BarcodeTypesLabelMap = Object.fromEntries(Object.entries(BarcodeTypesInfos).map(([k, v]) => [k, v.label] as [BarcodeTypesKeys, string])) as Record<BarcodeTypesKeys, string>;