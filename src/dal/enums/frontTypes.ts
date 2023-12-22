import { enumColors } from './sleeveTypes';

export const FrontTypesInfos = {
    halfButton: { key: 'half-button', color: enumColors.rose2 },
    halfZip: { key: 'half-zip', color: enumColors.sky2 },
    fullZip: { key: 'full-zip', color: enumColors.lime2 },
    fullButton: { key: 'full-button', color: enumColors.yellow2 },
    drawstring: { key: 'drawstring', color: enumColors.orange2 },
    hooded: { key: 'hooded', color: enumColors.purple2 },
    snaps: { key: 'button-snaps', color: enumColors.slate2 }
};

export const FrontTypes = Object.fromEntries(Object.entries(FrontTypesInfos).map(([k, v]) => [k, v.key] as [string, string]));
export const FrontTypesColors = Object.fromEntries(Object.entries(FrontTypesInfos).map(([k, v]) => [k, v.color] as [string, string]));