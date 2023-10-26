import { capitalize } from '../../common/text/capitalize';
import { is } from '../../dto/is';

export function toTitleCase(str?: string) {
    return is.nil(str) ? '' : is.empty(str) ? '' : (str ?? '').split(' ').map(capitalize).join(' ');
}
