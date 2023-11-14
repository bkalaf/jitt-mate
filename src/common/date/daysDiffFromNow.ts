import { dateFromNow } from '../../dal/dateFromNow';
import { daysDiff } from './daysDiff';

export const daysDiffFromNow = daysDiff(dateFromNow());
