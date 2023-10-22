import { BSON } from 'realm';
import { IListing2, OptObj, ISku, Opt, $db } from './db';


export class Listing extends Realm.Object<IListing2> implements IListing2 {
    _id: BSON.ObjectId = new BSON.ObjectId();
    sku: OptObj<ISku>;
    listingId: Opt<string>;
    title: string = '';
    description: string = '';
    hashes: string[] = [];
    shippingPrice: number = 0;
    itemFolder: Opt<string>;

    static schema: Realm.ObjectSchema = {
        name: $db.listing(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            item: $db.sku.opt,
            listingId: $db.string.opt,
            title: $db.string.empty,
            description: $db.string.empty,
            hashes: $db.string.list,
            shippingPrice: $db.float.zero,
            itemFolder: $db.string.opt
        }
    };
    isNoBrand(): boolean {
        return this.sku?.isNoBrand() ?? true;
    }
    brandName(): string | undefined {
        return this.sku?.brandName();
    }
    categoryId(): string {
        return this.sku?.categoryId() ?? '';
    }
    subCategoryId(): string {
        return this.sku?.subCategoryId() ?? '';
    }
    subSubCategoryId(): string {
        return this.sku?.subSubCategoryId() ?? '';
    }
    condition(): 1 | 2 | 3 | 4 | 5 {
        return this.sku?.condition ?? 2;
    }
    color(): string | undefined {
        return this.sku?.color() ?? undefined;
    }
    weight(): { lb?: number; oz?: number; } {
        return (this.sku?.weight())!;
    }
    dims(): { length?: number; width?: number; height?: number; } | undefined {
        return this.sku?.dims();
    }
    hasDims(): boolean {
        return this.sku?.dims() != null;
    }
    shippingService(): 'standard' | 'media-mail' {
        return this.sku?.shippingService() ?? 'standard';
    }
    price(): number {
        return this.sku?.price ?? 0;
    }
    carrier(): string {
        const shipping = this.sku?.carrier();
        if (shipping == null) throw new Error('no shipping');
        const [shippingPrice, carrier, carrierId] = shipping;
        return carrier;
    }
    carrierId(): number {
        const shipping = this.sku?.carrier();
        if (shipping == null) throw new Error('no shipping');
        const [shippingPrice, carrier, carrierId] = shipping;
        return carrierId;
    }
    smartPricingOn(): boolean {
        return true;
    }
    smartOffersOn(): boolean {
        return false;
    }
    brandFolder(): string {
        return this.sku?.product?.brand?.folder ?? 'no-brand';
    }

}
