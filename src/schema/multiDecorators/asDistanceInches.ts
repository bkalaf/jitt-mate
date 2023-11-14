import { hundredthInches } from '../decorators/hundredthInches';
import { asFloatingPoint } from './asFloatingPoint';

export const asDistanceInches = asFloatingPoint(hundredthInches);
