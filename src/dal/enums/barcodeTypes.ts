export type BarcodeTypes = {
    upcA: string;
    upcE: string;
    ean13: string;
    isbn10: string;
    isbn13: string;
    locator: string;
    sku: string;
};
export const BarcodeTypes = {
    upcA: 'upc-a',
    upcE: 'upc-e',
    ean13: 'ean-13',
    isbn10: 'isbn-10',
    isbn13: 'isbn-13',
    locator: 'locator',
    sku: 'sku'
};
export type BarcodeTypesKey = keyof BarcodeTypes;
