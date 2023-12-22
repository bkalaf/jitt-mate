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

