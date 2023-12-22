import { enumColors } from './sleeveTypes';

export const WaistTypesInfos = {
    'stretch-drawstring': { key: 'stretch & drawstring', color: enumColors.cyan2 },
    belted: { key: 'belted-waist', color: enumColors.lime2 },
    drawstring: { key: 'drawstring', color: enumColors.yellow2 },
    stretch: { key: 'stretch', color: enumColors.orange2 },
    semi: { key: 'semi-stretch', color: enumColors.rose2 }
};

export const WaistTypes = Object.fromEntries(Object.entries(WaistTypesInfos).map(([k, v]) => [k, v.key] as [string, string]));
export const WaistTypesColors = Object.fromEntries(Object.entries(WaistTypesInfos).map(([k, v]) => [k, v.color] as [string, string]));