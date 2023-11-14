import ShippingMatrix from '../enums/shipping.json';

export function retrieveShipping(weight: number, service: ShippingServiceKeys = 'standard') {
    return (ShippingMatrix as ShippingDetails[]).find((x) => x.min <= weight && x.max >= weight)[service];
}
