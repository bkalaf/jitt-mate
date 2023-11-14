import { hundredthGrams } from '../decorators/pattern2';
import { asFloatingPoint } from './asFloatingPoint';

export const asWeightGrams = asFloatingPoint(hundredthGrams);
