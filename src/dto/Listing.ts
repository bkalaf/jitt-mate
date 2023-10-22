import Realm, { BSON } from 'realm';
import { IListing, OptObj, IDraft, $db } from './db';


export class Listing extends Realm.Object<IListing> implements IListing {
    _id: BSON.ObjectId = new BSON.ObjectId();
    draft: OptObj<IDraft>;
    auctionSite: 'mercari' | 'ebay' = 'mercari';
    listingId: string = '';
    createdOn: Date = new Date(Date.now());

    static schema: Realm.ObjectSchema = {
        name: $db.listing(),
        primaryKey: '_id',
        properties: {
            _id: $db.objectId,
            draft: $db.draft.opt,
            auctionSite: { type: 'string', default: 'mercari' },
            listingId: $db.string.empty,
            createdOn: $db.date.req
        }
    };
}
