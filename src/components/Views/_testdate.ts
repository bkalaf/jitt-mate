import { BSON } from 'mongodb';

console.log(Date.parse('hellow'))
const regex = /^[0-9]{4}[-][0-1][0-9][-][0-3][0-9](T[0-9]{2}:[0-9]{2}:[0-9]{2}([.][0-9]{3}Z)?)?$/;

console.log(regex.test('2020-01-01'))
console.log(regex.test('2020-01-01T12:30:59'));
console.log(regex.test('2020-01-01T12:30:59.002Z'));
console.log(regex.test('2020-01-01T12:30:59.002'));
console.log(regex.test('2020-01-01T12:30'));

console.log(new BSON.ObjectId('#categoryId2'))