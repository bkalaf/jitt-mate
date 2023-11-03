
export function unpad(barcode: string): string {
    const bcs = barcode.split('');
    return bcs[0] === '0' ? unpad(bcs.slice(1).join('')) : barcode;
}
