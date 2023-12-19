export const ItemConditions = {
    new: {
        value: 'new',
        label: 'New',
        selector: '[data-testid="ConditionNew"]',
        classes: 'bg-sky-500 text-white'
    },
    likeNew: {
        value: 'likeNew',
        label: 'Like New',
        selector: '[data-testid="ConditionLikeNew"]',
        classes: 'bg-emerald-500 text-white'
    },
    good: {
        value: 'good',
        label: 'Good',
        selector: '[data-testid="ConditionGood"]',
        classes: 'bg-yellow-500 text-black'
    },
    fair: {
        value: 'fair',
        label: 'Fair',
        selector: '[data-testid="ConditionFair"]',
        classes: 'bg-orange-500 text-white'
    },
    poor: {
        value: 'poor',
        label: 'Poor',
        selector: '[data-testid="ConditionPoor"]',
        classes: 'bg-rose-500 text-white'
    },
    parts: {
        value: 'parts',
        label: 'For Parts',
        selector: '[data-testid="ConditionPoor"]',
        classes: 'bg-rose-500 text-white'
    }
};
export type ItemConditionsKey = keyof typeof ItemConditions;

export const ItemConditionsEnumMap = Object.fromEntries(Object.entries(ItemConditions).map(([k, v]) => [k, v.label] as [string, string]));
export const ItemConditionsColorMap = Object.fromEntries(Object.entries(ItemConditions).map(([k, v]) => [k, v.classes] as [string, string]));