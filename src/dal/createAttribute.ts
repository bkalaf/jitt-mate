///<reference path="./../global.d.ts" />
import { toKVP } from '../toKVP';
import { ISku } from './types';
import { identity } from '../common/functions/identity';
import { flip } from './flip';
import { is } from './is';
import { joinText } from '../common/text/joinText';
import { $css } from './$css';

export type AttributeOperators = '=' | '*=' | '~=' | '$=' | '|=' | '^=';
export type OperatorKeys = 'contains' | 'exact' | 'endsWith' | 'startsWith' | 'wordContains' | 'exactOrEndsWith';

const operators: Record<OperatorKeys, AttributeOperators> = {
    contains: '*=',
    exact: '=',
    endsWith: '$=',
    startsWith: '^=',
    wordContains: '~=',
    exactOrEndsWith: '|='
};

export const concatText = joinText('');
export const prependText = concatText;
export const appendText = flip(concatText);
export const surroundText = (left: string) => (right: string) => flip(flip(joinText)(left))(right);
export const baseAttribute = (baseName: string) => (op: OperatorKeys) => (name: string) => (value: string) => `[${baseName}-${name}${operators[op]}"${value}"]`
export const dataAttribute = baseAttribute('data');
export const dataAttributeEquals = dataAttribute('exact');
export const ariaAttribute = baseAttribute('aria');
export const ariaAttributeEquals = ariaAttribute('exact');
export const attribute = surroundText('[')(']');
export const valueAttribute = (op: OperatorKeys) => (name: string) => (value: string) => attribute(`${name}${operators[op]}"${value}"`);
export const valueAttributeEquals = valueAttribute('exact');
export const typeAttribute = valueAttributeEquals('type');
export const pseudo = flip(joinText(':'));

export function createAttribute<T = string>(key: string, fieldname: keyof ISku, keyToTextMap?: Record<string, string> | ((x?: T) => string | undefined), selectorMap?: Record<string, string> | ((x?: T) => string | undefined), toSelector?: keyof typeof $css, transform?: (x?: T) => string | undefined) {
    return function (obj?: Record<string, any>): ProductAttribute<T> {
        const xform = transform ?? ((x?: T) => x?.toString());
        const value = xform((obj ?? {})[fieldname]) as T;
        const preSelector = is.nil(selectorMap) ? undefined : is.function(selectorMap) ? selectorMap(value) : (selectorMap as AnyObject)[value as string];
        const selector = is.not.nil(preSelector) && is.not.nil(toSelector) ? ($css[toSelector as keyof typeof $css] as AnyFunction)(preSelector) : is.not.nil(preSelector) ? preSelector : undefined;
        const text = is.not.nil(selectorMap) ? is.function(selectorMap) ? ((selectorMap ?? identity) as AnyFunction)(value) : (selectorMap as AnyObject)[value as string] : value;
        const kvp = toKVP(key)(text);

        return [value == null, xform(text), kvp, selector, value];
    };
}
