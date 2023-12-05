import { ICategorySelector } from '../../dal/types';
import { prependText } from '../../common/text/prependText';


export function categorySelectorUpdater(this: ICategorySelector) {
    if (!this.id.startsWith('#')) {
        this.id = prependText('#')(this.id);
    }
}
