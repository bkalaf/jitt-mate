import { flip } from './flip';
import { joinText } from '../common/text/joinText';

export function surroundText(left: string) {
    return (right: string) => flip(flip(joinText)(left))(right);
}
