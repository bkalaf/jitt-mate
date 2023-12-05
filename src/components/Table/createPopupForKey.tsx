import prompt from 'electron-prompt';


export async function createPopupForKey<T>(list: T[] | [string, T][], newItem: T) {
    const keys = list.length > 0 ? (Array.isArray(list[0]) ? (list as [string, T][]).map((x: [string, T]) => x[0]) : []) : [];
    const key = await prompt({
        buttonLabels: {
            ok: 'OK',
            cancel: 'Cancel'
        },
        label: 'Please submit a valid key string for this item:',
        title: 'Enter KEY value',
        type: 'input',
        inputAttrs: {
            type: 'text'
        }
    });
    if (keys.includes(key ?? '')) throw new Error(`duplicate key: ${key}`);
    return [...list, [key, newItem]] as [string, T][];
}
