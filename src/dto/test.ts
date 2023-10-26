import { $css } from './$css';
import { writeFileSync } from 'graceful-fs';

// export const key1 = 'apparelType';
// export const key2 = 'sleeveType';

// console.log(toProperFromCamel(key1))
// console.log(toProperFromCamel(key2));

const testid = $css.testid;

const values = {
    1: testid('ConditionNew'),
    2: testid('ConditionLikeNew'),
    3: testid('ConditionGood'),
    4: testid('ConditionFair'),
    5: testid('ConditionPoor')
};

writeFileSync('/home/bobby/Desktop/jitt/jitt/src/enums/item-condition.json', JSON.stringify(values, null, '\t'))