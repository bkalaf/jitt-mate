export interface ItemGroups {
    apparel: string;
    media: string;
}
export type ItemGroupsKey = keyof ItemGroups;

export const ItemGroups: ItemGroups = {
    apparel: 'Apparel',
    media: 'Media'
};