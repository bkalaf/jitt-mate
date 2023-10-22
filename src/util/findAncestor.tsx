export function findAncestor(predicate: (x: HTMLElement) => boolean, name = 'unnamed') {
    return function (el: HTMLElement | undefined): HTMLElement {
        if (el == null) throw new Error(`predicate not found in ancestor: ${name}`);
        if (predicate(el)) {
            return el;
        }
        return findAncestor(predicate, name)(el.parentElement);
    };
}
