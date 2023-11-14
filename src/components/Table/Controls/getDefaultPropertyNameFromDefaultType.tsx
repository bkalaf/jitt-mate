export function getDefaultPropertyNameFromDefaultType(value?: any): {
    defaultChecked?: boolean;
    defaultValue?: any;
} {
    return { ...{ defaultChecked: undefined, defaultValue: undefined }, ...(value != null ? (typeof value === 'boolean' ? { defaultChecked: value } : { defaultValue: value }) : {}) };
}
