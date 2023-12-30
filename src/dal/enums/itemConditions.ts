export const ItemConditionsInfos = {
    new: {
        key: 'new',
        label: 'New',
        selector: '[data-testid="ConditionNew"]',
        color: 'bg-sky-500 text-white'
    },
    likeNew: {
        key: 'likeNew',
        label: 'Like New',
        selector: '[data-testid="ConditionLikeNew"]',
        color: 'bg-emerald-500 text-white'
    },
    good: {
        key: 'good',
        label: 'Good',
        selector: '[data-testid="ConditionGood"]',
        color: 'bg-yellow-500 text-black'
    },
    fair: {
        key: 'fair',
        label: 'Fair',
        selector: '[data-testid="ConditionFair"]',
        color: 'bg-orange-500 text-white'
    },
    poor: {
        key: 'poor',
        label: 'Poor',
        selector: '[data-testid="ConditionPoor"]',
        color: 'bg-rose-500 text-white'
    },
    parts: {
        key: 'parts',
        label: 'For Parts',
        selector: '[data-testid="ConditionPoor"]',
        color: 'bg-rose-500 text-white'
    }
};

export type ItemConditionsKeys = keyof typeof ItemConditionsInfos;
export const ItemConditionsEnumMap = Object.fromEntries(Object.entries(ItemConditionsInfos).map(([k, v]) => [k, v.key] as [ItemConditionsKeys, string])) as Record<ItemConditionsKeys, string>;
export const ItemConditionsColorMap = Object.fromEntries(Object.entries(ItemConditionsInfos).map(([k, v]) => [k, v.color] as [ItemConditionsKeys, string])) as Record<ItemConditionsKeys, string>;
export const ItemConditionsSelectorsMap = Object.fromEntries(Object.entries(ItemConditionsInfos).map(([k, v]) => [k, v.selector] as [ItemConditionsKeys, string])) as Record<ItemConditionsKeys, string>;