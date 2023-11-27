import { flip } from '../common/flip';
import { joinText } from '../common/text/joinText';
import { dataAttributeEquals, ariaAttributeEquals, attribute, typeAttribute, pseudo } from './createAttribute';
import { prependText } from '../common/text/prependText';

export function Selector({ tagName, id, className, dataToggle }: { tagName?: string, id?: string, className?: string; dataToggle?: string }) {
    const $tagName = tagName ? [tagName] : [];
    const $id = id ? [prependText('#')(id)] : [];
    const $className = className ? [prependText('.')(className)] : [];
    const $dataToggle = dataToggle ? [`[data-toggle="${dataToggle}"]`] : [];
    return (...substitution: [string, string][]) => {
        return substitution
            .map(
                ([k, v]) =>
                    (s: string) =>
                        s.replaceAll(k, v)
            )
            .reduce((pv, cv) => cv(pv), [...$tagName, ...$id, ...$className, ...$dataToggle].join(''));
    }
}

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
