import { useBarcode } from 'react-barcodes';
import { BarcodeTypesKey } from '../../../dal/enums/barcodeTypes';

export function InnerBarcode({ value, type }: { value: string; type: BarcodeTypesKey; }) {
    const { inputRef } = useBarcode({
        value,
        options: {
            format: type === 'upcA' || type === 'upcE' || type === 'isbn10' || type === 'sku' || type === 'locator' ? 'upc' : 'ean13',
            margin: 5
        }
    });
    return (
        <div className='flex'>
            <img className='block object-contain' ref={inputRef} />
        </div>
    );
}
