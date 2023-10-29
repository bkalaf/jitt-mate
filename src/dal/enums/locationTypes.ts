export type LocationTypes = {
    fixture: string;
    shelf: string;
    bin: string;
}
export const LocationTypes = {
    fixture: 'fixture',
    shelf: 'shelf',
    bin: 'bin'
}

export type LocationTypesKey = keyof LocationTypes;
