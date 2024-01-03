import { $db } from '../../dal/db';
import { IAttachment, ILinkedItem } from '../../dal/types';

export class LinkedItem extends Realm.Object<ILinkedItem> implements ILinkedItem {
    type!: string;
    attachment: OptionalEntity<IAttachment>;
    url: Optional<string>;

    static schema: Realm.ObjectSchema = {
        name: $db.linkedItem(),
        embedded: true,
        properties: {
            type: $db.string.opt,
            attachment: $db.attachment.opt,
            url: $db.string.opt
        }
    }
}