///<reference path="./../../global.d.ts" />
import { Countries } from '../../dal/enums/countries';
import { ProvincesInfos } from '../../dal/enums/provinces';

// console.log(JSON.stringify(Object.fromEntries(Object.entries(Countries).map(([key, text]) => [key, { key, text }])), null, '\t'));

console.log(JSON.stringify(Object.fromEntries(Object.entries(ProvincesInfos).map(([key, text]) => [key, { key, text }])), null, '\t'));