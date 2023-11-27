
export function getValueFromInputElement(el: HTMLInputElement) {
    return el.value;
}
export function setInputElementDefaultValue(el: HTMLInputElement, value?: string) {
    el.defaultValue = value ?? '';
}
export function getValueAsNumberFromInputElement(el: HTMLInputElement) {
    return el.valueAsNumber;
}

