import Realm, { BSON, PropertyTypeName } from 'realm';
import { RnNumberTypes, RnNumberTypesKey } from './enums/rnNumberType';
import { IAddress, IBrand, IProduct, IRn } from './types';
import { dateFromNow } from '../common/date/dateFromNow';
import { $css, Selector } from './$css';
import { lookupByLongName } from './enums/provinces';
import { $db } from './db';
import { checkTransaction } from '../util/checkTransaction';
import { toOID } from './toOID';
import { checkWS } from '../common/text/checkWS';

export const FTC_RN_LOOKUP = 'https://rn.ftc.gov/Account/BasicSearch';
export const RN_INPUT = Selector({ tagName: 'input', id: 'SearchText' });
export const RN_SEARCH_BTN = Selector({ tagName: 'input', id: 'btnBasicSearch' });
export const RESULT_LINK = (x: string) => Selector({ tagName: 'a', id: '$rn', dataToggle: 'modal' })(['$rn', x]); // text is compnay name

export const DATA_VALUES = '#registerForm .col-md-8';
// length should be 22

export const DATA_LABELS = [
    'Type', // ex "RN"
    'No.',
    'Legal Business Name',
    'Company Name',
    'Company Type',
    'Business Type', // ex IMPORTER MANUFACTURING WHOLESALE
    'Product Line',
    'Material',
    'Street Address:',
    'Address Line 1',
    'Address Line 2',
    'City',
    'State',
    'Zip',
    'Mailing Address:',
    'Address Line 1',
    'Address Line 2',
    'City',
    'State',
    'Country',
    'Zip',
    'URL' // ex "No_Internet_Addr"
];
export class Rn extends Realm.Object<Rn> implements IRn {
    addresses: DBList<IAddress> = [] as any;
    companyName = '';
    no = 0;
    legalBusinessName: Optional<string>;
    companyType: Optional<string>;
    isImporter = false;
    isRetailer = false;
    isMailOrder = false;
    isInternet = false;
    isOther = false;
    noType: Optional<keyof RnNumberTypes> = 'rn';
    isManufacturer = false;
    isWholesaler = false;
    productLine: Optional<string>;
    material: Optional<string>;
    url: Optional<string>;
    brand: OptionalEntity<IBrand>;
    products: DBBacklink<IProduct> = [] as any;
    get scrapedOn(): Date {
        const genTime = toOID(this._id)?.getTimestamp();
        return genTime == null ? dateFromNow() : genTime;
    }
    _id: OID = new BSON.ObjectId();
    update<T>(this: T, realm: Realm): T {
        return this;
    }
    static schema: Realm.ObjectSchema = {
        name: $db.rn(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            brand: $db.brand.opt,
            products: $db.backlink($db.product(), 'rn'),
            noType: { type: $db.string.req as PropertyTypeName, default: 'rn' },
            no: $db.int.zero,
            legalBusinessName: { type: $db.string.req as PropertyTypeName, optional: true, indexed: true },
            companyName: { type: $db.string.req as PropertyTypeName, optional: true, indexed: true },
            companyType: $db.string.opt,
            isImporter: $db.bool.false,
            isManufacturer: $db.bool.false,
            isWholesaler: $db.bool.false,
            isInternet: $db.bool.false,
            isMailOrder: $db.bool.false,
            isRetailer: $db.bool.false,
            isOther: $db.bool.false,
            productLine: $db.string.opt,
            material: $db.string.opt,
            url: $db.string.opt,
            addresses: $db.address.list
        }
    };
    static ctor(realm: Realm, data: string[]) {
        const obj: WithoutAccessors<IRn> = {
            brand: undefined,
            products: undefined as any,
            _id: new BSON.ObjectId(),
            noType: (checkWS(data[0]) ?? 'rn') as RnNumberTypesKey,
            no: parseInt(checkWS(data[1]) ?? '0', 10),
            legalBusinessName: checkWS(data[2]),
            companyName: checkWS(data[3]) ?? 'n/a',
            companyType: checkWS(data[4]),
            isImporter: data[5].includes('IMPORTER'),
            isManufacturer: data[5].includes('MANUFACTURING'),
            isWholesaler: data[5].includes('WHOLESALE'),
            isInternet: data[5].includes('INTERNET'),
            isMailOrder: data[5].includes('MAILORDER'),
            isRetailer: data[5].includes('RETAILER'),
            isOther: data[5].includes('OTHER'),
            productLine: checkWS(data[6]),
            material: checkWS(data[7]),
            url: checkWS(data[21]),
            addresses: [
                {
                    line1: checkWS(data[9]),
                    line2: checkWS(data[10]),
                    city: checkWS(data[11]),
                    province: checkWS(data[12] ?? '') ? lookupByLongName(checkWS(data[12] ?? '')) : undefined,
                    postalCode: checkWS(data[13])
                },
                {
                    line1: checkWS(data[15]),
                    line2: checkWS(data[16]),
                    city: checkWS(data[17]),
                    province: checkWS(data[18] ?? '') ? lookupByLongName(checkWS(data[18] ?? '')) : undefined,
                    postalCode: checkWS(data[20]),
                    country: checkWS(data[19]) as any
                }
            ] as IAddress[] as any
        };
        let result: IRn | undefined = undefined;
        const func = () => {
            result = realm.create<IRn>($db.rn(), obj);
        };
        checkTransaction(realm)(func);
        return result as unknown as IRn;
    }
}


