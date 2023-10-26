const fs = require('graceful-fs');

const dirname = '/home/bobby/Desktop/jitt/jitt/src/enums';

const genders = 'gender.json';
const itemGroups = 'item-group.json';
const apparelType = 'apparel-type.json';
const apparelGroup = 'apparel-group.json';
const legType = 'leg-type.json';
const topAdornment = 'top-adornment.json';
const sleeveType = 'sleeve-type.json';
const sizingType = 'sizing-type.json';

const $a = JSON.parse(fs.readFileSync([dirname, legType].join('/')).toString())
const $b = JSON.parse(fs.readFileSync([dirname, topAdornment].join('/')).toString());
const $c = JSON.parse(fs.readFileSync([dirname, sleeveType].join('/')).toString());
const $d = JSON.parse(fs.readFileSync([dirname, sizingType].join('/')).toString());

console.log(JSON.stringify($a, null, '\t'))
console.log(JSON.stringify($b, null, '\t'));
console.log(JSON.stringify($c, null, '\t'));
console.log(JSON.stringify($d, null, '\t'));
