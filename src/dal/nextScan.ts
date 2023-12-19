
// export function nextScan(scan: IScan, realm: Realm, barcodes: string[]): [IScan, string[]] | never[] {
//     if (barcodes.length === 0) return [];
//     const [head, ...tail] = barcodes;
//     console.log(`head: ${head} tail: ${JSON.stringify(tail)}`);
//     const { fixture, shelf } = scan;
//     const noCheckdigit = Scanning.verifyBarcode(head);
//     const [type, item] = Scanning.getItem(realm, noCheckdigit);
//     switch (type) {
//         case 'reset-all': {
//             const [next, ...tail2] = tail;
//             const noCheckDigit2 = Scanning.verifyBarcode(next);
//             const [type2, item2] = Scanning.getItem(realm, noCheckDigit2);

//             switch (type2) {
//                 case 'reset-all':
//                     throw new Error('double reset received');
//                 case 'locationSegment': {
//                     const ls = { [item2.type as string]: item2, timestamp: new Date(Date.now()) } as unknown as IScan;
//                     return [ls, tail2];
//                 }
//                 case 'sku':
//                     throw new Error(`no location segments for sku: ${noCheckDigit2}`);
//             }
//         }
//         break;
//         case 'locationSegment': {
//             const { type: segmentType } = item;
//             switch (segmentType) {
//                 case 'bin':
//                     return [{ fixture, shelf, bin: item, timestamp: new Date(Date.now()) } as IScan, tail];
//                 case 'fixture':
//                     return [{ fixture: item, timestamp: new Date(Date.now()) } as IScan, tail];
//                 case 'shelf':
//                     return [{ fixture, shelf: item, timestamp: new Date(Date.now()) } as IScan, tail];
//             }
//         }
//         break;
//         case 'sku': {
//             item.appendScan(scan.fixture, scan.shelf, scan.bin);
//             return [scan, tail];
//         }
//     }
//     throw new Error('should never get here');
// }
