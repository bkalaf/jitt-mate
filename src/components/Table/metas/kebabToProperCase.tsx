import { capitalize } from '../../../common/text/capitalize';



export function kebabToProperCase(str: string) {
    return str.split('-').map(capitalize).join(' ');
}
