import { flip } from '../flip';
import { joinText } from './joinText';

export function surroundText(left: string) {
    return (right: string) => flip(flip(joinText)(left))(right);
}
