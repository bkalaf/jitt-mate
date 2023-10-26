import * as ShippingMatrix from '../enums/shipping.json';


export function lookupShipping(weight: number) {
    return (shippingClass: ShippingServiceKeys) => (ShippingMatrix as ShippingDetails[]).filter((x) => x.min <= weight).filter((x) => x.max >= weight)[0][shippingClass];
}
