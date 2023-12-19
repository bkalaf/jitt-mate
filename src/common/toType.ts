export const toType = (name: string) => {
    const result: IRealmType = (() => {
        return name;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;
    result.req = name;
    result.opt = [name, '?'].join('');
    result.list = [name, '[]'].join('');
    result.dictionary = [name, '{}'].join('');
    result.set = [name, '<>'].join('');
    return result;
};
