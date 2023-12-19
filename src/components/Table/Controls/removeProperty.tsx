
export function removeProperty(record: Record<string, any>, key: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _, ...rest } = record;
    return rest;
}
