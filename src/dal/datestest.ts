import { daysDiff } from './daysDiff';
import { daysDiffFromNow } from './daysDiffFromNow';

const date1 = new Date(Date.parse('2023-10-01T12:34:00'));
const date2 = new Date('2023-10-07T18:00:00');


console.log(date1.toLocaleDateString())
console.log(date2.toLocaleDateString());

console.log(date1.valueOf())
console.log(date2.valueOf());

const ms = date2.valueOf() - date1.valueOf();
console.log(ms)
console.log(ms / 1000);
console.log(ms / (1000 * 60 * 60 * 24))

console.log(daysDiff(date2)(date1));
console.log(daysDiffFromNow(date1));