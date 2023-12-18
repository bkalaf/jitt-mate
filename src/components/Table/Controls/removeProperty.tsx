
export function removeProperty(record: Record<string, any>, key: string) {
    const { [key]: _, ...rest } = record;
    return rest;
}
