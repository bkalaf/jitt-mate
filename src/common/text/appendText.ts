import { flip } from '../../dal/flip';
import { concatText } from './concatText';

export const appendText = flip(concatText);
