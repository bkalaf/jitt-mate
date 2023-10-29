
export function retrieveValue(type: DataElementType, el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
    if (type === 'checkbox') {
        return (el as HTMLInputElement).checked;
    }
    if (type === 'select') {
        const result = Array.from((el as HTMLSelectElement).selectedOptions).map((x) => x.value);
        const multiple = (el as HTMLSelectElement).multiple;
        return multiple ? result : result.length === 1 ? result[0] : [];
    }
    return el.value;
}
