export interface ApparelGroups {
    top: string;
    bottom: string;
    active: string;
    sleep: string;
    shoes: string;
    fullbody: string;
    undergarment: string;
}
export type ApparelGroupsKey = keyof ApparelGroups;
export const ApparelGroups: EnumMap<ApparelGroupsKey> = {
	"top": "Top",
	"bottom": "Bottom",
	"active": "Activewear",
	"sleep": "Sleepwear",
	"shoes": "Shoes",
	"fullbody": "Full-body",
	"undergarment": "Undergarment"
}


