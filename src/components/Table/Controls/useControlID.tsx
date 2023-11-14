
export function useControlID(name: string, controlTag: 'input' | 'select' | 'textarea' = 'input') {
    const controlID = [name, controlTag].join('-');
    const labelID = [controlID, 'label'].join('-');
    const fieldID = [controlID, 'field'].join('-');
    const feedbackID = [controlID, 'feedback'].join('-');
    return [fieldID, controlID, labelID, feedbackID] as [field: string, control: string, label: string, feedback: string];
}
