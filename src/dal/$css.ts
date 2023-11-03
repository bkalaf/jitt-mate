import { flip } from './flip';
import { joinText } from '../common/text/joinText';
import { prependText, dataAttributeEquals, ariaAttributeEquals, attribute, typeAttribute, pseudo } from './createAttribute';

export const $css = {
    id: prependText('#'),
    class: prependText('.'),
    // _testid: surroundText('[data-testid="]')('"]'),
    testid: dataAttributeEquals('testid'),
    ariaRequired: ariaAttributeEquals('required'),
    ariaSelected: ariaAttributeEquals('selected'),
    ariaReadonly: ariaAttributeEquals('readonly'),
    ariaHidden: ariaAttributeEquals('hidden'),
    disabled: attribute('disabled'),
    required: attribute('required'),
    readonly: attribute('readonly'),
    textInput: typeAttribute('text'),
    fileInput: typeAttribute('file'),
    subsequentSibling: joinText(' ~ '),
    nextSibling: joinText(' + '),
    descendant: joinText(' '),
    child: joinText(' > '),
    active: pseudo('active'),
    checked: pseudo('checked'),
    focus: pseudo('focus'),
    hover: pseudo('hover'),
    oneOf: (...selectors: string[]) => joinText(selectors.join(', '))(':is(')(')'),
    not: flip(flip(joinText)(':not('))(')')
};