import * as fs from 'graceful-fs';
// import * as ShippingVersion from './../../enums/shipping-v1.json';
import * as Shipping09252023 from './shipping-v1.json';
import * as Shipping01182023 from './shipping-v1.json';

export const ShippingVersionsInfos = {
    '09252023': Shipping09252023,
    '01182023': Shipping01182023
};

export type ShippingVersionsKeys = keyof typeof ShippingVersionsInfos;
