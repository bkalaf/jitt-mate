
export interface LegTypes {
   straight: string;
   boot: string;
   flare: string;
   slim: string;
   relaxed: string;
   casual: string;
   skinny: string;
   baggy: string;
   'slim-boot': string;
}

export type LegTypesKey = keyof LegTypes;
export const LegTypes: EnumMap<LegTypesKey> = {
    straight: 'straight-leg fit',
    boot: 'boot-cut fit',
    flare: 'flare-leg fit',
    slim: 'slim fit',
    relaxed: 'relaxed fit',
    casual: 'casual',
    skinny: 'skinny fit   ',
    baggy: 'baggy fit',
    'slim-boot': 'slim boot-cut fit'
};

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

