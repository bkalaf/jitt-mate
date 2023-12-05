import { IHashTagged } from '../../dal/types';
import { HashTag } from '../collections/HashTag';


export function hashTaggedUpdater(this: IHashTagged) {
    if (this.hashTags) {
        HashTag.pruneList(this.hashTags);
    }
}
