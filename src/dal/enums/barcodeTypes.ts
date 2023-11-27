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
export const BarcodeTypesColors = {
    upcA: 'bg-red-500 text-white',
    upcE: 'bg-pink-500 text-white',
    ean13: 'bg-cyan-500 text-black',
    isbn10: 'bg-yellow-500 text-black',
    isbn13: 'bg-amber-500 text-black',
    locator: 'bg-lime-500 text-white',
    sku: 'bg-purple-500 text-white'
};
export type BarcodeTypesKey = keyof BarcodeTypes;
