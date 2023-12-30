import { enumColors } from './enumColors';

export const LegTypesInfos = {
    'slim-boot': { key: 'slim boot-cut fit', color: enumColors.cyan2 },
    straight: { key: 'straight leg fit', color: enumColors.lime2 },
    boot: { key: 'boot-cut fit', color: enumColors.yellow2 },
    flare: { key: 'flare leg fit', color: enumColors.orange2 },
    slim: { key: 'slim fit', color: enumColors.rose2 },
    relaxed: { key: 'relaxed fit', color: enumColors.slate2 },
    casual: { key: 'casual', color: enumColors.purple2 },
    skinny: { key: 'skinny fit', color: enumColors.sky2 },
    baggy: { key: 'baggy fit', color: enumColors.green2 },
    bell: { key: 'bell-bottom', color: enumColors.red2 }
};

export type LegTypesKeys = keyof typeof LegTypesInfos;
export const LegTypesEnumMap = Object.fromEntries(Object.entries(LegTypesInfos).map(([k, v]) => [k, v.key] as [LegTypesKeys, string])) as Record<LegTypesKeys, string>;

// {
// 	"batwing": "batwing",
// 	"bell": "bell",
// 	"bishop": "bishop",
// 	"bracelet": "bracelet",
// 	"butterfly": "butterfly",
// 	"button": "button-tab",
// 	"cape": "cape",
// 	"circular": "circular-cap",
// 	"cowl": "cowl",
// 	"drop": "drop-shoulder",
// 	"french": "french",
// 	"juliet": "juliet",
// 	"kimono": "kimono",
// 	"lantern": "lantern",
// 	"layer": "layered",
// 	"less": "sleeveless",
// 	"long": "long-sleeved",
// 	"marie": "marie",
// 	"mutton": "leg-of-mutton",
// 	"off": "off-shoulder",
// 	"peasant": "peasant",
// 	"petal": "petal",
// 	"poet": "poet",
// 	"puffed": "puffed",
// 	"raglan": "raglan",
// 	"rollup": "roll-up",
// 	"shirt": "cuffed",
// 	"short": "short-sleeved",
// 	"quarter": "3/4-sleeve"
// }
