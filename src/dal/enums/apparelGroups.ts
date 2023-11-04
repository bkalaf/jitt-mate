export interface ApparelGroups {
    tops: string;
    bottoms: string;
    sleepwear: string;
    shoes: string;
    fullbody: string;
    undergarments: string;
}
export type ApparelGroupsKey = keyof ApparelGroups;
export const ApparelGroups: EnumMap<ApparelGroupsKey> = {
	"tops": "Top",
	"bottoms": "Bottom",
	"sleepwear": "Sleepwear",
	"shoes": "Shoes",
	"fullbody": "Full-body",
	"undergarments": "Undergarment"
}


