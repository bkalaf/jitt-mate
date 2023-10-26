// export interface IListing2 {
//     _id: BSON.ObjectId;
//     sku: OptObj<ISku>;
//     listingId: Opt<string>;
//     title: string;
//     description: string;
//     hashes: string[];
//     shippingPrice: number;
//     itemFolder: Opt<string>;
//     isNoBrand(): boolean;
//     brandName(): string | undefined;
//     categoryId(): string;
//     subCategoryId(): string;
//     subSubCategoryId(): string;
//     condition(): ConditionKeys;
//     color(): string | undefined;
//     weight(): EnglishWeight;
//     dims(): LWH | undefined;
//     hasDims(): boolean;
//     shippingService(): ShippingService;
//     price(): number;
//     carrier(): string;
//     carrierId(): number;
//     smartPricingOn(): boolean;
//     smartOffersOn(): boolean;
//     brandFolder(): string;
// }

import { toProperFromCamel } from './common/text/toProperCase';

export function toKVP(key: string) {
    return function (value: string | number | undefined | null) {
        if (value != null) {
            if (typeof value === 'string') {
                return value.length > 0 ? [toProperFromCamel(key).toUpperCase(), value].join(': ') : undefined;
            }
            if (Number.isInteger(value)) {
                return [toProperFromCamel(key).toUpperCase(), value.toFixed(0)].join(': ');
            }
            return [toProperFromCamel(key).toUpperCase(), value.toFixed(2)].join(': ');
        }
        return undefined;
    };
}
