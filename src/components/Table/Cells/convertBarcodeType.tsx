import { BarcodeTypesInfos } from '../../../dal/enums/barcodeTypes';


export function convertBarcodeType(bc?: keyof BarcodeTypes): keyof BarcodeTypes {
    switch (bc) {
        case 'upcA':
        case 'upcE':
        case 'ean13':
        case 'isbn10':
        case 'isbn13':
        case 'locator':
        case 'sku':
            return 'ean13';
        case undefined:
            throw new Error('no barcode type');
    }
}
