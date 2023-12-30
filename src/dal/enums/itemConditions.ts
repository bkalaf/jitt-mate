export const ItemConditionsInfos = {
    new: {
        key: 'new',
        text: 'New',
        selector: '[data-testid="ConditionNew"]',
        color: 'bg-sky-500 text-white'
    },
    likeNew: {
        key: 'likeNew',
        text: 'Like New',
        selector: '[data-testid="ConditionLikeNew"]',
        color: 'bg-emerald-500 text-white'
    },
    good: {
        key: 'good',
        text: 'Good',
        selector: '[data-testid="ConditionGood"]',
        color: 'bg-yellow-500 text-black'
    },
    fair: {
        key: 'fair',
        text: 'Fair',
        selector: '[data-testid="ConditionFair"]',
        color: 'bg-orange-500 text-white'
    },
    poor: {
        key: 'poor',
        text: 'Poor',
        selector: '[data-testid="ConditionPoor"]',
        color: 'bg-rose-500 text-white'
    },
    parts: {
        key: 'parts',
        text: 'For Parts',
        selector: '[data-testid="ConditionPoor"]',
        color: 'bg-rose-500 text-white'
    }
};

export type ItemConditionsKeys = keyof typeof ItemConditionsInfos;
export const ItemConditionsEnumMap = Object.fromEntries(Object.entries(ItemConditionsInfos).map(([k, v]) => [k, v.key] as [ItemConditionsKeys, string])) as Record<ItemConditionsKeys, string>;
export const ItemConditionsColorMap = Object.fromEntries(Object.entries(ItemConditionsInfos).map(([k, v]) => [k, v.color] as [ItemConditionsKeys, string])) as Record<ItemConditionsKeys, string>;