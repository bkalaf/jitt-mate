// ///<reference path="./../global.d.ts" />
import { toProperFromCamel } from '../common/text/toProperCase';
import { taxonomy } from '../dal/enums/taxa';
import { is } from '../dal/is';

type CBO = Exclude<ComboBoxOption, string>;

function toComboBoxOption(value: string, opt?: ComboBoxOption, node = 0): CBO {
    return {
        node,
        value,
        label: toProperFromCamel(value),
        parent: is.string(opt) ? undefined : opt != null ? (opt.parent ? [opt.parent, opt.value].join('.') : opt.value) : undefined
    };
}
function sorter(a: Exclude<ComboBoxOption, string>, b: Exclude<ComboBoxOption, string>) {
    const anodes = [...a.parent?.split('.') ?? [], a.value]
    const bnodes = [...(b.parent?.split('.') ?? []), b.value];
    for (let index = 0; index < anodes.length; index++) {
        const result = -bnodes[index].localeCompare(anodes[index])
        if (result !== 0) return result;    
    }
    return 0;
}
export const $kingdoms = Object.keys(taxonomy)
    .map((x) => toComboBoxOption(x))
    .sort(sorter);

export const $phlyums = $kingdoms.map(x => {
    const p = taxonomy[x.value as keyof typeof taxonomy];
    return Object.keys(p).map(p2 => toComboBoxOption(p2, x, 1))
}).reduce((p, c) =>[...p, ...c], []);

export const $klasses = $phlyums
    .map((x) => {
        const p = (taxonomy[x.parent as keyof typeof taxonomy] as any)[x.value];
        return Object.keys(p).map((p2) => toComboBoxOption(p2, x, 2));
    })
    .reduce((p, c) => [...p, ...c], []).sort(sorter);

export const $orders = $klasses
    .map((x) => {
        const [$k, $p] = x.parent?.split('.') ?? [];
        const p = (taxonomy[$k as keyof typeof taxonomy] as any)[$p][x.value];
        return typeof p === 'string' ? [toComboBoxOption(p, x, 3)] : Object.keys(p).map((p2) => toComboBoxOption(p2, x, 3));
    })
    .reduce((p, c) => [...p, ...c], [])
    .sort(sorter);

export const $families = $orders
    .map((x) => {
        const [$k, $p, $c] = x.parent?.split('.') ?? [];
        const p = (taxonomy[$k as keyof typeof taxonomy] as any)[$p][$c][x.value];
        return typeof p === 'string' ? (x.value === p ? [] : [toComboBoxOption(p, x, 4)]) : Object.keys(p ?? {}).map((p2) => toComboBoxOption(p2, x, 4));
    })
    .reduce((p, c) => [...p, ...c], [])
    .sort(sorter);

export const $genuses = $families
    .map((x) => {
        const [$k, $p, $c, $o] = x.parent?.split('.') ?? [];
        const p = (taxonomy[$k as keyof typeof taxonomy] as any)[$p][$c][$o][x.value];
        return typeof p === 'string' ? (x.value === p ? [] : [toComboBoxOption(p, x, 5)]) : Object.keys(p ?? {}).map((p2) => toComboBoxOption(p2, x, 5));
    })
    .reduce((p, c) => [...p, ...c], [])
    .sort(sorter);

console.log(JSON.stringify($kingdoms, null, '\t'));
console.log(JSON.stringify($phlyums, null, '\t'));
console.log(JSON.stringify($klasses, null, '\t'));
console.log(JSON.stringify($orders, null, '\t'));
console.log(JSON.stringify($families, null, '\t'));
console.log(JSON.stringify($genuses, null, '\t'));




