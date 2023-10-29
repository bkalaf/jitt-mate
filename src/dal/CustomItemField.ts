import { $db } from './db';
import { ICustomItemField } from './types';

const ctor = {
    testId: (str: string) => `[data-testid="${str}"]`,
    id: (str: string) => `#${str}`,
    label: (str: string) => `label[for="${str}"]`,
    isButtonPressed: (sel: string) => [sel, '[aria-pressed="true"]'].join('')
};
const customItemField = (name: string) => ({
    input: ctor.testId(`CustomItemFieldId-${name}`),
    dropdown: ctor.testId(`CustomItemFieldId-${name}Dropdown`),
    options: [ctor.testId(`CustomItemFieldId-${name}Dropdown`), ' > div > div'].join('')
});

export class CustomItemField extends Realm.Object<ICustomItemField> implements ICustomItemField {
    name = '';
    options: string[] = [];
    get $selectors(): { input: string; dropdown: string; options: string; } {
        return customItemField(this.name);
    }
    get $optionMap(): Record<number, string> {
        return Object.fromEntries(this.options.map((x, ix) => [ix, x]))
    }
    static schema: Realm.ObjectSchema = {
        name: $db.customItemField(),
        embedded: true,
        properties: {
            name: $db.string.empty,
            options: $db.string.list
        }
    }
}